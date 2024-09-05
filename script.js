// configurações iniciais
const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 300;
camera.position.y = 100;

// luzes
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// função p criar o carro
function createCar() {
    const car = new THREE.Group();

    // corpo do carro
    const bodyGeometry = new THREE.BoxGeometry(60, 20, 30);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff5722 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    car.add(body);

    // rodas
    const wheelGeometry = new THREE.CylinderGeometry(10, 10, 5, 32);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheelPositions = [
        [-25, -15, 15],
        [25, -15, 15],
        [-25, -15, -15],
        [25, -15, -15]
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos[0], pos[1], pos[2]);
        car.add(wheel);
    });

    // vidros
    const glassGeometry = new THREE.BoxGeometry(50, 10, 20);
    const glassMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = 15;
    car.add(glass);

    // escapamento
    const exhaustGeometry = new THREE.BoxGeometry(10, 10, 10);
    const exhaustMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaust.position.set(25, -10, 0);
    car.add(exhaust);

    // faróis
    const headlightGeometry = new THREE.BoxGeometry(10, 5, 5);
    const headlightMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightLeft.position.set(-30, 10, 15);
    car.add(headlightLeft);
    const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightRight.position.set(-30, 10, -15);
    car.add(headlightRight);

    car.position.y = 10;
    return car;
}

const car = createCar();
scene.add(car);

// função para criar a rodovia
function createRoad() {
    const roadGeometry = new THREE.PlaneGeometry(1000, 2000);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x4CAF50 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -10;
    return road;
}

const road = createRoad();
scene.add(road);

// função p criar obstáculos 
function createObstacle(type) {
    let geometry;
    let color;

    switch (type) {
        case 'hole':
            geometry = new THREE.BoxGeometry(60, 10, 60);
            color = 0x000000;
            break;
        case 'brick':
            geometry = new THREE.BoxGeometry(60, 30, 60);
            color = 0x8B4513;
            break;
        case 'sign':
            geometry = new THREE.BoxGeometry(20, 60, 10);
            color = 0xFF0000;
            break;
        default:
            geometry = new THREE.BoxGeometry(60, 30, 60);
            color = 0xFFC107;
            break;
    }

    const material = new THREE.MeshPhongMaterial({ color: color });
    const obstacle = new THREE.Mesh(geometry, material);
    obstacle.position.y = 15;
    return obstacle;
}

const obstacles = [];
const obstacleTypes = ['hole', 'brick', 'sign'];
for (let i = 0; i < 10; i++) {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = createObstacle(type);
    obstacle.position.x = Math.random() * 800 - 400;
    obstacle.position.z = -Math.random() * 2000;
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// função p atualizar os obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.position.z += 5;
        if (obstacle.position.z > 500) {
            obstacle.position.z = -Math.random() * 2000;
            obstacle.position.x = Math.random() * 800 - 400;
        }
    });
}

// função p ver colisões
function checkCollision() {
    obstacles.forEach(obstacle => {
        const carBoundingBox = new THREE.Box3().setFromObject(car);
        const obstacleBoundingBox = new THREE.Box3().setFromObject(obstacle);

        if (carBoundingBox.intersectsBox(obstacleBoundingBox)) {
            alert('Game Over!');
            document.location.reload();
        }
    });
}

// pontuação
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = '#fff';
scoreElement.style.fontSize = '24px';
document.body.appendChild(scoreElement);

function updateScore() {
    score++;
    scoreElement.innerText = 'Score: ' + score;
}

// função de animação
function animate() {
    requestAnimationFrame(animate);

    // atualizar obstáculos e pontuação
    updateObstacles();
    checkCollision();
    updateScore();

    // renderizar cena
    renderer.render(scene, camera);
}

animate();

// controle do carro
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            car.position.x -= 10;
            break;
        case 'ArrowRight':
            car.position.x += 10;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);

// ajusta o tamanho do canvas ao redimensionar a janela
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
