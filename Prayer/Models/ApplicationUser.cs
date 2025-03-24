using Microsoft.AspNetCore.Identity;

namespace Prayer.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty; // Custom field for Display Name
}