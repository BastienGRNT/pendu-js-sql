using Microsoft.AspNetCore.Mvc;

namespace ApiPendu.AddScore;

[ApiController]
[Route("api/[controller]")]
public class AddScoreController : ControllerBase
{
    [HttpPost]
    public IActionResult AddScore([FromBody] DataScore dataScore)
    {
        if (dataScore == null ||
            dataScore.player == null ||
            dataScore.mot == null ||
            dataScore.score_player < 0 ||
            string.IsNullOrWhiteSpace(dataScore.status))
        {
            return BadRequest("Merci de renseigner des données valides !");
        }

        var resultat = Service.AddScore(dataScore);

        if (resultat.StartsWith("Erreur"))
        {
            return StatusCode(500, resultat);
        }

        return Ok(new { message = resultat });
    }
}