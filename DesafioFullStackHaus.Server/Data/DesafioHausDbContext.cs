using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using DesafioFullStackHaus.Server.Models;

namespace DesafioFullStackHaus.Server.Data
{

    public class DesafioHausDbContext : IdentityDbContext<IdentityUser>
    {
        public DesafioHausDbContext(DbContextOptions<DesafioHausDbContext> options) : base(options) { }

        public DbSet<Acao> Acoes { get; set; }
        public DbSet<Hierarquia> Hierarquias { get; set; }
        public DbSet<Causa> Causas { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AcaoCausa>().HasKey(e => new { e.AcaoId, e.CausaId });
            modelBuilder.Entity<Acao>()
                            .HasOne(e => e.Hierarquia);
            modelBuilder.Entity<Acao>()
                            .HasMany(e => e.Causas);

            modelBuilder.Entity<Causa>().HasData(new Causa { Id = 1, Nome = "Falha no treinamento" });
            modelBuilder.Entity<Causa>().HasData(new Causa { Id = 2, Nome = "Falha na mão de obra" });
            modelBuilder.Entity<Causa>().HasData(new Causa { Id = 3, Nome = "Falha na disponibilidade" });

            modelBuilder.Entity<Hierarquia>().HasData(new Hierarquia { Id = 1, Nome = "Eliminação" });
            modelBuilder.Entity<Hierarquia>().HasData(new Hierarquia { Id = 2, Nome = "Substituição" });
            modelBuilder.Entity<Hierarquia>().HasData(new Hierarquia { Id = 3, Nome = "EPI" });
        }
    }
}
