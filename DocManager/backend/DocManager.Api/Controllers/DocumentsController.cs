using DocManager.Api.Data;
using DocManager.Api.DTOs;
using DocManager.Api.Entities;
using DocManager.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocManager.Api.Controllers;

[ApiController, Route("api/documents"), Authorize]
public class DocumentsController(AppDbContext db) : ControllerBase
{
    private const long MaxFileSize = 20 * 1024 * 1024;

    [HttpGet]
    public async Task<List<DocumentDto>> Search([FromQuery] DocumentSearchDto s)
    {
        var q = db.Documents.AsQueryable();
        if (!string.IsNullOrWhiteSpace(s.Name)) q = q.Where(x => x.Client.Name.Contains(s.Name));
        if (!string.IsNullOrWhiteSpace(s.Type)) q = q.Where(x => x.DocumentType == s.Type);
        if (!string.IsNullOrWhiteSpace(s.DocumentId)) q = q.Where(x => x.DocumentId.Contains(s.DocumentId));
        if (s.From is not null) q = q.Where(x => x.CreatedAt >= s.From.Value.Date);
        if (s.To is not null) q = q.Where(x => x.CreatedAt < s.To.Value.Date.AddDays(1));
        return await q.OrderByDescending(x => x.CreatedAt).ToDto().ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DocumentDto>> Get(int id) =>
        await db.Documents.Where(d => d.Id == id).ToDto().FirstOrDefaultAsync() is { } d ? d : NotFound();

    [HttpPost, Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] SaveDocumentDto dto)
    {
        var error = await Validate(dto, fileRequired: true);
        if (error is not null) return error;

        var client = await db.Clients.FindAsync(dto.ClientId);
        var d = new Document { CreatedBy = User.Identity?.Name ?? "" };
        Apply(d, dto);
        await SetFile(d, dto.File!);
        db.Documents.Add(d);

        for (var attempt = 0; ; attempt++)
        {
            d.DocumentId = await NextDocumentId(client!.Name, dto.DocumentType);
            d.FileName = RenameFile(d.DocumentId, d.FileName);
            try { await db.SaveChangesAsync(); break; }
            catch (DbUpdateException) when (attempt < 4) { }   // number taken by a parallel request: try the next one
        }
        return Ok(new { d.Id, d.DocumentId });
    }

    [HttpPut("{id:int}"), Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(int id, [FromForm] SaveDocumentDto dto)
    {
        var d = await db.Documents.Include(x => x.Blob).FirstOrDefaultAsync(x => x.Id == id);
        if (d is null) return NotFound();
        var error = await Validate(dto, fileRequired: false);
        if (error is not null) return error;

        Apply(d, dto);
        d.UpdatedAt = DateTime.Now;
        if (dto.File is not null)
        {
            await SetFile(d, dto.File);
            d.FileName = RenameFile(d.DocumentId, d.FileName);
        }
        await db.SaveChangesAsync();
        return Ok(new { d.Id });
    }

    [HttpGet("{id:int}/file")]
    public async Task<IActionResult> GetFile(int id, [FromQuery] bool download = false)
    {
        var f = await db.Documents.Where(x => x.Id == id)
            .Select(x => new { x.FileName, x.ContentType, x.Blob!.Data }).FirstOrDefaultAsync();
        if (f is null) return NotFound();
        return download ? File(f.Data, f.ContentType, f.FileName) : File(f.Data, f.ContentType);
    }

    [HttpDelete("{id:int}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var d = await db.Documents.FindAsync(id);
        if (d is null) return NotFound();
        db.Documents.Remove(d);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- helpers ----
    private async Task<IActionResult?> Validate(SaveDocumentDto dto, bool fileRequired)
    {
        if (!await db.Clients.AnyAsync(c => c.Id == dto.ClientId)) return BadRequest("Choose a client.");
        if (fileRequired && dto.File is null) return BadRequest("Choose a file to upload.");
        if (dto.File is { Length: > MaxFileSize }) return BadRequest("File is larger than 20 MB.");
        return null;
    }

    /// <summary>Builds IDs like JOH-20261119-0001: client name, insert date, running number.</summary>
    private async Task<string> NextDocumentId(string clientName, string documentType)
    {
        var letters = clientName.ToUpperInvariant();
        var docType = documentType.ToUpperInvariant();
        var prefix = $"{letters}-{docType}-{DateTime.Now:yyyyMMdd}-";
        var last = await db.Documents.Where(x => x.DocumentId.StartsWith(prefix))
            .OrderByDescending(x => x.DocumentId).Select(x => x.DocumentId).FirstOrDefaultAsync();
        var next = last is null ? 1 : int.Parse(last[prefix.Length..]) + 1;
        return $"{prefix}{next:D4}";
    }
    /// <summary>JOH-20261119-0001 + original extension, e.g. JOH-20261119-0001.pdf</summary>
    private static string RenameFile(string documentId, string originalName) =>
        documentId + Path.GetExtension(originalName).ToLowerInvariant();

    private static void Apply(Document d, SaveDocumentDto dto)
    {
        d.ClientId = dto.ClientId;          // the line "d.DocumentId = dto.DocumentId!.Trim();" is removed
        d.DocumentType = dto.DocumentType;
        d.PropertyAddress = dto.PropertyAddress;
        d.Notes = dto.Notes;
        d.ExpiryDate = dto.ExpiryDate?.Date;
    }

    private static async Task SetFile(Document d, IFormFile file)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        d.FileName = Path.GetFileName(file.FileName);
        d.ContentType = file.ContentType;
        d.FileSize = file.Length;
        if (d.Blob is null) d.Blob = new DocumentBlob { Data = ms.ToArray() };
        else d.Blob.Data = ms.ToArray();
    }
}
