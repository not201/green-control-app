using GreenControl.Domain.Entities;
using GreenControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public class UsuarioRepository : Repository<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Usuario> GetByCorreoAsync(string correo)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Correo == correo);
        }
    }
}