using Microsoft.AspNetCore.Mvc;

namespace ApiPendu.GetMot;

[ApiController]
[Route("api/[controller]")]
public class GetMotController : ControllerBase
{
    [HttpPost]
    public IActionResult GetMot([FromBody] DataRecu data)
    {
        if (data == null)
        {
            return BadRequest("Les données envoyées sont invalides.");
        }

        if (!data.besoin)
        {
            return BadRequest("La requête n'est pas nécessaire.");
        }

        var result = Service.GetMot(data);
        if (result == "Aucun mot trouvé")
        {
            return NotFound("Aucun mot trouvé pour ce niveau de difficulté.");
        }

        return Ok(new { mot = result });
    }
}