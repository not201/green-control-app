using GreenControl.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public interface IParcelaRepository : IRepository<Parcela>
    {
        Task<IEnumerable<Parcela>> GetByUsuarioIdAsync(int usuarioId);
        Task<Parcela> GetWithSiembraAsync(int id, int usuarioId);
    }
}