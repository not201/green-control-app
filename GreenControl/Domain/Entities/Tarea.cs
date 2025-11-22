using System;

namespace GreenControl.Domain.Entities
{
    public class Tarea
    {
        public int Id { get; set; }
        public DateTime FechaProgramada { get; set; }
        public DateTime? FechaFinalizacion { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int ParcelaId { get; set; }

        public Parcela Parcela { get; set; }
    }
}