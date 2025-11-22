using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class CultivoRequest
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "La especie es requerida")]
        public string Especie { get; set; }
    }

    public class CultivoResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Especie { get; set; }
    }
}