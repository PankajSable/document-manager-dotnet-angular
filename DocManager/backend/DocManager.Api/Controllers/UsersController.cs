using DocManager.Api.Data;
using DocManager.Api.DTOs;
using DocManager.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocManager.Api.Controllers;

[ApiController, Route("api/users"), Authorize(Roles = "Admin")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<List<UserDto>> GetAll() =>
        await db.Users.OrderBy(u => u.Username).Select(u => new UserDto(u.Id, u.Username, u.Role, u.IsActive)).ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create(CreateUserDto dto)
    {
        if (await db.Users.AnyAsync(u => u.Username == dto.Username)) return Conflict("That username is taken.");
        db.Users.Add(new AppUser
        {
            Username = dto.Username.Trim(),
            Role = dto.Role == "Admin" ? "Admin" : "Staff",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        });
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto dto)
    {
        var u = await db.Users.FindAsync(id);
        if (u is null) return NotFound();
        if (u.Username == User.Identity?.Name && (!dto.IsActive || dto.Role != "Admin"))
            return BadRequest("You can’t demote or deactivate yourself.");
        u.Role = dto.Role == "Admin" ? "Admin" : "Staff";
        u.IsActive = dto.IsActive;
        if (!string.IsNullOrWhiteSpace(dto.Password)) u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        await db.SaveChangesAsync();
        return Ok();
    }
}
