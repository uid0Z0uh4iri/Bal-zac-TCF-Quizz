

      // Array pour les questions
        const questions = [
            { question: "Comment allez-vous?", answers: ["Je vais bien", "Au revoir", "Merci", "Bonjour"], correct: 0 },
            { question: "Quelle est la capitale de la France?", answers: ["Lyon", "Marseille", "Paris", "Bordeaux"], correct: 2 },
            { question: "Comment dit-on 'hello' en français?", answers: ["Au revoir", "Bonjour", "Merci", "S'il vous plaît"], correct: 1 },
            { question: "Quelle couleur est le drapeau français?", answers: ["Rouge-Blanc-Bleu", "Bleu-Blanc-Rouge", "Blanc-Bleu-Rouge", "Rouge-Bleu-Blanc"], correct: 1 },
            { question: "Quel est le mot français pour 'cat'?", answers: ["Chien", "Oiseau", "Chat", "Poisson"], correct: 2 },
            { question: "Comment dit-on 'thank you' en français?", answers: ["S'il vous plaît", "Merci", "De rien", "Pardon"], correct: 1 },
            { question: "Quel nombre vient après 'trois'?", answers: ["Cinq", "Deux", "Quatre", "Six"], correct: 2 },
            { question: "Quelle est la couleur 'rouge' en anglais?", answers: ["Blue", "Green", "Yellow", "Red"], correct: 3 },
            { question: "Comment dit-on 'goodbye' en français?", answers: ["Au revoir", "Bonjour", "Bonsoir", "Salut"], correct: 0 },
            { question: "Quel est le mot français pour 'water'?", answers: ["Pain", "Lait", "Vin", "Eau"], correct: 3 }
        ];

        let currentQuestion = 0;   // nombre dial current question
        let score = 0;    // current score
        let timer;    // timer de question
        let shuffledQuestions;  // questions randomly

        function startQuiz() {    // fonction pour commencer le quiz
            score = 0;
            currentQuestion = 0;
            shuffledQuestions = [...questions].sort(() => Math.random() - 0.5); // shuffle les questions
            document.getElementById('start-screen').classList.add('hidden'); // cache le bouton de start
            document.getElementById('quiz-screen').classList.remove('hidden'); // affiche le quiz
            showQuestion();  // afficher la premiere question
        }

        function showQuestion() {
            if (currentQuestion >= shuffledQuestions.length) {   //verificartion si le quiz est terminé
                showResults();
                return;
            }

            // Affichage des questions et reponses

            const question = shuffledQuestions[currentQuestion];
            document.getElementById('question').textContent = question.question;
            document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1} of ${shuffledQuestions.length}`;
            const answersDiv = document.getElementById('answers');
            answersDiv.innerHTML = '';
            
            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.className = 'answer-btn';
                button.onclick = () => checkAnswer(index);
                answersDiv.appendChild(button);
            });

            startTimer();
        }

        function startTimer() {
            let timeLeft = 10;   // timer de 10 seconds
            const timerDisplay = document.getElementById('timer');
            const buttons = document.querySelectorAll('.answer-btn');
            clearInterval(timer);
            
            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    buttons.forEach(button => button.disabled = true);  
                    showCorrectAnswer();
                    document.getElementById('next-btn').classList.remove('hidden');
                }
            }, 1000);
        }

        function showCorrectAnswer() {
            const correctIndex = shuffledQuestions[currentQuestion].correct;
            const buttons = document.querySelectorAll('.answer-btn');
            buttons[correctIndex].classList.add('correct');
        }


            // Verification wach jawb s7i7
           // Katbyen correct/incorrect answer
          // Katzid score ila kan jawb s7i7
        function checkAnswer(selectedIndex) {
            clearInterval(timer);
            const buttons = document.querySelectorAll('.answer-btn');
            buttons.forEach(button => button.disabled = true);
            
            if (selectedIndex === shuffledQuestions[currentQuestion].correct) {
                buttons[selectedIndex].classList.add('correct');
                score++;
            } else {
                buttons[selectedIndex].classList.add('incorrect');
                showCorrectAnswer();
            }
            
            document.getElementById('next-btn').classList.remove('hidden');
        }

        function nextQuestion() {
            document.getElementById('next-btn').classList.add('hidden');
            currentQuestion++;
            showQuestion();
        }
         // Affichage dial results screen
         // Calculation dial niveau (A1-C2) based 3la score
         // Save dial score f localStorage
        function showResults() {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('results-screen').classList.remove('hidden');
            
            const finalScore = `Your score is ${score} out of ${questions.length}`;
            document.getElementById('final-score').textContent = finalScore;
            
            let level = '';
            if (score <= 2) level = 'A1';
            else if (score <= 4) level = 'A2';
            else if (score <= 6) level = 'B1';
            else if (score <= 8) level = 'B2';
            else if (score <= 9) level = 'C1';
            else level = 'C2';
            
            document.getElementById('level').textContent = `Your level is: ${level}`;
            localStorage.setItem('lastQuizScore', finalScore);
        }

        function restartQuiz() {
            document.getElementById('results-screen').classList.add('hidden');
            startQuiz();
        }

        window.onload = function() {
            const lastScore = localStorage.getItem('lastQuizScore');   //localstorage du dernier quizz.
            if (lastScore) {
                document.getElementById('last-score').textContent = `Last score: ${lastScore}`;
            }
        };
