using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public class ParcelaRepository : Repository<Parcela>, IParcelaRepository
    {
        public ParcelaRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Parcela>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _dbSet
                .Include(p => p.Siembra)
                    .ThenInclude(s => s.Cultivo)
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<Parcela> GetWithSiembraAsync(int id, int usuarioId)
        {
            return await _dbSet
                .Include(p => p.Siembra)
                    .ThenInclude(s => s.Cultivo)
                .FirstOrDefaultAsync(p => p.Id == id && p.UsuarioId == usuarioId);
        }
    }
}