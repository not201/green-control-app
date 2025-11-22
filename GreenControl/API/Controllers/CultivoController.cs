using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using GreenControl.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CultivoController : ControllerBase
    {
        private readonly IRepository<Cultivo> _cultivoRepository;

        public CultivoController(IRepository<Cultivo> cultivoRepository)
        {
            _cultivoRepository = cultivoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var cultivos = await _cultivoRepository.FindAsync(c => c.UsuarioId == usuarioId);
                var response = cultivos.Select(c => new CultivoResponse
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Especie = c.Especie
                });
                return Ok(new { mensaje = "Cultivos obtenidos exitosamente", data = response });
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
                var cultivo = await _cultivoRepository.GetByIdAsync(id);

                if (cultivo == null || cultivo.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Cultivo no encontrado" });

                var response = new CultivoResponse
                {
                    Id = cultivo.Id,
                    Nombre = cultivo.Nombre,
                    Especie = cultivo.Especie
                };
                return Ok(new { mensaje = "Cultivo obtenido exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CultivoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var cultivo = new Cultivo
                {
                    Nombre = request.Nombre,
                    Especie = request.Especie,
                    UsuarioId = usuarioId
                };

                await _cultivoRepository.AddAsync(cultivo);

                var response = new CultivoResponse
                {
                    Id = cultivo.Id,
                    Nombre = cultivo.Nombre,
                    Especie = cultivo.Especie
                };
                return CreatedAtAction(nameof(GetById), new { id = cultivo.Id },
                    new { mensaje = "Cultivo creado exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CultivoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var cultivo = await _cultivoRepository.GetByIdAsync(id);

                if (cultivo == null || cultivo.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Cultivo no encontrado" });

                cultivo.Nombre = request.Nombre;
                cultivo.Especie = request.Especie;

                await _cultivoRepository.UpdateAsync(cultivo);

                var response = new CultivoResponse
                {
                    Id = cultivo.Id,
                    Nombre = cultivo.Nombre,
                    Especie = cultivo.Especie
                };
                return Ok(new { mensaje = "Cultivo actualizado exitosamente", data = response });
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
                var cultivo = await _cultivoRepository.GetByIdAsync(id);

                if (cultivo == null || cultivo.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Cultivo no encontrado" });

                await _cultivoRepository.DeleteAsync(cultivo);
                return Ok(new { mensaje = "Cultivo eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}