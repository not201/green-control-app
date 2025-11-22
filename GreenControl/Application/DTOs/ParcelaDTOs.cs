using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class ParcelaRequest
    {
        [Required(ErrorMessage = "El área es requerida")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El área debe ser mayor a 0")]
        public decimal Area { get; set; }

        [Required(ErrorMessage = "La ubicación es requerida")]
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El nombre de la parcela es requerido")]
        public string NombreParcela { get; set; }

        public string? TipoSuelo { get; set; }

        [Range(0, 14, ErrorMessage = "El pH debe estar entre 0 y 14")]
        public decimal? PhSuelo { get; set; }
    }

    public class ParcelaResponse
    {
        public int Id { get; set; }
        public decimal Area { get; set; }
        public string Ubicacion { get; set; }
        public string NombreParcela { get; set; }
        public string? TipoSuelo { get; set; }
        public decimal? PhSuelo { get; set; }
        public bool TieneSiembra { get; set; }
        public SiembraResponse? SiembraActual { get; set; }
    }
}