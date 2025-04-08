using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DesafioFullStackHaus.Server.Data;
using DesafioFullStackHaus.Server.Models;
using System.Net;

namespace DesafioFullStackHaus.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcoesController : ControllerBase
    {
        protected readonly DesafioHausDbContext _context;
        protected readonly AcaoRepository _acaoRepository;

        public AcoesController(DesafioHausDbContext context, AcaoRepository repository)
        {
            _context = context;
            _acaoRepository = repository;
        }

        // GET: api/Acoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Acao>>> GetAcoes()
        {
            return await _acaoRepository.GetAll();
        }

        // GET: api/Acoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Acao>> GetAcao(int id)
        {
            var acao = await _acaoRepository.Get(id);

            if (acao == null)
            {
                return NotFound();
            }

            return acao;
        }

        // PUT: api/Acoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAcao(int id, AcaoDTO acaoDTO)
        {
            var acao = await _acaoRepository.Get(id);
            if (acao == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<Causa> causas = await _acaoRepository.FindCausas(c => acaoDTO.Causas.Contains(c.Id));
            if (!causas.Any())
            {
                return BadRequest(new { message = $"Causas com id {acaoDTO.Causas} não encontradas." });
            }

            Hierarquia? hierarquia = await _acaoRepository.GetHierarquia(acaoDTO.HierarquiaId);
            if (hierarquia == null)
            {
                return BadRequest(new { message = $"Hierarquia com id {acaoDTO.HierarquiaId} não encontrada." });
            }

            acao.Descricao = acaoDTO.Descricao;
            acao.Status = acaoDTO.Status;
            acao.HierarquiaId = acaoDTO.HierarquiaId;
            acao.Responsavel = acaoDTO.Responsavel;
            acao.PrazoConclusao = acaoDTO.PrazoConclusao;

            await _acaoRepository.Update(acao);

            return NoContent();
        }

        // POST: api/Acoes
        [HttpPost]
        public async Task<ActionResult<Acao>> PostAcao(AcaoDTO acaoDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<Causa> causas = await _acaoRepository.FindCausas(c => acaoDTO.Causas.Contains(c.Id));
            if (!causas.Any())
            {
                return BadRequest(new { message = $"Causas com id {acaoDTO.Causas} não encontradas." });
            }

            Hierarquia? hierarquia = await _acaoRepository.GetHierarquia(acaoDTO.HierarquiaId);
            if (hierarquia == null)
            {
                return BadRequest(new { message = $"Hierarquia com id {acaoDTO.HierarquiaId} não encontrada." });
            }
            var acao = new Acao()
            {
                Descricao = acaoDTO.Descricao,
                PrazoConclusao = acaoDTO.PrazoConclusao,
                Status = acaoDTO.Status,
                Responsavel = acaoDTO.Responsavel,
                Hierarquia = hierarquia
            };

            await _acaoRepository.Add(acao);
            foreach (var causa in causas)
            {
                await _acaoRepository.AddAcaoCausa(new AcaoCausa { AcaoId = acao.Id, CausaId = causa.Id });
            }
            await _acaoRepository.SaveChanges();

            return CreatedAtAction("GetAcao", new { id = acao.Id }, acaoDTO);
        }

        // DELETE: api/Acoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAcao(int id)
        {
            if (!await _acaoRepository.Remove(id))
            {
                return NotFound();
            }
            return NoContent();
        }

        private bool AcaoExists(int id)
        {
            return _acaoRepository.Exists(id);
        }
    }
}
