import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class PongGame {
    constructor(mode) {
        this.mode = mode;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 18, 20);
        this.camera.lookAt(0, 0, 0);

        this.paddle1SpeedX = 0;
        this.paddle2SpeedX = 0;
        this.score1 = 0;
        this.score2 = 0;

        this.fetchUserData();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, mainDivHeight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.className = 'three-canvas';
        this.scene.background = null;
        this.renderer.setClearColor(0x000000, 0);
        mainDiv.appendChild(this.renderer.domElement);

        if (this.mode === 'multiplayer') {
            this.setupMatchmakingWebSocket();
        } else if (this.mode === 'local') {
            this.initObjects();
            this.setupLocalControls();
            this.animate();
        }
    }

    async setupMatchmakingWebSocket() {
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
                console.log(this.gameGroupName);
                await this.setupGameWebSocket();
            } else if (data.type === 'waiting') {
                console.log('Waiting for another player...');
            }
        };

        this.socket.onerror = (error) => {
            console.error('Matchmaking WebSocket error:', error);
        };
    }

    async setupGameWebSocket() {
        this.socket = new WebSocket(`ws://localhost:8000/ws/game/${this.gameGroupName}/`);

        this.socket.onopen = () => {
            console.log('Connected to game WebSocket');
            this.initObjects();
            this.animate();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received game data:', data);
            this.updateGameState(data);
        };

        this.socket.onclose = () => {
            console.log('Game WebSocket disconnected');
            this.storeMatchHistory({
                player1_id: this.player1Id,
                player2_id: this.player2Id,
                score1: this.score1,
                score2: this.score2,
            });
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

    initObjects() {
        this.fetchGameInitData({ state: 'init' });
        
        this.paddle1 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3, 8, 16),
            new THREE.MeshBasicMaterial({ color: 'blue' })
        );
        this.paddle1.rotation.x = Math.PI / 2;
        this.paddle1.rotation.z = Math.PI / 2;
        this.scene.add(this.paddle1);
        
        this.paddle2 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3, 8, 16),
            new THREE.MeshBasicMaterial({ color: 'red' })
        );
        this.paddle2.rotation.x = Math.PI / 2;
        this.paddle2.rotation.z = Math.PI / 2;
        this.scene.add(this.paddle2);
        
        this.ball = new THREE.Mesh(
            new THREE.SphereGeometry(0.4),
            new THREE.MeshBasicMaterial({ color: 'orange' })
        );
        this.ball.velocity = new THREE.Vector3(0.1, 0, 0.1);
        this.scene.add(this.ball);
        this.paddleRadius = 0.2;
        this.BallRadius = 0.4;

        this.wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 30),
            new THREE.MeshBasicMaterial({ color: 'white' })
        );
        this.wall.position.set(-10, 0, 0);
        this.scene.add(this.wall);
        
        this.wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 30),
            new THREE.MeshBasicMaterial({ color: 'white' })
        );
        this.wall2.position.set(10, 0, 0);
        this.scene.add(this.wall2);
    }
    
    setupLocalControls() {
        this._handleLocalInput = (event) => {
            const keyState = event.type === 'keydown' ? 0.5 : 0;
            
            if (event.key === 'd') this.paddle1SpeedX = keyState;
            if (event.key === 'a') this.paddle1SpeedX = -keyState;
            
            if (event.key === 'ArrowRight') this.paddle2SpeedX = keyState;
            if (event.key === 'ArrowLeft') this.paddle2SpeedX = -keyState;
        };
        document.addEventListener('keydown', this._handleLocalInput);
        document.addEventListener('keyup', this._handleLocalInput);
    }
    
    handleLocalLogic(deltaTime) {
        this.paddle1.position.x += this.paddle1SpeedX * deltaTime;
        this.paddle2.position.x += this.paddle2SpeedX * deltaTime;

        this.paddle1.position.x = Math.max(-9.8, Math.min(9.8, this.paddle1.position.x));
        this.paddle2.position.x = Math.max(-9.8, Math.min(9.8, this.paddle2.position.x));

        let nextBallPosition = this.ball.position.clone().add(this.ball.velocity.clone().multiplyScalar(deltaTime));
        this.ball.position.copy(nextBallPosition);
        this.ball.position.y = 0;

        if (this.checkPaddleCollision(this.paddle1)) {
            this.resolvePaddleCollision(this.paddle1);
        }
        if (this.checkPaddleCollision(this.paddle2)) {
            this.resolvePaddleCollision(this.paddle2);
        }

        if (this.ball.position.x <= -10) {
            this.ball.position.x = -9.9;
            this.ball.velocity.x = Math.abs(this.ball.velocity.x);
        } else if (this.ball.position.x >= 10) {
            this.ball.position.x = 9.9;
            this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
        }

        if (this.ball.position.z < -16) {
            this.score2 += 1;
            this.resetBall();
        } else if (this.ball.position.z > 16) {
            this.score1 += 1;
            this.resetBall();
        }
    }
    
    checkPaddleCollision(paddle) {
        const paddleHalfLength = 1.7;
        const ballPos = this.ball.position.clone();
        const paddlePos = paddle.position.clone();
        const distanceX = Math.abs(ballPos.x - paddlePos.x);
        const distanceZ = Math.abs(ballPos.z - paddlePos.z);
        if (distanceX < paddleHalfLength && distanceZ < (this.paddleRadius + this.BallRadius)) {
            return true;
        }
        const leftEndX = paddlePos.x - paddleHalfLength;
        const rightEndX = paddlePos.x + paddleHalfLength;
        const endZ = paddlePos.z;
        const distLeft = Math.sqrt(
            (ballPos.x - leftEndX) ** 2 + (ballPos.z - endZ) ** 2
        );
        const distRight = Math.sqrt(
            (ballPos.x - rightEndX) ** 2 + (ballPos.z - endZ) ** 2
        );
        return distLeft < (this.paddleRadius + this.BallRadius) || distRight < (this.paddleRadius + this.BallRadius);
    }
    
    resolvePaddleCollision(paddle) {
        const pushDistance = this.paddleRadius + this.BallRadius + 0.05;
        this.ball.position.z = paddle.position.z + (this.ball.velocity.z > 0 ? -pushDistance : pushDistance);
        this.ball.velocity.z *= -1;
        const deltaX = this.ball.position.x - paddle.position.x;
        this.ball.velocity.x += deltaX * 0.3;

        if (Math.abs(this.ball.velocity.x) < 0.1) {
            this.ball.velocity.x = this.ball.velocity.x > 0 ? 0.1 : -0.1;
        }
        const speed = 0.4;
        this.ball.velocity.normalize().multiplyScalar(speed);
    }
    
    resetBall() {
        this.ball.position.set(0, 0, 0);
        let speed = 0.3;
        let direction = Math.random() > 0.5 ? 1 : -1;
        let angle = (Math.random() - 0.5) * Math.PI / 2;

        this.ball.velocity.set(
            speed * Math.sin(angle),
            0,
            direction * speed * Math.cos(angle)
        );
    }
    
    updateGameState(data) {
        this.paddle1.position.x = data.paddle1_x;
        this.paddle2.position.x = data.paddle2_x;
        this.ball.position.x = data.ball_x;
        this.ball.position.z = data.ball_z;
        this.score1 = data.score1;
        this.score2 = data.score2;
    }

    fetchGameInitData(state) {
        fetch('http://localhost:8000/game/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state),
        })
        .then((response) => response.json())
        .then((data) => {
            this.paddle1.position.set(data.LeftPaddle.x, data.LeftPaddle.y, data.LeftPaddle.z);
            this.paddle2.position.set(data.RightPaddle.x, data.RightPaddle.y, data.RightPaddle.z);
            this.ball.position.set(data.ball.x, data.ball.y, data.ball.z);
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
        .then((data) => {
            this.user = data;
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
    
    storeMatchHistory(matchData) {
        fetch('http://localhost:8000/match-history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(matchData),
        })
        .then((response) => response.json())
        .then((data) => console.log('Match history stored:', data))
        .catch((error) => console.error('Error storing match history:', error));
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.mode === 'local') {
            const deltaTime = 1 / 2;
            this.handleLocalLogic(deltaTime);
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, mainDivHeight);
    }

    dispose() {
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.remove();
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.remove();
        }

        window.removeEventListener('resize', this.onWindowResize.bind(this));

        if (this.mode === 'local' && this._handleLocalInput) {
            document.removeEventListener('keydown', this._handleLocalInput);
            document.removeEventListener('keyup', this._handleLocalInput);
        }
        if (this.mode === 'multiplayer' && this._socketKeyUpListener) {
            document.removeEventListener('keyup', this._socketKeyUpListener);
        }

        if (this.socket) {
            this.socket.close();
        }
    }
}

export let currentGame = null;

export function setCurrentGame(gameInstance) {
    if (currentGame) {
        currentGame.dispose();
    }
    currentGame = gameInstance;
}