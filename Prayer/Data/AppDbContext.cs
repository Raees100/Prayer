using Microsoft.EntityFrameworkCore;

namespace Prayer.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Models.PrayerRecord> PrayerRecords => Set<Models.PrayerRecord>();
}