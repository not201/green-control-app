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
    public class SiembraController : ControllerBase
    {
        private readonly ISiembraService _siembraService;

        public SiembraController(ISiembraService siembraService)
        {
            _siembraService = siembraService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var siembras = await _siembraService.GetAllAsync(usuarioId);
                return Ok(new { mensaje = "Siembras obtenidas exitosamente", data = siembras });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var siembra = await _siembraService.GetByIdAsync(id, usuarioId);
                return Ok(new { mensaje = "Siembra obtenida exitosamente", data = siembra });
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SiembraRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var siembra = await _siembraService.CreateAsync(request, usuarioId);
                return CreatedAtAction(nameof(GetById), new { id = siembra.Id },
                    new { mensaje = "Siembra creada exitosamente", data = siembra });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SiembraUpdateRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var siembra = await _siembraService.UpdateAsync(id, request, usuarioId);
                return Ok(new { mensaje = "Siembra actualizada exitosamente", data = siembra });
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                await _siembraService.DeleteAsync(id, usuarioId);
                return Ok(new { mensaje = "Siembra eliminada exitosamente" });
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
    }
}