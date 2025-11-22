using GreenControl.Domain.Entities;
using System.Threading.Tasks;

namespace GreenControl.Infrastructure.Repositories
{
    public interface IUsuarioRepository : IRepository<Usuario>
    {
        Task<Usuario> GetByCorreoAsync(string correo);
    }
}