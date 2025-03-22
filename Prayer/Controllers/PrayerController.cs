using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Prayer.Controllers;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PrayerController : ControllerBase
{
}