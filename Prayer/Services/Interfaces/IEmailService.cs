using Prayer.Models;

namespace Prayer.Services.Interfaces;

public interface IEmailService
{
    Task SendWelcomeEmail(string toEmail, string userName);
    Task SendOtpEmail(string toEmail, string otp);
}