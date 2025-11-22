namespace GreenControl.Domain.Entities
{
    public class Cultivo
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Especie { get; set; }
        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; }
        public ICollection<Siembra> Siembras { get; set; }
    }
}