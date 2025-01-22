namespace ApiPendu.GetPlayer;
using Npgsql;

public class Service
{
    public static List<string> ShowPlayers(Data data)
    {
        using var connection = SQL.GetConnection();
        if (connection.State != System.Data.ConnectionState.Open)
        {
            connection.Open();
        }

        string query = "";

        switch (data.demande)
        {
            case "Alpha":
                query = """
                        SELECT
                            player.pseudo,
                            score.score_player,
                            mot_pendu.mot,
                            difficulty_level.level,
                            score.nb_essaie,
                            score.statut
                        FROM score
                        JOIN player ON player.id_player = score.id_player
                        JOIN mot_pendu ON mot_pendu.id_mot = score.id_mot
                        JOIN difficulty_level ON mot_pendu.id_difficulty = difficulty_level.id_difficulty
                        ORDER BY player.pseudo DESC
                        LIMIT @limit;
                        """;
                break;
            
            case "Score":
                query = """
                        SELECT
                            player.pseudo,
                            score.score_player,
                            mot_pendu.mot,
                            difficulty_level.level,
                            score.nb_essaie,
                            score.statut
                        FROM score
                        JOIN player ON player.id_player = score.id_player
                        JOIN mot_pendu ON mot_pendu.id_mot = score.id_mot
                        JOIN difficulty_level ON mot_pendu.id_difficulty = difficulty_level.id_difficulty
                        ORDER BY score.score_player ASC 
                        LIMIT @limit;
                        """;
                break;
            
            case "diff":
                query = """
                        SELECT
                            player.pseudo,
                            score.score_player,
                            mot_pendu.mot,
                            difficulty_level.level,
                            score.nb_essaie,
                            score.statut
                        FROM score
                        JOIN player ON player.id_player = score.id_player
                        JOIN mot_pendu ON mot_pendu.id_mot = score.id_mot
                        JOIN difficulty_level ON mot_pendu.id_difficulty = difficulty_level.id_difficulty
                        ORDER BY 
                            CASE 
                                WHEN difficulty_level.level = 'difficile' THEN 1
                                WHEN difficulty_level.level = 'moyen' THEN 2
                                WHEN difficulty_level.level = 'facile' THEN 3
                            END ASC,
                            player.pseudo DESC
                        LIMIT @limit;
                        """;
                break;
            
            default:
                throw new ArgumentException("Type de demande invalide.");
        }

        using var command = new NpgsqlCommand(query, connection);
        command.Parameters.AddWithValue("@limit", data.limit);

        List<string> players = new List<string>();

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            string pseudo = reader["pseudo"].ToString();
            int score = Convert.ToInt32(reader["score_player"]);
            string mot = reader["mot"].ToString();
            string level = reader["level"].ToString();
            int nbEssaie = Convert.ToInt32(reader["nb_essaie"]);
            string statut = reader["statut"].ToString();

            players.Add($"Pseudo: {pseudo}, Score: {score}, Mot: {mot}, Difficulté: {level}, Tentatives: {nbEssaie}, Statut: {statut}");
        }

        return players;
    }
}
