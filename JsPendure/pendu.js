const difficulteSelect = document.getElementById("difficulte-select");
const jouerButton = document.getElementById("jouer");
const pseudo = document.getElementById("pseudo-input");
const message = document.getElementById("message");
const inputLettre = document.getElementById("lettre-input");
const motTrouverElement = document.getElementById("mot-trouver");
const lettreEssayeesElement = document.getElementById("lettre-essayées");
const erreurSignElement = document.getElementById("erreur-sign");
const penduElement = document.getElementById("pendu");

let motPendu = "";
let motTrouve = [];
let erreurs = 0;
let lettresEssayees = [];
let jeuTermine = false;
let essaisRestants = 7;
let ApiScoreGet = null;

const difficulteScores = {
    "Facile": 1,
    "Moyen": 2,
    "Difficile": 3
};

let pendu = [
    `\n
    _|_
    |   |______
    |          |
    |__________|
    `,
    `\n
    |
    |
    |
    |
    |
    _|_
    |   |______
    |          |
    |__________|
    `,
    `\n
    ____
    |
    |
    |
    |
    |
    _|_
    |   |______
    |          |
    |__________|
    `,
    `\n
    ____
    |    |
    |
    |
    |
    |
    _|_
    |   |______
    |          |
    |__________|
    `,
    `\n
    ____
    |    |
    |    o
    |
    |
    |
    _|_
    |   |______  
    |          |
    |__________|
    `,
    `\n
    ____
    |    |
    |    o
    |   /|\\
    |
    |
    _|_
    |   |______  
    |          |
    |__________|
    `,
    `\n
    ____
    |    |
    |    o
    |   /|\\
    |    |
    |
    _|_
    |   |______  
    |          |
    |__________|
    `,
    `\n
    ____
    |    |
    |    o
    |   /|\\
    |    |
    |   / \\
    _|_
    |   |______  
    |          |
    |__________|
    `
];

jouerButton.addEventListener("click", async () => {
    erreurs = 0;
    essaisRestants = pendu.length - 1;
    lettresEssayees = [];
    jeuTermine = false;
    penduElement.innerHTML = pendu[0];

    const ApiMot = {
        besoin: true,
        level: difficulteSelect.value,
        mot: ""
    };

    const responseMot = await fetch("http://localhost:5028/api/GetMot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ApiMot),
    });
    const dataMot = await responseMot.json();

    const ApiPlayer = {
        pseudo: pseudo.value,
    };

    const responsePlayer = await fetch("http://localhost:5028/api/AddPlayer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ApiPlayer),
    });
    const dataPlayer = await responsePlayer.json();

    message.innerText = `${dataPlayer.message} Le mot est : ${dataMot.mot}`;

    motPendu = dataMot.mot.toUpperCase();
    motTrouve = Array(motPendu.length).fill("_");
    afficherMotsTrouves();
    afficherLettresEssayees();
    erreurSignElement.innerText = `Essais restants : ${essaisRestants}`;

    ApiScoreGet = {
        player: dataPlayer.pseudo,  // Le pseudo du joueur
        mot: dataMot.mot,            // Le mot choisi
        score_player: 0,              // Le score sera calculé à la fin
        nb_essaies: 0,                 // Mis à jour à la fin
        nb_lettres: motPendu.length,   // Nombre de lettres
        status: ""                     // Sera "Gagnée" ou "Perdue"
    };
});

function afficherMotsTrouves() {
    motTrouverElement.textContent = motTrouve.join(' ');
}

inputLettre.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !jeuTermine) {
        event.preventDefault();
        const lettre = inputLettre.value.toUpperCase();
        inputLettre.value = '';

        verifierLettre(lettre);
    }
});

function afficherLettresEssayees() {
    lettreEssayeesElement.textContent = `Lettres essayées : ${lettresEssayees.join(', ')}`;
}

function verifierLettre(lettre) {
    if (jeuTermine) return;

    if (/^[A-Z]$/.test(lettre) && !lettresEssayees.includes(lettre)) {
        let lettreTrouvee = false;

        for (let i = 0; i < motPendu.length; i++) {
            if (lettre === motPendu[i]) {
                motTrouve[i] = lettre;
                lettreTrouvee = true;
            }
        }

        if (!lettreTrouvee) {
            erreurs++;
            essaisRestants--;
            lettresEssayees.push(lettre);
            afficherLettresEssayees();
            penduElement.innerHTML = pendu[erreurs];
            erreurSignElement.innerText = `Essais restants : ${essaisRestants}`;
        }

        afficherMotsTrouves();

        if (motTrouve.join('') === motPendu || erreurs >= pendu.length - 1) {
            finDuJeu();
        }
    }
}

function finDuJeu() {
    jeuTermine = true;
    ApiScoreGet.status = motTrouve.join('') === motPendu ? "Gagnée" : "Perdue";
    ApiScoreGet.nb_essaies = erreurs;

    let difficultyFactor = difficulteScores[difficulteSelect.value];
    ApiScoreGet.score_player = (ApiScoreGet.nb_lettres * 10) - (ApiScoreGet.nb_essaies * difficultyFactor);

    message.innerText = ApiScoreGet.status === "Gagnée"
        ? `Félicitations, vous avez gagné ! Score: ${ApiScoreGet.score_player}`
        : `Désolé, vous avez perdu. Le mot était : ${motPendu}. Score: ${ApiScoreGet.score_player}`;

    console.log("Résultat final:", ApiScoreGet);
    envoyerScore();
}

async function envoyerScore() {
    ApiScoreGet = {
        player: ApiScoreGet.player,  // Le pseudo du joueur
        mot: ApiScoreGet.mot,         // Le mot choisi
        score_player: ApiScoreGet.score_player,  // Le score calculé
        nb_essaies: ApiScoreGet.nb_essaies,      // Nombre d'essais
        nb_lettres: ApiScoreGet.nb_lettres,      // Nombre de lettres
        status: ApiScoreGet.status               // Statut du jeu
    };

    console.log("Données envoyées dans l'ordre :", JSON.stringify(ApiScoreGet, null, 2));

    const response = await fetch("http://localhost:5028/api/AddScore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ApiScoreGet),
    });

    if (!response.ok) {
        console.error("Erreur lors de l'envoi du score :", await response.text());
    } else {
        console.log("Score envoyé avec succès :", ApiScoreGet);
    }
}
