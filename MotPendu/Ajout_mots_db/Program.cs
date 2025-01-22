using Npgsql;
using System;
using System.Collections.Generic;
using System.IO;

static NpgsqlConnection GetConnection()
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

static HashSet<string> GetMots()
{
    var mots = new HashSet<string>(); 
    string filePath = "C:\\Users\\greno\\RiderProjects\\Ajout_mots_db\\Ajout_mots_db\\words.txt";

    try
    {
        using (StreamReader sr = new StreamReader(filePath))
        {
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                string motNormalise = line.Trim().ToLower(); 
                if (!string.IsNullOrEmpty(motNormalise))
                {
                    mots.Add(motNormalise);
                    Console.WriteLine($"Mot ajouté : {motNormalise}");
                }
            }
        }
        Console.WriteLine($"Nombre total de mots uniques chargés : {mots.Count}");
    }
    catch (Exception e)
    {
        Console.WriteLine($"Erreur lors de la lecture du fichier : {e.Message}");
    }
    finally
    {
        Console.WriteLine("Fin de lecture du fichier.");
    }

    return mots;
}

static void ajoutSql(HashSet<string> mots)
{
    try
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            Console.WriteLine("Connexion ouverte avec succès.");

            var query = @"
                INSERT INTO mot_pendu (mot, id_difficulty) 
                VALUES (@mot, (SELECT id_difficulty FROM difficulty_level WHERE level = @level LIMIT 1))
                ON CONFLICT (mot) DO NOTHING;";

            foreach (var mot in mots)
            {
                using (var cmd = new NpgsqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@mot", mot);

                    if (mot.Length <= 5)
                    {
                        cmd.Parameters.AddWithValue("@level", "Facile");
                    }
                    else if (mot.Length >= 6 && mot.Length <= 8)
                    {
                        cmd.Parameters.AddWithValue("@level", "Moyen");
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@level", "Difficile");
                    }

                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        Console.WriteLine($"Mot '{mot}' ajouté avec succès.");
                    }
                    else
                    {
                        Console.WriteLine($"Mot '{mot}' déjà existant, insertion ignorée.");
                    }
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erreur lors de l'insertion en base de données : {ex.Message}");
    }
    finally
    {
        Console.WriteLine("Fin de l'insertion en base de données.");
    }
}

List<string> mots = GetMots().ToList();
ajoutSql(new HashSet<string>(mots));
