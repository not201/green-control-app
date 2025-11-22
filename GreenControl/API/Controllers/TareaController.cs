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
    public class TareaController : ControllerBase
    {
        private readonly ITareaService _tareaService;

        public TareaController(ITareaService tareaService)
        {
            _tareaService = tareaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var tareas = await _tareaService.GetAllAsync(usuarioId);
                return Ok(new { mensaje = "Tareas obtenidas exitosamente", data = tareas });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("parcela/{parcelaId}")]
        public async Task<IActionResult> GetByParcela(int parcelaId)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var tareas = await _tareaService.GetByParcelaIdAsync(parcelaId, usuarioId);
                return Ok(new { mensaje = "Tareas obtenidas exitosamente", data = tareas });
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
                var tarea = await _tareaService.GetByIdAsync(id, usuarioId);
                return Ok(new { mensaje = "Tarea obtenida exitosamente", data = tarea });
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
        public async Task<IActionResult> Create([FromBody] TareaRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var tarea = await _tareaService.CreateAsync(request, usuarioId);
                return CreatedAtAction(nameof(GetById), new { id = tarea.Id },
                    new { mensaje = "Tarea creada exitosamente", data = tarea });
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TareaUpdateRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var tarea = await _tareaService.UpdateAsync(id, request, usuarioId);
                return Ok(new { mensaje = "Tarea actualizada exitosamente", data = tarea });
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

        [HttpPut("{id}/completar")]
        public async Task<IActionResult> MarcarCompletada(int id)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var tarea = await _tareaService.MarcarCompletadaAsync(id, usuarioId);
                return Ok(new { mensaje = "Tarea marcada como completada", data = tarea });
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
                await _tareaService.DeleteAsync(id, usuarioId);
                return Ok(new { mensaje = "Tarea eliminada exitosamente" });
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