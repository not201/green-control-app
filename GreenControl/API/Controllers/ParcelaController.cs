using Microsoft.AspNetCore.Mvc;
using GreenControl.Application.DTOs;
using GreenControl.Application.Services;
using Microsoft.AspNetCore.Authorization;
using GreenControl.API.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GreenControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ParcelaController : ControllerBase
    {
        private readonly IParcelaService _parcelaService;

        public ParcelaController(IParcelaService parcelaService)
        {
            _parcelaService = parcelaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var parcelas = await _parcelaService.GetAllAsync(usuarioId);
                return Ok(new { mensaje = "Parcelas obtenidas exitosamente", data = parcelas });
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
                var parcela = await _parcelaService.GetByIdAsync(id, usuarioId);
                return Ok(new { mensaje = "Parcela obtenida exitosamente", data = parcela });
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
        public async Task<IActionResult> Create([FromBody] ParcelaRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var parcela = await _parcelaService.CreateAsync(request, usuarioId);
                return CreatedAtAction(nameof(GetById), new { id = parcela.Id },
                    new { mensaje = "Parcela creada exitosamente", data = parcela });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ParcelaRequest request)
        {
            try
            {
                var usuarioId = HttpContext.GetUsuarioId();
                var parcela = await _parcelaService.UpdateAsync(id, request, usuarioId);
                return Ok(new { mensaje = "Parcela actualizada exitosamente", data = parcela });
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
                await _parcelaService.DeleteAsync(id, usuarioId);
                return Ok(new { mensaje = "Parcela eliminada exitosamente" });
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