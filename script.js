/**
 * ===================================================================
 * MUSEU DIGITAL DO PARANÁ - SCRIPT PRINCIPAL
 * ===================================================================
 */

// ==========================================
// 1. ACESSIBILIDADE E TEMAS
// ==========================================

let tamanhoFonteAtual = 16;

function alterarFonte(delta) {
    tamanhoFonteAtual += delta * 2;
    if (tamanhoFonteAtual < 12) tamanhoFonteAtual = 12;
    if (tamanhoFonteAtual > 24) tamanhoFonteAtual = 24;
    document.documentElement.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    tamanhoFonteAtual = 16;
    document.documentElement.style.fontSize = '16px';
}

function alternarTema() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (isDark) {
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Modo Claro';
    } else {
        html.classList.add('dark');
        html.setAttribute('data-theme', 'dark');
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Modo Escuro';
    }
}


// ==========================================
// 2. BANCO DE DADOS DA EXPOSIÇÃO
// ==========================================

const dadosHistoria = [
    {
        titulo: "Tropeirismo e a Formação Paranaense",
        descricao: "O papel fundamental dos tropeiros no povoamento, economia e integração cultural do Paraná.",
        descricaoDetalhada: "O tropeirismo foi um dos movimentos socioeconômicos mais relevantes na formação do Paraná. Os tropeiros transportavam gado e mercadorias entre o RS e SP, fundando vilas e cidades ao longo dos caminhos, como Lapa, Ponta Grossa e Castro.",
        imagem: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de História"
    },
    {
        titulo: "Emancipação Política do Paraná (1853)",
        descricao: "A separação da Província de São Paulo e o nascimento do Paraná sob liderança de Zakarias de Góes.",
        descricaoDetalhada: "Em 29 de agosto de 1853, a Lei Imperial nº 669 criou a Província do Paraná. A instalação oficial ocorreu em 19 de dezembro do mesmo ano com a posse de Zacarias de Góes e Vasconcelos.",
        imagem: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de História"
    },
    {
        titulo: "Ciclos Econômicos: Erva-Mate e Café",
        descricao: "A expansão agrícola e industrial que moldaram as ferrovias e a urbanização do estado.",
        descricaoDetalhada: "O ciclo da erva-mate no século XIX colocou o Paraná em destaque exportador. Mais tarde, no norte do estado, a expansão do café transformou Londrina e Maringá em grandes polos.",
        imagem: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de História"
    }
];

const dadosGeografia = [
    {
        titulo: "Os Três Planaltos Paranaenses",
        descricao: "Estudo altimétrico do relevo: Litoral, Primeiro, Segundo e Terceiro Planaltos.",
        descricaoDetalhada: "O relevo paranaense é estruturado em degraus de leste para oeste: Baixada Litorânea, Primeiro Planalto (Curitiba), Segundo Planalto (Campos Gerais) e Terceiro Planalto (Guarapuava/Oeste).",
        imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Geografia"
    },
    {
        titulo: "Mata das Araucárias e Biodiversidade",
        descricao: "A Floresta Ombrófila Mista, símbolo ecológico paranaense e desafios de preservação.",
        descricaoDetalhada: "A Araucaria angustifolia é a árvore símbolo da paisagem natural do estado. O ecossistema abriga farta biodiversidade, incluindo a gralha-azul, dispersora natural dos pinhões.",
        imagem: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Geografia"
    },
    {
        titulo: "Bacias Hidrográficas e Cataratas do Iguaçu",
        descricao: "A abundância de recursos hídricos e o aproveitamento hidrelétrico e turístico.",
        descricaoDetalhada: "O Paraná possui uma das redes hidrográficas mais ricas do Brasil, destacando-se o Rio Paraná e o Rio Iguaçu, famoso mundialmente pelas Cataratas do Iguaçu e pela Usina de Itaipu.",
        imagem: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Geografia"
    }
];

