namespace Prayer.Contracts.Responses;

public class PrayerTypeResponse
{
    public string Status { get; set; } = string.Empty; // "Qaza", "On Time"
    public bool IsCompleted { get; set; } // false if null in DB
}
