using System.Text.Json.Serialization;

namespace Prayer.Models;

public class PrayerRecord
{
    public int Id { get; set; }
    public DateTime PrayerDate { get; set; }
    public PrayerStatus Fajar { get; set; } = PrayerStatus.Skipped;
    public PrayerStatus Zuhr { get; set; } = PrayerStatus.Skipped;
    public PrayerStatus Asar { get; set; } = PrayerStatus.Skipped;
    public PrayerStatus Maghrib { get; set; } = PrayerStatus.Skipped;
    public PrayerStatus Esha { get; set; } = PrayerStatus.Skipped;
    public string UserId { get; set; }
}

public enum PrayerStatus
{
    Skipped = 0,
    OnTime = 1,
    Qaza = 2
}