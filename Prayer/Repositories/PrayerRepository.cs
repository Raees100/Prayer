using Microsoft.EntityFrameworkCore;
using Prayer.Data;
using Prayer.Models;
using Prayer.Repositories.Interfaces;

namespace Prayer.Repositories;

public class PrayerRepository : IPrayerRepository
{
    private readonly AppDbContext _context;
    public PrayerRepository(AppDbContext context) => _context = context;

    public async Task AddPrayerAsync(PrayerRecord prayer)
    {
        _context.PrayerRecords.Add(prayer);
        await _context.SaveChangesAsync();
    }

    public async Task<List<PrayerRecord>> GetAllPrayersAsync() =>
        await _context.PrayerRecords.ToListAsync();

    public async Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month) =>
        await _context.PrayerRecords
            .Where(p => p.PrayerDate.Year == year && p.PrayerDate.Month == month)
            .ToListAsync();

    public async Task<PrayerRecord?> GetPrayerByDateAsync(DateTime prayerDate)
    {
        return await _context.PrayerRecords
                             .FirstOrDefaultAsync(p => p.PrayerDate.Date == prayerDate.Date);
    }

    public async Task UpdatePrayerAsync(PrayerRecord prayer)
    {
        var existing = await _context.PrayerRecords
                                     .FirstOrDefaultAsync(p => p.PrayerDate.Date == prayer.PrayerDate.Date);
        if (existing != null)
        {
            existing.Fajar = prayer.Fajar;
            existing.Zuhr = prayer.Zuhr;
            existing.Asar = prayer.Asar;
            existing.Maghrib = prayer.Maghrib;
            existing.Esha = prayer.Esha;

            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> DeletePrayerByDateAsync(DateTime prayerDate)
    {
        var existing = await _context.PrayerRecords
                                     .FirstOrDefaultAsync(p => p.PrayerDate.Date == prayerDate.Date);
        if (existing != null)
        {
            _context.PrayerRecords.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

}
