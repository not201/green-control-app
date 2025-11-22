using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Application.Services;
using Microsoft.AspNetCore.Authorization;
using GreenControl.API.Extensions;
using System;
using System.Threading.Tasks;

namespace GreenControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet("perfil")]
        public async Task<IActionResult> GetPerfil()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var perfil = await _usuarioService.GetPerfilAsync(usuarioId);
                return Ok(new { mensaje = "Perfil obtenido exitosamente", data = perfil });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("perfil")]
        public async Task<IActionResult> ActualizarPerfil([FromBody] ActualizarPerfilRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var perfil = await _usuarioService.ActualizarPerfilAsync(usuarioId, request);
                return Ok(new { mensaje = "Perfil actualizado exitosamente", data = perfil });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("cambiar-contrasena")]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                await _usuarioService.CambiarContrasenaAsync(usuarioId, request);
                return Ok(new { mensaje = "Contraseña cambiada exitosamente" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}