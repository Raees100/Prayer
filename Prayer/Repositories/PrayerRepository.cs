using Microsoft.EntityFrameworkCore;
using Prayer.Data;
using Prayer.Models;

namespace Prayer.Repositories
{
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
    }
}
