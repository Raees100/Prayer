using Prayer.Models;

namespace Prayer.Contracts.Responses;

public class PrayerResponse
{
    public int Id { get; set; }
    public DateTime PrayerDate { get; set; }
    public string Fajar { get; set; }
    public string Zuhr { get; set; }
    public string Asar { get; set; }
    public string Maghrib { get; set; }
    public string Esha { get; set; }
}