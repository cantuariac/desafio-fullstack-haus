using Microsoft.AspNetCore.Mvc;

using DesafioFullStackHaus.Server.Data;
using DesafioFullStackHaus.Server.Models;

namespace DesafioFullStackHaus.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        protected readonly ValuesRepository _valuesRepository;

        public ValuesController(ValuesRepository repository)
        {
            _valuesRepository = repository;
        }
        // GET: api/Values/Causas
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Causa>>> Causas()
        {
            return (await _valuesRepository.GetCausas()).ToList();
        }
        // GET: api/Values/Hierarquias
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Hierarquia>>> Hierarquias()
        {
            return (await _valuesRepository.GetHierarquias()).ToList();
        }
    }
}
