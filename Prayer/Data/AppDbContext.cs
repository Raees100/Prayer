using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Prayer.Models;

namespace Prayer.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Models.PrayerRecord> PrayerRecords => Set<Models.PrayerRecord>();

    // For OTP Storage
    public DbSet<UserOtp> UserOtps => Set<UserOtp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Convert Enum to String in Database
        modelBuilder.Entity<PrayerRecord>()
            .Property(p => p.Fajar)
            .HasConversion<string>();

        modelBuilder.Entity<PrayerRecord>()
            .Property(p => p.Zuhr)
            .HasConversion<string>();

        modelBuilder.Entity<PrayerRecord>()
            .Property(p => p.Asar)
            .HasConversion<string>();

        modelBuilder.Entity<PrayerRecord>()
            .Property(p => p.Maghrib)
            .HasConversion<string>();

        modelBuilder.Entity<PrayerRecord>()
            .Property(p => p.Esha)
            .HasConversion<string>();
    }
}