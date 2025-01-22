const difficulteSelect = document.getElementById("difficulte-select");
const jouerButton = document.getElementById("jouer");
const pseudo = document.getElementById("pseudo-input");
const message = document.getElementById("message");
inputLettre = document.getElementById("lettre-input");

jouerButton.addEventListener("click", async () => {

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

    message.innerText = dataPlayer.message + " Le mot est : " + dataMot.mot;
});






