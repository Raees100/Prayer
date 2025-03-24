using Prayer.Models;

namespace Prayer.Repositories.Interfaces;

public interface IPrayerRepository
{
    Task AddPrayerAsync(PrayerRecord prayer);
    Task<List<PrayerRecord>> GetAllPrayersAsync();
    Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month);
    Task<PrayerRecord?> GetPrayerByDateAsync(DateTime prayerDate);
    Task UpdatePrayerAsync(PrayerRecord prayer);
    Task<bool> DeletePrayerByDateAsync(DateTime prayerDate);

}