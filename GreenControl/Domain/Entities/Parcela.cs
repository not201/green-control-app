namespace GreenControl.Domain.Entities
{
    public class Parcela
    {
        public int Id { get; set; }
        public decimal Area { get; set; }
        public string Ubicacion { get; set; }
        public string NombreParcela { get; set; }
        public string? TipoSuelo { get; set; }
        public decimal? PhSuelo { get; set; }
        public int UsuarioId { get; set; }

        public ICollection<Gasto> Gastos { get; set; }
        public ICollection<Ingreso> Ingresos { get; set; }
        public ICollection<Tarea> Tareas { get; set; }
        public Usuario Usuario { get; set; }
        public Siembra? Siembra { get; set; }
    }
}