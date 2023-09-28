// Tableau contenant une liste de pays en français
const countriesInFrench = {
    'Afghanistan': 'Afghanistan', 'Albania': 'Albanie', 'Algeria': 'Algérie', 'Andorra': 'Andorre',
    'Angola': 'Angola', 'Antigua and Barbuda': 'Antigua-et-Barbuda', 'Argentina': 'Argentine', 'Armenia': 'Arménie',
    'Australia': 'Australie', 'Austria': 'Autriche', 'Azerbaijan': 'Azerbaïdjan', 'Bahamas': 'Bahamas',
    'Bahrain': 'Bahreïn', 'Bangladesh': 'Bangladesh', 'Barbados': 'Barbade', 'Belarus': 'Biélorussie',
    'Belgium': 'Belgique', 'Belize': 'Belize', 'Benin': 'Bénin', 'Bhutan': 'Bhoutan', 'Bolivia': 'Bolivie',
    'Bosnia and Herzegovina': 'Bosnie-Herzégovine', 'Botswana': 'Botswana', 'Brazil': 'Brésil', 'Brunei': 'Brunéi',
    'Bulgaria': 'Bulgarie', 'Burkina Faso': 'Burkina Faso', 'Burundi': 'Burundi',
};

// Récupération des éléments HTML par ID
const quizSection = document.getElementById('quiz');
const nextQuestionBtn = document.getElementById('nextQuestion');
const countrySearchInput = document.getElementById('countrySearch');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Fonction pour obtenir un nom de pays aléatoire
function getRandomCountry() {
    const countries = Object.keys(countriesInFrench);
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
}

// Option Bonus : Fonction pour créer le quizz sur les drapeaux avec des images de drapeaux et 4 propositions de réponses en français
function createQuiz() {
    quizSection.innerHTML = ''; // Effacez le contenu précédent du quizz

    // Sélectionnez un pays aléatoire (la bonne réponse)
    const correctCountry = getRandomCountry();

    // Requête AJAX pour obtenir l'URL du drapeau du pays correct
    const xhrFlag = new XMLHttpRequest();
    xhrFlag.open('GET', `https://restcountries.com/v3.1/name/${correctCountry}`);
    xhrFlag.onload = function() {
        if (xhrFlag.status === 200) {
            const flagData = JSON.parse(xhrFlag.responseText)[0];
            const flagURL = flagData.flags.png;

            // Obtenez trois autres pays aléatoires (mauvaises réponses)
            const wrongCountries = [];
            while (wrongCountries.length < 3) {
                const randomCountry = getRandomCountry();
                if (randomCountry !== correctCountry && !wrongCountries.includes(randomCountry)) {
                    wrongCountries.push(randomCountry);
                }
            }

            // Mélangez les réponses (la bonne réponse et les mauvaises réponses)
            const allOptions = [correctCountry, ...wrongCountries].sort(() => Math.random() - 0.5);

            // Affichez la question avec l'image du drapeau et les 4 propositions de réponses en français
            const question = document.createElement('div');
            question.innerHTML = `
                <h3>À quel pays appartient ce drapeau ?</h3>
                <img src="${flagURL}" alt="Drapeau de ${countriesInFrench[correctCountry]}" style="width: 150px; height: 100px;">
            `;

            // Ajoutez les boutons de réponse
            allOptions.forEach(option => {
                const answerButton = document.createElement('button');
                answerButton.textContent = countriesInFrench[option];
                answerButton.classList.add('answerButton');
                answerButton.addEventListener('click', function() {
                    const selectedAnswer = this.textContent;
                    if (selectedAnswer === countriesInFrench[correctCountry]) {
                        alert('Bonne réponse !');
                    } else {
                        alert(`Mauvaise réponse. Le drapeau appartient à ${countriesInFrench[correctCountry]}.`);
                    }

                    // Option Bonus : Rechargez une nouvelle question
                    createQuiz();
                });
                question.appendChild(answerButton);
            });

            quizSection.appendChild(question);
        } else {
            console.error('Erreur lors de la requête vers l\'API Restcountries.');
        }
    };
    xhrFlag.send();
}

// Bouton pour passer à la question suivante
nextQuestionBtn.addEventListener('click', function() {
    createQuiz();
});

// Fonction pour afficher les informations sur le pays recherché
function displaySearchResults(countryData) {
    searchResults.innerHTML = `
        <h3>${countryData.name.common}</h3>
        <p><strong>Capitale :</strong> ${countryData.capital}</p>
        <p><strong>Population :</strong> ${countryData.population}</p>
        <p><strong>Superficie :</strong> ${countryData.area} km²</p>
        <p><strong>Région :</strong> ${countryData.region}</p>
        <img src="${countryData.flags.png}" alt="Drapeau de ${countryData.name.common}" style="width: 150px; height: 100px;">
    `;
}

// Écoutez le clic sur le bouton de recherche
searchButton.addEventListener('click', function() {
    const countryName = countrySearchInput.value;

    // Effectuez une requête AJAX vers l'API Restcountries pour la recherche
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://restcountries.com/v3.1/name/${countryName}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const countryData = JSON.parse(xhr.responseText)[0];
            // Affichez les informations sur le pays dans #searchResults
            displaySearchResults(countryData);
        } else {
            // Gérez les erreurs ici
            console.error('Erreur lors de la recherche du pays.');
            searchResults.innerHTML = 'Pays non trouvé.';
        }
    };
    xhr.send();
});

// Appel à la fonction pour créer le quizz dès le chargement de la page
createQuiz();