const dadosArte = [
    {
        titulo: "O Movimento Paranista",
        descricao: "A busca pela identidade visual paranaense inspirada no Pinheiro e na Fauna.",
        descricaoDetalhada: "Surgido nas primeiras décadas do século XX, o Paranismo buscou consolidar os símbolos visuais do Paraná em esculturas, arquitetura e pinturas, liderado por João Turin e Romário Martins.",
        imagem: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Arte"
    },
    {
        titulo: "Muralismo de Poty Lazzarotto",
        descricao: "As gravuras e painéis em azulejo que contam a história e a identidade urbana.",
        descricaoDetalhada: "Poty Lazzarotto foi um dos maiores muralistas brasileiros. Seus painéis em azulejo e concreto pontuam espaços públicos, narrando a história dos trabalhadores e imigrantes paranaenses.",
        imagem: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Arte"
    },
    {
        titulo: "Alfredo Andersen: Mestre da Pintura",
        descricao: "O legado do artista norueguês considerado o pai da pintura no estado do Paraná.",
        descricaoDetalhada: "Radicado em Curitiba a partir de 1902, Alfredo Andersen retratou paisagens e figuras humanas paranaenses, além de fundar a primeira escola de artes plásticas do estado.",
        imagem: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=1200&q=80",
        autor: "Prof. de Arte"
    }
];

const trabalhosAlunos = [
    { 
        id: 't1', 
        titulo: 'O Pinheiro em Geometria', 
        descricao: 'Estudo em pintura acrílica sobre a geometria das copas das araucárias.', 
        descricaoDetalhada: 'Trabalho prático integrando Arte e Geografia. Os alunos analisaram a estrutura botânica do Pinheiro-do-Paraná e utilizaram técnicas de composição abstrata geométrica.',
        autor: 'Lucas Silva (8º Ano A)', 
        disciplina: 'Arte / Geografia',
        imagem: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        lon: 0, lat: 0 
    },
    { 
        id: 't2', 
        titulo: 'Maquete dos Planaltos', 
        descricao: 'Representação tridimensional e tátil dos degraus do relevo paranaense.', 
        descricaoDetalhada: 'Construída em camadas de papelão reciclado e argila, esta maquete destaca a diferença de altitude entre o Litoral, Curitiba, Ponta Grossa e Guarapuava.',
        autor: 'Maria Eduarda (9º Ano B)', 
        disciplina: 'Geografia',
        imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        lon: 72, lat: 0 
    },
    { 
        id: 't3', 
        titulo: 'Painel do Tropeiro', 
        descricao: 'Painel coletivo inspirado nas gravuras de Poty Lazzarotto.', 
        descricaoDetalhada: 'A turma investigou as técnicas de xilogravura e muralismo de Poty Lazzarotto para ilustrar o cotidiano das pousadas tropeiras no Paraná colonial.',
        autor: 'Trabalho Coletivo (7º Ano C)', 
        disciplina: 'Arte / História',
        imagem: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        lon: 144, lat: 0 
    },
    { 
        id: 't4', 
        titulo: 'Cordel: Rotas do Mate', 
        descricao: 'Livreto ilustrado relacionando poesia e o ciclo da erva-mate.', 
        descricaoDetalhada: 'Atividade interdisciplinar que uniu História e Literatura. Os estudantes escreveram versos de cordel sobre o transporte do mate até o Porto de Paranaguá.',
        autor: 'Gabriel Santos (1º EM)', 
        disciplina: 'História',
        imagem: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        lon: 216, lat: 0 
    },
    { 
        id: 't5', 
        titulo: 'Ensaio: Águas do Paraná', 
        descricao: 'Série fotográfica explorando a preservação das bacias hidrográficas.', 
        descricaoDetalhada: 'Projeto fotográfico focado na conscientização ambiental. Os alunos registraram rios e nascentes da comunidade escolar, avaliando o impacto humano.',
        autor: 'Beatriz Lima (2º EM)', 
        disciplina: 'Geografia',
        imagem: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
        lon: 288, lat: 0 
    }
];


// ==========================================
// 3. RENDERIZAÇÃO DAS CARDS NO HTML
// ==========================================

function criarCardHtml(item, tag) {
    return `
        <div class="bg-white dark:bg-zinc-900 border border-[#D4C4A8] dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div class="img-zoom-container relative aspect-video cursor-pointer" onclick="abrirLightbox('${item.imagem}', '${item.titulo}', \`${item.descricaoDetalhada || item.descricao}\`, '${item.autor}', '${tag}')">
                <img src="${item.imagem}" alt="${item.titulo}" class="w-full h-full object-cover img-zoom">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <span class="text-[10px] font-serif font-bold uppercase tracking-wider text-[#7A1C1C] dark:text-amber-400">${tag}</span>
                    <h3 class="font-serif font-bold text-base leading-snug mt-1 text-stone-900 dark:text-stone-100">${item.titulo}</h3>
                    <p class="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-3">${item.descricao}</p>
                </div>
                <div class="text-[11px] text-[#4A2E1B] dark:text-amber-200/80 font-serif font-semibold pt-2 border-t border-[#E2D8C3] dark:border-zinc-800">
                    ${item.autor}
                </div>
            </div>
        </div>
    `;
}

