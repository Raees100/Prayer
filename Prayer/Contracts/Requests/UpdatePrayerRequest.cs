using Prayer.Models;

namespace Prayer.Contracts.Requests;

public class UpdatePrayerRequest
{
    public DateTime PrayerDate { get; set; }
    public PrayerStatus Fajar { get; set; }
    public PrayerStatus Zuhr { get; set; }
    public PrayerStatus Asar { get; set; }
    public PrayerStatus Maghrib { get; set; }
    public PrayerStatus Esha { get; set; }
}