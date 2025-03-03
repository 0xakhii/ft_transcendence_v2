import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class PongGame {
    constructor(mode) {
        this.mode = mode;
        this.score1 = 0;
        this.score2 = 0;
        this.paddle1SpeedX = 0;
        this.paddle2SpeedX = 0;
        this.isGameActive = false;
        this.isRunning = false;
        this.maxScore = 5;

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
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const height = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, height);
        this.renderer.domElement.className = 'three-canvas';
        this.renderer.setClearColor(0x000000, 0);
        if (mainDiv) mainDiv.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        this._onWindowResize = () => this.onWindowResize();
        window.addEventListener('resize', this._onWindowResize);
    }

    createStartUI() {
        this.startDiv = document.createElement('div');
        this.startDiv.id = 'start-ui';
        this.startDiv.className = 'start-ui'
        // this.startDiv.innerHTML = `<h2>${this.mode === 'tournament' ? 'Tournament' : this.mode === 'local' ? 'Local' : 'Multiplayer'} Pong</h2>`;
        this.startDiv.innerHTML = `<h2 class="start-heading">${this.mode === 'tournament' ? 'Tournament' : this.mode === 'local' ? 'Local' : 'Multiplayer'} Pong</h2>`;
        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.className = 'game-start-button';
        startButton.addEventListener('click', () => this.startGame());
        this.startDiv.appendChild(startButton);
        document.body.appendChild(this.startDiv);

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    startGame() {
        if (this.startDiv) {
            this.startDiv.remove();
            this.startDiv = null;
        }
        this.isGameActive = true;
        this.isRunning = true;

        switch (this.mode) {
            case 'local':
                this.setupLocalMode();
                break;
            case 'multiplayer':
                this.setupMatchmakingWebSocket();
                break;
        }
    }

    initObjects() {
        this.fetchGameInitData({ state: 'init' });

        this.paddle1 = this.createPaddle('blue', new THREE.Vector3(0, 0, -15));
        this.paddle2 = this.createPaddle('red', new THREE.Vector3(0, 0, 15));
        this.ball = this.createBall();
        this.wall = this.createWall(new THREE.Vector3(-10, 0, 0));
        this.wall2 = this.createWall(new THREE.Vector3(10, 0, 0));

        this.paddleRadius = 0.2;
        this.BallRadius = 0.4;
    }

    createPaddle(color, position) {
        const paddle = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3, 8, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        paddle.rotation.x = Math.PI / 2;
        paddle.rotation.z = Math.PI / 2;
        paddle.position.copy(position);
        this.scene.add(paddle);
        return paddle;
    }

    createBall() {
        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(0.4),
            new THREE.MeshBasicMaterial({ color: 'orange' })
        );
        ball.velocity = new THREE.Vector3(0.09, 0, 0.09);
        this.scene.add(ball);
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

    setupLocalMode() {
        this.initObjects();
        this.setupLocalControls();
        this.createScoreUI();
        this.animate();
    }

    setupLocalControls() {
        this._handleLocalInput = (event) => {
            const keyState = event.type === 'keydown' ? 0.1 : 0;
            if (event.key === 'd') this.paddle1SpeedX = keyState;
            if (event.key === 'a') this.paddle1SpeedX = -keyState;
            if (event.key === 'ArrowRight') this.paddle2SpeedX = keyState;
            if (event.key === 'ArrowLeft') this.paddle2SpeedX = -keyState;
        };
        document.addEventListener('keydown', this._handleLocalInput);
        document.addEventListener('keyup', this._handleLocalInput);
    }

    createScoreUI() {
        this.scoreDiv = document.createElement('div');
        this.scoreDiv.id = 'score-ui';
        Object.assign(this.scoreDiv.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px'
        });
        document.body.appendChild(this.scoreDiv);
        this.updateScoreUI();
    }

    updateScoreUI() {
        if (this.scoreDiv) {
            this.scoreDiv.innerHTML = `<h2>Score</h2><p>Player 1: ${this.score1} | Player 2: ${this.score2}</p>`;
        }
    }

    handleLocalLogic() {
        this.updatePaddlePositions();
        this.updateBallPosition();
        this.handleCollisions();
        this.checkScoring();
    }

    updatePaddlePositions() {
        if (this.paddle1) {
            this.paddle1.position.x = Math.max(-9.8, Math.min(9.8, this.paddle1.position.x + this.paddle1SpeedX));
        }
        if (this.paddle2) {
            this.paddle2.position.x = Math.max(-9.8, Math.min(9.8, this.paddle2.position.x + this.paddle2SpeedX));
        }
    }

    updateBallPosition() {
        if (this.ball) {
            const nextBallPosition = this.ball.position.clone().add(this.ball.velocity);
            this.ball.position.copy(nextBallPosition);
            this.ball.position.y = 0;
        }
    }

    handleCollisions() {
        if (this.paddle1 && this.checkPaddleCollision(this.paddle1)) this.resolvePaddleCollision(this.paddle1);
        if (this.paddle2 && this.checkPaddleCollision(this.paddle2)) this.resolvePaddleCollision(this.paddle2);

        if (this.ball) {
            if (this.ball.position.x <= -10) {
                this.ball.position.x = -9.9;
                this.ball.velocity.x = Math.abs(this.ball.velocity.x);
            } else if (this.ball.position.x >= 10) {
                this.ball.position.x = 9.9;
                this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
            }
        }
    }

    checkScoring() {
        if (!this.ball) return;

        if (this.ball.position.z < -16) {
            this.score2 += 1;
            this.resetBall();
            this.updateScoreUI();
            if (this.mode === 'local' && this.score2 >= this.maxScore) this.endGame();
        } else if (this.ball.position.z > 16) {
            this.score1 += 1;
            this.resetBall();
            this.updateScoreUI();
            if (this.mode === 'local' && this.score1 >= this.maxScore) this.endGame();
        }
    }

    checkPaddleCollision(paddle) {
        if (!this.ball || !paddle) return false;

        const paddleHalfLength = 1.7;
        const ballPos = this.ball.position.clone();
        const paddlePos = paddle.position.clone();
        const distanceX = Math.abs(ballPos.x - paddlePos.x);
        const distanceZ = Math.abs(ballPos.z - paddlePos.z);

        if (distanceX < paddleHalfLength && distanceZ < (this.paddleRadius + this.BallRadius)) return true;

        const leftEndX = paddlePos.x - paddleHalfLength;
        const rightEndX = paddlePos.x + paddleHalfLength;
        const endZ = paddlePos.z;
        const distLeft = Math.sqrt((ballPos.x - leftEndX) ** 2 + (ballPos.z - endZ) ** 2);
        const distRight = Math.sqrt((ballPos.x - rightEndX) ** 2 + (ballPos.z - endZ) ** 2);

        return distLeft < (this.paddleRadius + this.BallRadius) || distRight < (this.paddleRadius + this.BallRadius);
    }

    resolvePaddleCollision(paddle) {
        if (!this.ball || !paddle) return;

        const pushDistance = this.paddleRadius + this.BallRadius + 0.05;
        this.ball.position.z = paddle.position.z + (this.ball.velocity.z > 0 ? -pushDistance : pushDistance);
        this.ball.velocity.z *= -1;
        const deltaX = this.ball.position.x - paddle.position.x;
        this.ball.velocity.x += deltaX * 0.03; 

        if (Math.abs(this.ball.velocity.x) < 0.01) {
            this.ball.velocity.x = this.ball.velocity.x > 0 ? 0.01 : -0.01;
        }
        this.ball.velocity.normalize().multiplyScalar(0.2);
    }

    resetBall() {
        if (this.ball) {
            this.ball.position.set(0, 0, 0);
            const speed = 0.1;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const angle = (Math.random() - 0.5) * Math.PI / 2;
            this.ball.velocity.set(speed * Math.sin(angle), 0, direction * speed * Math.cos(angle));
        }
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }

        if (this.isGameActive && this.mode === 'local') {
            this.handleLocalLogic();
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const height = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, height);
    }

    endGame() {
        this.isGameActive = false;
        this.storeMatchHistory({});
        this.dispose();
    }

    disposeGameObjects() {
        if (this.paddle1) {
            this.scene.remove(this.paddle1);
            this.paddle1 = null;
        }
        if (this.paddle2) {
            this.scene.remove(this.paddle2);
            this.paddle2 = null;
        }
        if (this.ball) {
            this.scene.remove(this.ball);
            this.ball = null;
        }
        if (this.wall) {
            this.scene.remove(this.wall);
            this.wall = null;
        }
        if (this.wall2) {
            this.scene.remove(this.wall2);
            this.wall2 = null;
        }

        if (this.mode === 'local' && this._handleLocalInput) {
            document.removeEventListener('keydown', this._handleLocalInput);
            document.removeEventListener('keyup', this._handleLocalInput);
            this._handleLocalInput = null;
        }
        if (this.scoreDiv) {
            this.scoreDiv.remove();
            this.scoreDiv = null;
        }
        this.score1 = 0;
        this.score2 = 0;
    }

    cleanupUI() {
        if (this.startDiv) {
            this.startDiv.remove();
            this.startDiv = null;
        }
        if (this.scoreDiv) {
            this.scoreDiv.remove();
            this.scoreDiv = null;
        }
        if (this.renderer?.domElement) {
            this.renderer.domElement.remove();
        }
    }

    dispose() {
        this.isRunning = false;
        this.isGameActive = false;
        this.cleanupUI();
        this.disposeGameObjects();

        if (this._onWindowResize) {
            window.removeEventListener('resize', this._onWindowResize);
            this._onWindowResize = null;
        }

        if (this.mode === 'multiplayer' && this._socketKeyUpListener) {
            document.removeEventListener('keyup', this._socketKeyUpListener);
            document.removeEventListener('keydown', this._socketKeyListener);
            this._socketKeyUpListener = null;
            this._socketKeyListener = null;
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        if (this.scene) {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            this.scene = null;
        }
        this.camera = null;
    }

    setupMatchmakingWebSocket() {
        this.socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');
        this.socket.onopen = () => {
            console.log('Connected to matchmaking WebSocket');
            this.socket.send(JSON.stringify({ action: 'join_queue' }));
        };
        this.socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'match_found') {
                this.player1Id = data.player1_id;
                this.player2Id = data.player2_id;
                this.gameGroupName = data.game_group_name;
                this.socket.close();
                this.setupGameWebSocket();
            } else if (data.type === 'waiting') {
                console.log('Waiting for another player...');
            }
        };
        this.socket.onerror = (error) => console.error('Matchmaking WebSocket error:', error);
    }

    setupGameWebSocket() {
        this.socket = new WebSocket(`ws://localhost:8000/ws/game/${this.gameGroupName}/`);
        this.socket.onopen = () => {
            console.log('Connected to game WebSocket');
            this.initObjects();
            this.createScoreUI();
            this.isRunning = true;
            this.isGameActive = true;
            this.animate();
        };
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'game_update' || data.type === 'game_init') {
                this.updateGameState(data);
                if (this.isGameActive && (data.score1 >= this.maxScore || data.score2 >= this.maxScore)) {
                    console.log('Game ended due to max score');
                    this.endGame();
                }
                else if (data.type === 'game_ended') {
                    console.log(data.message);
                    this.endGame();
                }
            }
        };
        this.socket.onclose = () => {
            console.log('Game WebSocket disconnected');
            this.storeMatchHistory({
                player1_id: this.player1Id,
                player2_id: this.player2Id,
                score1: this.score1,
                score2: this.score2,
            });
            if (this.isGameActive) this.endGame();
        };
        this._socketKeyListener = (event) => {
            const validKeys = ['a', 'd', 'ArrowLeft', 'ArrowRight'];
            if (validKeys.includes(event.key) && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ action: 'move', key: event.key }));
            }
        };
        this._socketKeyUpListener = (event) => {
            const validKeys = ['a', 'd', 'ArrowLeft', 'ArrowRight'];
            if (validKeys.includes(event.key) && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ action: 'move', key: null }));
            }
        };
        document.addEventListener('keydown', this._socketKeyListener);
        document.addEventListener('keyup', this._socketKeyUpListener);
    }
    
    updateGameState(data) {
        if (this.paddle1) this.paddle1.position.x = data.paddle1_x || 0;
        if (this.paddle2) this.paddle2.position.x = data.paddle2_x || 0;
        if (this.ball) {
            this.ball.position.x = data.ball_x || 0;
            this.ball.position.z = data.ball_z || 0;
            this.ball.velocity.x = data.ball_velocity_x || 0;
            this.ball.velocity.z = data.ball_velocity_z || 0;
        }
        this.score1 = data.score1 || 0;
        this.score2 = data.score2 || 0;
        this.updateScoreUI();
    }

    fetchGameInitData(state) {
        fetch('http://localhost:8000/game/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state),
        })
            .then((response) => response.json())
            .then((data) => {
                if (this.paddle1) this.paddle1.position.set(data.LeftPaddle.x, data.LeftPaddle.y, data.LeftPaddle.z);
                if (this.paddle2) this.paddle2.position.set(data.RightPaddle.x, data.RightPaddle.y, data.RightPaddle.z);
                if (this.ball) this.ball.position.set(data.ball.x, data.ball.y, data.ball.z);
            })
            .catch((error) => console.error('Error fetching initial game data:', error));
    }

    fetchUserData() {
        fetch('http://localhost:8000/profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => (this.user = data))
            .catch((error) => console.error('Error fetching user data:', error));
    }

    storeMatchHistory(matchData) {
        if (this.mode !== 'local') return;

        fetch('http://localhost:8000/match-history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
                player1_username: this.user?.username || 'player1',
                player2_username: 'player2',
                score1: this.score1,
                score2: this.score2,
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log('Local match history stored:', data))
            .catch((error) => console.error('Error storing local match history:', error));
    }
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
        this.tournamentUI.className = 'tournament-ui';
        document.body.appendChild(this.tournamentUI);
    }

    updateTournamentUI() {
        if (!this.tournamentUI) this.createTournamentUI();
        this.tournamentUI.innerHTML = '';
        switch (this.tournament.stage) {
            case 'nameInput':
                // this.tournamentUI.innerHTML = '<h2>Enter Player Names</h2>';
                this.tournamentUI.innerHTML = '<h2 class="tournament-heading">Enter Player Names</h2>';
                for (let i = 1; i <= 4; i++) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'tn-player-input';
                    input.style.marginBottom = '10px';
                    input.style.width = '300px';
                    input.placeholder = `Player ${i}`;
                    input.id = `player-${i}`;
                    this.tournamentUI.appendChild(input);
                    this.tournamentUI.appendChild(document.createElement('br'));
                }
                const startButton = document.createElement('button');
                startButton.textContent = 'Start Tournament';
                startButton.className = 'tn-start-button';
                startButton.addEventListener('click', () => this.startTournament());
                this.tournamentUI.appendChild(startButton);
                break;
            case 'semifinals':
            case 'final':
                this.tournamentUI.innerHTML = `<h2>${this.tournament.stage === 'semifinals' ? 'Semifinals' : 'Final'}</h2>`;
                this.tournamentUI.innerHTML += `<p>${this.tournament.currentMatch.player1} vs ${this.tournament.currentMatch.player2}</p>`;
                this.tournamentUI.innerHTML += `<p>Score: ${this.score1} - ${this.score2}</p>`;
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
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        if (this.isGameActive) {
            this.handleLocalLogic();
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
    if (currentGame) {
        currentGame.dispose();
        currentGame = null;
    }
    currentGame = gameInstance;
}