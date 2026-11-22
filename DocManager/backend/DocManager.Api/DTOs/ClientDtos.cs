using System.ComponentModel.DataAnnotations;

namespace DocManager.Api.DTOs;

public class SaveClientDto
{
    [Required] public string Name { get; set; } = "";
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
}
public record ClientListDto(int Id, string Name, string? Phone, string? Email, string? Address, int DocCount);
public record ClientDetailDto(int Id, string Name, string? Phone, string? Email, string? Address, List<DocumentDto> Documents);
