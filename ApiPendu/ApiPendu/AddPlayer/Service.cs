namespace ApiPendu.AddPlayer;
using Npgsql;

public class Service
{
    public static bool AddPlayer(DataPlayer dataPlayer)
    {
        using var connection = SQL.GetConnection();
        
        if (connection.State == System.Data.ConnectionState.Closed)
        {
            connection.Open();
        }

        var queryCheck = "SELECT COUNT(*) FROM player WHERE pseudo = @user_id";
        
        using var commandCheck = new NpgsqlCommand(queryCheck, connection);
        commandCheck.Parameters.AddWithValue("@user_id", dataPlayer.pseudo);

        int resultat = Convert.ToInt32(commandCheck.ExecuteScalar());

        if (resultat == 0) 
        {
            var queryAdd = "INSERT INTO player (pseudo) VALUES (@user_id)";
            using var commandAdd = new NpgsqlCommand(queryAdd, connection);
            commandAdd.Parameters.AddWithValue("@user_id", dataPlayer.pseudo);

            int rowsAffected = commandAdd.ExecuteNonQuery();

            return rowsAffected > 0;
        }

        return false;
    }
}