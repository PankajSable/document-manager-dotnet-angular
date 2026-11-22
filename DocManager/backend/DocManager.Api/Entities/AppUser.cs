namespace DocManager.Api.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "Staff";   // Admin | Staff
    public bool IsActive { get; set; } = true;
}
