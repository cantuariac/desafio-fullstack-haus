using DesafioFullStackHaus.Server.Data;
using DesafioFullStackHaus.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace DesafioFullStackHaus.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        protected readonly DesafioHausDbContext _context;
        protected readonly AcaoRepository _acaoRepository;

        public TestController(DesafioHausDbContext context, AcaoRepository repository)
        {
            _context = context;
            _acaoRepository = repository;
        }

        [HttpGet("[action]")]
        [Authorize]
        public ActionResult AuthUser()
        {
            var user = this.User;
            return Ok(user.Identity.Name);
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<Acao>> Teste()
        {
            int[] cs = [2, 3];
            List<Causa> causas = await _acaoRepository.FindCausas(c => cs.Contains(c.Id));
            Hierarquia? hierarquia = await _acaoRepository.GetHierarquia(2);
            Acao acao = new Acao()
            {
                Descricao = "Realizar tarefa 2",
                PrazoConclusao = DateTime.Now,
                Responsavel = "Joao",
                Status = StatusAcao.Aberto,
                HierarquiaId = hierarquia.Id
            };

            var id = await _acaoRepository.Add(acao);
            foreach (var causa in causas)
            {
                await _acaoRepository.AddAcaoCausa(new AcaoCausa { AcaoId = (int)id, CausaId = causa.Id });
            }
            return Ok(acao);
        }
        [HttpGet("[action]")]
        public async Task<ActionResult> Povoa()
        {
            _context.Hierarquias.Add(new Hierarquia { Nome = "Eliminação" });
            _context.Hierarquias.Add(new Hierarquia { Nome = "Substituição" });
            _context.Hierarquias.Add(new Hierarquia { Nome = "EPI" });
            _context.Causas.Add(new Causa { Nome = "Falha A" });
            _context.Causas.Add(new Causa { Nome = "Falha B" });
            _context.Causas.Add(new Causa { Nome = "Falha C" });
            _context.SaveChanges();
            return Ok();
        }
    }
}
