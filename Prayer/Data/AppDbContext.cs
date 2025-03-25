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
}