function carregarSecoes() {
    const render = (idContainer, dados, tag) => {
        const el = document.getElementById(idContainer);
        if (el) el.innerHTML = dados.map(item => criarCardHtml(item, tag)).join('');
    };

    render('grid-historia', dadosHistoria, 'História');
    render('grid-geografia', dadosGeografia, 'Geografia');
    render('grid-arte', dadosArte, 'Arte');
    render('grid-trabalhos', trabalhosAlunos, 'Trabalho de Aluno');
}

document.addEventListener('DOMContentLoaded', carregarSecoes);


// ==========================================
// 4. LIGHTBOX DOS CARDS E OBRAS
// ==========================================

function abrirLightbox(imgSrc, titulo, descDetalhada, autor, tag) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-title').textContent = titulo;
    document.getElementById('lightbox-desc').textContent = descDetalhada;
    document.getElementById('lightbox-autor').textContent = autor;
    document.getElementById('lightbox-tag').textContent = tag;

    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
    }, 300);
    document.body.style.overflow = 'auto';
}


// ==========================================
// 5. SALA VIRTUAL 3D REALISTA (COM ZOOM E MODAL)
// ==========================================

let cena, camera, renderizador, grupoQuadros, raycaster, mouse;
let interagindo = false;
let mouseX = 0, mouseY = 0, lon = 0, lat = 0, latOnDown = 0, lonOnDown = 0;
let startX = 0, startY = 0;
let animacaoId = null;

let anguloAlvoLon = null;
let anguloAlvoLat = null;
let fovAlvo = 75;

// --- FUNÇÕES DE CONTROLE DE ZOOM ---

/**
 * Controla o nível de zoom da sala 3D ajustando o FOV (Field of View) da câmera.
 * @param {number} delta - Quantidade a ser alterada (valores negativos aproximam, positivos afastam).
 */
function zoom(delta) {
    fovAlvo += delta;
    fovAlvo = Math.max(20, Math.min(85, fovAlvo));
}

function alterarZoom3D(delta) {
    zoom(delta);
}

function resetarZoom3D() {
    fovAlvo = 75;
}


// --- GERADORES PROCEDURAIS DE TEXTURA ---

function criarTexturaPisoProcedural() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2C1B10';
    ctx.fillRect(0, 0, 512, 512);

    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 32) {
        ctx.strokeStyle = '#180E08';
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();

        ctx.fillStyle = (i / 32) % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, i, 512, 32);
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    for (let j = 0; j < 30; j++) {
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(170, y + 5, 340, y - 5, 512, y);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    return texture;
}

function criarTexturaPlaca3D(titulo, autor, disciplina) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // Fundo Placa
    ctx.fillStyle = '#F5F0EB';
    ctx.fillRect(0, 0, 1024, 640);

    // Borda Dupla
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 984, 600);
    
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 952, 568);

    // Banner da Disciplina
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(60, 60, 904, 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold uppercase 38px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText((disciplina || 'TRABALHO').toUpperCase(), 90, 115);

    // Título da Obra
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 52px Georgia, serif';
    
    let txtTitulo = titulo;
    if (txtTitulo.length > 26) {
        txtTitulo = txtTitulo.substring(0, 24) + '...';
    }
    ctx.fillText(txtTitulo, 60, 220);

    // Linha Divisória
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 260);
    ctx.lineTo(964, 260);
    ctx.stroke();

    // Autor
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText('Autor(a): ' + autor, 60, 340);

    // Dica Visual de Zoom e Clique
    ctx.fillStyle = '#1C1917';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 4;
    ctx.fillRect(60, 420, 904, 140);
    ctx.strokeRect(60, 420, 904, 140);

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('🔍 Clique para expandir ou use o Scroll do mouse', 80, 505);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function criarTexturePlaceholder(titulo, disciplina) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#EFECE6';
    ctx.fillRect(0, 0, 512, 384);

    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, 480, 352);

    ctx.fillStyle = '#7A1C1C';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText((disciplina || 'EXPOSIÇÃO').toUpperCase(), 256, 150);

    ctx.fillStyle = '#3D2314';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText(titulo, 256, 200);

    ctx.fillStyle = '#8C6D23';
    ctx.font = '16px sans-serif';
    ctx.fillText('🎨 Carregando imagem...', 256, 260);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// --- INICIALIZAÇÃO DA SALA 3D ---

