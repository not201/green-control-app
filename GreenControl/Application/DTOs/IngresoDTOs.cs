using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class IngresoRequest
    {
        [Required(ErrorMessage = "La fecha es requerida")]
        public DateTime Fecha { get; set; }

        [Required(ErrorMessage = "El monto es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
        public decimal Monto { get; set; }

        [Required(ErrorMessage = "El concepto es requerido")]
        public string Concepto { get; set; }

        public string? NotaAdicional { get; set; }
    }

    public class IngresoResponse
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string Concepto { get; set; }
        public string? NotaAdicional { get; set; }
    }
}