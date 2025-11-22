using GreenControl.Application.DTOs;
using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Application.Services
{
    public interface IParcelaService
    {
        Task<IEnumerable<ParcelaResponse>> GetAllAsync(int usuarioId);
        Task<ParcelaResponse> GetByIdAsync(int id, int usuarioId);
        Task<ParcelaResponse> CreateAsync(ParcelaRequest request, int usuarioId);
        Task<ParcelaResponse> UpdateAsync(int id, ParcelaRequest request, int usuarioId);
        Task DeleteAsync(int id, int usuarioId);
    }

    public class ParcelaService : IParcelaService
    {
        private readonly IParcelaRepository _parcelaRepository;

        public ParcelaService(IParcelaRepository parcelaRepository)
        {
            _parcelaRepository = parcelaRepository;
        }

        public async Task<IEnumerable<ParcelaResponse>> GetAllAsync(int usuarioId)
        {
            var parcelas = await _parcelaRepository.GetByUsuarioIdAsync(usuarioId);
            return parcelas.Select(MapToResponse);
        }

        public async Task<ParcelaResponse> GetByIdAsync(int id, int usuarioId)
        {
            var parcela = await _parcelaRepository.GetWithSiembraAsync(id, usuarioId);
            if (parcela == null)
                throw new KeyNotFoundException("Parcela no encontrada");

            return MapToResponse(parcela);
        }

        public async Task<ParcelaResponse> CreateAsync(ParcelaRequest request, int usuarioId)
        {
            var parcela = new Parcela
            {
                Area = request.Area,
                Ubicacion = request.Ubicacion,
                NombreParcela = request.NombreParcela,
                TipoSuelo = request.TipoSuelo,
                PhSuelo = request.PhSuelo,
                UsuarioId = usuarioId
            };

            await _parcelaRepository.AddAsync(parcela);
            return MapToResponse(parcela);
        }

        public async Task<ParcelaResponse> UpdateAsync(int id, ParcelaRequest request, int usuarioId)
        {
            var parcela = await _parcelaRepository.GetWithSiembraAsync(id, usuarioId);
            if (parcela == null)
                throw new KeyNotFoundException("Parcela no encontrada");

            parcela.Area = request.Area;
            parcela.Ubicacion = request.Ubicacion;
            parcela.NombreParcela = request.NombreParcela;
            parcela.TipoSuelo = request.TipoSuelo;
            parcela.PhSuelo = request.PhSuelo;

            await _parcelaRepository.UpdateAsync(parcela);
            return MapToResponse(parcela);
        }

        public async Task DeleteAsync(int id, int usuarioId)
        {
            var parcela = await _parcelaRepository.GetWithSiembraAsync(id, usuarioId);
            if (parcela == null)
                throw new KeyNotFoundException("Parcela no encontrada");

            await _parcelaRepository.DeleteAsync(parcela);
        }

        private ParcelaResponse MapToResponse(Parcela parcela)
        {
            var response = new ParcelaResponse
            {
                Id = parcela.Id,
                Area = parcela.Area,
                Ubicacion = parcela.Ubicacion,
                NombreParcela = parcela.NombreParcela,
                TipoSuelo = parcela.TipoSuelo,
                PhSuelo = parcela.PhSuelo,
                TieneSiembra = parcela.Siembra != null && parcela.Siembra.FechaFinal == null
            };

            if (parcela.Siembra != null && parcela.Siembra.FechaFinal == null)
            {
                response.SiembraActual = new SiembraResponse
                {
                    Id = parcela.Siembra.Id,
                    ParcelaId = parcela.Siembra.ParcelaId,
                    NombreParcela = parcela.NombreParcela,
                    CultivoId = parcela.Siembra.CultivoId,
                    NombreCultivo = parcela.Siembra.Cultivo?.Nombre,
                    FechaInicio = parcela.Siembra.FechaInicio,
                    FechaFinal = parcela.Siembra.FechaFinal,
                    FechaGerminacion = parcela.Siembra.FechaGerminacion,
                    FechaFloracion = parcela.Siembra.FechaFloracion,
                    Activa = true
                };
            }

            return response;
        }
    }
}