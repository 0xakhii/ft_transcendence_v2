
export class NumberTapGame {
    constructor(mode = 'single') {
        
        this.mode = mode;
        this.score = 0; 
        this.timeLeft = 30; 
        this.isGameActive = false;
        this.hasStoredHistory = false;
        this.currentNumber = this.generateRandomNumber();
        this.numbersPool = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 
        this.webSocket = null; 
        this.opponentScore = 0; 
        this.opponentUsername = null; 

        console.log('Constructor initialized - numbersPool:', this.numbersPool);
        this.initializeGame();
        this.setupUI();
        if (mode === 'multiplayer') {
            this.setupMultiplayer();
        } else {
            this.startGame();
        }
    }

    setupMultiplayer() {
        const access_token = localStorage.getItem('authToken');
        if (!access_token) {
            console.error('No authentication token found. Please log in.');
            alert('You must be logged in to play multiplayer. Please sign in.');
            return;
        }
    
        const wsUrl = 'wss://127.0.0.1:8000/ws/number-tap/';
        console.log('Attempting WebSocket connection to:', wsUrl, 'with token:', access_token);
    
        this.webSocket = new WebSocket(wsUrl);
    
        this.webSocket.onopen = () => {
            console.log('WebSocket connected for Number Tap multiplayer');
            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(JSON.stringify({ type: 'join', token: access_token }));
            } else {
                console.error('WebSocket opened but not in ready state');
            }
        };
    
