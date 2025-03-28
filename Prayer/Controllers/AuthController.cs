using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prayer.Data;
using Prayer.Models;
using Prayer.Services.Interfaces;

namespace Prayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly AppDbContext _context;
    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ITokenService tokenService, IEmailService emailService, AppDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _context = context;
    }

    // Signup - No Token generation here
    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = ModelState.Values.SelectMany(v => v.Errors).First().ErrorMessage });
        }

        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
            return BadRequest(new { message = "User already exists with this email" });

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            Name = model.Name
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            // Send welcome email
            await _emailService.SendWelcomeEmail(user.Email, user.Name);
            return Ok(new { message = "User registered successfully" });
        }

        // Return the first error message
        var errorMessage = result.Errors.First().Description;
        return BadRequest(new { message = errorMessage });
    }

    // Login - Token generation here
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid email or password" });

        // Generate JWT Token
        var token = _tokenService.CreateToken(user);
        return Ok(new { token });
    }

    // Forgot Password - Send OTP
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword forgotPassword)
    {
        var user = await _userManager.FindByEmailAsync(forgotPassword.Email);
        if (user == null)
            return BadRequest(new { message = "User not found" });

        // Generate 5-digit OTP
        var otp = new Random().Next(10000, 99999).ToString();

        // Clean previous OTPs if any
        var existingOtps = _context.UserOtps.Where(o => o.Email == user.Email);
        _context.UserOtps.RemoveRange(existingOtps);

        // Save new OTP with 5 min expiry
        var userOtp = new UserOtp
        {
            Email = user.Email,
            Otp = otp,
            ExpiryTime = DateTime.UtcNow.AddMinutes(5)
        };
        _context.UserOtps.Add(userOtp);
        await _context.SaveChangesAsync();

        // Send OTP via email
        await _emailService.SendOtpEmail(user.Email, otp);

        return Ok(new { message = "OTP sent to your email" });
    }

    // Verify OTP
    [HttpPost("VerifyOtp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpModel model)
    {
        var userOtp = await _context.UserOtps
            .FirstOrDefaultAsync(o => o.Email == model.Email && o.Otp == model.Otp);

        if (userOtp == null || userOtp.ExpiryTime < DateTime.UtcNow)
            return BadRequest(new { message = "Invalid or expired OTP" });

        // OTP verified - remove from DB
        _context.UserOtps.Remove(userOtp);
        await _context.SaveChangesAsync();

        return Ok(new { message = "OTP verified successfully" });
    }

    // Reset Password - Only after OTP verification
    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromQuery] string email, [FromBody] ResetPassword resetPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest(new { message = "User not found" });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await _userManager.ResetPasswordAsync(user, token, resetPassword.Password);

        if (!resetResult.Succeeded)
            return BadRequest(resetResult.Errors);

        return Ok(new { message = "Password reset successfully" });
    }

    // Resend OTP - Same flow as Forgot Password
    [HttpPost("ResendOtp")]
    public async Task<IActionResult> ResendOtp([FromBody] ForgotPassword forgotPassword)
    {
        var user = await _userManager.FindByEmailAsync(forgotPassword.Email);
        if (user == null)
            return BadRequest(new { message = "User not found" });

        // Generate new OTP
        var newOtp = new Random().Next(10000, 99999).ToString();

        // Remove any old OTPs
        var existingOtps = _context.UserOtps.Where(o => o.Email == user.Email);
        _context.UserOtps.RemoveRange(existingOtps);

        // Store new OTP
        var userOtp = new UserOtp
        {
            Email = user.Email,
            Otp = newOtp,
            ExpiryTime = DateTime.UtcNow.AddMinutes(5)
        };
        _context.UserOtps.Add(userOtp);
        await _context.SaveChangesAsync();

        // Send new OTP via email
        await _emailService.SendOtpEmail(user.Email, newOtp);

        return Ok(new { message = "New OTP has been sent to your email" });
    }
}