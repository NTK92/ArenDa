using System.Security.Cryptography;
using Diplom.Data;
using Diplom.Helpers;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using GoogleReCaptcha.V3;
using GoogleReCaptcha.V3.Interface;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("https://localhost:44463")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

/*
builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredUniqueChars = 6;
    
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 3;
    
    options.SignIn.RequireConfirmedEmail = true;
    options.User.RequireUniqueEmail = true;
});

*/
/*services.Configure<CookiePolicyOptions>(options =>
{
    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});*/

builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddControllersWithViews();
builder.Services.AddDataProtection()
    .UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration()
    {
        EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
        ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
    });

/*builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();*/

builder.Services.AddDbContext<DataContext>();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddScoped<Jwt>();
builder.Services.AddScoped<CipherService>();

builder.Services.AddHttpClient();
builder.Services.AddHttpClient<ICaptchaValidator, GoogleReCaptchaValidator>();

builder.Services.AddAntiforgery(options =>
{
    // Set Cookie properties using CookieBuilder properties†.
    options.FormFieldName = "AntiforgeryFieldname";
    options.HeaderName = "X-CSRF-TOKEN-HEADERNAME";
    options.SuppressXFrameOptionsHeader = false;
});

var app = builder.Build();

/*
app.Use(async (context, next) =>
{
    //Create Nonce and store it in the context dictionary
    var randomNumber = new byte[32];
    string nonce = "";

    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(randomNumber);
        nonce = Convert.ToBase64String(randomNumber);
    }
    context.Items["nonce"] = nonce;

    //Add the csp to the response header
    context.Response.Headers.Add(
        "Content-Security-Policy-Report-Only", 
        "default-src 'self'; script-src 'self' 'nonce-" + nonce + "';"  //replace this string with your actual csp
    );

    await next();
});*/

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

/*var antiforgery = app.Services.GetRequiredService<IAntiforgery>();

app.Use((context, next) =>
{
    var requestPath = context.Request.Path.Value;

        var tokenSet = antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokenSet.RequestToken!,
            new CookieOptions { HttpOnly = false });

    return next(context);
});*/

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors(myAllowSpecificOrigins);
app.UseRouting();

app.UseAuthentication();    // аутентификация
app.UseAuthorization();     // авторизация

app.UseStatusCodePages("text/plain", "Error. Status code : {0}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();