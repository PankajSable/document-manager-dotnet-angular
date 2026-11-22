using DocManager.Api.Data;
using DocManager.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();
builder.WebHost.UseUrls(builder.Configuration["Urls"] ?? "http://0.0.0.0:5000");

var jwtKey = JwtKeyProvider.LoadOrCreate(builder.Environment.ContentRootPath);
builder.Services.AddSingleton(jwtKey);
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<TokenService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.MapInboundClaims = false;   // keep "role" and "name" claim names as issued
    o.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = jwtKey.Key,
        ValidateIssuer = false,
        ValidateAudience = false,
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});
builder.Services.AddAuthorization();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
using (var scope = app.Services.CreateScope())
    DbSeeder.Seed(scope.ServiceProvider.GetRequiredService<AppDbContext>());

app.UseDefaultFiles();        // NEW
app.UseStaticFiles();         // NEW
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");   // NEW
app.Run();
