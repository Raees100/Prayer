using Prayer.Models;
using Prayer.Repositories;
using Prayer.Repositories.Interfaces;
using Prayer.Services.Interfaces;

namespace Prayer.Services;

public class PrayerService : IPrayerService
{
    private readonly IPrayerRepository _repository;
    public PrayerService(IPrayerRepository repository) => _repository = repository;

    public async Task<PrayerRecord?> GetPrayerByDateAsync(string userId, DateTime prayerDate)
    {
        return await _repository.GetPrayerByDateAsync(userId, prayerDate);
    }

    public async Task<string> AddPrayerAsync(PrayerRecord prayer)
    {
        var existing = await _repository.GetPrayerByDateAsync(prayer.UserId, prayer.PrayerDate);
        if (existing != null)
        {
            return "Prayer record for this date already exists.";
        }

        await _repository.AddPrayerAsync(prayer);
        return "Prayer Record Added Successfully";
    }

    public async Task<string> UpdatePrayerAsync(PrayerRecord prayer)
    {
        var isUpdated = await _repository.UpdatePrayerAsync(prayer);
        return isUpdated ? "Prayer Record Updated Successfully" : "Failed to update prayer record.";
    }

    public async Task<string?> GetPrayerByTypeAsync(string userId, string prayerType, DateTime prayerDate)
    {
        return await _repository.GetPrayerByTypeAsync(userId, prayerType, prayerDate);
    }

    public async Task<List<PrayerRecord>> GetPrayerRecordsForMonthAsync(string userId, DateTime startDate, DateTime endDate)
    {
        return await _repository.GetPrayerRecordsForMonthAsync(userId, startDate, endDate);
    }
}