using Microsoft.Extensions.Options;
using MimeKit;
using Prayer.Models;
using Prayer.Services.Interfaces;

namespace Prayer.Services;

public class EmailService : IEmailService
{
    private readonly AppSettings _appSettings;

    public EmailService(IOptions<AppSettings> appSettings)
    {
        _appSettings = appSettings.Value;
    }

    public async Task SendWelcomeEmail(string toEmail, string userName)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Prayer App", _appSettings.EmailFrom));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Welcome to Prayer App!";
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = $@"
                <h2>Welcome to Prayer App, {userName}!</h2>
                <p>Thank you for joining our community. We're excited to have you on board!</p>
                <p>With Prayer App, you can:</p>
                <ul>
                    <li>Track your daily prayers</li>
                    <li>Set prayer reminders</li>
                    <li>View your prayer history</li>
                    <li>And much more!</li>
                </ul>
                <p>Start your spiritual journey today!</p>
                <p>Best regards,<br>The Prayer App Team</p>"
        };

        using var smtp = new MailKit.Net.Smtp.SmtpClient();
        await smtp.ConnectAsync(_appSettings.SmtpHost, _appSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_appSettings.SmtpUser, _appSettings.SmtpPass);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    public async Task SendOtpEmail(string toEmail, string otp)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Prayer App", _appSettings.EmailFrom));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Your OTP Code";
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = $@"
                <h3>Your OTP Code is: {otp}</h3>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>"
        };

        using var smtp = new MailKit.Net.Smtp.SmtpClient();
        await smtp.ConnectAsync(_appSettings.SmtpHost, _appSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_appSettings.SmtpUser, _appSettings.SmtpPass);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}