using Prayer.Models;

namespace Prayer.Services
{
    public interface IPrayerService
    {
        Task AddPrayerAsync(PrayerRecord prayer);
        Task<List<PrayerRecord>> GetAllPrayersAsync();
        Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month);
    }
}
