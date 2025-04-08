using System.ComponentModel.DataAnnotations;

namespace DesafioFullStackHaus.Server.Models
{
    public class BaseModel
    {
        [Key]
        public int Id { get; set; }
    }
}
