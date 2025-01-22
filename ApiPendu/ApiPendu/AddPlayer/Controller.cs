using Microsoft.AspNetCore.Mvc;

namespace ApiPendu.AddPlayer;

[ApiController]
[Route("api/[controller]")]
public class AddPlayerController : ControllerBase
{
    [HttpPost]
    public IActionResult AddPlayer([FromBody] DataPlayer dataPlayer)
    {
        if (dataPlayer == null || string.IsNullOrWhiteSpace(dataPlayer.pseudo))
        {
            return BadRequest("Merci de renseigner un pseudo valide.");
        }

        var resultat = Service.AddPlayer(dataPlayer);

        if (resultat)
        {
            return Created("", new 
            {
                message = $"Joueur créé avec succès. Bienvenue {dataPlayer.pseudo} !",
                status = "created",
                pseudo = dataPlayer.pseudo
            });
        }
        else
        {
            return Ok(new 
            {
                message = $"Joueur déjà existant. Bonjour {dataPlayer.pseudo} !",
                status = "exists",
                pseudo = dataPlayer.pseudo
            });
        }

    }
}