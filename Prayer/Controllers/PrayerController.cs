using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prayer.Contracts.Requests;
using Prayer.Mappings;
using Prayer.Models;
using Prayer.Services.Interfaces;
using System.Security.Claims;

namespace Prayer.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PrayerController : ControllerBase
{
    private readonly IPrayerService _service;
    public PrayerController(IPrayerService service) => _service = service;

    // Add Daily Prayer Record
    [HttpPost]
    public async Task<IActionResult> AddPrayer([FromBody] CreatePrayerRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Unauthorized request" });

        // Map request to PrayerRecord
        var prayerRecord = request.MapToPrayerRecord(userId);

        var result = await _service.AddPrayerAsync(prayerRecord);
        if (result.Contains("already exists"))
            return BadRequest(new { message = result });

        return Ok(new { message = result });
    }

    // Update Daily Prayer Record
    [HttpPut]
    public async Task<IActionResult> UpdatePrayer([FromBody] UpdatePrayerRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authorized" });

        var existingRecord = await _service.GetPrayerByDateAsync(userId, request.PrayerDate);
        if (existingRecord == null)
            return NotFound(new { message = "No prayer record found for this date." });

        if (existingRecord.UserId != userId)
            return Forbid();

        request.MapToExistingPrayerRecord(existingRecord);

        var result = await _service.UpdatePrayerAsync(existingRecord);
        if (result.Contains("Failed", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Failed to update prayer record." });

        return Ok(new { message = "Prayer record updated successfully." });
    }



    [HttpGet("all")]
    public async Task<IActionResult> GetAllPrayers()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authorized" });

        var allPrayers = await _service.GetAllPrayersAsync(userId);

        if (allPrayers == null || !allPrayers.Any())
            return NotFound(new { message = "No prayer records found for this user." });

        var prayerResponses = allPrayers.Select(prayer => prayer.MapToPrayerRecordResponse()).ToList();

        return Ok(prayerResponses);
    }


    [HttpGet("by-date/{prayerDate}")]
    public async Task<IActionResult> GetPrayerByDate(DateTime prayerDate)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authorized" });

        // Convert date to UTC before querying
        prayerDate = DateTime.SpecifyKind(prayerDate, DateTimeKind.Utc);
        var record = await _service.GetPrayerByDateAsync(userId, prayerDate);
        if (record == null)
            return NotFound(new { message = "No prayer record found for this date." });

        var prayerResponse = record.MapToPrayerRecordResponse();

        return Ok(prayerResponse);

    }

    [HttpGet("by-type/{prayerType}")]
    public async Task<IActionResult> GetPrayerByType(string prayerType, [FromQuery] DateTime? date = null)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authorized" });

        var validPrayerTypes = new HashSet<string> { "fajar", "zuhr", "asar", "maghrib", "esha" };
        prayerType = prayerType.ToLower();

        if (!validPrayerTypes.Contains(prayerType))
            return BadRequest(new { message = "Invalid prayer type. Valid values: Fajar, Zuhr, Asar, Maghrib, Esha." });

        var prayerDate = date ?? DateTime.UtcNow.Date;

        var status = await _service.GetPrayerByTypeAsync(userId, prayerType, prayerDate);
        if (status == null)
            return NotFound(new { message = $"No record found for {prayerType} on {prayerDate:yyyy-MM-dd}." });

        return Ok(new { prayerType, date = prayerDate.ToString("yyyy-MM-dd"), status });
    }

    [HttpGet("calendar")]
    public async Task<IActionResult> GetPrayerCalendar([FromQuery] int year, [FromQuery] int month)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "User not authorized" });

        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var prayerRecords = await _service.GetPrayerRecordsForMonthAsync(userId, startDate, endDate);

        var calendarData = new List<object>();

        for (int day = 1; day <= endDate.Day; day++)
        {
            var currentDate = new DateTime(year, month, day);
            var prayersForDay = prayerRecords.FirstOrDefault(p => p.PrayerDate.Date == currentDate);

            // Format the currentDate to only include the date part
            string formattedDate = currentDate.ToString("yyyy-MM-dd");

            if (prayersForDay == null)
            {
                // No prayers recorded for this date, return empty
                calendarData.Add(new { date = formattedDate, status = "" });
            }
            else
            {
                bool hasSkipped = prayersForDay.Fajar == PrayerStatus.Skipped ||
                                  prayersForDay.Zuhr == PrayerStatus.Skipped ||
                                  prayersForDay.Asar == PrayerStatus.Skipped ||
                                  prayersForDay.Maghrib == PrayerStatus.Skipped ||
                                  prayersForDay.Esha == PrayerStatus.Skipped;

                calendarData.Add(new
                {
                    date = formattedDate,
                    status = hasSkipped ? "cross" : "tick"
                });
            }
        }

        return Ok(calendarData);
    }

}