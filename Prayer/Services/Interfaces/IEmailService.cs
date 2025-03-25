namespace Prayer.Services.Interfaces;

public interface IEmailService
{
    Task SendOtpEmail(string toEmail, string otp);
}