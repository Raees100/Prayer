﻿using Prayer.Models;

namespace Prayer.Repositories.Interfaces;

public interface IPrayerRepository
{
    Task AddPrayerAsync(PrayerRecord prayer);
    Task<PrayerRecord?> GetPrayerByDateAsync(string userId, DateTime prayerDate);
    Task<bool> UpdatePrayerAsync(PrayerRecord prayer);
    Task<string?> GetPrayerByTypeAsync(string userId, string prayerType, DateTime prayerDate);
    Task<List<PrayerRecord>> GetPrayerRecordsForMonthAsync(string userId, DateTime startDate, DateTime endDate);
}