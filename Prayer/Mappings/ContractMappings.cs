using Prayer.Contracts.Requests;
using Prayer.Contracts.Responses;
using Prayer.Models;

namespace Prayer.Mappings;

public static class ContractMappings
{
    public static PrayerRecord MapToPrayerRecord(this CreatePrayerRequest request, string userId)
    {
        return new PrayerRecord
        {
            UserId = userId,
            PrayerDate = DateTime.SpecifyKind(request.PrayerDate, DateTimeKind.Utc), // Ensure UTC time
            Fajar = request.Fajar,
            Zuhr = request.Zuhr,
            Asar = request.Asar,
            Maghrib = request.Maghrib,
            Esha = request.Esha
        };
    }

    public static void MapToExistingPrayerRecord(this UpdatePrayerRequest request, PrayerRecord existingRecord)
    {
        existingRecord.PrayerDate = DateTime.SpecifyKind(request.PrayerDate, DateTimeKind.Utc); // Optional: Keep or skip
        existingRecord.Fajar = request.Fajar;
        existingRecord.Zuhr = request.Zuhr;
        existingRecord.Asar = request.Asar;
        existingRecord.Maghrib = request.Maghrib;
        existingRecord.Esha = request.Esha;
    }

    public static PrayerResponse MapToPrayerRecordResponse(this PrayerRecord prayerRecord)
    {
        return new PrayerResponse
        {
            Id = prayerRecord.Id,
            PrayerDate = prayerRecord.PrayerDate,
            Fajar = prayerRecord.Fajar.ToString(),
            Zuhr = prayerRecord.Zuhr.ToString(),
            Asar = prayerRecord.Asar.ToString(),
            Maghrib = prayerRecord.Maghrib.ToString(),
            Esha = prayerRecord.Esha.ToString()
        };
    }
}