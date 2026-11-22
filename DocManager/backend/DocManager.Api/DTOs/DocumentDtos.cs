namespace DocManager.Api.DTOs;

public record DocumentDto(int Id, string DocumentId, int ClientId, string ClientName, string? Phone,
    string? DocumentType, string? PropertyAddress, DateTime? ExpiryDate, string? Notes,
    string FileName, string ContentType, long FileSize, string CreatedBy, DateTime CreatedAt, DateTime? UpdatedAt);

/// <summary>Multipart form used for both create and update. File is optional on update.</summary>
public class SaveDocumentDto
{
    public int ClientId { get; set; }
    public string? DocumentType { get; set; }
    public string? PropertyAddress { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Notes { get; set; }
    public IFormFile? File { get; set; }
}

public class DocumentSearchDto
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? DocumentId { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}
