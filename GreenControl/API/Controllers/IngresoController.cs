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
    [Authorize]
    public class IngresoController : ControllerBase
    {
        private readonly IRepository<Ingreso> _ingresoRepository;

        public IngresoController(IRepository<Ingreso> ingresoRepository)
        {
            _ingresoRepository = ingresoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var ingresos = await _ingresoRepository.FindAsync(i => i.UsuarioId == usuarioId);
                var response = ingresos.Select(i => new IngresoResponse
                {
                    Id = i.Id,
                    Fecha = i.Fecha,
                    Monto = i.Monto,
                    Concepto = i.Concepto,
                    NotaAdicional = i.NotaAdicional
                }).OrderByDescending(i => i.Fecha);

                return Ok(new { mensaje = "Ingresos obtenidos exitosamente", data = response });
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
                var ingreso = await _ingresoRepository.GetByIdAsync(id);

                if (ingreso == null || ingreso.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional
                };

                return Ok(new { mensaje = "Ingreso obtenido exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IngresoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var ingreso = new Ingreso
                {
                    Fecha = request.Fecha,
                    Monto = request.Monto,
                    Concepto = request.Concepto,
                    NotaAdicional = request.NotaAdicional,
                    UsuarioId = usuarioId
                };

                await _ingresoRepository.AddAsync(ingreso);

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional
                };

                return CreatedAtAction(nameof(GetById), new { id = ingreso.Id },
                    new { mensaje = "Ingreso creado exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] IngresoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var ingreso = await _ingresoRepository.GetByIdAsync(id);

                if (ingreso == null || ingreso.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                ingreso.Fecha = request.Fecha;
                ingreso.Monto = request.Monto;
                ingreso.Concepto = request.Concepto;
                ingreso.NotaAdicional = request.NotaAdicional;

                await _ingresoRepository.UpdateAsync(ingreso);

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional
                };

                return Ok(new { mensaje = "Ingreso actualizado exitosamente", data = response });
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
                var ingreso = await _ingresoRepository.GetByIdAsync(id);

                if (ingreso == null || ingreso.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                await _ingresoRepository.DeleteAsync(ingreso);
                return Ok(new { mensaje = "Ingreso eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}