using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace Diplom.Helpers;

public interface IMailService
{
    Task SendEmailAsync(string email, string subject,string message);
}
public class MailService : IMailService
{
    public Task SendEmailAsync(string email, string subject,string message)
    {
        var mail = "maxp57113@outlook.com";
        var pw = "y43-6Bs-yAy-XBr!";
        var client = new SmtpClient("smtp-mail.outlook.com", 587)
        {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(mail, pw)
        };
        return client.SendMailAsync(new MailMessage(from: mail, to: email, subject, message));
    }
}