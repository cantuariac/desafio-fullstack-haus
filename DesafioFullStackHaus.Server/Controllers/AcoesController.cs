using Microsoft.AspNetCore.Mvc;

using DesafioFullStackHaus.Server.Data;
using DesafioFullStackHaus.Server.Models;
using System.Collections.Generic;

namespace DesafioFullStackHaus.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcoesController : ControllerBase
    {
        protected readonly AcaoRepository _acaoRepository;

        public AcoesController(AcaoRepository repository)
        {
            _acaoRepository = repository;
        }

        // GET: api/Acoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AcaoDTO>>> GetAcoes(string? q)
        {
            IEnumerable<Acao> result;
            if (q is null)
            {
                result = await _acaoRepository.GetAll();
            }
            else
            {
                result = await _acaoRepository.Find(a => a.Descricao.Contains(q) ||
                                                         a.Hierarquia.Nome.Contains(q));
            }
            return Ok(result.Select(a => new AcaoDTO(a)));
        }

        // GET: api/Acoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AcaoDTO>> GetAcao(int id)
        {
            var acao = await _acaoRepository.Get(id);

            if (acao == null)
            {
                return NotFound();
            }

            return new AcaoDTO(acao);
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
                return BadRequest(new { message = $"Causas com id fornecidos não encontradas." });
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

            return CreatedAtAction("GetAcao", new { id = acao.Id }, new AcaoDTO(acao));
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
                return BadRequest(new { message = $"Causas com id fornecidos não encontradas." });
            }

            Hierarquia? hierarquia = await _acaoRepository.GetHierarquia(acaoDTO.HierarquiaId);
            if (hierarquia == null)
            {
                return BadRequest(new { message = $"Hierarquia com id {acaoDTO.HierarquiaId} não encontrada." });
            }

            acao.Descricao = acaoDTO.Descricao;
            acao.Status = acaoDTO.Status;
            //acao.HierarquiaId = acaoDTO.HierarquiaId;
            acao.Responsavel = acaoDTO.Responsavel;
            acao.PrazoConclusao = acaoDTO.PrazoConclusao;
            acao.Hierarquia = hierarquia;

            await _acaoRepository.Update(acao);

            return NoContent();
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
    }
}
