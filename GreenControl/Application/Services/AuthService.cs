using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using System;
using System.Threading.Tasks;

namespace GreenControl.Application.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> RegistrarAsync(RegistroRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;

        public AuthService(IUsuarioRepository usuarioRepository, IPasswordHasher passwordHasher, IJwtService jwtService)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }

        public async Task<LoginResponse> RegistrarAsync(RegistroRequest request)
        {
            var usuarioExistente = await _usuarioRepository.GetByCorreoAsync(request.Correo);
            if (usuarioExistente != null)
            {
                throw new InvalidOperationException("El correo ya está registrado");
            }

            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Telefono = request.Telefono,
                Correo = request.Correo,
                Contrasena = _passwordHasher.HashPassword(request.Contrasena),
                FechaCreacion = DateTime.UtcNow
            };

            await _usuarioRepository.AddAsync(usuario);

            var token = _jwtService.GenerateToken(usuario.Id, usuario.Correo);

            return new LoginResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Correo = usuario.Correo,
                Token = token
            };
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var usuario = await _usuarioRepository.GetByCorreoAsync(request.Correo);
            if (usuario == null || !_passwordHasher.VerifyPassword(request.Contrasena, usuario.Contrasena))
            {
                throw new UnauthorizedAccessException("Correo o contraseña incorrectos");
            }

            var token = _jwtService.GenerateToken(usuario.Id, usuario.Correo);

            return new LoginResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Correo = usuario.Correo,
                Token = token
            };
        }
    }
}