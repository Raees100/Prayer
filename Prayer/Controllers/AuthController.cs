using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Prayer.Models;

namespace Prayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // Signup - No Token generation here
    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
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
            return Ok(new { message = "User registered successfully" });

        return BadRequest(result.Errors);
    }
}
