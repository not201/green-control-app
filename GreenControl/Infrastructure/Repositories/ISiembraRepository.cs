using GreenControl.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public interface ISiembraRepository : IRepository<Siembra>
    {
        Task<IEnumerable<Siembra>> GetByUsuarioIdAsync(int usuarioId);
        Task<Siembra> GetWithDetailsAsync(int id, int usuarioId);
        Task<bool> ParcelaTieneSiembraActivaAsync(int parcelaId);
    }
}