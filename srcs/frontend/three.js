import * as THREE from 'three';
import { contain } from 'three/src/extras/TextureUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class PongGame {
    constructor(mode) {
        this.mode = mode;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 5, 7);
        document.addEventListener('keydown', (event) => {
            if (event.key === '0') {
            this.camera.position.set(0, 5, 7);
            this.camera.lookAt(0, 0, 0);
            }
        });
        this.scoreDisplay = document.createElement('div');
        Object.assign(this.scoreDisplay.style, {
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            color: 'white'
        });
        document.body.appendChild(this.scoreDisplay);
        this.initObjects();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, mainDivHeight);

        window.addEventListener('resize', () => {
            const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
            this.renderer.setSize(window.innerWidth, mainDivHeight);
            this.camera.aspect = window.innerWidth / mainDivHeight;
            this.camera.updateProjectionMatrix();
        });
        this.renderer.domElement.className = 'three-canvas';
        this.scene.background = null;
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const container = document.querySelector('.main');
        container.appendChild(this.renderer.domElement);

        this._onResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this._onResize);

        if (this.mode === 'multiplayer') {
            this.fetchUserData();
            this.setupWebSocket();
        } else if (this.mode === 'local') {
            this._handleLocalInput = this.handleLocalInput.bind(this);
            document.addEventListener('keydown', this._handleLocalInput);
        }

        this.animate();
    }

    initObjects() {
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        this.scene.add(light);

        const paddleGeometry = new THREE.BoxGeometry(1, 3, 0.5);
        const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddle1.position.x = -4;
        this.scene.add(this.paddle1);

        this.paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddle2.position.x = 4;
        this.scene.add(this.paddle2);

        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.scene.add(this.ball);
    }

    fetchUserData() {
        fetch('http://localhost:8000/user-data/')
            .then(response => response.json())
            .then(data => {
                // { user1: { name: '1234', ... }, user2: { name: '4321', ... } }
                this.user1 = data.user1;
                this.user2 = data.user2;
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    storeMatchHistory(matchData) {
        fetch('http://localhost:8000/match-history/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matchData)
        })
        .then(response => response.json())
        .then(data => console.log('Match history stored:', data))
        .catch(error => console.error('Error storing match history:', error));
    }

    setupWebSocket() {
        this.socket = new WebSocket('ws://localhost:8000/ws/game/');

        this.socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updateGameState(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this._socketKeyListener = (event) => {
            const validKeys = ['ArrowUp', 'ArrowDown', 'w', 's'];
            if (validKeys.includes(event.key) && this.socket && this.socket.readyState === WebSocket.OPEN) {
                const moveEvent = { action: 'move', key: event.key };
                this.socket.send(JSON.stringify(moveEvent));
            }
        };
        document.addEventListener('keydown', this._socketKeyListener);
    }

    handleLocalInput(event) {
        if (event.key === 'w') this.paddle1.position.y += 0.5;
        if (event.key === 's') this.paddle1.position.y -= 0.5;
        if (event.key === 'ArrowUp') this.paddle2.position.y += 0.5;
        if (event.key === 'ArrowDown') this.paddle2.position.y -= 0.5;
    }

    updateGameState(data) {
        this.paddle1.position.y = data.paddle1_y;
        this.paddle2.position.y = data.paddle2_y;
        this.ball.position.x = data.ball_x;
        this.ball.position.y = data.ball_y;

        if (this.mode === 'multiplayer') {
            const name1 = this.user1?.name || 'Player 1';
            const name2 = this.user2?.name || 'Player 2';
            this.scoreDisplay.textContent = `${name1}: ${data.score1} - ${name2}: ${data.score2}`;
        } else {
            this.scoreDisplay.textContent = `Player 1: ${data.score1} - Player 2: ${data.score2}`;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, mainDivHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.remove();
        }
        if (this.scoreDisplay) {
            this.scoreDisplay.remove();
        }

        window.removeEventListener('resize', this._onResize);

        if (this.mode === 'local' && this._handleLocalInput) {
            document.removeEventListener('keydown', this._handleLocalInput);
        }
        if (this.mode === 'multiplayer' && this._socketKeyListener) {
            document.removeEventListener('keydown', this._socketKeyListener);
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