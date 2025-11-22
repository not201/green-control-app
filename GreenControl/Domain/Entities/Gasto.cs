namespace GreenControl.Domain.Entities
{
    public class Gasto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string Concepto { get; set; }
        public string? NotaAdicional { get; set; }
        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; }
    }
}