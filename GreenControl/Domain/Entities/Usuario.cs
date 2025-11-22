using System.Collections.Generic;

namespace GreenControl.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string? Apellido { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; }
        public DateTime FechaCreacion { get; set; }

        public ICollection<Parcela> Parcelas { get; set; }
        public ICollection<Cultivo> Cultivos { get; set; }
        public ICollection<Notificacion> Notificaciones { get; set; }
        public ICollection<Gasto> Gastos { get; set; }
        public ICollection<Ingreso> Ingresos { get; set; }
    }
}