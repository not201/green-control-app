using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Application.Services
{
    public interface ISiembraService
    {
        Task<IEnumerable<SiembraResponse>> GetAllAsync(int usuarioId);
        Task<SiembraResponse> GetByIdAsync(int id, int usuarioId);
        Task<SiembraResponse> CreateAsync(SiembraRequest request, int usuarioId);
        Task<SiembraResponse> UpdateAsync(int id, SiembraUpdateRequest request, int usuarioId);
        Task DeleteAsync(int id, int usuarioId);
    }

    public class SiembraService : ISiembraService
    {
        private readonly ISiembraRepository _siembraRepository;
        private readonly IParcelaRepository _parcelaRepository;
        private readonly IRepository<Cultivo> _cultivoRepository;

        public SiembraService(ISiembraRepository siembraRepository, IParcelaRepository parcelaRepository, IRepository<Cultivo> cultivoRepository)
        {
            _siembraRepository = siembraRepository;
            _parcelaRepository = parcelaRepository;
            _cultivoRepository = cultivoRepository;
        }

        public async Task<IEnumerable<SiembraResponse>> GetAllAsync(int usuarioId)
        {
            var siembras = await _siembraRepository.GetByUsuarioIdAsync(usuarioId);
            return siembras.Select(MapToResponse);
        }

        public async Task<SiembraResponse> GetByIdAsync(int id, int usuarioId)
        {
            var siembra = await _siembraRepository.GetWithDetailsAsync(id, usuarioId);
            if (siembra == null)
                throw new KeyNotFoundException("Siembra no encontrada");

            return MapToResponse(siembra);
        }

        public async Task<SiembraResponse> CreateAsync(SiembraRequest request, int usuarioId)
        {
            var parcela = await _parcelaRepository.GetWithSiembraAsync(request.ParcelaId, usuarioId);
            if (parcela == null)
                throw new KeyNotFoundException("Parcela no encontrada");

            if (await _siembraRepository.ParcelaTieneSiembraActivaAsync(request.ParcelaId))
                throw new InvalidOperationException("La parcela ya tiene una siembra activa");

            var cultivo = await _cultivoRepository.GetByIdAsync(request.CultivoId);
            if (cultivo == null || cultivo.UsuarioId != usuarioId)
                throw new KeyNotFoundException("Cultivo no encontrado");

            var siembra = new Siembra
            {
                ParcelaId = request.ParcelaId,
                CultivoId = request.CultivoId,
                FechaInicio = request.FechaInicio,
                FechaGerminacion = request.FechaGerminacion,
                FechaFloracion = request.FechaFloracion
            };

            await _siembraRepository.AddAsync(siembra);

            var siembraCompleta = await _siembraRepository.GetWithDetailsAsync(siembra.Id, usuarioId);
            return MapToResponse(siembraCompleta);
        }

        public async Task<SiembraResponse> UpdateAsync(int id, SiembraUpdateRequest request, int usuarioId)
        {
            var siembra = await _siembraRepository.GetWithDetailsAsync(id, usuarioId);
            if (siembra == null)
                throw new KeyNotFoundException("Siembra no encontrada");

            siembra.FechaFinal = request.FechaFinal;
            siembra.FechaGerminacion = request.FechaGerminacion;
            siembra.FechaFloracion = request.FechaFloracion;

            await _siembraRepository.UpdateAsync(siembra);
            return MapToResponse(siembra);
        }

        public async Task DeleteAsync(int id, int usuarioId)
        {
            var siembra = await _siembraRepository.GetWithDetailsAsync(id, usuarioId);
            if (siembra == null)
                throw new KeyNotFoundException("Siembra no encontrada");

            await _siembraRepository.DeleteAsync(siembra);
        }

        private SiembraResponse MapToResponse(Siembra siembra)
        {
            return new SiembraResponse
            {
                Id = siembra.Id,
                ParcelaId = siembra.ParcelaId,
                NombreParcela = siembra.Parcela?.NombreParcela,
                CultivoId = siembra.CultivoId,
                NombreCultivo = $"{siembra.Cultivo!.Nombre} {siembra.Cultivo!.Especie}",
                FechaInicio = siembra.FechaInicio,
                FechaFinal = siembra.FechaFinal,
                FechaGerminacion = siembra.FechaGerminacion,
                FechaFloracion = siembra.FechaFloracion,
                Activa = siembra.FechaFinal == null
            };
        }
    }
}