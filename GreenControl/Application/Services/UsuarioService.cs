using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using System;
using System.Threading.Tasks;

namespace GreenControl.Application.Services
{
    public interface IUsuarioService
    {
        Task<UsuarioPerfilResponse> GetPerfilAsync(int usuarioId);
        Task<UsuarioPerfilResponse> ActualizarPerfilAsync(int usuarioId, ActualizarPerfilRequest request);
        Task CambiarContrasenaAsync(int usuarioId, CambiarContrasenaRequest request);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHasher _passwordHasher;

        public UsuarioService(IUsuarioRepository usuarioRepository, IPasswordHasher passwordHasher)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<UsuarioPerfilResponse> GetPerfilAsync(int usuarioId)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            return new UsuarioPerfilResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Correo = usuario.Correo,
                FechaCreacion = usuario.FechaCreacion
            };
        }

        public async Task<UsuarioPerfilResponse> ActualizarPerfilAsync(int usuarioId, ActualizarPerfilRequest request)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            usuario.Nombre = request.Nombre;
            usuario.Apellido = request.Apellido;
            usuario.Telefono = request.Telefono;

            await _usuarioRepository.UpdateAsync(usuario);

            return new UsuarioPerfilResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Correo = usuario.Correo,
                FechaCreacion = usuario.FechaCreacion
            };
        }

        public async Task CambiarContrasenaAsync(int usuarioId, CambiarContrasenaRequest request)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            if (!_passwordHasher.VerifyPassword(request.ContrasenaActual, usuario.Contrasena))
                throw new UnauthorizedAccessException("La contraseña actual es incorrecta");

            usuario.Contrasena = _passwordHasher.HashPassword(request.NuevaContrasena);
            await _usuarioRepository.UpdateAsync(usuario);
        }
    }
}