using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace GreenControl.API.Extensions
{
    public static class HttpContextExtensions
    {
        public static int GetUsuarioId(this HttpContext context)
        {
            var claim = context.User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                throw new UnauthorizedAccessException("Usuario no autenticado");
            }

            return int.Parse(claim.Value);
        }
    }
}
