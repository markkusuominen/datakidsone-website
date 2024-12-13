class WordSearchGame {
    constructor() {
        this.categories = {
            animals: {
                name: 'Eläimet',
                words: ['KISSA', 'KOIRA', 'HIIRI']
            },
            colors: {
                name: 'Värit',
                words: ['PUNA', 'SINI', 'KELTA']
            },
            nature: {
                name: 'Luonto',
                words: ['PUU', 'KUKKA', 'LEHTI']
            }
        };
        
        this.grid = [];
        this.gridSize = 8; // Fixed grid size
        this.selectedCells = [];
        this.foundWords = new Set();
        this.completedCategories = new Set();
        this.currentCategory = null;
        
        this.initializeUI();
    }

    initializeUI() {
        // Initialize category buttons
        document.querySelectorAll('.category-button').forEach(button => {
            button.addEventListener('click', () => this.selectCategory(button.dataset.category));
        });

        // Initialize hint button
        document.getElementById('hintButton').addEventListener('click', () => this.giveHint());

        // Initialize feedback element
        this.feedbackElement = document.getElementById('feedback');
        this.wordListElement = document.getElementById('wordList');
        this.gridElement = document.getElementById('wordGrid');

        // Setup touch/mouse events for grid
        this.gridElement.addEventListener('mousedown', (e) => this.handleCellInteractionStart(e));
        this.gridElement.addEventListener('mouseover', (e) => this.handleCellInteractionMove(e));
        this.gridElement.addEventListener('mouseup', () => this.handleCellInteractionEnd());
        this.gridElement.addEventListener('mouseleave', () => this.handleCellInteractionEnd());

        // Touch events
        this.gridElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleCellInteractionStart(e.touches[0]);
        });
        this.gridElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleCellInteractionMove(e.touches[0]);
        });
        this.gridElement.addEventListener('touchend', () => this.handleCellInteractionEnd());
    }

    selectCategory(category) {
        if (this.completedCategories.has(category)) {
            this.feedbackElement.textContent = 'Olet jo suorittanut tämän kategorian. Valitse toinen!';
            return;
        }

        // Reset previous category
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
            if (this.completedCategories.has(btn.dataset.category)) {
                btn.style.backgroundColor = '#4CAF50'; // Green for completed categories
            }
        });
        
        // Activate selected category
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        categoryButton.classList.add('active');
        
        this.currentCategory = category;
        this.foundWords.clear();
        this.createGrid();
        this.displayWordList();
        
        this.feedbackElement.textContent = `Etsi ${this.categories[category].name.toLowerCase()}!`;
    }

    createGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(''));
        
        // Place words
        const words = this.categories[this.currentCategory].words;
        words.forEach(word => this.placeWord(word));
        
        // Fill empty cells
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
        for(let i = 0; i < this.gridSize; i++) {
            for(let j = 0; j < this.gridSize; j++) {
                if(this.grid[i][j] === '') {
                    this.grid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
                }
            }
        }
        
        // Display grid
        this.displayGrid();
    }

    placeWord(word) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0]    // vertical
        ];
        
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [dx, dy] = direction;
            
            // Random starting position
            const row = Math.floor(Math.random() * this.gridSize);
            const col = Math.floor(Math.random() * this.gridSize);
            
            // Check if word fits
            if (this.wordFits(word, row, col, dx, dy)) {
                // Place the word
                for (let i = 0; i < word.length; i++) {
                    this.grid[row + dx * i][col + dy * i] = word[i];
                }
                placed = true;
            }
            attempts++;
        }

        if (!placed) {
            // If word couldn't be placed, try again with a different random position
            this.createGrid();
            this.placeWord(word);
        }
    }

    wordFits(word, row, col, dx, dy) {
        // Check if word goes out of bounds
        if(row + dx * (word.length - 1) < 0 || 
           row + dx * (word.length - 1) >= this.gridSize ||
           col + dy * (word.length - 1) < 0 || 
           col + dy * (word.length - 1) >= this.gridSize) {
            return false;
        }
        
        // Check if path is clear
        for(let i = 0; i < word.length; i++) {
            const cell = this.grid[row + dx * i][col + dy * i];
            if(cell !== '' && cell !== word[i]) {
                return false;
            }
        }
        
        return true;
    }

    displayGrid() {
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.gridElement.innerHTML = '';
        
        for(let i = 0; i < this.gridSize; i++) {
            for(let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.textContent = this.grid[i][j];
                this.gridElement.appendChild(cell);
            }
        }
    }

    displayWordList() {
        this.wordListElement.innerHTML = '';
        const words = this.categories[this.currentCategory].words;
        
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = `word-item${this.foundWords.has(word) ? ' found' : ''}`;
            wordElement.textContent = word;
            this.wordListElement.appendChild(wordElement);
        });
    }

    handleCellInteractionStart(event) {
        const cell = event.target.closest('.grid-cell');
        if(!cell) return;
        
        this.isSelecting = true;
        this.selectedCells = [cell];
        cell.classList.add('selected');
    }

    handleCellInteractionMove(event) {
        if(!this.isSelecting) return;
        
        const cell = document.elementFromPoint(event.clientX, event.clientY);
        if(!cell || !cell.classList.contains('grid-cell')) return;
        
        if(!this.selectedCells.includes(cell)) {
            this.selectedCells.push(cell);
            cell.classList.add('selected');
        }
    }

    handleCellInteractionEnd() {
        if(!this.isSelecting) return;
        this.isSelecting = false;
        
        // Check if word is found
        const word = this.getSelectedWord();
        const words = this.categories[this.currentCategory].words;
        
        if(words.includes(word)) {
            if(!this.foundWords.has(word)) {
                this.foundWords.add(word);
                this.selectedCells.forEach(cell => cell.classList.add('found'));
                this.displayWordList();
                this.checkGameCompletion();
            }
        }
        
        // Clear selection
        this.selectedCells.forEach(cell => cell.classList.remove('selected'));
        this.selectedCells = [];
    }

    getSelectedWord() {
        return this.selectedCells
            .map(cell => this.grid[cell.dataset.row][cell.dataset.col])
            .join('');
    }

    checkGameCompletion() {
        const words = this.categories[this.currentCategory].words;
        if(this.foundWords.size === words.length) {
            this.completedCategories.add(this.currentCategory);
            
            // Mark category button as completed
            const categoryButton = document.querySelector(`[data-category="${this.currentCategory}"]`);
            categoryButton.style.backgroundColor = '#4CAF50';

            if (this.completedCategories.size === Object.keys(this.categories).length) {
                // All categories completed - show final message
                const popup = document.getElementById('completionPopup');
                document.querySelector('.popup h2').textContent = '🎉';
                document.querySelector('.popup p').textContent = 'Onneksi olkoon! Hienoa! Olet löytänyt kaikki sanat.';
                popup.style.display = 'flex';
            } else {
                // Category completed - show intermediate message
                const popup = document.getElementById('completionPopup');
                document.querySelector('.popup h2').textContent = '🎉';
                document.querySelector('.popup p').textContent = 'Onneksi olkoon. Hienoa. Olet löytänyt kaikki sanat. Valitse seuraava kategoria';
                popup.style.display = 'flex';
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 3000);
            }
        } else {
            this.feedbackElement.textContent = 'Hyvä! Jatka etsimistä! 💪';
        }
    }

    giveHint() {
        if (!this.currentCategory) {
            this.feedbackElement.textContent = 'Valitse ensin kategoria!';
            return;
        }

        const words = this.categories[this.currentCategory].words;
        const remainingWords = words.filter(word => !this.foundWords.has(word));
        
        if (remainingWords.length > 0) {
            const hintWord = remainingWords[0];
            
            // Find the word's position in the grid
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    // Check each direction
                    const directions = [
                        [0, 1],   // horizontal
                        [1, 0]    // vertical
                    ];

                    for (const [dx, dy] of directions) {
                        if (this.checkWordAtPosition(hintWord, i, j, dx, dy)) {
                            // Highlight the first letter
                            const cell = document.querySelector(`.grid-cell[data-row="${i}"][data-col="${j}"]`);
                            cell.style.backgroundColor = '#ffd43b';
                            setTimeout(() => {
                                if (!cell.classList.contains('found')) {
                                    cell.style.backgroundColor = '';
                                }
                            }, 2000);
                            
                            this.feedbackElement.textContent = `Vihje: Etsi sana "${hintWord}" - katso keltaista kirjainta!`;
                            return;
                        }
                    }
                }
            }
        } else {
            this.feedbackElement.textContent = 'Hienoa! Olet löytänyt kaikki sanat!';
        }
    }

    checkWordAtPosition(word, row, col, dx, dy) {
        if (row + dx * (word.length - 1) < 0 || 
            row + dx * (word.length - 1) >= this.gridSize ||
            col + dy * (word.length - 1) < 0 || 
            col + dy * (word.length - 1) >= this.gridSize) {
            return false;
        }

        for (let i = 0; i < word.length; i++) {
            if (this.grid[row + dx * i][col + dy * i] !== word[i]) {
                return false;
            }
        }
        return true;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new WordSearchGame();
});
