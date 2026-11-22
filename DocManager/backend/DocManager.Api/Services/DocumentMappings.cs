using DocManager.Api.DTOs;
using DocManager.Api.Entities;

namespace DocManager.Api.Services;

public static class DocumentMappings
{
    public static IQueryable<DocumentDto> ToDto(this IQueryable<Document> q) =>
        q.Select(d => new DocumentDto(d.Id, d.DocumentId, d.ClientId, d.Client.Name, d.Client.Phone,
            d.DocumentType, d.PropertyAddress, d.ExpiryDate, d.Notes, d.FileName, d.ContentType,
            d.FileSize, d.CreatedBy, d.CreatedAt, d.UpdatedAt));
}
