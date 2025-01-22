const difficulteSelect = document.getElementById("difficulte-select");
const jouerButton = document.getElementById("jouer");
const pseudo = document.getElementById("pseudo-input");
const message = document.getElementById("message");
const inputLettre = document.getElementById("lettre-input");
const motTrouverElement = document.getElementById("mot-trouver");
const lettreEssayeesElement = document.getElementById("lettre-essayees");
const erreurSignElement = document.getElementById("erreur-sign");
const penduImage = document.getElementById("pendu-image");

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

// Liste des images du pendu en fonction du nombre d'erreurs
const imagesPendu = [
    "images/pendu0.png",
    "images/pendu1.png",
    "images/pendu2.png",
    "images/pendu3.png",
    "images/pendu4.png",
    "images/pendu5.png",
    "images/pendu6.png",
    "images/pendu7.png"
];

jouerButton.addEventListener("click", async () => {
    erreurs = 0;
    essaisRestants = imagesPendu.length - 1;
    lettresEssayees = [];
    jeuTermine = false;
    penduImage.src = imagesPendu[0];

    const ApiMot = {
        besoin: true,
        level: difficulteSelect.value,
        mot: ""
    };

    try {
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
            player: dataPlayer.pseudo,
            mot: dataMot.mot,
            score_player: 0,
            nb_essaies: 0,
            nb_lettres: motPendu.length,
            status: ""
        };
    } catch (error) {
        console.error("Erreur lors de la récupération du mot :", error);
    }
});

function afficherMotsTrouves() {
    motTrouverElement.textContent = motTrouve.join(" ");
}

inputLettre.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !jeuTermine) {
        event.preventDefault();
        const lettre = inputLettre.value.toUpperCase();
        inputLettre.value = "";

        verifierLettre(lettre);
    }
});

function afficherLettresEssayees() {
    lettreEssayeesElement.textContent = `Lettres essayées : ${lettresEssayees.join(", ")}`;
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
            penduImage.src = imagesPendu[erreurs];
            erreurSignElement.innerText = `Essais restants : ${essaisRestants} Score : ${ApiScoreGet.score_player}`;
        }

        afficherMotsTrouves();

        if (motTrouve.join("") === motPendu || erreurs >= imagesPendu.length - 1) {
            finDuJeu();
        }
    }
}

function finDuJeu() {
    jeuTermine = true;
    ApiScoreGet.status = motTrouve.join("") === motPendu ? "Gagnée" : "Perdue";
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
