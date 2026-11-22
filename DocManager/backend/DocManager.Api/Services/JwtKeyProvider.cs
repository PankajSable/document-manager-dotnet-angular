using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace DocManager.Api.Services;

/// <summary>Creates a random signing key on first run and reuses it afterwards.</summary>
public class JwtKeyProvider(SymmetricSecurityKey key)
{
    public SymmetricSecurityKey Key => key;

    public static JwtKeyProvider LoadOrCreate(string contentRoot)
    {
        var dir = Path.Combine(contentRoot, "App_Data");
        Directory.CreateDirectory(dir);
        var path = Path.Combine(dir, "jwt.key");
        if (!File.Exists(path))
            File.WriteAllText(path, Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)));
        return new JwtKeyProvider(new SymmetricSecurityKey(Convert.FromBase64String(File.ReadAllText(path).Trim())));
    }
}
