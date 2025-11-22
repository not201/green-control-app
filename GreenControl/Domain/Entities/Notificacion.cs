namespace GreenControl.Domain.Entities
{
    public class Notificacion
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaEnvio { get; set; }
        public DateTime? FechaLeido { get; set; }
        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; }
    }
}