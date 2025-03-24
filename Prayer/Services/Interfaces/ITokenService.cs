using Prayer.Models;

namespace Prayer.Services.Interfaces;

public interface ITokenService
{
    string CreateToken(ApplicationUser user);
}