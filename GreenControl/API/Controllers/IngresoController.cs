using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using GreenControl.API.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using GreenControl.Infrastructure.Data;
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
        private readonly ApplicationDbContext _context;

        public IngresoController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtener ingresos con filtros opcionales
        /// </summary>
        /// <param name="tipo">Filtro: "general", "parcela", o null para todos</param>
        /// <param name="parcelaId">Filtrar por parcela específica</param>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? tipo, [FromQuery] int? parcelaId)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();

                var query = _context.Ingresos
                    .Include(i => i.Parcela)
                    .Where(i => i.UsuarioId == usuarioId);

                if (!string.IsNullOrEmpty(tipo))
                {
                    if (tipo.ToLower() == "general")
                        query = query.Where(i => i.ParcelaId == null);
                    else if (tipo.ToLower() == "parcela")
                        query = query.Where(i => i.ParcelaId != null);
                }

                if (parcelaId.HasValue)
                    query = query.Where(i => i.ParcelaId == parcelaId.Value);

                var ingresos = await query.OrderByDescending(i => i.Fecha).ToListAsync();

                var response = ingresos.Select(i => new IngresoResponse
                {
                    Id = i.Id,
                    Fecha = i.Fecha,
                    Monto = i.Monto,
                    Concepto = i.Concepto,
                    NotaAdicional = i.NotaAdicional,
                    ParcelaId = i.ParcelaId,
                    NombreParcela = i.Parcela?.NombreParcela,
                    EsGeneral = i.ParcelaId == null
                });

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
                var ingreso = await _context.Ingresos
                    .Include(i => i.Parcela)
                    .FirstOrDefaultAsync(i => i.Id == id && i.UsuarioId == usuarioId);

                if (ingreso == null)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional,
                    ParcelaId = ingreso.ParcelaId,
                    NombreParcela = ingreso.Parcela?.NombreParcela,
                    EsGeneral = ingreso.ParcelaId == null
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

                if (request.ParcelaId.HasValue)
                {
                    var parcela = await _context.Parcelas
                        .FirstOrDefaultAsync(p => p.Id == request.ParcelaId.Value && p.UsuarioId == usuarioId);
                    if (parcela == null)
                        return NotFound(new { mensaje = "Parcela no encontrada" });
                }

                var ingreso = new Ingreso
                {
                    Fecha = request.Fecha,
                    Monto = request.Monto,
                    Concepto = request.Concepto,
                    NotaAdicional = request.NotaAdicional,
                    ParcelaId = request.ParcelaId,
                    UsuarioId = usuarioId
                };

                _context.Ingresos.Add(ingreso);
                await _context.SaveChangesAsync();

                if (ingreso.ParcelaId.HasValue)
                    await _context.Entry(ingreso).Reference(i => i.Parcela).LoadAsync();

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional,
                    ParcelaId = ingreso.ParcelaId,
                    NombreParcela = ingreso.Parcela?.NombreParcela,
                    EsGeneral = ingreso.ParcelaId == null
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
                var ingreso = await _context.Ingresos
                    .FirstOrDefaultAsync(i => i.Id == id && i.UsuarioId == usuarioId);

                if (ingreso == null)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                if (request.ParcelaId.HasValue)
                {
                    var parcela = await _context.Parcelas
                        .FirstOrDefaultAsync(p => p.Id == request.ParcelaId.Value && p.UsuarioId == usuarioId);
                    if (parcela == null)
                        return NotFound(new { mensaje = "Parcela no encontrada" });
                }

                ingreso.Fecha = request.Fecha;
                ingreso.Monto = request.Monto;
                ingreso.Concepto = request.Concepto;
                ingreso.NotaAdicional = request.NotaAdicional;
                ingreso.ParcelaId = request.ParcelaId;

                await _context.SaveChangesAsync();

                if (ingreso.ParcelaId.HasValue)
                    await _context.Entry(ingreso).Reference(i => i.Parcela).LoadAsync();

                var response = new IngresoResponse
                {
                    Id = ingreso.Id,
                    Fecha = ingreso.Fecha,
                    Monto = ingreso.Monto,
                    Concepto = ingreso.Concepto,
                    NotaAdicional = ingreso.NotaAdicional,
                    ParcelaId = ingreso.ParcelaId,
                    NombreParcela = ingreso.Parcela?.NombreParcela,
                    EsGeneral = ingreso.ParcelaId == null
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
                var ingreso = await _context.Ingresos
                    .FirstOrDefaultAsync(i => i.Id == id && i.UsuarioId == usuarioId);

                if (ingreso == null)
                    return NotFound(new { mensaje = "Ingreso no encontrado" });

                _context.Ingresos.Remove(ingreso);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Ingreso eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}