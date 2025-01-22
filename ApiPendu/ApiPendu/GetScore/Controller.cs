using Microsoft.AspNetCore.Mvc;

namespace ApiPendu.GetPlayer;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    [HttpPost]
    public IActionResult GetResult([FromBody] Data data)
    {
        if (data == null)
        {
            return BadRequest("Merci de renseigner des données valides.");
        }

        try
        {
            var result = Service.ShowPlayers(data);

            if (result == null || !result.Any())
            {
                return NotFound("Aucun résultat trouvé pour la requête spécifiée.");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Une erreur interne est survenue : {ex.Message}");
        }
    }
}