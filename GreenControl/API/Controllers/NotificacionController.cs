using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using GreenControl.API.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificacionController : ControllerBase
    {
        private readonly IRepository<Notificacion> _notificacionRepository;

        public NotificacionController(IRepository<Notificacion> notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotificacionRequest request)
        {
            try
            {
                var notificacion = new Notificacion
                {
                    Titulo = request.Titulo,
                    Descripcion = request.Descripcion,
                    FechaEnvio = DateTime.UtcNow,
                    UsuarioId = request.UsuarioId
                };

                await _notificacionRepository.AddAsync(notificacion);

                var response = new NotificacionResponse
                {
                    Id = notificacion.Id,
                    Titulo = notificacion.Titulo,
                    Descripcion = notificacion.Descripcion,
                    FechaEnvio = notificacion.FechaEnvio,
                    FechaLeido = notificacion.FechaLeido,
                    Leida = notificacion.FechaLeido.HasValue
                };

                return CreatedAtAction(nameof(GetById), new { id = notificacion.Id },
                    new { mensaje = "Notificación creada exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var notificaciones = await _notificacionRepository.FindAsync(n => n.UsuarioId == usuarioId);
                var response = notificaciones.Select(n => new NotificacionResponse
                {
                    Id = n.Id,
                    Titulo = n.Titulo,
                    Descripcion = n.Descripcion,
                    FechaEnvio = n.FechaEnvio,
                    FechaLeido = n.FechaLeido,
                    Leida = n.FechaLeido.HasValue
                }).OrderByDescending(n => n.FechaEnvio);

                return Ok(new { mensaje = "Notificaciones obtenidas exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var notificacion = await _notificacionRepository.GetByIdAsync(id);

                if (notificacion == null || notificacion.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Notificación no encontrada" });

                var response = new NotificacionResponse
                {
                    Id = notificacion.Id,
                    Titulo = notificacion.Titulo,
                    Descripcion = notificacion.Descripcion,
                    FechaEnvio = notificacion.FechaEnvio,
                    FechaLeido = notificacion.FechaLeido,
                    Leida = notificacion.FechaLeido.HasValue
                };

                return Ok(new { mensaje = "Notificación obtenida exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}/marcar-leida")]
        [Authorize]
        public async Task<IActionResult> MarcarComoLeida(int id)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var notificacion = await _notificacionRepository.GetByIdAsync(id);

                if (notificacion == null || notificacion.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Notificación no encontrada" });

                if (!notificacion.FechaLeido.HasValue)
                {
                    notificacion.FechaLeido = DateTime.UtcNow;
                    await _notificacionRepository.UpdateAsync(notificacion);
                }

                return Ok(new { mensaje = "Notificación marcada como leída" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}