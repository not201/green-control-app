using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class N8NController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public N8NController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("tareas")]
        public async Task<IActionResult> GetTareasPorDias([FromQuery] int dias = 1)
        {
            try
            {
                var fechaHoy = DateTime.Today;
                var fechaObjetivo = fechaHoy.AddDays(dias);

                var tareasDelDia = await _context.Tareas
                    .Include(t => t.Parcela)
                        .ThenInclude(p => p.Usuario)
                    .Where(t => t.FechaFinalizacion == null &&
                                t.FechaProgramada.Date == fechaObjetivo.Date)
                    .ToListAsync();

                var usuariosAgrupados = tareasDelDia
                    .GroupBy(t => t.Parcela.Usuario)
                    .Select(grupo => new N8NUsuario
                    {
                        Info = new N8NUsuarioInfo
                        {
                            UsuarioId = grupo.Key.Id,
                            Correo = grupo.Key.Correo,
                            Telefono = grupo.Key.Telefono
                        },
                        Tareas = grupo.Select(t => new N8NTarea
                        {
                            Nombre = t.Nombre,
                            FechaProgramada = t.FechaProgramada.ToString("dd/MM/yyyy"),
                            NombreParcela = t.Parcela.NombreParcela
                        }).ToList()
                    })
                    .ToList();

                var response = new N8NResponse
                {
                    Usuarios = usuariosAgrupados
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("tareas/rango")]
        public async Task<IActionResult> GetTareasPorRango([FromQuery] int desde = 0, [FromQuery] int hasta = 7)
        {
            try
            {
                var fechaHoy = DateTime.Today;
                var fechaDesde = fechaHoy.AddDays(desde);
                var fechaHasta = fechaHoy.AddDays(hasta);

                var tareasEnRango = await _context.Tareas
                    .Include(t => t.Parcela)
                        .ThenInclude(p => p.Usuario)
                    .Where(t => t.FechaFinalizacion == null &&
                                t.FechaProgramada.Date >= fechaDesde.Date &&
                                t.FechaProgramada.Date <= fechaHasta.Date)
                    .OrderBy(t => t.FechaProgramada)
                    .ToListAsync();

                var usuariosAgrupados = tareasEnRango
                    .GroupBy(t => t.Parcela.Usuario)
                    .Select(grupo => new N8NUsuario
                    {
                        Info = new N8NUsuarioInfo
                        {
                            UsuarioId = grupo.Key.Id,
                            Correo = grupo.Key.Correo,
                            Telefono = grupo.Key.Telefono
                        },
                        Tareas = grupo.Select(t => new N8NTarea
                        {
                            Nombre = t.Nombre,
                            FechaProgramada = t.FechaProgramada.ToString("dd/MM/yyyy"),
                            NombreParcela = t.Parcela.NombreParcela
                        }).ToList()
                    })
                    .ToList();

                var response = new N8NResponse
                {
                    Usuarios = usuariosAgrupados
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("tareas/vencidas")]
        public async Task<IActionResult> GetTareasVencidas()
        {
            try
            {
                var fechaHoy = DateTime.Today;

                var tareasVencidas = await _context.Tareas
                    .Include(t => t.Parcela)
                        .ThenInclude(p => p.Usuario)
                    .Where(t => t.FechaFinalizacion == null &&
                                t.FechaProgramada.Date < fechaHoy.Date)
                    .OrderBy(t => t.FechaProgramada)
                    .ToListAsync();

                var usuariosAgrupados = tareasVencidas
                    .GroupBy(t => t.Parcela.Usuario)
                    .Select(grupo => new N8NUsuario
                    {
                        Info = new N8NUsuarioInfo
                        {
                            UsuarioId = grupo.Key.Id,
                            Correo = grupo.Key.Correo,
                            Telefono = grupo.Key.Telefono
                        },
                        Tareas = grupo.Select(t => new N8NTarea
                        {
                            Nombre = t.Nombre,
                            FechaProgramada = t.FechaProgramada.ToString("dd/MM/yyyy"),
                            NombreParcela = t.Parcela.NombreParcela
                        }).ToList()
                    })
                    .ToList();

                var response = new N8NResponse
                {
                    Usuarios = usuariosAgrupados
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("tareas/hoy")]
        public async Task<IActionResult> GetTareasHoy()
        {
            return await GetTareasPorDias(0);
        }

        [HttpGet("tareas/manana")]
        public async Task<IActionResult> GetTareasManana()
        {
            return await GetTareasPorDias(1);
        }
    }
}