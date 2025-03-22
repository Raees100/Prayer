using Prayer.Models;
using Prayer.Repositories;

namespace Prayer.Services
{
    public class PrayerService : IPrayerService
    {
        private readonly IPrayerRepository _repository;
        public PrayerService(IPrayerRepository repository) => _repository = repository;

        public async Task AddPrayerAsync(PrayerRecord prayer) => await _repository.AddPrayerAsync(prayer);

        public async Task<List<PrayerRecord>> GetAllPrayersAsync() => await _repository.GetAllPrayersAsync();

        public async Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month) =>
            await _repository.GetPrayersByMonthAsync(year, month);
    }
}
