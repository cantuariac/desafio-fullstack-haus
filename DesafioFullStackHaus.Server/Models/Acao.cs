using System.Collections.ObjectModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DesafioFullStackHaus.Server.Models
{
    public enum StatusAcao
    {
        Aberto,
        EmProgresso,
        Concluida
    }
    public class Acao : BaseModel
    {

        [StringLength(500)]
        public string Descricao { get; set; }

        [StringLength(50)]
        public string Responsavel { get; set; }

        public DateTime PrazoConclusao { get; set; }

        [DefaultValue(StatusAcao.Aberto)]
        public StatusAcao Status { get; set; }

        public int HierarquiaId { get; set; }
        public Hierarquia Hierarquia { get; set; }

        public ICollection<AcaoCausa> Causas { get; set; }

    }
}
