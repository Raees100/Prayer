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

    public async Task SendOtpEmail(string toEmail, string otp)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Prayer App", _appSettings.EmailFrom)); // display name
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Your OTP Code";
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = $"<h3>Your OTP Code is: {otp}</h3>"
        };

        using var smtp = new MailKit.Net.Smtp.SmtpClient();
        await smtp.ConnectAsync(_appSettings.SmtpHost, _appSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_appSettings.SmtpUser, _appSettings.SmtpPass);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}