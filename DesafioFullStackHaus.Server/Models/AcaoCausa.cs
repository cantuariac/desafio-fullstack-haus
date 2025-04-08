namespace DesafioFullStackHaus.Server.Models
{
    public class AcaoCausa
    {
        public int AcaoId { get; set; }
        public int CausaId { get; set; }
        public Acao Acao { get; set; }
        public Causa Causa { get; set; }
    }
}
