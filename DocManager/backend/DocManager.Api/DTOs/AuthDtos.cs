using System.ComponentModel.DataAnnotations;

namespace DocManager.Api.DTOs;

public class LoginDto
{
    [Required] public string Username { get; set; } = "";
    [Required] public string Password { get; set; } = "";
}
public record LoginResponseDto(string Token, string Username, string Role);
