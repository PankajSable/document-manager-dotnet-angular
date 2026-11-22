using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DocManager.Api.Entities;
using Microsoft.IdentityModel.Tokens;

namespace DocManager.Api.Services;

public class TokenService(JwtKeyProvider jwt)
{
    public string Create(AppUser u)
    {
        var token = new JwtSecurityToken(
            claims: [new Claim("name", u.Username), new Claim("role", u.Role)],
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(jwt.Key, SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
