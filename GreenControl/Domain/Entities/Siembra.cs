namespace GreenControl.Domain.Entities
{
    public class Siembra
    {
        public int Id { get; set; }
        public int ParcelaId { get; set; }
        public int CultivoId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFinal { get; set; }
        public DateTime? FechaGerminacion { get; set; }
        public DateTime? FechaFloracion { get; set; }

        public Parcela Parcela { get; set; }
        public Cultivo Cultivo { get; set; }
    }
}