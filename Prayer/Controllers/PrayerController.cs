using Microsoft.AspNetCore.Mvc;
using Prayer.Models;
using Prayer.Services;

namespace Prayer.Controllers
{
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
            await _service.AddPrayerAsync(prayer);
            return Ok(new { message = "Prayer Record Added Successfully" });
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
    }
}
