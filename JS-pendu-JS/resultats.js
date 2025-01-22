const demandeSelect = document.getElementById("demande-select");
const limitInput = document.getElementById("limit-input");
const fetchButton = document.getElementById("fetch-results");
const resultList = document.getElementById("result-list");

fetchButton.addEventListener("click", async () => {
    const demandeType = demandeSelect.value;
    const limitValue = parseInt(limitInput.value);

    const requestData = {
        demande: demandeType,
        limit: limitValue
    };

    console.log("Envoi de la requête API avec :", requestData);

    const response = await fetch("http://localhost:5028/api/Player", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (response.ok) {
        afficherResultats(data);
    } else {
        resultList.innerHTML = `<li style="color: red;">Erreur: ${data}</li>`;
    }
});

function afficherResultats(results) {
    resultList.innerHTML = ""; // Réinitialiser les résultats

    if (results.length === 0) {
        resultList.innerHTML = `<li>Aucun résultat trouvé.</li>`;
        return;
    }

    results.forEach(result => {
        const listItem = document.createElement("li");
        listItem.textContent = result;
        resultList.appendChild(listItem);
    });
}
