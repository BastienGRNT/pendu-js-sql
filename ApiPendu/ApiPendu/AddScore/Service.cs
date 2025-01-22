using Npgsql;

namespace ApiPendu.AddScore;

public class Service
{
    public static string AddScore(DataScore dataScore)
    {
        using var connection = SQL.GetConnection();
        if (connection.State == System.Data.ConnectionState.Closed)
        {
            connection.Open();
        }

        var query = """
                    INSERT INTO score (id_player, id_mot, score_player, nb_essaie, nb_lettres, statut) 
                    VALUES (
                    (SELECT id_player FROM player WHERE pseudo = CAST(@player AS TEXT)), 
                    (SELECT id_mot FROM mot_pendu WHERE mot = @mot), 
                    @score, 
                    @nb_essaie, 
                    @nb_lettres, 
                    @statut);
                    """;
        
        try
        {
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@player", dataScore.player);
            command.Parameters.AddWithValue("@mot", dataScore.mot);
            command.Parameters.AddWithValue("@score", dataScore.score_player);
            command.Parameters.AddWithValue("@nb_essaie", dataScore.nb_essaies);
            command.Parameters.AddWithValue("@nb_lettres", dataScore.nb_lettres);
            command.Parameters.AddWithValue("@statut", dataScore.status);

            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected > 0)
            {
                return "Le score a été ajouté avec succès.";
            }
            else
            {
                return "Aucune ligne insérée. Veuillez vérifier les données.";
            }
        }
        catch (Exception ex)
        {
            return $"Erreur lors de l'ajout du score : {ex.Message}";
        }
    }
}