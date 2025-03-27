using Prayer.Models;

namespace Prayer.Services.Interfaces;

public interface IPrayerService
{
    Task<string> AddPrayerAsync(PrayerRecord prayer);
    Task<string> UpdatePrayerAsync(PrayerRecord prayer);
    Task<PrayerRecord?> GetPrayerByDateAsync(string userId, DateTime prayerDate);
    Task<string?> GetPrayerByTypeAsync(string userId, string prayerType, DateTime prayerDate);
    Task<List<PrayerRecord>> GetPrayerRecordsForMonthAsync(string userId, DateTime startDate, DateTime endDate);
}