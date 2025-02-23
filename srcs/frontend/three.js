import * as THREE from 'three';
import { contain } from 'three/src/extras/TextureUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class PongGame {
    constructor(mode) {
        this.fetchUserData();
        this.mode = mode;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 18, 20);
        this.paddle1SpeedX = 0;
        this.paddle1SpeedY = 0;
        this.paddle2SpeedX = 0;
        this.paddle2SpeedY = 0;
        document.addEventListener('keydown', (event) => {
            if (event.key === '0') {
            this.camera.position.set(0, 18, 20);
            this.camera.lookAt(0, 0, 0);
            }
        });
        // this.scoreDisplay = document.createElement('div');
        // Object.assign(this.scoreDisplay.style, {
        //     position: 'absolute',
        //     top: '20px',
        //     left: '50%',
        //     transform: 'translateX(-50%)',
        //     fontSize: '24px',
        //     color: 'white'
        // });
        // document.body.appendChild(this.scoreDisplay);
        this.initObjects();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const mainDiv = document.querySelector('.main');
        const headerDiv = document.querySelector('.header');
        const mainDivHeight = mainDiv && headerDiv ? mainDiv.offsetHeight - headerDiv.offsetHeight : window.innerHeight;
        this.renderer.setSize(window.innerWidth, mainDivHeight);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
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
            this.setupWebSocket();
        } else if (this.mode === 'local') {
            this._handleLocalInput = this.handleLocalInput.bind(this);
            document.addEventListener('keydown', this._handleLocalInput);
            document.addEventListener('keyup', this._handleLocalInput);

        }

        this.animate();
    }

    initObjects() {
        this.fetchGameInitData({'state' : 'init'});
        this.paddle1 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3, 8, 16),
            new THREE.MeshBasicMaterial({ color: 'blue' })
        );
        this.paddle1.rotation.x = Math.PI/2;
        this.paddle1.rotation.z = Math.PI/2;
        this.scene.add(this.paddle1);
        
        this.paddle2 = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 3, 8, 16),
            new THREE.MeshBasicMaterial({ color: 'red' })
        );
        this.paddle2.rotation.x = Math.PI/2;
        this.paddle2.rotation.z = Math.PI/2;

        
        this.scene.add(this.paddle2);
        
        this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({color: 'orange'}));
        this.ball.velocity = new THREE.Vector3(0.1, 0, 0); 
        this.scene.add(this.ball);

        this.wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 30),
            new THREE.MeshBasicMaterial({ color: 'white' })
        );
        this.wall.position.set(-10, 0, 0);
        this.scene.add(this.wall)
        this.wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 30),
            new THREE.MeshBasicMaterial({ color: 'white' })
        );
        this.wall2.position.set(10, 0, 0);
        this.scene.add(this.wall2)
    }
    
    fetchGameInitData(state){
        fetch('http://localhost:8000/game/', {
            method : 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(state)
        })
        .then(response => response.json())
        .then(data => {
            this.paddle1.position.x = data['LeftPaddle']['x'];
            this.paddle1.position.y = data['LeftPaddle']['y'];
            this.paddle1.position.z = data['LeftPaddle']['z'];
            
            this.paddle2.position.x = data['RightPaddle']['x'];
            this.paddle2.position.y = data['RightPaddle']['y'];
            this.paddle2.position.z = data['RightPaddle']['z'];
            
            // this.ball.position.x = data['ball']['x'];
            // this.ball.position.y = data['ball']['y'];
            // this.ball.position.z = data['ball']['z'];
        })
        .catch(error => console.log('Error fetching game inital data'));
    }
    
    fetchUserData() {
        fetch('http://localhost:8000/profile/', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data)
                this.user = data;
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
        this.socket = new WebSocket('ws://localhost:8000/ws/pong/');

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
        if (event.key === 'd') this.paddle1SpeedX += 0.5;
        if (event.key === 'a') this.paddle1SpeedY -= 0.5;
        
        if (event.key === 'ArrowRight') this.paddle2SpeedX += 0.5;
        if (event.key === 'ArrowLeft') this.paddle2SpeedY -= 0.5;

        this.paddle1.position.y += this.paddle1SpeedY;
        this.paddle1.position.x += this.paddle1SpeedX;
        
        this.paddle2.position.y += this.paddle2SpeedY;
        this.paddle2.position.x += this.paddle2SpeedX;
        // if (this.paddle1.position.y < -10) this.paddle1.position.y = -10;
        // if (this.paddle1.position.y > 10) this.paddle1.position.y = 10;
        // if (this.paddle2.position.y < -10) this.paddle2.position.y = -10;
        // if (this.paddle2.position.y > 10) this.paddle2.position.y = 10;
    }
    handleLocalBall(){
        this.ball.position.x += this.ball.velocity.x;
        this.ball.position.y += this.ball.velocity.y;
        if (this.ball.position.x <= -10 || this.ball.position.x >= 10) {
            this.ball.velocity.x = this.ball.velocity.z = -this.ball.velocity.x;
            this.ball.velocity.y = this.ball.velocity.z;
        }

        // if (this.ball.position.distanceTo(this.paddle1.position) < 1 || this.ball.position.distanceTo(this.paddle2.position) < 1) {
        //     this.ball.velocity.y = -this.ball.velocity.y;
        // }

        // if (this.mode === 'multiplayer' && this.socket && this.socket.readyState === WebSocket.OPEN) {
        //     const ballUpdateEvent = {
        //     action: 'update_ball',
        //     ball_x: this.ball.position.x,
        //     ball_y: this.ball.position.y
        //     };
        //     this.socket.send(JSON.stringify(ballUpdateEvent));
        // }
    }
    updateGameState(data) {
        this.paddle1.position.y = data.paddle1_y;
        this.paddle2.position.y = data.paddle2_y;
        this.ball.position.x = data.ball_x;
        this.ball.position.y = data.ball_y;

        // if (this.mode === 'multiplayer') {
        //     const name1 = this.user['data']['attributes']['username'];
        //     const name2 = this.user2?.name || 'Player 2';
        //     this.scoreDisplay.textContent = `${name1}: 0- ${name2}: 0`;
        // } else {
        //     this.scoreDisplay.textContent = `Player 1: 0- Player 2: 0`;
        // }
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
        this.handleLocalBall();
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