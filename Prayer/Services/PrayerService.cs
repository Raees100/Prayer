using Prayer.Models;
using Prayer.Repositories;

namespace Prayer.Services;

public class PrayerService : IPrayerService
{
    private readonly IPrayerRepository _repository;
    public PrayerService(IPrayerRepository repository) => _repository = repository;

    public async Task<string> AddPrayerAsync(PrayerRecord prayer)
    {
        // Check if record exists for the date
        var existing = await _repository.GetPrayerByDateAsync(prayer.PrayerDate);
        if (existing != null)
        {
            return "Prayer record for this date already exists.";
        }

        await _repository.AddPrayerAsync(prayer);
        return "Prayer Record Added Successfully";
    }

    public async Task<List<PrayerRecord>> GetAllPrayersAsync() => await _repository.GetAllPrayersAsync();

    public async Task<List<PrayerRecord>> GetPrayersByMonthAsync(int year, int month) =>
        await _repository.GetPrayersByMonthAsync(year, month);

    public async Task<string> UpdatePrayerAsync(PrayerRecord prayer)
    {
        var existing = await _repository.GetPrayerByDateAsync(prayer.PrayerDate);
        if (existing == null)
        {
            return "No prayer record found for this date to update.";
        }

        await _repository.UpdatePrayerAsync(prayer);
        return "Prayer Record Updated Successfully";
    }

    public async Task<string> DeletePrayerByDateAsync(DateTime prayerDate)
    {
        var isDeleted = await _repository.DeletePrayerByDateAsync(prayerDate);
        return isDeleted ? "Prayer Record Deleted Successfully" : "No prayer record found for this date.";
    }

}
