using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using API.Services;
using Application.Core;
using Application.MediatR;
using Application.MediatR.Behaviors;
using Application.MediatR.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;

const string CorsPolicyName = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        opts.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ECNMembersConnection"),
        sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

// Get allowed origins from configuration (for Azure deployment)
// Supports both array format in appsettings.json and comma-separated in environment variables
var corsOrigins = new List<string> { "http://localhost:3000", "https://localhost:3000" };

// Try to get from configuration array
var configOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
if (configOrigins != null && configOrigins.Length > 0)
{
    corsOrigins.AddRange(configOrigins);
}

// Also check environment variable (Azure App Settings can be set as Cors:AllowedOrigins:0, Cors:AllowedOrigins:1, etc.)
var envOrigins = builder.Configuration["Cors:AllowedOrigins"];
if (!string.IsNullOrEmpty(envOrigins))
{
    corsOrigins.AddRange(envOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
}

// Remove duplicates and filter empty strings
var allowedOrigins = corsOrigins.Where(o => !string.IsNullOrWhiteSpace(o)).Distinct().ToArray();

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy(CorsPolicyName, policy =>
//         policy.WithOrigins(allowedOrigins)
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials());
// });

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy(CorsPolicyName, policy =>
//         policy.WithOrigins(
//             "http://localhost:3000",
//             "https://localhost:3000",
//             "https://YOUR_WEB_APP_NAME.azurestaticapps.net"  // Add this
//         )
//         .AllowAnyHeader()
//         .AllowAnyMethod()
//         .AllowCredentials());
// });

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
        policy.WithOrigins(allowedOrigins.Length > 0 ? allowedOrigins : new[] { "http://localhost:3000" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});



builder.Services.AddIdentity<Member, IdentityRole>(options =>
{
    options.Password.RequiredLength = 7;
    options.Password.RequireNonAlphanumeric = true;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
    builder.Configuration["TokenKey"] ??
    "super-secret-key-that-should-be-at-least-32-characters-long-for-security"));

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                var payload = JsonSerializer.Serialize(new { error = "Unauthorized" });
                return context.Response.WriteAsync(payload);
            }
        };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssemblyContaining<GetMemberList>());

builder.Services.AddValidatorsFromAssemblyContaining<CreateMemberValidator>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

var app = builder.Build();

app.UseStaticFiles();

app.UseCors(CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<Member>>();

        await context.Database.MigrateAsync();
        await DbInitializer.SeedData(context, userManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration.");
    }
}

await app.RunAsync();

