using Prayer.Models;

namespace Prayer.Repositories
{
    public interface IPrayerRepository
    {
        Task AddPrayerAsync(PrayerRecord prayer);
        Task<List<PrayerRecord>> GetAllPrayersAsync();
        Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month);
    }
}