function initSala3D() {
    const container = document.getElementById('tour-canvas-container');
    if (!container) return;

    if (renderizador) {
        noRedimensionamento();
        return;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    cena = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(fovAlvo, container.clientWidth / container.clientHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    // ILUMINAÇÃO
    const luzAmbiente = new THREE.AmbientLight(0xFFFAF0, 1.3);
    cena.add(luzAmbiente);

    const luzHemisferica = new THREE.HemisphereLight(0xFFF8EE, 0x443322, 0.5);
    cena.add(luzHemisferica);

    // ESTRUTURA DA SALA
    const geoEsfera = new THREE.SphereGeometry(500, 60, 40);
    geoEsfera.scale(-1, 1, 1);
    const matParedes = new THREE.MeshStandardMaterial({ 
        color: 0xD8D3C8,
        roughness: 0.85,
        metalness: 0.05
    });
    const esferaFundo = new THREE.Mesh(geoEsfera, matParedes);
    cena.add(esferaFundo);

    // PISO
    const geoAnel = new THREE.CircleGeometry(440, 64);
    const matPiso = new THREE.MeshStandardMaterial({ 
        map: criarTexturaPisoProcedural(),
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide
    });
    const anelPiso = new THREE.Mesh(geoAnel, matPiso);
    anelPiso.rotation.x = Math.PI / 2;
    anelPiso.position.y = -180;
    cena.add(anelPiso);

    // RODAPÉ
    const geoRodape = new THREE.CylinderGeometry(438, 438, 12, 64, 1, true);
    const matRodape = new THREE.MeshStandardMaterial({ color: 0x2C1B10, roughness: 0.6 });
    const rodape = new THREE.Mesh(geoRodape, matRodape);
    rodape.position.y = -174;
    cena.add(rodape);

    // TETO DECORADO
    const grupoTeto = new THREE.Group();

    const geoForro = new THREE.CircleGeometry(440, 64);
    const matForro = new THREE.MeshStandardMaterial({ 
        color: 0xEDE8DF, 
        roughness: 0.9, 
        side: THREE.DoubleSide 
    });
    const meshForro = new THREE.Mesh(geoForro, matForro);
    meshForro.rotation.x = Math.PI / 2;
    meshForro.position.y = 180;
    grupoTeto.add(meshForro);

    const geoSancaGesso = new THREE.CylinderGeometry(438, 438, 14, 64, 1, true);
    const matSancaGesso = new THREE.MeshStandardMaterial({ color: 0xD8D3C8, roughness: 0.8 });
    const sancaGesso = new THREE.Mesh(geoSancaGesso, matSancaGesso);
    sancaGesso.position.y = 173;
    grupoTeto.add(sancaGesso);

    const geoFrisoOuro = new THREE.TorusGeometry(436, 3, 16, 64);
    const matFrisoOuro = new THREE.MeshStandardMaterial({ color: 0xC59B27, metalness: 0.6, roughness: 0.4 });
    const frisoOuro = new THREE.Mesh(geoFrisoOuro, matFrisoOuro);
    frisoOuro.rotation.x = Math.PI / 2;
    frisoOuro.position.y = 178;
    grupoTeto.add(frisoOuro);

    const aneisRosacea = [
        { rInt: 0, rExt: 110, cor: 0xE2DDD5, roughness: 0.85 },
        { rInt: 110, rExt: 125, cor: 0xC59B27, metalness: 0.6, roughness: 0.4 },
        { rInt: 125, rExt: 170, cor: 0x7A1C1C, roughness: 0.8 },
        { rInt: 170, rExt: 185, cor: 0xC59B27, metalness: 0.6, roughness: 0.4 }
    ];

    aneisRosacea.forEach(anel => {
        const geoAnel = new THREE.RingGeometry(anel.rInt, anel.rExt, 64);
        const matAnel = new THREE.MeshStandardMaterial({ 
            color: anel.cor, 
            metalness: anel.metalness || 0, 
            roughness: anel.roughness || 0.8,
            side: THREE.DoubleSide
        });
        const meshAnel = new THREE.Mesh(geoAnel, matAnel);
        meshAnel.rotation.x = Math.PI / 2;
        meshAnel.position.y = 179.2;
        grupoTeto.add(meshAnel);
    });

    const geoDomo = new THREE.SphereGeometry(35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const matDomo = new THREE.MeshStandardMaterial({ 
        color: 0xFFFDF7, 
        emissive: 0xFFE0B2, 
        emissiveIntensity: 0.3, 
        roughness: 0.4,
        side: THREE.BackSide
    });
    const meshDomo = new THREE.Mesh(geoDomo, matDomo);
    meshDomo.position.y = 180;
    grupoTeto.add(meshDomo);

    cena.add(grupoTeto);

    // GRUPO DAS OBRAS
    grupoQuadros = new THREE.Group();
    cena.add(grupoQuadros);

    // RENDERIZADOR
    renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.0;
    container.appendChild(renderizador.domElement);

    // CONTROLES DE INTERAÇÃO
    container.addEventListener('mousedown', (e) => {
        interagindo = true;
        mouseX = e.clientX; mouseY = e.clientY;
        startX = e.clientX; startY = e.clientY;
        lonOnDown = lon; latOnDown = lat;
        anguloAlvoLon = null;
        anguloAlvoLat = null;
    });

    container.addEventListener('mousemove', (e) => {
        if (interagindo) {
            lon = (mouseX - e.clientX) * 0.15 + lonOnDown;
            lat = (e.clientY - mouseY) * 0.15 + latOnDown;
        } else {
            verificarHoverObra(e);
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (interagindo) {
            interagindo = false;
            const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
            if (dist < 6) {
                checarCliqueObra(e);
            }
        }
    });

    // EVENTO DE ZOOM VIA SCROLL DO MOUSE
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const fatorSensibilidade = 0.04;
        zoom(e.deltaY * fatorSensibilidade);
    }, { passive: false });

    window.addEventListener('resize', noRedimensionamento);

    montarObrasEPlacas3D();
}

/**
 * Monta as obras e as placas 3D
 */
function montarObrasEPlacas3D() {
    while (grupoQuadros.children.length > 0) grupoQuadros.remove(grupoQuadros.children[0]);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    trabalhosAlunos.forEach(item => {
        const grupoArte = new THREE.Group();

        let larguraTela = 110;
        let alturaTela = 80;

        // MOLDURA DO QUADRO
        const geoMoldura = new THREE.BoxGeometry(larguraTela + 12, alturaTela + 12, 5);
        const matMoldura = new THREE.MeshStandardMaterial({ 
            color: 0xC59B27,
            metalness: 0.6,
            roughness: 0.4
        });
        const meshMoldura = new THREE.Mesh(geoMoldura, matMoldura);

        // TELA DA PINTURA
        const geoTela = new THREE.PlaneGeometry(larguraTela, alturaTela);
        const matTela = new THREE.MeshStandardMaterial({ 
            map: criarTexturePlaceholder(item.titulo, item.disciplina),
            roughness: 1.0,
            metalness: 0.0,
            side: THREE.DoubleSide 
        });
        const meshTela = new THREE.Mesh(geoTela, matTela);
        meshTela.position.z = 3.0;

        // PLACA INFORMATIVA 3D
        const larguraPlaca = 55;
        const alturaPlaca = 35;
        const geoPlaca = new THREE.PlaneGeometry(larguraPlaca, alturaPlaca);
        
        const matPlaca = new THREE.MeshStandardMaterial({ 
            map: criarTexturaPlaca3D(item.titulo, item.autor, item.disciplina),
            roughness: 0.2,
            metalness: 0.0,
            emissive: 0x555555,
            side: THREE.DoubleSide 
        });
        
        const meshPlaca = new THREE.Mesh(geoPlaca, matPlaca);
        meshPlaca.position.set((larguraTela / 2) + (larguraPlaca / 2) + 10, -15, 2.0);

        // Atribuição de dados
        meshMoldura.userData = item;
        meshTela.userData = item;
        meshPlaca.userData = item;
        grupoArte.userData = item;

        grupoArte.add(meshMoldura);
        grupoArte.add(meshTela);
        grupoArte.add(meshPlaca);

        // POSICIONAMENTO CIRCULAR
        const raio = 425;
        const phi = THREE.MathUtils.degToRad(90 - item.lat);
        const theta = THREE.MathUtils.degToRad(item.lon);

        grupoArte.position.x = raio * Math.sin(phi) * Math.cos(theta);
        grupoArte.position.y = raio * Math.cos(phi);
        grupoArte.position.z = raio * Math.sin(phi) * Math.sin(theta);

        grupoArte.lookAt(0, 0, 0);
        grupoQuadros.add(grupoArte);

        // CARREGAMENTO DA IMAGEM
        loader.load(item.imagem, (tex) => {
            const aspect = tex.image.width / tex.image.height;
            let novaAltura = larguraTela / aspect;
            if (novaAltura > 120) novaAltura = 120;

            meshTela.scale.set(1, novaAltura / alturaTela, 1);
            meshMoldura.scale.set(1, (novaAltura + 12) / (alturaTela + 12), 1);
            
            matTela.map = tex;
            matTela.needsUpdate = true;
        });
    });
}

function checarCliqueObra(e) {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !grupoQuadros) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(grupoQuadros.children, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        
        if (data && data.titulo) {
            // 1. Aproxima o Zoom e centraliza a câmera na obra clicada no 3D
            fovAlvo = 35;
            
            let diffLon = (data.lon - lon) % 360;
            if (diffLon > 180) diffLon -= 360;
            if (diffLon < -180) diffLon += 360;

            anguloAlvoLon = lon + diffLon;
            anguloAlvoLat = data.lat;

            // 2. Abre a janela informativa (Lightbox/Modal) com as informações da obra
            abrirLightbox(
                data.imagem,
                data.titulo,
                data.descricaoDetalhada || data.descricao,
                data.autor,
                data.disciplina || 'Trabalho de Aluno'
            );
        }
    }
}

function verificarHoverObra(e) {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !grupoQuadros) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(grupoQuadros.children, true);

    if (intersects.length > 0) {
        container.style.cursor = 'pointer';
    } else {
        container.style.cursor = 'grab';
    }
}

