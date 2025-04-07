using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DesafioFullStackHaus.Server.Data
{

    public class DesafioHausDbContext : IdentityDbContext<IdentityUser>
    {
        public DesafioHausDbContext(DbContextOptions<DesafioHausDbContext> options) : base(options) { }
    }
}
