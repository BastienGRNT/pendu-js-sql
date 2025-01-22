namespace ApiPendu.GetMot;
using Npgsql;

public class Service
{
    public static string GetMot(DataRecu data)
    {
        try
        {
            using var connection = SQL.GetConnection();

            if (connection.State == System.Data.ConnectionState.Closed)
            {
                connection.Open();
            }
        
            var query = "SELECT mot FROM mot_pendu WHERE id_difficulty = (SELECT id_difficulty FROM difficulty_level WHERE level = @level) ORDER BY RANDOM() LIMIT 1;";
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@level", data.level);

            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                return reader["mot"].ToString();
            }

            return "Aucun mot trouvé";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la récupération du mot : {ex.Message}");
            return "Erreur lors de la récupération du mot";
        }
    }
}