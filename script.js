// ==========================================
// 1. MODAIS E INTERFACE
// ==========================================

window.openLightbox = function(imgSrc, title, desc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');

    if(!lightbox) return;

    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
   
    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if(!lightbox) return;

    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.getElementById('lightbox-img').src = '';
    }, 300);
    document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        window.closeLightbox();
        window.closeVirtualTour();
    }
});

// ==========================================
// 2. CONFIGURAÇÃO DAS SALAS E OBRAS
// ==========================================

const rooms = {
    'renascence': {
        title: '01. Galeria Principal (10 Obras)',
        texture: './imagens/panorama-360.jpg',
        artworks: [
            { id: 'art1', title: 'Obra 01', desc: 'Galeria Principal', image: './imagens/brasaoparana.jpg', lon: 0, lat: 0, width: 90, height: 110 },
            { id: 'art2', title: 'Obra 02', desc: 'Galeria Principal', image: './imagens/obra2.jpg', lon: 36, lat: 2, width: 100, height: 80 },
            { id: 'art3', title: 'Obra 03', desc: 'Galeria Principal', image: './imagens/obra3.jpg', lon: 72, lat: -1, width: 90, height: 90 },
            { id: 'art4', title: 'Obra 04', desc: 'Galeria Principal', image: './imagens/obra4.jpg', lon: 108, lat: 1, width: 80, height: 120 },
            { id: 'art5', title: 'Obra 05', desc: 'Galeria Principal', image: './imagens/obra5.jpg', lon: 144, lat: 0, width: 90, height: 110 },
            { id: 'art6', title: 'Obra 06', desc: 'Galeria Principal', image: './imagens/obra6.jpg', lon: 180, lat: -2, width: 110, height: 80 },
            { id: 'art7', title: 'Obra 07', desc: 'Galeria Principal', image: './imagens/obra7.jpg', lon: 216, lat: 1, width: 95, height: 95 },
            { id: 'art8', title: 'Obra 08', desc: 'Galeria Principal', image: './imagens/obra8.jpg', lon: 252, lat: 0, width: 85, height: 115 },
            { id: 'art9', title: 'Obra 09', desc: 'Galeria Principal', image: './imagens/obra9.jpg', lon: 288, lat: -1, width: 100, height: 85 },
            { id: 'art10', title: 'Obra 10', desc: 'Galeria Principal', image: './imagens/obra10.jpg', lon: 324, lat: 0, width: 90, height: 110 }
        ]
    }
};

// ==========================================
// 3. MOTOR THREE.JS 360º
// ==========================================

let scene, camera, renderer, sphere, framesGroup, raycaster, mouse;
let isUserInteracting = false;
let onMouseDownMouseX = 0, onMouseDownMouseY = 0, mouseClickStartX = 0, mouseClickStartY = 0;
let lon = 0, onMouseDownLon = 0, lat = 0, onMouseDownLat = 0, phi = 0, theta = 0;
let animationId = null;

function initVirtualTour() {
    const container = document.getElementById('tour-canvas-container');
    if (!container || renderer) return;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    framesGroup = new THREE.Group();
    scene.add(framesGroup);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    container.appendChild(renderer.domElement);

    container.addEventListener('mousedown', onPointerDown, false);
    container.addEventListener('mousemove', onPointerMove, false);
    window.addEventListener('mouseup', onPointerUp, false);
    container.addEventListener('wheel', onDocumentMouseWheel, { passive: true });

    window.addEventListener('resize', onWindowResize, false);
}

