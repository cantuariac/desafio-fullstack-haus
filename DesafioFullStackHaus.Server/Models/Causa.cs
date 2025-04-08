using System.ComponentModel.DataAnnotations;

namespace DesafioFullStackHaus.Server.Models
{
    public class Causa : BaseModel
    {
        [StringLength(500)]
        public string Nome { get; set; }
        //public ICollection<AcaoCausa> Acoes { get; set; }
    }
}
