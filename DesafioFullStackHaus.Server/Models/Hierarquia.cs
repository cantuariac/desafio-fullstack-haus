using System.ComponentModel.DataAnnotations;

namespace DesafioFullStackHaus.Server.Models
{
    public class Hierarquia : BaseModel
    {
        [StringLength(50)]
        public string Nome { get; set; }
    }
}
