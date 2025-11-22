using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using GreenControl.Infrastructure.Data;
using GreenControl.Infrastructure.Repositories;
using GreenControl.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using GreenControl.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
  {
    policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
  });
});

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IParcelaRepository, ParcelaRepository>();
builder.Services.AddScoped<ISiembraRepository, SiembraRepository>();
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<IRepository<Cultivo>, Repository<Cultivo>>();
builder.Services.AddScoped<IRepository<Notificacion>, Repository<Notificacion>>();
builder.Services.AddScoped<IRepository<Gasto>, Repository<Gasto>>();
builder.Services.AddScoped<IRepository<Ingreso>, Repository<Ingreso>>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IParcelaService, ParcelaService>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<ISiembraService, SiembraService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddSingleton<IJwtService>(sp => new JwtService(
    jwtSettings["SecretKey"],
    jwtSettings["Issuer"],
    jwtSettings["Audience"],
    int.Parse(jwtSettings["ExpirationMinutes"])
));

builder.Services
    .AddAuthentication(options =>
    {
      options.DefaultAuthenticateScheme = "JwtBearer";
      options.DefaultChallengeScheme = "JwtBearer";
    })
    .AddJwtBearer("JwtBearer", options =>
    {
      options.RequireHttpsMetadata = false;
      options.SaveToken = true;

      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])
          )
      };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
