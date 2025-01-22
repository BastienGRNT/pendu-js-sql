namespace ApiPendu;
using Npgsql;

public class SQL
{
    public static NpgsqlConnection GetConnection()
    {
        var DB_host = "localhost";
        var DB_port = "5433";
        var DB_user = "mon_user";
        var DB_password = "mon_password";
        var DB_username = "mon_user";
        var DB_database = "ma_base";
    
        var connectionString = $"Host={DB_host};Port={DB_port};Database={DB_database};Username={DB_username};Password={DB_password};";
        return new NpgsqlConnection(connectionString);
    }
}