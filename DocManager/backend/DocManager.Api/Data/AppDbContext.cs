using DocManager.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocManager.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<AppUser>().HasIndex(x => x.Username).IsUnique();
        m.Entity<Client>().HasIndex(x => x.Name);
        m.Entity<Document>().HasIndex(x => x.DocumentId).IsUnique();
        m.Entity<Document>().HasIndex(x => x.ExpiryDate);
        m.Entity<Document>().HasOne(d => d.Client).WithMany(c => c.Documents)
            .HasForeignKey(d => d.ClientId).OnDelete(DeleteBehavior.Restrict);
        m.Entity<DocumentBlob>().HasKey(x => x.DocumentId);
        m.Entity<DocumentBlob>().Property(x => x.Data).HasColumnType("varbinary(max)");
        m.Entity<Document>().HasOne(d => d.Blob).WithOne()
            .HasForeignKey<DocumentBlob>(x => x.DocumentId).OnDelete(DeleteBehavior.Cascade);
    }
}
