using DocManager.Api.Data;
using DocManager.Api.DTOs;
using DocManager.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocManager.Api.Controllers;

[ApiController, Route("api/dashboard"), Authorize]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<DashboardDto> Get()
    {
        var today = DateTime.Today;
        var limit = today.AddDays(60);
        var due = await db.Documents.Where(d => d.ExpiryDate != null && d.ExpiryDate <= limit)
            .OrderBy(d => d.ExpiryDate).Take(200).ToDto().ToListAsync();
        return new DashboardDto(
            await db.Documents.CountAsync(),
            await db.Clients.CountAsync(),
            await db.Documents.CountAsync(d => d.ExpiryDate != null && d.ExpiryDate < today),
            await db.Documents.CountAsync(d => d.ExpiryDate != null && d.ExpiryDate >= today && d.ExpiryDate <= today.AddDays(30)),
            due);
    }
}
