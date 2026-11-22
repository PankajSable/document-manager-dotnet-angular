using DocManager.Api.Entities;

namespace DocManager.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        db.Database.EnsureCreated();
        if (db.Users.Any()) return;
        db.Users.Add(new AppUser { Username = "admin", Role = "Admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123") });
        db.SaveChanges();
    }
}
