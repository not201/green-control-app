using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class NotificacionRequest
    {
        [Required(ErrorMessage = "El título es requerido")]
        public string Titulo { get; set; }

        [Required(ErrorMessage = "La descripción es requerida")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "El usuario es requerido")]
        public int UsuarioId { get; set; }
    }

    public class NotificacionResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaEnvio { get; set; }
        public DateTime? FechaLeido { get; set; }
        public bool Leida { get; set; }
    }
}