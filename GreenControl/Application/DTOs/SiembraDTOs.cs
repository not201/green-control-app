using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class SiembraRequest
    {
        [Required(ErrorMessage = "La parcela es requerida")]
        public int ParcelaId { get; set; }

        [Required(ErrorMessage = "El cultivo es requerido")]
        public int CultivoId { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es requerida")]
        public DateTime FechaInicio { get; set; }

        public DateTime? FechaGerminacion { get; set; }
        public DateTime? FechaFloracion { get; set; }
    }

    public class SiembraUpdateRequest
    {
        public DateTime? FechaFinal { get; set; }
        public DateTime? FechaGerminacion { get; set; }
        public DateTime? FechaFloracion { get; set; }
    }

    public class SiembraResponse
    {
        public int Id { get; set; }
        public int ParcelaId { get; set; }
        public string NombreParcela { get; set; }
        public int CultivoId { get; set; }
        public string NombreCultivo { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFinal { get; set; }
        public DateTime? FechaGerminacion { get; set; }
        public DateTime? FechaFloracion { get; set; }
        public bool Activa { get; set; }
    }
}