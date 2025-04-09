using Microsoft.EntityFrameworkCore;

using DesafioFullStackHaus.Server.Models;

namespace DesafioFullStackHaus.Server.Data
{
    public class ValuesRepository
    {
        protected readonly DesafioHausDbContext Context;

        public ValuesRepository(DesafioHausDbContext context)
        {
            Context = context;
        }

        public async Task<IEnumerable<Causa>> GetCausas()
        {
            return await Context.Causas
                                .ToListAsync();
        }
        public async Task<IEnumerable<Hierarquia>> GetHierarquias()
        {
            return await Context.Hierarquias
                                .ToListAsync();
        }
    }
}
