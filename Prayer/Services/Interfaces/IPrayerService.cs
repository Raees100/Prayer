using Prayer.Models;

namespace Prayer.Services.Interfaces;

public interface IPrayerService
{
    Task<string> AddPrayerAsync(PrayerRecord prayer);
    Task<List<PrayerRecord>> GetAllPrayersAsync();
    Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month);
    Task<string> UpdatePrayerAsync(PrayerRecord prayer);
    Task<string> DeletePrayerByDateAsync(DateTime prayerDate);


}
