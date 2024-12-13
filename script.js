fetch('./questions.json')
    .then(response => response.json())
    .then(questions => {
        initializeQuiz(questions);
    })
    .catch(error => {
        console.error('Errore nel caricamento del file JSON:', error);
    });


function initializeQuiz(questions) {
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-button');
    const resultContainer = document.getElementById('result');

    // Seleziona 30 domande casuali
    const randomQuestions = getRandomQuestions(questions, 30);

    // Renderizza le domande
    randomQuestions.forEach((question, index) => {
        const questionElement = createQuestionElement(question, index);
        quizContainer.appendChild(questionElement);
    });

    // Gestisce il submit
    submitButton.addEventListener('click', () => {
        const results = evaluateAnswers(randomQuestions);
        displayResults(results, resultContainer, quizContainer);
    });
}

// Funzione per ottenere domande casuali
function getRandomQuestions(questions, num) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Crea un elemento DOM per una domanda
function createQuestionElement(question, index) {
    const div = document.createElement('div');
    div.className = 'question-card';

    // Titolo della domanda
    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${question.question}`;
    div.appendChild(questionText);

    // Radio button per le risposte
    for (let i = 1; i <= 4; i++) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = `answer_${i}`;

        label.appendChild(input);
        label.appendChild(document.createTextNode(question[`answer_${i}`]));
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
    }

    return div;
}

// Valuta le risposte
function evaluateAnswers(questions) {
    const results = [];

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(
            `input[name="question-${index}"]:checked`
        );
        if (selectedAnswer) {
            results.push({
                questionId: question.id,
                isCorrect: selectedAnswer.value === question.current_anwer,
                questionData: question // Aggiungi i dettagli della domanda
            });
        } else {
            results.push({ 
                questionId: question.id, 
                isCorrect: false,
                questionData: question // Aggiungi i dettagli della domanda
            });
        }
    });

    return results;
}


// Mostra i risultati
// Mostra i risultati
function displayResults(results, resultContainer, quizContainer) {
    let correctCount = 0;

    results.forEach((result, index) => {
        const questionCard = quizContainer.children[index];
        const questionData = results[index].questionData;

        // Aggiungi colore in base alla correttezza
        if (result.isCorrect) {
            correctCount++;
            questionCard.style.backgroundColor = 'lightgreen';
        } else {
            questionCard.style.backgroundColor = 'lightcoral';
        }

        // Aggiungi il link PDF e il modulo
        const pdfLink = document.createElement('a');
        pdfLink.href = questionData.link_pdf;
        pdfLink.target = '_blank';
        pdfLink.textContent = 'Scarica PDF';
        pdfLink.style.marginRight = '10px';

        const moduleInfo = document.createElement('span');
        moduleInfo.textContent = `Modulo: ${questionData.module}`;

        // Aggiungi i nuovi elementi al card
        const additionalInfo = document.createElement('div');
        additionalInfo.appendChild(pdfLink);
        additionalInfo.appendChild(moduleInfo);
        questionCard.appendChild(additionalInfo);
    });

    // Mostra il risultato complessivo
    resultContainer.textContent = `Hai risposto correttamente a ${correctCount} su ${results.length} domande.`;
}

