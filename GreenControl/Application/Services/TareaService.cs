using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Application.Services
{
    public interface ITareaService
    {
        Task<IEnumerable<TareaResponse>> GetAllAsync(int usuarioId);
        Task<IEnumerable<TareaResponse>> GetByParcelaIdAsync(int parcelaId, int usuarioId);
        Task<TareaResponse> GetByIdAsync(int id, int usuarioId);
        Task<TareaResponse> CreateAsync(TareaRequest request, int usuarioId);
        Task<TareaResponse> UpdateAsync(int id, TareaUpdateRequest request, int usuarioId);
        Task<TareaResponse> MarcarCompletadaAsync(int id, int usuarioId);
        Task DeleteAsync(int id, int usuarioId);
    }

    public class TareaService : ITareaService
    {
        private readonly ITareaRepository _tareaRepository;
        private readonly IParcelaRepository _parcelaRepository;

        public TareaService(ITareaRepository tareaRepository, IParcelaRepository parcelaRepository)
        {
            _tareaRepository = tareaRepository;
            _parcelaRepository = parcelaRepository;
        }

        public async Task<IEnumerable<TareaResponse>> GetAllAsync(int usuarioId)
        {
            var tareas = await _tareaRepository.GetByUsuarioIdAsync(usuarioId);
            return tareas.Select(MapToResponse);
        }

        public async Task<IEnumerable<TareaResponse>> GetByParcelaIdAsync(int parcelaId, int usuarioId)
        {
            var tareas = await _tareaRepository.GetByParcelaIdAsync(parcelaId, usuarioId);
            return tareas.Select(MapToResponse);
        }

        public async Task<TareaResponse> GetByIdAsync(int id, int usuarioId)
        {
            var tarea = await _tareaRepository.GetWithDetailsAsync(id, usuarioId);
            if (tarea == null)
                throw new KeyNotFoundException("Tarea no encontrada");

            return MapToResponse(tarea);
        }

        public async Task<TareaResponse> CreateAsync(TareaRequest request, int usuarioId)
        {
            var parcela = await _parcelaRepository.GetWithSiembraAsync(request.ParcelaId, usuarioId);
            if (parcela == null)
                throw new KeyNotFoundException("Parcela no encontrada");

            var tarea = new Tarea
            {
                FechaProgramada = request.FechaProgramada,
                Nombre = request.Nombre,
                Descripcion = request.Descripcion,
                ParcelaId = request.ParcelaId
            };

            await _tareaRepository.AddAsync(tarea);

            var tareaCompleta = await _tareaRepository.GetWithDetailsAsync(tarea.Id, usuarioId);
            return MapToResponse(tareaCompleta);
        }

        public async Task<TareaResponse> UpdateAsync(int id, TareaUpdateRequest request, int usuarioId)
        {
            var tarea = await _tareaRepository.GetWithDetailsAsync(id, usuarioId);
            if (tarea == null)
                throw new KeyNotFoundException("Tarea no encontrada");

            if (request.FechaProgramada.HasValue)
                tarea.FechaProgramada = request.FechaProgramada.Value;

            if (request.FechaFinalizacion.HasValue)
                tarea.FechaFinalizacion = request.FechaFinalizacion.Value;

            if (!string.IsNullOrEmpty(request.Nombre))
                tarea.Nombre = request.Nombre;

            if (!string.IsNullOrEmpty(request.Descripcion))
                tarea.Descripcion = request.Descripcion;

            await _tareaRepository.UpdateAsync(tarea);
            return MapToResponse(tarea);
        }

        public async Task<TareaResponse> MarcarCompletadaAsync(int id, int usuarioId)
        {
            var tarea = await _tareaRepository.GetWithDetailsAsync(id, usuarioId);
            if (tarea == null)
                throw new KeyNotFoundException("Tarea no encontrada");

            if (!tarea.FechaFinalizacion.HasValue)
            {
                tarea.FechaFinalizacion = DateTime.UtcNow;
                await _tareaRepository.UpdateAsync(tarea);
            }

            return MapToResponse(tarea);
        }

        public async Task DeleteAsync(int id, int usuarioId)
        {
            var tarea = await _tareaRepository.GetWithDetailsAsync(id, usuarioId);
            if (tarea == null)
                throw new KeyNotFoundException("Tarea no encontrada");

            await _tareaRepository.DeleteAsync(tarea);
        }

        private TareaResponse MapToResponse(Tarea tarea)
        {
            return new TareaResponse
            {
                Id = tarea.Id,
                FechaProgramada = tarea.FechaProgramada,
                FechaFinalizacion = tarea.FechaFinalizacion,
                Nombre = tarea.Nombre,
                Descripcion = tarea.Descripcion,
                ParcelaId = tarea.ParcelaId,
                NombreParcela = tarea.Parcela?.NombreParcela,
                Completada = tarea.FechaFinalizacion.HasValue
            };
        }
    }
}