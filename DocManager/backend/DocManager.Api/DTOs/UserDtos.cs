using System.ComponentModel.DataAnnotations;

namespace DocManager.Api.DTOs;

public record UserDto(int Id, string Username, string Role, bool IsActive);

public class CreateUserDto
{
    [Required] public string Username { get; set; } = "";
    [Required, MinLength(6)] public string Password { get; set; } = "";
    public string Role { get; set; } = "Staff";
}
public class UpdateUserDto
{
    public string Role { get; set; } = "Staff";
    public bool IsActive { get; set; } = true;
    public string? Password { get; set; }
}