        this.webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);
    
            switch (data.type) {
                case 'matchFound':
                    this.opponentUsername = data.opponent;
                    console.log(`Matched with opponent: ${this.opponentUsername}`);
                    this.isGameActive = true;
                    this.startGame();
                    break;
                case 'score':
                    this.opponentScore = data.score;
                    const opponentScoreDisplay = document.getElementById('opponent-score');
                    if (opponentScoreDisplay) {
                        opponentScoreDisplay.textContent = `Opponent Score: ${this.opponentScore}`;
                    }
                    break;
                case 'endGame':
                    this.opponentScore = data.opponentScore;
                    this.endGame();
                    break;
                case 'waiting':
                    console.log('Waiting for opponent:', data.message);
                    const waitingDisplay = document.getElementById('waiting-message') || this.createWaitingDisplay();
                    waitingDisplay.textContent = data.message;
                    break;
                case 'error':
                    console.error('Server error:', data.message);
                    alert(data.message);
                    this.isGameActive = false;
                    break;
                default:
                    console.warn(`Unhandled message type: ${data.type}`);
                    break;
            }
        };
    
        this.webSocket.onclose = (event) => {
            console.log('WebSocket disconnected for Number Tap multiplayer. Event:', { code: event.code, reason: event.reason || 'No reason provided', wasClean: event.wasClean });
            this.isGameActive = false;
            if (event.code !== 1000) { 
                console.error('WebSocket connection closed unexpectedly. Attempting to reconnect...');
                setTimeout(() => this.setupMultiplayer(), 2000);
            }
        };
    
        this.webSocket.onerror = (error) => {
            console.error('WebSocket error for Number Tap multiplayer:', JSON.stringify(error, null, 2));
            this.isGameActive = false;
            alert('WebSocket connection failed. Check server status, port, or login. See console for details.');
            if (error.target && error.target.url) {
                console.error('Failed WebSocket URL:', error.target.url);
                alert(`Failed to connect to ${error.target.url}. Ensure the server is running on port 8000.`);
            }
        };
    }
    
    createWaitingDisplay() {
        const waitingDisplay = document.createElement('div');
        waitingDisplay.id = 'waiting-message';
        waitingDisplay.style.position = 'absolute';
        waitingDisplay.style.top = '140px';
        waitingDisplay.style.left = '50%';
        waitingDisplay.style.transform = 'translateX(-50%)';
        waitingDisplay.style.color = '#fff';
        waitingDisplay.style.fontFamily = "'Poppins', sans-serif";
        waitingDisplay.style.fontSize = '20px';
        this.gameContainer.appendChild(waitingDisplay);
        return waitingDisplay;
    }

    generateRandomNumber() {
        if (!this.numbersPool || this.numbersPool.length === 0) {
            this.numbersPool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        const randomIndex = Math.floor(Math.random() * this.numbersPool.length);
        const number = this.numbersPool.splice(randomIndex, 1)[0];
        return number;
    }

    initializeGame() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'number-tap-container';
        this.gameContainer.style.width = '800px';
        this.gameContainer.style.height = '600px';
        this.gameContainer.style.margin = '150px auto';
        this.gameContainer.style.background = 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)';
        this.gameContainer.style.borderRadius = '15px';
        this.gameContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        this.gameContainer.style.position = 'relative';
        document.querySelector('.main').appendChild(this.gameContainer);

        this.tiles = [];
        this.createTiles();
    }

    setupUI() {
        const targetDisplay = document.createElement('div');
        targetDisplay.id = 'target-number';
        targetDisplay.style.position = 'absolute';
        targetDisplay.style.top = '10px';
        targetDisplay.style.left = '50%';
        targetDisplay.style.transform = 'translateX(-50%)';
        targetDisplay.style.color = '#fff';
        targetDisplay.style.fontFamily = "'Poppins', sans-serif";
        targetDisplay.style.fontSize = '24px';
        targetDisplay.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
        targetDisplay.textContent = `Tap: ${this.currentNumber}`;
        this.gameContainer.appendChild(targetDisplay);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'number-tap-score';
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.top = '50px';
        scoreDisplay.style.left = '50%';
        scoreDisplay.style.transform = 'translateX(-50%)';
        scoreDisplay.style.color = '#fff';
        scoreDisplay.style.fontFamily = "'Poppins', sans-serif";
        scoreDisplay.style.fontSize = '20px';
        scoreDisplay.textContent = `Score: ${this.score}`;
        this.gameContainer.appendChild(scoreDisplay);

        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'number-tap-timer';
        timerDisplay.style.position = 'absolute';
        timerDisplay.style.top = '80px';
        timerDisplay.style.left = '50%';
        timerDisplay.style.transform = 'translateX(-50%)';
        timerDisplay.style.color = '#fff';
        timerDisplay.style.fontFamily = "'Poppins', sans-serif";
        timerDisplay.style.fontSize = '20px';
        timerDisplay.textContent = `Time: ${this.timeLeft}s`;
        this.gameContainer.appendChild(timerDisplay);

        if (this.mode === 'multiplayer') {
            const opponentScoreDisplay = document.createElement('div');
            opponentScoreDisplay.id = 'opponent-score';
            opponentScoreDisplay.style.position = 'absolute';
            opponentScoreDisplay.style.top = '110px';
            opponentScoreDisplay.style.left = '50%';
            opponentScoreDisplay.style.transform = 'translateX(-50%)';
            opponentScoreDisplay.style.color = '#fff';
            opponentScoreDisplay.style.fontFamily = "'Poppins', sans-serif";
            opponentScoreDisplay.style.fontSize = '20px';
            opponentScoreDisplay.textContent = `Opponent Score: ${this.opponentScore}`;
            this.gameContainer.appendChild(opponentScoreDisplay);
        }
    }

    createTiles() {
        for (let i = 0; i < 9; i++) { // 3x3 grid of numbered tiles (1–9)
            const tile = document.createElement('div');
            tile.classList.add('number-tile');
            tile.style.width = '100px';
            tile.style.height = '100px';
            tile.style.position = 'absolute';
            tile.style.borderRadius = '10px';
            tile.style.cursor = 'pointer';
            tile.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            tile.style.backgroundColor = '#333';
            tile.style.color = '#fff';
            tile.style.fontFamily = "'Poppins', sans-serif";
            tile.style.fontSize = '24px';
            tile.style.display = 'flex';
            tile.style.alignItems = 'center';
            tile.style.justifyContent = 'center';
            tile.style.pointerEvents = 'auto';
            tile.style.zIndex = '10';
            tile.style.userSelect = 'none';

            const number = i + 1; // Numbers 1–9
            tile.dataset.number = number; // Store the number in a data attribute
            tile.textContent = number;

            const row = Math.floor(i / 3);
            const col = i % 3;
            tile.style.left = `${col * 110 + 230}px`; // Center the 3x3 grid
            tile.style.top = `${row * 110 + 200}px`;

            tile.addEventListener('click', (event) => this.handleTileClick(event.target), false);
            this.gameContainer.appendChild(tile);
            this.tiles.push(tile);

            console.log(`Created tile at position (${row}, ${col}) with number: ${number}`);
        }
    }

    handleTileClick(tile) {
        if (!this.isGameActive) {
            console.log('Game not active, click ignored');
            return;
        }

        const tileNumber = parseInt(tile.dataset.number, 10);
        console.log('Clicked tile number:', tileNumber, 'Current target:', this.currentNumber);

        if (tileNumber === this.currentNumber) {
            this.score += 10;
            this.currentNumber = this.generateRandomNumber(); // Generate new random number
            tile.style.backgroundColor = '#4CAF50'; // Green for correct
            setTimeout(() => {
                tile.style.backgroundColor = '#333'; // Reset after 200ms
            }, 200);
            this.updateTargetDisplay();
            console.log('Correct tap! New score:', this.score);

            if (this.mode === 'multiplayer') {
                this.sendUpdateToOpponent({ type: 'score', score: this.score });
            }
        } else {
            this.score -= 5;
            if (this.score < 0) this.score = 0;
            tile.style.backgroundColor = '#F44336'; // Red for incorrect
            setTimeout(() => {
                tile.style.backgroundColor = '#333'; // Reset after 200ms
            }, 200);
            console.log('Incorrect tap! New score:', this.score);

            if (this.mode === 'multiplayer') {
                this.sendUpdateToOpponent({ type: 'score', score: this.score });
            }
        }

        const scoreDisplay = document.getElementById('number-tap-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${this.score}`;
            console.log('Score display updated to:', scoreDisplay.textContent);
            // Force DOM update
            scoreDisplay.style.display = 'none';
            scoreDisplay.offsetHeight; // Trigger reflow
            scoreDisplay.style.display = 'block';
            scoreDisplay.style.visibility = 'visible';
            scoreDisplay.style.opacity = '1';
        } else {
            console.error('Score display element not found');
        }

        if (this.mode === 'multiplayer') {
            const opponentScoreDisplay = document.getElementById('opponent-score');
            if (opponentScoreDisplay) {
                opponentScoreDisplay.textContent = `Opponent Score: ${this.opponentScore}`;
            }
        }
    }

    updateTargetDisplay() {
        const targetDisplay = document.getElementById('target-number');
        if (targetDisplay) {
            targetDisplay.textContent = `Tap: ${this.currentNumber}`;
            console.log('Target number updated to:', this.currentNumber);
            // Force DOM update
            targetDisplay.style.display = 'none';
            targetDisplay.offsetHeight; // Trigger reflow
            targetDisplay.style.display = 'block';
            targetDisplay.style.visibility = 'visible';
            targetDisplay.style.opacity = '1';
        } else {
            console.error('Target number display element not found');
        }
    }

    startGame() {
        this.isGameActive = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isGameActive) return;

        this.timeLeft--;
        const timerDisplay = document.getElementById('number-tap-timer');
        if (timerDisplay) {
            timerDisplay.textContent = `Time: ${this.timeLeft}s`;
        } else {
            console.error('Timer display element not found');
        }

        if (this.timeLeft <= 0) {
            this.endGame();
        } else {
            setTimeout(() => this.gameLoop(), 1000);
        }
    }

    endGame() {
        this.isGameActive = false;
        const timerDisplay = document.getElementById('number-tap-timer');
        if (timerDisplay) {
            timerDisplay.textContent = `Time: 0s`;
        }

        this.showEndGameModal();

        if (this.mode === 'multiplayer' && this.webSocket) {
            this.sendUpdateToOpponent({ type: 'endGame', opponentScore: this.score });
            this.webSocket.close(1000, 'Game ended');
            this.webSocket = null;
        }
    }

    showEndGameModal() {
        const modal = document.createElement('div');
        modal.id = 'number-tap-end-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>Your Score: <span class="score-highlight">${this.score}</span></p>
                ${this.mode === 'multiplayer' ? `<p>Opponent's Score: <span class="score-highlight">${this.opponentScore || 0}</span></p>` : ''}
                <p class="result-text">${this.getResultText()}</p>
                <button id="play-again-btn">Play Again</button>
                <button id="exit-btn">Exit to Menu</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('play-again-btn').addEventListener('click', () => {
            modal.remove();
            this.dispose();
            setCurrentGame(new NumberTapGame(this.mode)); // Restart in same mode
        });

        document.getElementById('exit-btn').addEventListener('click', () => {
            modal.remove();
            this.dispose(); // Clean up current game
            navigateTo('#/game'); // Return to game selection
        });
    }

    getResultText() {
        if (this.mode === 'single') {
            return `Great job! Can you beat ${this.score} next time?`;
        } else {
            const win = this.score > (this.opponentScore || 0);
            const tie = this.score === (this.opponentScore || 0);
            return win ? 'You Win!' : tie ? 'It\'s a Tie!' : 'You Lose!';
        }
    }

    dispose() {
        if (this.gameContainer && this.gameContainer.parentNode) {
            this.gameContainer.parentNode.removeChild(this.gameContainer);
        }
        this.isGameActive = false;
        this.hasStoredHistory = false;
        if (this.webSocket && this.webSocket.readyState !== WebSocket.CLOSED) {
            this.webSocket.close(1000, 'Game disposed');
        }
    }

    sendUpdateToOpponent(data) {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket not open. Cannot send update to opponent.');
        }
    }
}