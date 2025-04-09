using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

using DesafioFullStackHaus.Server.Models;

namespace DesafioFullStackHaus.Server.Controllers
{
    public record AcaoDTO()
    {
        public int Id { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "A ação dever ter ao menos uma causa")]
        public ICollection<int> Causas { get; set; } = [];
        [Required]
        [StringLength(500)]
        public string Descricao { get; set; }
        [Required]
        [StringLength(50)]
        public string Responsavel { get; set; }
        [Required]
        public int HierarquiaId { get; set; }
        [Required]
        public DateTime PrazoConclusao { get; set; }
        [Required]
        [DefaultValue(StatusAcao.EmProgresso)]
        public StatusAcao Status { get; set; }

        public AcaoDTO(Acao acao) : this()
        {
            Id = acao.Id;
            Descricao = acao.Descricao;
            Responsavel = acao.Responsavel;
            PrazoConclusao = acao.PrazoConclusao;
            Status = acao.Status;
            HierarquiaId = acao.HierarquiaId;
            if (acao.Causas != null)
            { Causas = acao.Causas.Select(c => c.CausaId).ToList(); }
        }
    }
}
