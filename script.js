

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


        let questionStats = [];
        let currentQuestionStartTime;


        function startQuiz() {
            score = 0;
            currentQuestion = 0;
            questionStats = []; // Reset stats
            shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('quiz-screen').classList.remove('hidden');
            showQuestion();
        }

        function showQuestion() {
            if (currentQuestion >= shuffledQuestions.length) {
                showResults();
                return;
            }
        
            currentQuestionStartTime = Date.now(); // Track start time
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
            
            const question = shuffledQuestions[currentQuestion];
            const isCorrect = selectedIndex === question.correct;
            const timeSpent = (Date.now() - currentQuestionStartTime) / 1000; // Time in seconds
            
            // Save stats for this question
            questionStats.push({
                question: question.question,
                userAnswer: question.answers[selectedIndex],
                correctAnswer: question.answers[question.correct],
                isCorrect: isCorrect,
                timeSpent: timeSpent
            });
            
            if (isCorrect) {
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

        function createPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.text('Quiz Statistics Report', 20, 20);
            
            // Add general info
            doc.setFontSize(12);
            doc.text(`Final Score: ${score} out of ${questions.length}`, 20, 35);
            doc.text(`Level: ${document.getElementById('level').textContent.split(': ')[1]}`, 20, 45);
            
            // Add summary statistics
            doc.setFontSize(16);
            doc.text('Summary Statistics', 20, 60);
            doc.setFontSize(12);
            const avgTime = (questionStats.reduce((acc, stat) => acc + stat.timeSpent, 0) / questionStats.length).toFixed(2);
            const fastestTime = Math.min(...questionStats.map(stat => stat.timeSpent)).toFixed(2);
            const slowestTime = Math.max(...questionStats.map(stat => stat.timeSpent)).toFixed(2);
            
            doc.text(`Average Time per Question: ${avgTime} seconds`, 20, 75);
            doc.text(`Fastest Answer: ${fastestTime} seconds`, 20, 85);
            doc.text(`Slowest Answer: ${slowestTime} seconds`, 20, 95);
            
            // Add detailed question analysis
            doc.setFontSize(16);
            doc.text('Question by Question Analysis', 20, 115);
            
            let yPosition = 130;
            questionStats.forEach((stat, index) => {
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(14);
                doc.text(`Question ${index + 1}`, 20, yPosition);
                
                doc.setFontSize(12);
                const lines = doc.splitTextToSize(`Q: ${stat.question}`, 170);
                doc.text(lines, 20, yPosition + 10);
                
                doc.text(`Your Answer: ${stat.userAnswer}`, 20, yPosition + 25);
                doc.text(`Correct Answer: ${stat.correctAnswer}`, 20, yPosition + 35);
                doc.text(`Time Spent: ${stat.timeSpent.toFixed(2)} seconds`, 20, yPosition + 45);
                doc.text(`Result: ${stat.isCorrect ? 'Correct' : 'Incorrect'}`, 20, yPosition + 55);
                
                yPosition += 70;
            });
            
            // Save PDF
            doc.save('quiz-statistics.pdf');
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
            
            // Create detailed statistics section
            const statsDiv = document.createElement('div');
            statsDiv.className = 'statistics-section';
            statsDiv.innerHTML = `
                <h2>Detailed Statistics</h2>
                <div class="stats-summary">
                    <p>Average Time per Question: ${(questionStats.reduce((acc, stat) => acc + stat.timeSpent, 0) / questionStats.length).toFixed(2)} seconds</p>
                    <p>Fastest Answer: ${Math.min(...questionStats.map(stat => stat.timeSpent)).toFixed(2)} seconds</p>
                    <p>Slowest Answer: ${Math.max(...questionStats.map(stat => stat.timeSpent)).toFixed(2)} seconds</p>
                </div>
                <h3>Question by Question Analysis</h3>
                <div class="question-stats">
                    ${questionStats.map((stat, index) => `
                        <div class="question-stat ${stat.isCorrect ? 'correct-answer' : 'wrong-answer'}">
                            <h4>Question ${index + 1}</h4>
                            <p><strong>Question:</strong> ${stat.question}</p>
                            <p><strong>Your Answer:</strong> ${stat.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> ${stat.correctAnswer}</p>
                            <p><strong>Time Spent:</strong> ${stat.timeSpent.toFixed(2)} seconds</p>
                            <p><strong>Result:</strong> ${stat.isCorrect ? 'Correct' : 'Incorrect'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add download button
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download Statistics (PDF)';
            downloadButton.className = 'download-btn';
            downloadButton.onclick = createPDF;
            statsDiv.appendChild(downloadButton);
            
            // Add stats to results screen
            document.getElementById('results-screen').appendChild(statsDiv);
            
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
