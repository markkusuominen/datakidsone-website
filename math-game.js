class MathGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.maxLevel = 4;
        this.progress = 0;
        this.correctAnswers = 0;
        this.questionsPerLevel = 5;
        
        // DOM elements
        this.problemElement = document.getElementById('problem');
        this.optionsContainer = document.getElementById('options');
        this.scoreElement = document.getElementById('score');
        this.progressBar = document.getElementById('progressBar');
        this.feedbackElement = document.getElementById('feedback');
        
        this.currentProblem = null;
    }

    generateProblem() {
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;

        // Adjust number range based on level
        const maxNumber = Math.min(10 * this.level, 100);
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * maxNumber);
            num2 = Math.floor(Math.random() * (maxNumber - num1));
        } else {
            num1 = Math.floor(Math.random() * maxNumber);
            num2 = Math.floor(Math.random() * num1); // Ensure positive result
        }

        const answer = operation === '+' ? num1 + num2 : num1 - num2;
        
        return {
            num1,
            num2,
            operation,
            answer
        };
    }

    generateOptions(answer) {
        const options = [answer];
        
        // Generate 3 unique wrong answers
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const wrongAnswer = answer + offset;
            
            if (!options.includes(wrongAnswer) && wrongAnswer >= 0) {
                options.push(wrongAnswer);
            }
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    displayProblem() {
        this.currentProblem = this.generateProblem();
        const { num1, num2, operation } = this.currentProblem;
        
        this.problemElement.textContent = `${num1} ${operation} ${num2} = ?`;
        
        const options = this.generateOptions(this.currentProblem.answer);
        this.optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option));
            this.optionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedAnswer) {
        const correct = selectedAnswer === this.currentProblem.answer;
        
        if (correct) {
            this.score += 10 * this.level;
            this.correctAnswers++;
            this.feedbackElement.textContent = 'Oikein! 🎉';
            this.feedbackElement.style.color = '#4CAF50';
        } else {
            this.feedbackElement.textContent = 'Yritä uudelleen! 💪';
            this.feedbackElement.style.color = '#f44336';
        }

        this.updateProgress();
        this.scoreElement.textContent = this.score;

        // Disable all buttons temporarily
        const buttons = this.optionsContainer.getElementsByTagName('button');
        Array.from(buttons).forEach(button => {
            button.disabled = true;
            if (parseInt(button.textContent) === this.currentProblem.answer) {
                button.style.backgroundColor = '#4CAF50';
            } else if (parseInt(button.textContent) === selectedAnswer && !correct) {
                button.style.backgroundColor = '#f44336';
            }
        });

        // Wait before showing next problem
        setTimeout(() => {
            if (this.correctAnswers >= this.questionsPerLevel) {
                this.levelUp();
            } else {
                this.displayProblem();
            }
        }, 1500);
    }

    updateProgress() {
        const progressPercentage = (this.correctAnswers / this.questionsPerLevel) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
    }

    levelUp() {
        if (this.level < this.maxLevel) {
            this.level++;
            this.correctAnswers = 0;
            this.feedbackElement.textContent = `Hienoa! Taso ${this.level} alkaa! 🌟`;
            this.updateProgress();
            setTimeout(() => this.displayProblem(), 2000);
        } else {
            this.feedbackElement.textContent = 'Onnittelut! Olet mestari! 🏆';
            // Add game completion logic here
        }
    }

    start() {
        this.displayProblem();
    }
}

// Initialize and start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new MathGame();
    game.start();
});
