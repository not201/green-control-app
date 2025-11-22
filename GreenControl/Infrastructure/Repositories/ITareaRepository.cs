using GreenControl.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public interface ITareaRepository : IRepository<Tarea>
    {
        Task<IEnumerable<Tarea>> GetByUsuarioIdAsync(int usuarioId);
        Task<IEnumerable<Tarea>> GetByParcelaIdAsync(int parcelaId, int usuarioId);
        Task<Tarea> GetWithDetailsAsync(int id, int usuarioId);
    }
}