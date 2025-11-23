using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using GreenControl.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using GreenControl.Infrastructure.Data;
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
        private readonly ApplicationDbContext _context;

        public GastoController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtener gastos con filtros opcionales
        /// </summary>
        /// <param name="tipo">Filtro: "general", "parcela", o null para todos</param>
        /// <param name="parcelaId">Filtrar por parcela específica</param>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? tipo, [FromQuery] int? parcelaId)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();

                var query = _context.Gastos
                    .Include(g => g.Parcela)
                    .Where(g => g.UsuarioId == usuarioId);

                if (!string.IsNullOrEmpty(tipo))
                {
                    if (tipo.ToLower() == "general")
                        query = query.Where(g => g.ParcelaId == null);
                    else if (tipo.ToLower() == "parcela")
                        query = query.Where(g => g.ParcelaId != null);
                }

                if (parcelaId.HasValue)
                    query = query.Where(g => g.ParcelaId == parcelaId.Value);

                var gastos = await query.OrderByDescending(g => g.Fecha).ToListAsync();

                var response = gastos.Select(g => new GastoResponse
                {
                    Id = g.Id,
                    Fecha = g.Fecha,
                    Monto = g.Monto,
                    Concepto = g.Concepto,
                    NotaAdicional = g.NotaAdicional,
                    ParcelaId = g.ParcelaId,
                    NombreParcela = g.Parcela?.NombreParcela,
                    EsGeneral = g.ParcelaId == null
                });

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
                var gasto = await _context.Gastos
                    .Include(g => g.Parcela)
                    .FirstOrDefaultAsync(g => g.Id == id && g.UsuarioId == usuarioId);

                if (gasto == null)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional,
                    ParcelaId = gasto.ParcelaId,
                    NombreParcela = gasto.Parcela?.NombreParcela,
                    EsGeneral = gasto.ParcelaId == null
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

                if (request.ParcelaId.HasValue)
                {
                    var parcela = await _context.Parcelas
                        .FirstOrDefaultAsync(p => p.Id == request.ParcelaId.Value && p.UsuarioId == usuarioId);
                    if (parcela == null)
                        return NotFound(new { mensaje = "Parcela no encontrada" });
                }

                var gasto = new Gasto
                {
                    Fecha = request.Fecha,
                    Monto = request.Monto,
                    Concepto = request.Concepto,
                    NotaAdicional = request.NotaAdicional,
                    ParcelaId = request.ParcelaId,
                    UsuarioId = usuarioId
                };

                _context.Gastos.Add(gasto);
                await _context.SaveChangesAsync();

                if (gasto.ParcelaId.HasValue)
                    await _context.Entry(gasto).Reference(g => g.Parcela).LoadAsync();

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional,
                    ParcelaId = gasto.ParcelaId,
                    NombreParcela = gasto.Parcela?.NombreParcela,
                    EsGeneral = gasto.ParcelaId == null
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
                var gasto = await _context.Gastos
                    .FirstOrDefaultAsync(g => g.Id == id && g.UsuarioId == usuarioId);

                if (gasto == null)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                if (request.ParcelaId.HasValue)
                {
                    var parcela = await _context.Parcelas
                        .FirstOrDefaultAsync(p => p.Id == request.ParcelaId.Value && p.UsuarioId == usuarioId);
                    if (parcela == null)
                        return NotFound(new { mensaje = "Parcela no encontrada" });
                }

                gasto.Fecha = request.Fecha;
                gasto.Monto = request.Monto;
                gasto.Concepto = request.Concepto;
                gasto.NotaAdicional = request.NotaAdicional;
                gasto.ParcelaId = request.ParcelaId;

                await _context.SaveChangesAsync();

                if (gasto.ParcelaId.HasValue)
                    await _context.Entry(gasto).Reference(g => g.Parcela).LoadAsync();

                var response = new GastoResponse
                {
                    Id = gasto.Id,
                    Fecha = gasto.Fecha,
                    Monto = gasto.Monto,
                    Concepto = gasto.Concepto,
                    NotaAdicional = gasto.NotaAdicional,
                    ParcelaId = gasto.ParcelaId,
                    NombreParcela = gasto.Parcela?.NombreParcela,
                    EsGeneral = gasto.ParcelaId == null
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
                var gasto = await _context.Gastos
                    .FirstOrDefaultAsync(g => g.Id == id && g.UsuarioId == usuarioId);

                if (gasto == null)
                    return NotFound(new { mensaje = "Gasto no encontrado" });

                _context.Gastos.Remove(gasto);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Gasto eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}