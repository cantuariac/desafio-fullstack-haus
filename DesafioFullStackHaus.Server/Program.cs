using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using DesafioFullStackHaus.Server;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Services.ResolvePostgre(builder.Configuration.GetConnectionString("PostgresConnection"));
builder.Services.ResolveSqlServer(builder.Configuration.GetConnectionString("SqlServerConnection"));
builder.Services.ResolveConfigurations();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapIdentityApi<IdentityUser>();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
