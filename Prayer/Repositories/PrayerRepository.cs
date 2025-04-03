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

    public async Task<PrayerRecord?> GetPrayerByDateAsync(string userId, DateTime prayerDate)
    {
        return await _context.PrayerRecords
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PrayerDate.Date == prayerDate.Date);
    }
    public async Task<bool> UpdatePrayerAsync(PrayerRecord prayer)
    {
        try
        {
            _context.PrayerRecords.Update(prayer);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<string?> GetPrayerByTypeAsync(string userId, string prayerType, DateTime prayerDate)
    {
        prayerDate = DateTime.SpecifyKind(prayerDate, DateTimeKind.Utc);

        var record = await _context.PrayerRecords
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PrayerDate.Date == prayerDate.Date);

        if (record == null)
            return null;

        return prayerType switch
        {
            "fajar" => record.Fajar.ToString(),
            "zuhr" => record.Zuhr.ToString(),
            "asar" => record.Asar.ToString(),
            "maghrib" => record.Maghrib.ToString(),
            "esha" => record.Esha.ToString(),
            _ => null
        };
    }

    public async Task<List<PrayerRecord>> GetPrayerRecordsForMonthAsync(string userId, DateTime startDate, DateTime endDate)
    {
        startDate = startDate.ToUniversalTime();
        endDate = endDate.ToUniversalTime();

        return await _context.PrayerRecords
            .Where(p => p.UserId == userId && p.PrayerDate >= startDate && p.PrayerDate <= endDate)
            .ToListAsync();
    }

    public async Task<List<PrayerRecord>> GetAllPrayersAsync(string userId)
    {
        return await _context.PrayerRecords
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.PrayerDate) // Show most recent first
            .ToListAsync();
    }

}