using DesafioFullStackHaus.Server.Controllers;
using DesafioFullStackHaus.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DesafioFullStackHaus.Server.Data
{
    public class AcaoRepository
    {
        protected readonly DesafioHausDbContext Context;

        public AcaoRepository(DesafioHausDbContext context)
        {
            Context = context;
        }

        public async Task<List<Acao>> GetAll()
        {
            return await Context.Acoes.ToListAsync();
        }

        public async Task<Acao?> Get(int id)
        {
            return await Context.Acoes.FindAsync(id);
        }

        public async Task<List<Acao>> Find(Expression<Func<Acao, bool>> predicate)
        {
            return await Context.Acoes.AsNoTracking().Where(predicate).ToListAsync();
        }
        public async Task<List<Causa>> FindCausas(Expression<Func<Causa, bool>> predicate)
        {
            return await Context.Causas.AsNoTracking().Where(predicate).ToListAsync();
        }
        public async Task<Hierarquia?> GetHierarquia(int id)
        {
            return await Context.Hierarquias.FindAsync(id);
        }

        public async Task<int?> Add(Acao entity)
        {
            try
            {
                Context.Acoes.Add(entity);
                await SaveChanges();
                return entity.Id;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public async Task<bool> AddAcaoCausa(AcaoCausa entity)
        {
            try
            {
                Context.Add(entity);
                await SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool Exists(int id)
        {
            var entity = Context.Acoes.Find(id);
            if (entity == null) { return false; }
            else
            {
                Context.Entry(entity).State = EntityState.Detached;
                return true;
            }
        }

        public async Task<bool> Update(Acao entity)
        {
            try
            {
                Context.Acoes.Update(entity);
                await SaveChanges();
                return true;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;

            }
        }

        public async Task<bool> Remove(Acao entity)
        {
            try
            {
                Context.Acoes.Remove(entity);
                await SaveChanges();
                return true;

            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> Remove(int id)
        {
            var entity = await Context.Acoes.FindAsync(id);
            if (entity != null)
            {
                return await Remove(entity);
            }
            else
            {
                return false;
            }

        }

        public async Task<int> SaveChanges()
        {
            return await Context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Context?.Dispose();
        }
    }
}
