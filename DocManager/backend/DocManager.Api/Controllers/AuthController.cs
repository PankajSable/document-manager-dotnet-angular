using DocManager.Api.Data;
using DocManager.Api.DTOs;
using DocManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DocManager.Api.Controllers;

[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<LoginResponseDto> Login(LoginDto dto)
    {
        var u = db.Users.FirstOrDefault(x => x.Username == dto.Username && x.IsActive);
        if (u is null || !BCrypt.Net.BCrypt.Verify(dto.Password, u.PasswordHash)) return Unauthorized();
        return new LoginResponseDto(tokens.Create(u), u.Username, u.Role);
    }
}