function encontrarObraMaisProxima() {
    let lonAtual = ((lon % 360) + 360) % 360;
    let obraMaisProxima = null;
    let menorDiferenca = Infinity;

    trabalhosAlunos.forEach(obra => {
        let lonObra = ((obra.lon % 360) + 360) % 360;
        let diff = Math.abs(lonAtual - lonObra);
        if (diff > 180) diff = 360 - diff;

        if (diff < menorDiferenca) {
            menorDiferenca = diff;
            obraMaisProxima = obra;
        }
    });

    return obraMaisProxima;
}

function focarObraMaisProxima() {
    const obra = encontrarObraMaisProxima();
    if (!obra) return;

    let diffLon = (obra.lon - lon) % 360;
    if (diffLon > 180) diffLon -= 360;
    if (diffLon < -180) diffLon += 360;

    anguloAlvoLon = lon + diffLon;
    anguloAlvoLat = obra.lat;
    fovAlvo = 35;
}

function noRedimensionamento() {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !renderizador) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(container.clientWidth, container.clientHeight);
}

function animar3D() {
    animacaoId = requestAnimationFrame(animar3D);

    // Interpolação suave do Zoom
    if (Math.abs(camera.fov - fovAlvo) > 0.05) {
        camera.fov += (fovAlvo - camera.fov) * 0.1;
        camera.updateProjectionMatrix();
    }

    // Interpolação suave de rotação da câmera
    if (anguloAlvoLon !== null && anguloAlvoLat !== null) {
        lon += (anguloAlvoLon - lon) * 0.08;
        lat += (anguloAlvoLat - lat) * 0.08;

        if (Math.abs(anguloAlvoLon - lon) < 0.1 && Math.abs(anguloAlvoLat - lat) < 0.1) {
            lon = anguloAlvoLon;
            lat = anguloAlvoLat;
            anguloAlvoLon = null;
            anguloAlvoLat = null;
        }
    } else if (!interagindo) {
        lon += 0.03; // Rotação panorâmica lenta automática
    }

    lat = Math.max(-85, Math.min(85, lat));
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);
    renderizador.render(cena, camera);
}

function abrirTourVirtual() {
    const modal = document.getElementById('tour-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        initSala3D();
        noRedimensionamento();
        if (!animacaoId) animar3D();
    }, 50);

    document.body.style.overflow = 'hidden';
}

function fecharTourVirtual() {
    const modal = document.getElementById('tour-modal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        if (animacaoId) {
            cancelAnimationFrame(animacaoId);
            animacaoId = null;
        }
    }, 300);

    document.body.style.overflow = 'auto';
}
