using DesafioFullStackHaus.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace DesafioFullStackHaus.Server.Controllers
{
    public class AcaoDTO()
    {
        [Required]
        [MinLength(1, ErrorMessage = "A ação dever ter ao menos uma causa")]
        public ICollection<int> Causas { get; set; }
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
    }
}
