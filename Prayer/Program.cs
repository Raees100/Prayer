using Microsoft.EntityFrameworkCore;
using Prayer.Data;
using Prayer.Repositories;
using Prayer.Services;

var builder = WebApplication.CreateBuilder(args);

// Database and Identity
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Repository
builder.Services.AddScoped<IPrayerRepository, PrayerRepository>();

// Services
builder.Services.AddScoped<IPrayerService, PrayerService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Prayer", Version = "v1" });
});

builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options => options.RouteTemplate = "api/prayer/swagger/{documentname}/swagger.json");
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "api/prayer/swagger";
    options.SwaggerEndpoint("/api/prayer/swagger/v1/swagger.json", "Prayer v1");
});
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/_health");

app.Run();