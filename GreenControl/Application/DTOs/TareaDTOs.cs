	using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class TareaRequest
    {
        [Required(ErrorMessage = "La fecha programada es requerida")]
        public DateTime FechaProgramada { get; set; }

        [Required(ErrorMessage = "El nombre es requerido")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "La descripción es requerida")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "La parcela es requerida")]
        public int ParcelaId { get; set; }
    }

    public class TareaUpdateRequest
    {
        public DateTime? FechaProgramada { get; set; }
        public DateTime? FechaFinalizacion { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
    }

    public class TareaResponse
    {
        public int Id { get; set; }
        public DateTime FechaProgramada { get; set; }
        public DateTime? FechaFinalizacion { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int ParcelaId { get; set; }
        public string NombreParcela { get; set; }
        public bool Completada { get; set; }
    }
}
