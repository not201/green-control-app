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
    public class GastoController : ControllerBase
    {
        private readonly IRepository<Gasto> _gastoRepository;

        public GastoController(IRepository<Gasto> gastoRepository)
        {
            _gastoRepository = gastoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var gastos = await _gastoRepository.FindAsync(g => g.UsuarioId == usuarioId);
                var response = gastos.Select(g => new GastoResponse
                {
                    Id = g.Id,
                    Fecha = g.Fecha,
                    Monto = g.Monto,
                    Concepto = g.Concepto,
                    NotaAdicional = g.NotaAdicional
                }).OrderByDescending(g => g.Fecha);

                return Ok(new { mensaje = "Gastos obtenidos exitosamente", data = response });
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
                var gasto = await _gastoRepository.GetByIdAsync(id);

                if (gasto == null || gasto.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional
                };

                return Ok(new { mensaje = "Gasto obtenido exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GastoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var gasto = new Gasto
                {
                    Fecha = request.Fecha,
                    Monto = request.Monto,
                    Concepto = request.Concepto,
                    NotaAdicional = request.NotaAdicional,
                    UsuarioId = usuarioId
                };

                await _gastoRepository.AddAsync(gasto);

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional
                };

                return CreatedAtAction(nameof(GetById), new { id = gasto.Id },
                    new { mensaje = "Gasto creado exitosamente", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GastoRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var gasto = await _gastoRepository.GetByIdAsync(id);

                if (gasto == null || gasto.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                gasto.Fecha = request.Fecha;
                gasto.Monto = request.Monto;
                gasto.Concepto = request.Concepto;
                gasto.NotaAdicional = request.NotaAdicional;

                await _gastoRepository.UpdateAsync(gasto);

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional
                };

                return Ok(new { mensaje = "Gasto actualizado exitosamente", data = response });
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
                var gasto = await _gastoRepository.GetByIdAsync(id);

                if (gasto == null || gasto.UsuarioId != usuarioId)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                await _gastoRepository.DeleteAsync(gasto);
                return Ok(new { mensaje = "Gasto eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}