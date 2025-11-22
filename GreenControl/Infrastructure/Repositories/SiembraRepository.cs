using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public class SiembraRepository : Repository<Siembra>, ISiembraRepository
    {
        public SiembraRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Siembra>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _dbSet
                .Include(s => s.Parcela)
                .Include(s => s.Cultivo)
                .Where(s => s.Parcela.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<Siembra> GetWithDetailsAsync(int id, int usuarioId)
        {
            return await _dbSet
                .Include(s => s.Parcela)
                .Include(s => s.Cultivo)
                .FirstOrDefaultAsync(s => s.Id == id && s.Parcela.UsuarioId == usuarioId);
        }

        public async Task<bool> ParcelaTieneSiembraActivaAsync(int parcelaId)
        {
            return await _dbSet.AnyAsync(s => s.ParcelaId == parcelaId && s.FechaFinal == null);
        }
    }
}