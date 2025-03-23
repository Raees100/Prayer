using Microsoft.AspNetCore.Mvc;
using Prayer.Models;
using Prayer.Services;

namespace Prayer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrayerController : ControllerBase
{
    private readonly IPrayerService _service;
    public PrayerController(IPrayerService service) => _service = service;

    // Add Daily Prayer Record
    [HttpPost]
    public async Task<IActionResult> AddPrayer([FromBody] PrayerRecord prayer)
    {
        // Ensure UTC before saving
        prayer.PrayerDate = DateTime.SpecifyKind(prayer.PrayerDate, DateTimeKind.Utc);

        var result = await _service.AddPrayerAsync(prayer);
        if (result.Contains("already exists"))
            return BadRequest(new { message = result });

        return Ok(new { message = result });
    }

    // Fetch All Records (Optional)
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPrayers() =>
        Ok(await _service.GetAllPrayersAsync());

    // Calendar View (Filter by Month & Year)
    [HttpGet("calendar")]
    public async Task<IActionResult> GetCalendar([FromQuery] int year, [FromQuery] int month)
    {
        var data = await _service.GetPrayersByMonthAsync(year, month);
        return Ok(data);
    }

    // Update Daily Prayer Record
    [HttpPut]
    public async Task<IActionResult> UpdatePrayer([FromBody] PrayerRecord prayer)
    {
        // Ensure UTC before updating
        prayer.PrayerDate = DateTime.SpecifyKind(prayer.PrayerDate, DateTimeKind.Utc);

        var result = await _service.UpdatePrayerAsync(prayer);
        if (result.Contains("No prayer record"))
            return NotFound(new { message = result });

        return Ok(new { message = result });
    }

    // Delete Daily Prayer Record by Date (Updated to handle UTC properly)
    [HttpDelete]
    public async Task<IActionResult> DeletePrayer([FromQuery] DateTime prayerDate)
    {
        // Convert incoming date to UTC to avoid PostgreSQL Kind mismatch
        var utcDate = DateTime.SpecifyKind(prayerDate, DateTimeKind.Utc);

        var result = await _service.DeletePrayerByDateAsync(utcDate);
        if (result.Contains("No prayer record"))
            return NotFound(new { message = result });

        return Ok(new { message = result });
    }
}
