using System.ComponentModel.DataAnnotations;

namespace Prayer.Models;

public class ResetPassword
{
    public required string Password { get; set; }

    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public required string ConfirmPassword { get; set; }
}