function create3DArtFrames(artworksList) {
    while(framesGroup.children.length > 0) { 
        framesGroup.remove(framesGroup.children[0]); 
    }

    if (!artworksList) return;

    const textureLoader = new THREE.TextureLoader();

    artworksList.forEach(art => {
        const frameWidth = art.width || 80;
        const frameHeight = art.height || 100;

        // Moldura
        const frameGeo = new THREE.BoxGeometry(frameWidth + 10, frameHeight + 10, 4);
        const frameMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide }); 
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);

        // Tela
        const canvasGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
        
        // Tenta carregar a imagem local, usa canvas reserva em caso de erro
        const canvasMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
        textureLoader.load(
            art.image,
            function(tex) { canvasMat.map = tex; canvasMat.needsUpdate = true; },
            undefined,
            function() { canvasMat.map = createCanvasPlaceholder(art.title); canvasMat.needsUpdate = true; }
        );

        const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
        canvasMesh.position.z = 2.5;

        const artGroup = new THREE.Group();
        artGroup.add(frameMesh);
        artGroup.add(canvasMesh);

        const radius = 450;
        const p = THREE.MathUtils.degToRad(90 - art.lat);
        const t = THREE.MathUtils.degToRad(art.lon);

        artGroup.position.x = radius * Math.sin(p) * Math.cos(t);
        artGroup.position.y = radius * Math.cos(p);
        artGroup.position.z = radius * Math.sin(p) * Math.sin(t);

        artGroup.lookAt(0, 0, 0);
        artGroup.userData = art;

        framesGroup.add(artGroup);
    });
}

// Cria imagem reserva temporária caso o arquivo local não exista
function createCanvasPlaceholder(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 10; ctx.strokeRect(20, 20, 472, 472);
    ctx.fillStyle = '#d4af37'; ctx.font = '24px serif'; ctx.textAlign = 'center';
    ctx.fillText(text, 256, 250);
    ctx.fillStyle = '#a1a1aa'; ctx.font = '16px sans-serif';
    ctx.fillText('Adicione a imagem na pasta /imagens', 256, 290);
    return new THREE.CanvasTexture(canvas);
}

function loadRoomTexture(roomKey) {
    const room = rooms[roomKey];
    if(!room) return;

    const loader = new THREE.TextureLoader();
    loader.load(
        room.texture,
        function(texture) {
            sphere.material.map = texture;
            sphere.material.needsUpdate = true;
            create3DArtFrames(room.artworks);
        },
        undefined,
        function() {
            sphere.material.map = createCanvasPlaceholder('Panorama 360º');
            sphere.material.needsUpdate = true;
            create3DArtFrames(room.artworks);
        }
    );
}

window.openVirtualTour = function(roomKey) {
    const modal = document.getElementById('tour-modal');
    if(!modal) return;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        initVirtualTour();
        loadRoomTexture(roomKey);
        if(!animationId) animate();
    }, 50);
};

window.closeVirtualTour = function() {
    const modal = document.getElementById('tour-modal');
    if(!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if(animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }, 300);
};

function onPointerDown(event) {
    isUserInteracting = true;
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    mouseClickStartX = event.clientX;
    mouseClickStartY = event.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

function onPointerMove(event) {
    if (isUserInteracting === true) {
        lon = (onMouseDownMouseX - event.clientX) * 0.15 + onMouseDownLon;
        lat = (event.clientY - onMouseDownMouseY) * 0.15 + onMouseDownLat;
    }
}

function onPointerUp(event) {
    isUserInteracting = false;
    const distMoved = Math.hypot(event.clientX - mouseClickStartX, event.clientY - mouseClickStartY);
    if (distMoved < 5) checkArtworkClick(event.clientX, event.clientY);
}

function checkArtworkClick(clientX, clientY) {
    const container = document.getElementById('tour-canvas-container');
    if(!container || !camera || !framesGroup) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(framesGroup.children, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.title && obj.parent) obj = obj.parent;
        if (obj && obj.userData && obj.userData.title) {
            window.openLightbox(obj.userData.image, obj.userData.title, obj.userData.desc);
        }
    }
}

function onDocumentMouseWheel(event) {
    if(!camera) return;
    camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.05, 30, 90);
    camera.updateProjectionMatrix();
}

function onWindowResize() {
    const container = document.getElementById('tour-canvas-container');
    if(!camera || !renderer || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    if (!isUserInteracting) lon += 0.04;

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);
    renderer.render(scene, camera);
}