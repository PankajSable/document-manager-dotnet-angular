namespace DocManager.Api.Entities;

public class Document
{
    public int Id { get; set; }
    public string DocumentId { get; set; } = "";
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
    public string? DocumentType { get; set; }
    public string? PropertyAddress { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Notes { get; set; }
    public string FileName { get; set; } = "";
    public string ContentType { get; set; } = "";
    public long FileSize { get; set; }
    public string CreatedBy { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
    public DocumentBlob? Blob { get; set; }
}
