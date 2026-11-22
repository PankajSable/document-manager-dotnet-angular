namespace DocManager.Api.Entities;

/// <summary>File bytes, kept in a separate table so document lists stay light.</summary>
public class DocumentBlob
{
    public int DocumentId { get; set; }
    public byte[] Data { get; set; } = [];
}
