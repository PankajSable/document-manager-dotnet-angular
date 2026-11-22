using DocManager.Api.Data;
using DocManager.Api.DTOs;
using DocManager.Api.Entities;
using DocManager.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocManager.Api.Controllers;

[ApiController, Route("api/clients"), Authorize]
public class ClientsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<List<ClientListDto>> GetAll([FromQuery] string? q) =>
        await db.Clients
            .Where(c => string.IsNullOrEmpty(q) || c.Name.Contains(q) || (c.Phone != null && c.Phone.Contains(q)))
            .OrderBy(c => c.Name)
            .Select(c => new ClientListDto(c.Id, c.Name, c.Phone, c.Email, c.Address, c.Documents.Count))
            .ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClientDetailDto>> Get(int id)
    {
        var c = await db.Clients.FindAsync(id);
        if (c is null) return NotFound();
        var docs = await db.Documents.Where(d => d.ClientId == id).OrderByDescending(d => d.CreatedAt).ToDto().ToListAsync();
        return new ClientDetailDto(c.Id, c.Name, c.Phone, c.Email, c.Address, docs);
    }

    [HttpPost]
    public async Task<IActionResult> Create(SaveClientDto dto)
    {
        var c = new Client { Name = dto.Name.Trim(), Phone = dto.Phone, Email = dto.Email, Address = dto.Address };
        db.Clients.Add(c);
        await db.SaveChangesAsync();
        return Ok(new { c.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, SaveClientDto dto)
    {
        var c = await db.Clients.FindAsync(id);
        if (c is null) return NotFound();
        c.Name = dto.Name.Trim(); c.Phone = dto.Phone; c.Email = dto.Email; c.Address = dto.Address;
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id:int}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Clients.FindAsync(id);
        if (c is null) return NotFound();
        if (await db.Documents.AnyAsync(d => d.ClientId == id)) return Conflict("Delete or move this client’s documents first.");
        db.Clients.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
