namespace Prayer.Models;

public class PrayerRecord
{
    public int Id { get; set; }
    public DateTime PrayerDate { get; set; }  // e.g., "2024-07-27"

    public string Fajar { get; set; }   // "OnTime", "Qaza", "Skipped"
    public string Zuhr { get; set; }
    public string Asar { get; set; }
    public string Maghrib { get; set; }
    public string Esha { get; set; }
}
