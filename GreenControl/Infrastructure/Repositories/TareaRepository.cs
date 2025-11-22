using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public class TareaRepository : Repository<Tarea>, ITareaRepository
    {
        public TareaRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Tarea>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _dbSet
                .Include(t => t.Parcela)
                .Where(t => t.Parcela.UsuarioId == usuarioId)
                .OrderBy(t => t.FechaProgramada)
                .ToListAsync();
        }

        public async Task<IEnumerable<Tarea>> GetByParcelaIdAsync(int parcelaId, int usuarioId)
        {
            return await _dbSet
                .Include(t => t.Parcela)
                .Where(t => t.ParcelaId == parcelaId && t.Parcela.UsuarioId == usuarioId)
                .OrderBy(t => t.FechaProgramada)
                .ToListAsync();
        }

        public async Task<Tarea> GetWithDetailsAsync(int id, int usuarioId)
        {
            return await _dbSet
                .Include(t => t.Parcela)
                .FirstOrDefaultAsync(t => t.Id == id && t.Parcela.UsuarioId == usuarioId);
        }
    }
}