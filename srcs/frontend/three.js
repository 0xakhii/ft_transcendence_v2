import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class PongGame {
    constructor(mode, friendId = null) {
        this.mode = mode;
        this.score = { player1: 0, player2: 0 };
        this.maxScore = 5;
        this.isGameActive = false;
        this.isRunning = false;
        this.localUserId = null;
        this.player1Id = null;
        this.player2Id = null;
        this.gameGroupName = null;
        this.playerRole = null;
        this.friendUsername = friendId;
        this.hasEnded = false; // New flag to prevent duplicate endGame calls

        this.initializeScene();
        this.initializeRenderer();
        this.fetchUserData();
        this.createStartUI();
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 18, 20);
        this.camera.lookAt(0, 0, 0);
    }

    initializeRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        this.updateRendererSize();
        this.renderer.domElement.className = 'three-canvas';
        document.querySelector('.main')?.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        window.addEventListener('resize', () => this.onWindowResize());
    }

    updateRendererSize() {
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const height = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, height);
    }

    createStartUI() {
        this.startDiv = document.createElement('div');
        this.startDiv.id = 'start-ui';
        this.startDiv.className = 'start-ui';
        this.startDiv.innerHTML = `<h2 class="start-heading">${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)} Pong</h2>`;
        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.className = 'game-start-button';
        startButton.addEventListener('click', () => this.startGame());
        this.startDiv.appendChild(startButton);
        document.body.appendChild(this.startDiv);

        this.render();
    }

    createScoreUI() {
        this.scoreDiv = document.createElement('div');
        this.scoreDiv.id = 'score-ui';
        // this.scoreDiv.className = 'scoreeee-ui';
        Object.assign(this.scoreDiv.style, {
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            // background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px'
        });
        document.body.appendChild(this.scoreDiv);
        this.updateScoreUI();
    }

    updateScoreUI() {
        if (this.scoreDiv) {
            this.scoreDiv.innerHTML = `<h2>Score</h2><p>${this.player1Id || 'Player 1'}: ${this.score.player1} vs ${this.player2Id || 'Player 2'}: ${this.score.player2}</p>`;
        }
    }

    initObjects() {
        this.paddle1 = this.createPaddle('blue', new THREE.Vector3(0, 0, -15));
        this.paddle2 = this.createPaddle('red', new THREE.Vector3(0, 0, 15));
        this.ball = this.createBall();
        this.wall = this.createWall(new THREE.Vector3(-10, 0, 0));
        this.wall2 = this.createWall(new THREE.Vector3(10, 0, 0));
    }

    createPaddle(color, position) {
        const paddle = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3.4, 8, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        paddle.rotation.x = Math.PI / 2;
        paddle.rotation.z = Math.PI / 2;
        paddle.position.copy(position);
        this.scene.add(paddle);
        return paddle;
    }

    // createBall() {
    //     const ball = new THREE.Mesh(
    //         new THREE.SphereGeometry(0.4),
    //         new THREE.MeshBasicMaterial({ color: 'orange' })
    //     );
    //     this.scene.add(ball);
    //     return ball;
    // }

    createBall() {
        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(0.4),
            new THREE.MeshBasicMaterial({ color: 'orange' })
        );
        this.scene.add(ball);
        ball.velocity = new THREE.Vector3(0, 0, 0); // Initialize to prevent undefined
        return ball;
    }

    createWall(position) {
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 30),
            new THREE.MeshBasicMaterial({ color: 'white' })
        );
        wall.position.copy(position);
        this.scene.add(wall);
        return wall;
    }

    startGame() {
        this.startDiv?.remove();
        this.startDiv = null;
        this.isGameActive = true;
        this.isRunning = true;

        switch (this.mode) {
            case 'local':
                this.setupLocalMode();
                break;
            case 'multiplayer':
                this.setupMatchmakingWebSocket();
                break;
            case 'friends':
                if (!this.friendUsername) {
                    console.error('No friend selected for private match');
                    alert('Please select a friend from the chat to play a private match.');
                    this.endGame();
                    return;
                }
                if (!this.socket) {
                    console.log("Socket not set, calling setupFriendsMatchWebSocket");
                    this.setupFriendsMatchWebSocket();
                }
                break;
        }
    }

    // setupLocalMode() {
    //     this.initObjects();
    //     this.setupLocalControls();
    //     this.createScoreUI();
    //     this.animate();
    // }

    setupLocalMode() {
        this.initObjects();
        this.resetBall(); // Set initial velocity right after objects are created
        this.setupLocalControls();
        this.createScoreUI();
        this.animate();
    }

    setupLocalControls() {
        const handleInput = (event) => {
            const speed = event.type === 'keydown' ? 0.1 : 0;
            switch (event.key) {
                case 'd': this.paddle1SpeedX = speed; break;
                case 'a': this.paddle1SpeedX = -speed; break;
                case 'ArrowRight': this.paddle2SpeedX = speed; break;
                case 'ArrowLeft': this.paddle2SpeedX = -speed; break;
            }
        };
        document.addEventListener('keydown', handleInput);
        document.addEventListener('keyup', handleInput);
    }

    async setupFriendsMatchWebSocket() {
        console.log("Setting up friends match WebSocket with gameGroupName:", this.gameGroupName);
        this.socket = new WebSocket(`wss://localhost:8000/ws/game/${this.gameGroupName}/`);
        this.socket.onopen = () => {
            console.log(`WebSocket opened for ${this.gameGroupName}`);
            this.initObjects();
            this.createScoreUI();
            this.determinePlayerRole();
            this.updateCameraPosition();
            this.isRunning = true;
            this.isGameActive = true;
            this.animate();
        };
        this.socket.onmessage = (event) => {
            this.handleGameMessage(event);
        };
        this.socket.onclose = () => {
            this.handleGameClose();
        };
        this.setupMultiplayerControls();
    }

    async setupMatchmakingWebSocket() {
        this.socket = new WebSocket('wss://localhost:8000/ws/matchmaking/');
        this.socket.onopen = () => {
            this.socket.send(JSON.stringify({
                action: 'join_queue',
                authToken: localStorage.getItem('authToken')
            }));
        };
        this.socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'match_found') {
                this.player1Id = data.player1_id;
                this.player2Id = data.player2_id;
                this.gameGroupName = data.game_group_name;
                this.socket.close();
                await this.fetchUserData();
                this.setupGameWebSocket();
            } else if (data.type === 'error') {
                console.error('Matchmaking error:', data.message);
            }
        };
        this.socket.onerror = (error) => console.error('Matchmaking WebSocket error:', error);
    }

    setupGameWebSocket() {
        this.socket = new WebSocket(`wss://localhost:8000/ws/game/${this.gameGroupName}/`);
        this.socket.onopen = () => {
            this.initObjects();
            this.determinePlayerRole();
            this.createScoreUI();
            this.isRunning = true;
            this.isGameActive = true;
            this.updateCameraPosition();
            this.animate();
        };
        this.socket.onmessage = (event) => this.handleGameMessage(event);
        this.socket.onclose = () => this.handleGameClose();
        this.setupMultiplayerControls();
    }

    determinePlayerRole() {
        if (!this.localUserId) {
            console.error('Local user ID not set');
            this.playerRole = 'player2';
            return;
        }
        this.playerRole = this.localUserId === this.player1Id ? 'player1' : 'player2';
    }

    updateCameraPosition() {
        if (this.playerRole === 'player1') {
            this.camera.position.set(0, 18, -25);
            this.camera.lookAt(0, 0, 0);
        } else {
            this.camera.position.set(0, 18, 25);
            this.camera.lookAt(0, 0, 0);
        }
        this.controls.target.set(0, 0, this.playerRole === 'player1' ? 15 : -15);
        this.controls.update();
    }

    setupMultiplayerControls() {
        const validKeys = ['a', 'd', 'ArrowLeft', 'ArrowRight'];
        const sendMove = (event) => {
            if (validKeys.includes(event.key) && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    action: 'move',
                    key: event.type === 'keydown' ? event.key : null
                }));
            }
        };
        document.addEventListener('keydown', sendMove);
        document.addEventListener('keyup', sendMove);
    }

    // handleGameMessage(event) {
    //     const data = JSON.parse(event.data);
    //     if (data.type === 'game_update' || data.type === 'game_init') {
    //         this.updateGameState(data);
    //         if (this.isGameActive && (data.score1 >= this.maxScore || data.score2 >= this.maxScore)) {
    //             this.endGame();
    //         }
    //     } else if (data.type === 'game_ended') {
    //         this.endGame();
    //     }
    // this is the first one
    // }

    handleGameMessage(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'game_update' || data.type === 'game_init') {
            this.updateGameState(data);
            if (this.isGameActive && (data.score1 >= this.maxScore || data.score2 >= this.maxScore)) {
                this.endGame(); // Triggered by score
            }
        } else if (data.type === 'game_ended') {
            // Only end if not already ended
            if (!this.hasEnded) {
                this.endGame();
            } else {
                // Ensure modal is present if somehow missed
                const modal = document.getElementById('pong-end-modal');
                if (!modal) this.showEndGameModal();
            }
        }
    }

    // handleGameClose() {
    //     console.log('WebSocket closed');
    //     if (!this.hasEnded) {
    //         this.endGame(); // Trigger end if not already ended
    //     } else {
    //         // Ensure modal is shown if not already
    //         const modal = document.getElementById('pong-end-modal');
    //         if (!modal) this.showEndGameModal();
    //     }
    // }

    handleGameClose() {
        if (this.isGameActive) this.endGame();
    //this is the first one
    }

    updateGameState(data) {
        this.paddle1.position.x = -data.paddle1_x || 0;
        this.paddle2.position.x = -data.paddle2_x || 0;
        this.ball.position.set(data.ball_x || 0, 0, data.ball_z || 0);
        this.ball.velocity = new THREE.Vector3(data.ball_velocity_x || 0, 0, data.ball_velocity_z || 0);
        this.score.player1 = data.score1 || 0;
        this.score.player2 = data.score2 || 0;
        this.updateScoreUI();
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());
        if (this.mode === 'local' && this.isGameActive) this.handleLocalLogic();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    handleLocalLogic() {
        this.updatePaddlePositions();
        this.updateBallPosition();
        this.handleCollisions();
        this.checkScoring();
    }

    updatePaddlePositions() {
        this.paddle1.position.x = Math.max(-9.8, Math.min(9.8, this.paddle1.position.x + (this.paddle1SpeedX || 0)));
        this.paddle2.position.x = Math.max(-9.8, Math.min(9.8, this.paddle2.position.x + (this.paddle2SpeedX || 0)));
    }

    updateBallPosition() {
        const nextBallPosition = this.ball.position.clone().add(this.ball.velocity || new THREE.Vector3(0.09, 0, 0.09));
        this.ball.position.copy(nextBallPosition);
        this.ball.position.y = 0;
    }

    handleCollisions() {
        if (this.checkPaddleCollision(this.paddle1)) this.resolvePaddleCollision(this.paddle1);
        if (this.checkPaddleCollision(this.paddle2)) this.resolvePaddleCollision(this.paddle2);
        this.handleWallCollisions();
    }

    checkPaddleCollision(paddle) {
        const paddleHalfLength = 1.7;
        const paddleRadius = 0.2;
        const ballRadius = 0.4;
        const distanceX = Math.abs(this.ball.position.x - paddle.position.x);
        const distanceZ = Math.abs(this.ball.position.z - paddle.position.z);
        return distanceX < paddleHalfLength && distanceZ < (paddleRadius + ballRadius);
    }

    resolvePaddleCollision(paddle) {
        const pushDistance = 0.65;
        this.ball.position.z = paddle.position.z + (this.ball.velocity.z > 0 ? -pushDistance : pushDistance);
        this.ball.velocity.z *= -1;
        const deltaX = this.ball.position.x - paddle.position.x;
        this.ball.velocity.x += deltaX * 0.05;
        this.ball.velocity.normalize().multiplyScalar(0.3);
    }

    handleWallCollisions() {
        if (this.ball.position.x <= -10) {
            this.ball.position.x = -9.9;
            this.ball.velocity.x = Math.abs(this.ball.velocity.x);
        } else if (this.ball.position.x >= 10) {
            this.ball.position.x = 9.9;
            this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
        }
    }

    checkScoring() {
        if (this.ball.position.z < -16) {
            this.score.player2 += 1;
            this.resetBall();
            this.updateScoreUI();
            if (this.score.player2 >= this.maxScore) this.endGame();
        } else if (this.ball.position.z > 16) {
            this.score.player1 += 1;
            this.resetBall();
            this.updateScoreUI();
            if (this.score.player1 >= this.maxScore) this.endGame();
        }
    }

    resetBall() {
        this.ball.position.set(0, 0, 0);
        const speed = 0.2; //i deacrease speed to make the ball slower
        const direction = Math.random() > 0.5 ? 1 : -1;
        const angle = (Math.random() - 0.5) * Math.PI / 3;
        this.ball.velocity = new THREE.Vector3(speed * Math.sin(angle), 0, direction * speed * Math.cos(angle));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.updateRendererSize();
    }

    async fetchUserData() {
        try {
            const response = await fetch('https://localhost:8000/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            const data = await response.json();
            this.user = data;
            this.localUserId = data?.data?.attributes?.username;
            console.log('Local user ID:', this.localUserId);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    storeMatchHistory() {
        if (this.mode === 'local') return;
        fetch('https://localhost:8000/match-history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                player1_username: this.player1Id,
                player2_username: this.player2Id,
                score1: this.score.player1,
                score2: this.score.player2,
                result: this.score.player1 > this.score.player2 
                    ? `${this.player1Id}` 
                    : this.score.player2 > this.score.player1 
                    ? `${this.player2Id}` 
                    : 'draw'
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log('Match history stored:', data))
            .catch((error) => console.error('Error storing match history:', error));
    }

    // endGame() {
    //     this.isGameActive = false;
    //     this.storeMatchHistory();
    //     this.dispose();
    //     this is the first one
    // }

    // endGame() {
    //     this.isGameActive = false;
    //     this.isRunning = false; // Stop animation loop
    //     this.storeMatchHistory();
    //     this.showEndGameModal(); // Show popup before cleanup
    // }

    endGame() {
        if (this.hasEnded) return; // Prevent re-entry
        this.hasEnded = true;
        this.isGameActive = false;
        this.isRunning = false;
        this.storeMatchHistory();
        this.showEndGameModal();

        // Notify server if multiplayer
        if (this.mode === 'multiplayer' || this.mode === 'friends') {
            // if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            //     this.socket.send(JSON.stringify({
            //         action: 'end_game',
            //         game_group_name: this.gameGroupName
            //     }));
            // }
        }
    }


    showEndGameModal() {
        // Remove any existing modal
        const existingModal = document.getElementById('pong-end-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'pong-end-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>${this.getResultText()}</p>
                <button id="exit-btn">Exit to Menu</button>
            </div>
        `;
        document.body.appendChild(modal);

        const exitBtn = document.getElementById('exit-btn');
        exitBtn.addEventListener('click', () => {
            modal.remove();
            this.dispose();
            navigateTo('#/game'); // Should only trigger once
        });
    }

    // showEndGameModal() {
    //     const modal = document.createElement('div');
    //     modal.id = 'pong-end-modal';
    //     modal.innerHTML = `
    //         <div class="modal-content">
    //             <h2>Game Over!</h2>
    //             <p>${this.getResultText()}</p>
    //             <button id="exit-btn">Exit to Menu</button>
    //         </div>
    //     `;
    //     document.body.appendChild(modal);

    //     document.getElementById('exit-btn').addEventListener('click', () => {
    //         modal.remove();
    //         this.dispose(); // Clean up after modal closes
    //         navigateTo('#/game'); // Use global navigateTo, no import needed
    //     });
    // }

    getResultText() {
        // Simple result based on internal score, no UI display needed
        if (this.score.player1 >= this.maxScore) {
            return this.player1Id ? `${this.player1Id} Wins!` : 'Player 1 Wins!';
        } else if (this.score.player2 >= this.maxScore) {
            return this.player2Id ? `${this.player2Id} Wins!` : 'Player 2 Wins!';
        } else {
            return 'Game Ended!';
        }
    }

    dispose() {
        this.isRunning = false;
        this.isGameActive = false;
        [this.startDiv, this.scoreDiv, this.renderer?.domElement].forEach(el => el?.remove());
        [this.paddle1, this.paddle2, this.ball, this.wall, this.wall2].forEach(obj => obj && this.scene.remove(obj));
        window.removeEventListener('resize', this.onWindowResize);
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.renderer?.dispose();
        this.controls?.dispose();
        while (this.scene.children.length > 0) this.scene.remove(this.scene.children[0]);
    }

    // dispose() {
    //     this.isRunning = false;
    //     this.isGameActive = false;
    //     [this.startDiv, this.scoreDiv, this.renderer?.domElement].forEach(el => el?.remove());
    //     [this.paddle1, this.paddle2, this.ball, this.wall, this.wall2].forEach(obj => obj && this.scene.remove(obj));
    //     window.removeEventListener('resize', this.onWindowResize);
    //     if (this.socket) this.socket.close();
    //     this.renderer?.dispose();
    //     this.controls?.dispose();
    //     while (this.scene.children.length > 0) this.scene.remove(this.scene.children[0]);
    // }
    // dispose() {
    //     this.isRunning = false;
    //     this.isGameActive = false;
    //     [this.startDiv, this.scoreDiv, this.renderer?.domElement].forEach(el => el?.remove());
    //     [this.paddle1, this.paddle2, this.ball, this.wall, this.wall2].forEach(obj => obj && this.scene.remove(obj));
    //     window.removeEventListener('resize', this.onWindowResize);
    //     if (this.socket) this.socket.close();
    //     this.renderer?.dispose();
    //     this.controls?.dispose();
    //     while (this.scene.children.length > 0) this.scene.remove(this.scene.children[0]);
    // this is the first one
    // }
}

export class TournamentPongGame extends PongGame {
    constructor() {
        super('tournament');
        this.setupTournament();
    }

    startGame() {
        super.startGame();
        this.updateTournamentUI();
    }

    setupTournament() {
        this.tournament = {
            players: [],
            semifinals: [],
            final: [],
            currentMatch: null,
            winners: [],
            stage: 'nameInput'
        };
    }

    createTournamentUI() {
        this.tournamentUI = document.createElement('div');
        this.tournamentUI.id = 'tournament-ui';
        Object.assign(this.tournamentUI.style, {
            // position: 'absolute',
            // top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)',
            // color: 'white',
            // padding: '20px',
            // borderRadius: '10px',
            // textAlign: 'center',
            // backgroundColor: 'transparent',
            // fontFamily: 'Arial, sans-serif',
            // fontSize: '25px',
            // width: '300px',
            // maxWidth: '90%'
        });
        document.body.appendChild(this.tournamentUI);
    }

    updateTournamentUI() {
        if (!this.tournamentUI) this.createTournamentUI();
        this.tournamentUI.innerHTML = '';
        switch (this.tournament.stage) {
            case 'nameInput':
                this.tournamentUI.innerHTML = '<h2>Enter Player Names</h2>';
                for (let i = 1; i <= 4; i++) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'tn-player-input';
                    input.style.cssText = 'margin-bottom: 10px; width: 300px;';
                    input.placeholder = `Player ${i}`;
                    input.id = `player-${i}`;
                    this.tournamentUI.appendChild(input);
                    this.tournamentUI.appendChild(document.createElement('br'));
                }
                const startButton = document.createElement('button');
                startButton.textContent = 'Start Tournament';
                startButton.addEventListener('click', () => this.startTournament());
                this.tournamentUI.appendChild(startButton);
                break;
            case 'semifinals':
            case 'final':
                this.tournamentUI.innerHTML = `<h2>${this.tournament.stage === 'semifinals' ? 'Semifinals' : 'Final'}</h2>`;
                this.tournamentUI.innerHTML += `<p>${this.tournament.currentMatch.player1} vs ${this.tournament.currentMatch.player2}</p>`;
                this.tournamentUI.innerHTML += `<p>Score: ${this.score.player1} - ${this.score.player2}</p>`;
                break;
            case 'finished':
                this.tournamentUI.innerHTML = `<h2>Tournament Finished</h2>`;
                this.tournamentUI.innerHTML += `<p>Winner: ${this.tournament.winners[0]}</p>`;
                this.endGame();
                break;
        }
    }

    startTournament() {
        this.tournament.players = [];
        for (let i = 1; i <= 4; i++) {
            const name = document.getElementById(`player-${i}`).value || `Player ${i}`;
            this.tournament.players.push(name);
        }
        this.tournament.semifinals = [
            { player1: this.tournament.players[0], player2: this.tournament.players[1], winner: null },
            { player1: this.tournament.players[2], player2: this.tournament.players[3], winner: null }
        ];
        this.tournament.stage = 'semifinals';
        this.tournament.currentMatch = this.tournament.semifinals[0];
        this.initObjects();
        this.setupLocalControls();
        this.animate();
        this.resetBall();
        this.checkScoring();
        this.updateTournamentUI();
    }

    checkMatchEnd() {
        if (this.score1 >= this.maxScore || this.score2 >= this.maxScore) {
            const winner = this.score1 > this.score2 ? this.tournament.currentMatch.player1 : this.tournament.currentMatch.player2;
            if (this.tournament.stage === 'semifinals') {
                this.tournament.currentMatch.winner = winner;
                this.tournament.winners.push(winner);
                if (this.tournament.winners.length === 1) {
                    this.tournament.currentMatch = this.tournament.semifinals[1];
                } else {
                    this.tournament.stage = 'final';
                    this.tournament.final = [{ player1: this.tournament.winners[0], player2: this.tournament.winners[1], winner: null }];
                    this.tournament.currentMatch = this.tournament.final[0];
                }
            } else if (this.tournament.stage === 'final') {
                this.tournament.currentMatch.winner = winner;
                this.tournament.winners = [winner];
                this.tournament.stage = 'finished';
            }
            this.score1 = 0;
            this.score2 = 0;
            this.resetBall();
            this.disposeGameObjects();
            if (this.tournament.stage !== 'finished') this.initObjects();
            this.updateTournamentUI();
        }
    }

    animate() {
        this.updateTournamentUI();
        if (!this.isRunning) return; // Stop animation if not running
        requestAnimationFrame(() => this.animate());

        if (this.isGameActive) {
            this.handleLocalLogic(1 / 2);
            if (this.mode === 'tournament') this.checkMatchEnd();
        }
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    dispose() {
        super.dispose();
        if (this.tournamentUI) {
            this.tournamentUI.remove();
            this.tournamentUI = null;
        }
    }
}

export let currentGame = null;

export function setCurrentGame(gameInstance) {
    if (currentGame) currentGame.dispose();
    currentGame = gameInstance;
}