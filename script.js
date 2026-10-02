/**
 * ===================================================================
 * MUSEU DIGITAL DO PARANÁ - SCRIPT PRINCIPAL E INTERATIVIDADE
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
// UTILITÁRIO: LIMPEZA DE MEMÓRIA THREE.JS
// ==========================================
function descarteMaterial(mat) {
    if (!mat) return;
    if (mat.map) mat.map.dispose();
    if (mat.lightMap) mat.lightMap.dispose();
    if (mat.bumpMap) mat.bumpMap.dispose();
    if (mat.normalMap) mat.normalMap.dispose();
    if (mat.specularMap) mat.specularMap.dispose();
    if (mat.envMap) mat.envMap.dispose();
    mat.dispose();
}

function limparRecursos3D(objeto) {
    if (!objeto) return;
    objeto.traverse((child) => {
        if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => descarteMaterial(mat));
                } else {
                    descarteMaterial(child.material);
                }
            }
        }
    });
    while (objeto.children.length > 0) {
        objeto.remove(objeto.children[0]);
    }
}

// ==========================================
// 2. BANCO DE DADOS DA EXPOSIÇÃO
// ==========================================

const dadosHistoria = [
    {
        titulo: "Cerco da Lapa",
        descricao: "Jornal do dia 16 de Fevereiro de 1894.",
        descricaoDetalhada: "Essa é uma representação de jornal da época da revolução federalista, que retrata informações sobre a história e acontecimentos do Cerco da Lapa.",
        imagens: [
            "cerco da lapa-michel (1).webp", "cerco da lapa-michel (2).webp"
        ],
        autor: "Luiza, Maisa e Rafael Huber."
    },
    {
        titulo: "Barão do Cerro Azul",
        descricao: "Jornal do dia 20 de maio de 1894.",
        descricaoDetalhada: "Essa é uma representação de jornal da época da revolução federalista, que retrata informações sobre a história e vida de Ildefonso Pereira Correia, o Barão do Cerro Azul.",
        imagens: [
            "jornal barão do serro azul-michel (1).webp", "jornal barão do serro azul-michel (2).webp"
        ],
        autor: "Pesquisa Escolar"
    },
    {
        titulo: "Guerra do Contestado",
        descricao: "Slide sobre os principais acontecimentos e contextualização desse evento tão importante para o povo Paranaense.",
        descricaoDetalhada: "Esta proposta de pesquisa traz para nós uma breve volta ao passado e aos conflitos que moldaram a nossa sociedade e o povo Paranaense.",
        imagens: [
            "contestado (1).webp", "contestado (2).webp", "contestado (3).webp",
            "contestado (4).webp", "contestado (5).webp", "contestado (6).webp",
            "contestado (8).webp", "contestado (9).webp",
            "contestado (10).webp", "contestado (11).webp"
        ],
        autor: "Ana T., Henry Frescura e Daniel Rossoni."
    }, 
    {
        titulo: "Indústrias Paranaenses",
        descricao: "Industrialização do Estado do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer informações sobre o desenvolvimento industrial do Paraná.",
        imagens: [
            "industrias paranaenses-michel (1).webp", "industrias paranaenses-michel (2).webp",
            "industrias paranaenses-michel (3).webp", "industrias paranaenses-michel (4).webp",
            "industrias paranaenses-michel (5).webp", "industrias paranaenses-michel (6).webp",
            "industrias paranaenses-michel (7).webp", "industrias paranaenses-michel (8).webp",
            "industrias paranaenses-michel (9).webp", "industrias paranaenses-michel (10).webp",
            "industrias paranaenses-michel (11).webp", "industrias paranaenses-michel (12).webp",
            "industrias paranaenses-michel (13).webp", "industrias paranaenses-michel (14).webp"
        ],
        autor: "Tayane Zamperon, Victor Stoll e Danilo Panzenhagen."
    },
    {
        titulo: "Oeste e Sudoeste Paranaense",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "oeste e sudoeste-michel (1).webp", "oeste e sudoeste-michel (2).webp",
            "oeste e sudoeste-michel (3).webp", "oeste e sudoeste-michel (4).webp",
            "oeste e sudoeste-michel (5).webp", "oeste e sudoeste-michel (6).webp",
            "oeste e sudoeste-michel (7).webp", "oeste e sudoeste-michel (8).webp",
            "oeste e sudoeste-michel (9).webp", "oeste e sudoeste-michel (10).webp",
            "oeste e sudoeste-michel (11).webp", "oeste e sudoeste-michel (12).webp",
            "oeste e sudoeste-michel (13).webp", "oeste e sudoeste-michel (14).webp",
            "oeste e sudoeste-michel (15).webp", "oeste e sudoeste-michel (16).webp",
            "oeste e sudoeste-michel (17).webp", "oeste e sudoeste-michel (18).webp",
            "oeste e sudoeste-michel (19).webp"
        ],
        autor: "Tayane Zamperon, Victor Stoll e Danilo Panzenhagen."
    },
    {
        titulo: "Campos Gerais e Centro Oriental Paranaense",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "campos gerais e centro oriental-michel (1).webp", "campos gerais e centro oriental-michel (2).webp",
            "campos gerais e centro oriental-michel (3).webp", "campos gerais e centro oriental-michel (4).webp",
            "campos gerais e centro oriental-michel (5).webp", "campos gerais e centro oriental-michel (6).webp",
            "campos gerais e centro oriental-michel (7).webp", "campos gerais e centro oriental-michel (8).webp",
            "campos gerais e centro oriental-michel (9).webp", "campos gerais e centro oriental-michel (10).webp",
            "campos gerais e centro oriental-michel (11).webp", "campos gerais e centro oriental-michel (12).webp",
            "campos gerais e centro oriental-michel (13).webp", "campos gerais e centro oriental-michel (14).webp",
            "campos gerais e centro oriental-michel (15).webp", "campos gerais e centro oriental-michel (16).webp",
            "campos gerais e centro oriental-michel (17).webp", "campos gerais e centro oriental-michel (18).webp"
        ],
        autor: "Luiza Binsfiel, Maisa Constantino e Rafael Huber."
    },
    {
        titulo: "Sul e Centro Sul Paranaense",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "Sul e centro-sul-michel (1).webp", "Sul e centro-sul-michel (2).webp",
            "Sul e centro-sul-michel (3).webp", "Sul e centro-sul-michel (4).webp",
            "Sul e centro-sul-michel (5).webp", "Sul e centro-sul-michel (6).webp",
            "Sul e centro-sul-michel (7).webp", "Sul e centro-sul-michel (8).webp",
            "Sul e centro-sul-michel (9).webp", "Sul e centro-sul-michel (10).webp",
            "Sul e centro-sul-michel (11).webp", "Sul e centro-sul-michel (12).webp",
            "Sul e centro-sul-michel (13).webp", "Sul e centro-sul-michel (14).webp",
            "Sul e centro-sul-michel (15).webp", "Sul e centro-sul-michel (16).webp",
            "Sul e centro-sul-michel (17).webp"
        ],
        autor: "Pedro, Pyetro e Sthefanny."
    },
    {
        titulo: "Região Metropolitana de Curitiba e Litoral Paranaense",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "rmc e litoral-michel (1).webp", 
            "rmc e litoral-michel (3).webp", 
            "rmc e litoral-michel (4).webp",
            "rmc e litoral-michel (5).webp", 
            "rmc e litoral-michel (6).webp",
            "rmc e litoral-michel (7).webp", 
            "rmc e litoral-michel (8).webp",
            "rmc e litoral-michel (9).webp", 
            "rmc e litoral-michel (10).webp",
            "rmc e litoral-michel (11).webp", 
            "rmc e litoral-michel (17).webp",
            "rmc e litoral-michel (14).webp",
            "rmc e litoral-michel (12).webp",
            "rmc e litoral-michel (13).webp", 
            "rmc e litoral-michel (15).webp", 
            "rmc e litoral-michel (16).webp",
        ],
        autor: "Sabrina Kunzel, Eduardo Panzenhagen e Rafael Frasson."
    }
];

const dadosGeografia = [
    {
        titulo: "Paraná: um mosaico de culturas e tradições",
        descricao: "Estudo sobre a orografia, a Serra do Mar e os três planaltos paranaenses.",
        descricaoDetalhada: "O Paraná é marcado pela diversidade de povos, paisagens, costumes e manifestações culturais. Sua identidade foi construída pela presença dos povos indígenas e pela chegada de diferentes grupos de imigrantes, que contribuíram para os modos de viver, as festas, a culinária, a música e as tradições presentes em todo o estado. De suas paisagens naturais às manifestações culturais, o Paraná reúne diferentes histórias que formam uma identidade rica e plural.",
        imagens: [
            "mariana mapa parana 1.webp",
            "mariana mapa parana 2.webp",
            "mariana mapa parana 3.webp"
        ],
        autor: "Pesquisa de Geografia"
    }
];

const dadosArte = [
    {
        titulo: "Primeiras Artes Artistas: Região Metropolitana e Litoral",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Literal e Região Metropolitana - Artes e artistas (1).webp",
            "Literal e Região Metropolitana - Artes e artistas (2).webp",
            "Literal e Região Metropolitana - Artes e artistas (3).webp",
            "Literal e Região Metropolitana - Artes e artistas (4).webp",
            "Literal e Região Metropolitana - Artes e artistas (5).webp",
            "Literal e Região Metropolitana - Artes e artistas (6).webp",
            "Literal e Região Metropolitana - Artes e artistas (7).webp",
            "Literal e Região Metropolitana - Artes e artistas (8).webp",
            "Literal e Região Metropolitana - Artes e artistas (9).webp",
            "Literal e Região Metropolitana - Artes e artistas (10).webp"
        ],
        autor: "Sabrina, Eduardo e Rafael."
    },
    {
        titulo: "Artes e artistas: Oeste e Sudoeste Paranaense",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Oeste e Sudoeste Paranaense - Artes e artistas (1).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (2).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (3).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (4).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (5).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (6).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (7).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (8).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (9).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (10).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (11).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (12).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (13).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (14).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (15).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (16).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (17).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (18).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (19).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (20).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (21).webp",
            "Oeste e Sudoeste Paranaense - Artes e artistas (22).webp"
        ],
        autor: "Tayane, Victor e Danilo"
    },
    {
        titulo: "Artes e Artistas: Região Centro Oriental e Campos Gerais",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (1).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (2).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (3).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (4).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (5).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (6).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (7).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (8).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (9).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (10).webp",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas (12).webp"
        ],
        autor: "Maisa, Rafael H. e Luiza."
    },
    {
        titulo: "Artes e artistas: Sul e Centro-sul",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Sul e Centro-sul - Artes e artistas (1).webp",
            "Sul e Centro-sul - Artes e artistas (2).webp",
            "Sul e Centro-sul - Artes e artistas (3).webp",
            "Sul e Centro-sul - Artes e artistas (4).webp",
            "Sul e Centro-sul - Artes e artistas (5).webp",
            "Sul e Centro-sul - Artes e artistas (6).webp",
            "Sul e Centro-sul - Artes e artistas (7).webp",
            "Sul e Centro-sul - Artes e artistas (8).webp",
            "Sul e Centro-sul - Artes e artistas (9).webp",
            "Sul e Centro-sul - Artes e artistas (10).webp"
        ],
        autor: "Pedro, Pyetro e Sthefanny."
    }
];

const trabalhosAlunos = [
    {
        id: 't1',
        titulo: 'As regiões Oeste e Sudoeste em traços e cores',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Os alunos analisaram as características e particularidades culturais, históricas e geográficas de cada região do Paraná, influenciados pelos principais artistas plásticos paranaenses.',
        autor: 'Tayane, Victor e Danilo.',
        disciplina: 'Arte / História / Geografia.',
        imagem: 'As regiões Oeste e Sudoeste em traços e cores_.webp',
        lon: 0, lat: 0
    },
    {
        id: 't2',
        titulo: 'As araucárias',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Victor',
        disciplina: 'Arte',
        imagem: 'As araucárias - Victor_.webp',
        lon: 36, lat: 0
    },
    {
        id: 't3',
        titulo: 'Do litoral à metrópole',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Produziram retratos utilizando bases e riscadores alternativos.',
        autor: 'Trabalho Coletivo (Sabrina, Rafael e Eduardo)',
        disciplina: 'Arte / História / Geografia.',
        imagem: 'Do litoral à metrópole_.webp',
        lon: 72, lat: 0
    },
    {
        id: 't4',
        titulo: 'Infância na lavoura',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Luiza',
        disciplina: 'Arte',
        imagem: 'IMG_20260903_102822.webp',
        lon: 108, lat: 0
    },
    {
        id: 't5',
        titulo: 'O cafezal',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais e papel machê.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais e papel machê para moldura.',
        autor: 'Pyetro',
        disciplina: 'Artes',
        imagem: 'O Cafezal - Pyetro.webp',
        lon: 144, lat: 0
    },
    {
        id: 't6',
        titulo: 'Costumes e tradições',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Eduardo',
        disciplina: 'Arte',
        imagem: 'IMG_20260903_102805.webp',
        lon: 180, lat: 0
    },
    {
        id: 't7',
        titulo: 'Mateando ao sol',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com pigmentos naturais.',
        autor: 'Rafael Huber',
        disciplina: 'Arte',
        imagem: 'IMG_20260902_083851.webp',
        lon: 216, lat: 0
    },
    {
        id: 't8',
        titulo: 'Tradição entre Araucárias',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Sabrina',
        disciplina: 'Arte',
        imagem: 'IMG_20260902_083837.webp',
        lon: 252, lat: 0
    },
    {
        id: 't9',
        titulo: 'Amanhecer',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Danilo',
        disciplina: 'Arte',
        imagem: 'IMG_20260902_083827.webp',
        lon: 288, lat: 0
    },
    {
        id: 't10',
        titulo: 'Um olhar sobre os Campos gerais paranaenses',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Os alunos analisaram as características e particularidades culturais das regiões do Paraná.',
        autor: 'Trabalho Coletivo (Luiza, Rafael H. e Maisa)',
        disciplina: 'História / Arte / Geografia',
        imagem: 'Um olhar sobre os Campos gerais paranaenses_.webp',
        lon: 324, lat: 0
    },
    {
        id: 't11',
        titulo: 'Café nacional',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Sthefanny',
        disciplina: 'Arte',
        imagem: 'IMG20260902114137.webp',
        lon: 288, lat: 0
    },
    {
        id: 't12',
        titulo: 'Preservando a tradição',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Rafael Frasson',
        disciplina: 'Arte',
        imagem: 'IMG20260902082909.webp',
        lon: 288, lat: 0
    },
    {
        id: 't13',
        titulo: 'O chimarrão',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Maisa',
        disciplina: 'Arte',
        imagem: 'IMG20260902082805.webp',
        lon: 288, lat: 0
    },
    {
        id: 't14',
        titulo: 'Peroba: Texturas do tempo',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses. Elementos básicos da arte.',
        autor: 'Professora Ingridi',
        disciplina: 'Arte',
        imagem: 'IMG20260824110034.webp',
        lon: 288, lat: 0
    },
    {
        id: 't15',
        titulo: 'Campo de araucárias',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        autor: 'Trabalho Coletivo (Pedro, Pyetro e Sthefanny)',
        disciplina: 'Arte',
        imagem: 'Campo de araucárias_.webp',
        lon: 288, lat: 0
    }
];

const obrasCafe = [
    {
        id: 'c1',
        titulo: 'Uma história curiosa sobre o café',
        descricao: 'Estudo em pintura sobre a expansão cafeeira no Norte do Paraná.',
        descricaoDetalhada: 'Uma antiga lenda conta que um pastor teria percebido os efeitos dos frutos do café ao observar o comportamento animado de suas cabras. A história ajuda a explicar como o café passou a ser associado à energia e à disposição.',
        autor: 'Geografia',
        disciplina: 'Geografia',
        imagem: 'Mariana 1.webp'
    },
    {
        id: 'c2',
        titulo: 'Traços e Cores do Sudoeste',
        descricao: 'Expressão visual das paisagens cafeeiras e agrícolas.',
        descricaoDetalhada: 'Nos anos 50 e 60, o café se tornou a alma do Noroeste do Paraná. A terra fértil e o clima favorável atraíram milhares de famílias.',
        autor: 'Post de Campo Mourão D',
        disciplina: 'Arte',
        imagem: 'marina5.webp'
    },
    {
        id: 'c3',
        titulo: 'O café e a identidade do Norte do Paraná',
        descricao: 'Integração da flora nativa com a cultura cafeeira.',
        descricaoDetalhada: 'O café foi muito mais que um produto agrícola: ajudou a transformar paisagens, comunidades e modos de vida no Paraná.',
        autor: 'Geografia',
        disciplina: 'Geografia',
        imagem: 'Mariana 3.webp'
    },
    {
        id: 'c4',
        titulo: 'Do Litoral à Metrópole',
        descricao: 'Rota de escoamento do café ao Porto de Paranaguá.',
        descricaoDetalhada: 'Em meio ao cafezal, no município de Tomazina, lembra-se das tristes cenas da grande geada de 1975.',
        autor: 'Acervo Museu Histórico',
        disciplina: 'História',
        imagem: 'mariana 6.webp'
    },
    {
        id: 'c5',
        titulo: 'As mudanças no campo',
        descricao: 'Retrato do cotidiano rural nas plantações históricas.',
        descricaoDetalhada: 'A história do café também revela como a agricultura se adapta às condições econômicas, ambientais e às transformações no território.',
        autor: 'Geografia',
        disciplina: 'Geografia',
        imagem: 'Mariana 2.webp'
    },
    {
        id: 'c6',
        titulo: 'Costumes e Tradições',
        descricao: 'A vida no campo e a convivência nas fazendas de café.',
        descricaoDetalhada: 'O Norte do Paraná é a principal região produtora de café no Estado, produzindo grãos premiados internacionalmente.',
        autor: 'Foto: Feito no Paraná/divulgação',
        disciplina: 'Arte',
        imagem: 'mariana7.webp'
    },
    {
        id: 'c7',
        titulo: 'Um período de grande expansão',
        descricao: 'Pigmentação natural derivada dos próprios grãos de café.',
        descricaoDetalhada: 'A cafeicultura viveu um momento de forte crescimento e deixou marcas importantes na economia e na ocupação do território paranaense.',
        autor: 'Geografia',
        disciplina: 'Geografia',
        imagem: 'Mariana 4.webp'
    },
    {
        id: 'c8',
        titulo: 'Café do Norte Pioneiro',
        descricao: 'Combinação da madeira das tulhas com elementos da natureza.',
        descricaoDetalhada: 'O Café do Norte Pioneiro obteve o registro de Indicação Geográfica (IG) pelo INPI.',
        autor: 'AEN',
        disciplina: 'Arte',
        imagem: 'mariana8.webp'
    }
];

// ==========================================
// 3. MOTOR DO LIVRO INTERATIVO (COM GESTOS SWIPE)
// ==========================================
const colecaoLivros = {
    livro1: {
        titulo: "Da Folha Ao Mate",
        subtitulo: "A erva-mate faz parte da história e da identidade cultural do Paraná. Presente nos costumes de diferentes comunidades, o mate representa muito mais do que uma bebida.",
        iconeCapa: "📜",
        dados: [
            { capitulo: "Capítulo I", paginaEsq: "Pág. 02", paginaDir: "Pág. 03", titulo: "A Orografia e os Três Planaltos", imagemEsq: "STHEFANNY TONETO-1 ANO (2).webp", imagemDir: "STHEFANNY TONETO-1 ANO (3).webp" },
            { capitulo: "Capítulo II", paginaEsq: "Pág. 04", paginaDir: "Pág. 05", titulo: "Clima e Vegetação", imagemEsq: "STHEFANNY TONETO-1 ANO (4).webp", imagemDir: "STHEFANNY TONETO-1 ANO (5).webp" },
            { capitulo: "Capítulo III", paginaEsq: "Pág. 06", paginaDir: "Pág. 07", titulo: "Solos e Agricultura", imagemEsq: "STHEFANNY TONETO-1 ANO (5).webp", imagemDir: "STHEFANNY TONETO-1 ANO (6).webp" },
            { capitulo: "Capítulo IV", paginaEsq: "Pág. 08", paginaDir: "Pág. 09", titulo: "A Colheita e Processamento", imagemEsq: "STHEFANNY TONETO-1 ANO (7).webp", imagemDir: "STHEFANNY TONETO-1 ANO (8).webp" },
            { capitulo: "Capítulo V", paginaEsq: "Pág. 10", paginaDir: "Pág. 11", titulo: "Tradição e Identidade", imagemEsq: "STHEFANNY TONETO-1 ANO (9).webp", imagemDir: "STHEFANNY TONETO-1 ANO (10).webp" }
        ]
    },
    livro2: {
        titulo: "Da Folha Ao Mate",
        subtitulo: "A erva-mate faz parte da história e da identidade cultural do Paraná. Presente nos costumes de diferentes comunidades, o mate representa muito mais do que uma bebida.",
        iconeCapa: "📕",
        dados: [
            { capitulo: "Capítulo I", paginaEsq: "Pág. 02", paginaDir: "Pág. 03", titulo: "Registros de Povoamento", imagemEsq: "TAYANE ZAMPERON-1 ANO (1).webp", imagemDir: "TAYANE ZAMPERON-1 ANO (2).webp" },
            { capitulo: "Capítulo II", paginaEsq: "Pág. 04", paginaDir: "Pág. 05", titulo: "Pioneiros e Imigração", imagemEsq: "TAYANE ZAMPERON-1 ANO (3).webp", imagemDir: "TAYANE ZAMPERON-1 ANO (4).webp" },
            { capitulo: "Capítulo III", paginaEsq: "Pág. 06", paginaDir: "Pág. 07", titulo: "Tropas e Caminhos", imagemEsq: "TAYANE ZAMPERON-1 ANO (5).webp", imagemDir: "TAYANE ZAMPERON-1 ANO (6).webp" },
            { capitulo: "Capítulo IV", paginaEsq: "Pág. 08", paginaDir: "Pág. 09", titulo: "Engenhos e Produção", imagemEsq: "TAYANE ZAMPERON-1 ANO (7).webp", imagemDir: "TAYANE ZAMPERON-1 ANO (8).webp" },
            { capitulo: "Capítulo V", paginaEsq: "Pág. 10", paginaDir: "Pág. 11", titulo: "Legado Cultural", imagemEsq: "TAYANE ZAMPERON-1 ANO (9).webp", imagemDir: "TAYANE ZAMPERON-1 ANO (10).webp" }
        ]
    }
};

let livroChaveAtual = 'livro1';
let paginaLivroAtual = -1; // -1 = Capa Fechada
let audioAtivo = false;

function obterLivroAtual() {
    return colecaoLivros[livroChaveAtual] || colecaoLivros['livro1'];
}

function atualizarIndicadoresLivro() {
    const livroObj = obterLivroAtual();
    const listaDados = livroObj.dados || [];

    const textIndicador = document.getElementById('pageIndicatorText');
    const iconIndicador = document.getElementById('pageIndicatorIcon');
    const hintText = document.getElementById('hintText');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    if (paginaLivroAtual === -1) {
        if (textIndicador) textIndicador.textContent = "Capa Fechada";
        if (iconIndicador) iconIndicador.textContent = "📕";
        if (hintText) hintText.textContent = "Clique na capa, use o botão ou deslize para abrir o livro.";
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = false;
    } else {
        if (textIndicador) textIndicador.textContent = `Página ${paginaLivroAtual + 1} de ${listaDados.length}`;
        if (iconIndicador) iconIndicador.textContent = "📖";
        if (hintText) hintText.textContent = `Visualizando página ${paginaLivroAtual + 1} de ${listaDados.length}`;
        if (btnPrev) btnPrev.disabled = false;
        if (btnNext) btnNext.disabled = (paginaLivroAtual === listaDados.length - 1);
    }
}

function renderizarPaginaLivro() {
    const livroObj = obterLivroAtual();
    const listaDados = livroObj.dados || [];

    const pagEsq = document.getElementById('livro-pagina-esq');
    const pagDir = document.getElementById('livro-pagina-dir');
    const container = document.getElementById('livro-container');

    if (!pagEsq || !pagDir) return;

    // Efeito visual de virada de página
    if (container) {
        container.classList.remove('animar-virada');
        void container.offsetWidth; // Trigger reflow
        container.classList.add('animar-virada');
    }

    // RENDERIZAR CAPA FECHADA (paginaLivroAtual === -1)
    if (paginaLivroAtual === -1) {
        pagEsq.innerHTML = `
            <div class="flex-1 flex flex-col justify-center items-center h-full w-full bg-[#2A160A] text-[#C59B27] p-4 sm:p-6 rounded-l-lg border-r-2 border-[#C59B27]/40 shadow-inner select-none cursor-pointer hover:bg-[#321B0C] transition group min-h-[200px]" onclick="goToSpread(0)">
                <div class="text-center space-y-3 sm:space-y-4 my-auto w-full max-w-xs border border-[#C59B27]/30 p-4 sm:p-6 rounded-xl bg-[#1F0E05]/60 shadow-xl">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#7A1C1C] border-2 border-[#C59B27] flex items-center justify-center text-2xl sm:text-3xl shadow-xl group-hover:scale-105 transition-transform">
                        🏛️
                    </div>
                    <div>
                        <h3 class="font-serif font-bold text-xs sm:text-sm text-[#FAF8F5] tracking-wider uppercase">
                            Museu Digital do Paraná
                        </h3>
                        <p class="font-serif italic text-[10px] sm:text-[11px] text-amber-200/70 mt-1">
                            Projeto Pedagógico Interdisciplinar
                        </p>
                    </div>
                    <div class="w-12 sm:w-16 h-0.5 bg-[#C59B27] mx-auto opacity-50"></div>
                    <p class="font-serif text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest">
                        Edição Interativa
                    </p>
                </div>
            </div>
        `;

        pagDir.innerHTML = `
            <div class="flex-1 flex flex-col justify-between items-center h-full w-full bg-[#3D2314] text-[#C59B27] p-4 sm:p-6 md:p-8 rounded-r-lg border-2 border-[#C59B27]/80 shadow-2xl select-none cursor-pointer hover:bg-[#482a18] transition group min-h-[260px]" onclick="goToSpread(0)">
                <div class="text-center space-y-3 sm:space-y-5 my-auto w-full max-w-sm border-2 border-[#C59B27]/60 p-4 sm:p-6 md:p-8 rounded-xl bg-[#2A160A]/90 shadow-2xl backdrop-blur-sm">
                    <div class="text-4xl sm:text-5xl md:text-6xl mb-1 transition-transform duration-300 group-hover:scale-110">
                        ${livroObj.iconeCapa || '📜'}
                    </div>
                    <h2 class="font-serif font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#FAF8F5] tracking-wide leading-tight drop-shadow-md">
                        ${livroObj.titulo}
                    </h2>
                    <div class="w-16 sm:w-20 h-1 bg-[#C59B27] mx-auto rounded-full"></div>
                    <p class="font-serif italic text-xs md:text-sm text-amber-200/90 font-medium line-clamp-4">
                        ${livroObj.subtitulo}
                    </p>
                    
                    <div class="pt-2 sm:pt-3">
                        <span class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#C59B27] hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs md:text-sm rounded-full shadow-xl transition-all border border-amber-200 group-hover:scale-105">
                            📖 Clique na Capa para Abrir
                        </span>
                    </div>
                </div>
            </div>
        `;

        atualizarIndicadoresLivro();
        return;
    }

    // RENDERIZAR PÁGINAS DO LIVRO (paginaLivroAtual >= 0)
    const item = listaDados[paginaLivroAtual];
    if (!item) return;

    const imgEsq = item.imagemEsq || item.imagem || '';
    const imgDir = item.imagemDir || item.imagem || '';

    // Render Página Esquerda (100% visível no mobile sem cortes)
    pagEsq.innerHTML = `
        <div class="w-full h-full flex flex-col justify-center items-center">
            <div class="w-full border-2 border-[#C59B27]/60 p-1.5 sm:p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg img-zoom-container cursor-pointer group relative overflow-hidden flex items-center justify-center" onclick="abrirGaleria(['${imgEsq}'], '${livroObj.titulo}', '', '${livroObj.titulo}', '${livroObj.titulo}')">
                <div class="w-full flex items-center justify-center bg-stone-100 dark:bg-zinc-800 rounded-lg overflow-hidden relative min-h-[220px] sm:min-h-[320px]">
                    <img src="${imgEsq}" alt="Página Esquerda" class="w-full h-auto max-h-[50vh] md:max-h-[65vh] object-contain img-zoom filter sepia-[0.08] contrast-105">
                    <span class="absolute bottom-2 right-2 bg-[#3D2314]/90 text-[#C59B27] text-[10px] font-serif px-2.5 py-1 rounded-md border border-[#C59B27]/40 shadow-md pointer-events-none">
                        🔍 Ampliar
                    </span>
                </div>
            </div>
        </div>
    `;

    // Render Página Direita (100% visível no mobile sem cortes)
    pagDir.innerHTML = `
        <div class="w-full h-full flex flex-col justify-center items-center">
            <div class="w-full border-2 border-[#C59B27]/60 p-1.5 sm:p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg img-zoom-container cursor-pointer group relative overflow-hidden flex items-center justify-center" onclick="abrirGaleria(['${imgDir}'], '${livroObj.titulo}', '', '${livroObj.titulo}', '${livroObj.titulo}')">
                <div class="w-full flex items-center justify-center bg-stone-100 dark:bg-zinc-800 rounded-lg overflow-hidden relative min-h-[220px] sm:min-h-[320px]">
                    <img src="${imgDir}" alt="Página Direita" class="w-full h-auto max-h-[50vh] md:max-h-[65vh] object-contain img-zoom filter sepia-[0.08] contrast-105">
                    <span class="absolute bottom-2 right-2 bg-[#3D2314]/90 text-[#C59B27] text-[10px] font-serif px-2.5 py-1 rounded-md border border-[#C59B27]/40 shadow-md pointer-events-none">
                        🔍 Ampliar
                    </span>
                </div>
            </div>
        </div>
    `;

    atualizarIndicadoresLivro();
}

    const item = listaDados[paginaLivroAtual];
    if (!item) return;

    const imgEsq = item.imagemEsq || item.imagem || '';
    const imgDir = item.imagemDir || item.imagem || '';

    // Render Página Esquerda (Ajustada para Mobile e Desktop)
    pagEsq.innerHTML = `
        <div class="w-full h-full flex flex-col justify-center items-center">
            <div class="w-full h-full max-h-[42vh] md:max-h-none border-2 border-[#C59B27]/60 p-1.5 sm:p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg img-zoom-container cursor-pointer group relative overflow-hidden flex items-center justify-center" onclick="abrirGaleria(['${imgEsq}'], '${livroObj.titulo}', '', '${livroObj.titulo}', '${livroObj.titulo}')">
                <div class="w-full h-full overflow-hidden rounded-lg relative flex items-center justify-center bg-stone-100 dark:bg-zinc-800">
                    <img src="${imgEsq}" alt="Ilustração Esquerda" class="max-w-full max-h-[38vh] md:max-h-[65vh] w-auto h-auto object-contain img-zoom filter sepia-[0.08] contrast-105">
                    <span class="absolute bottom-2 right-2 bg-[#3D2314]/90 text-[#C59B27] text-[10px] font-serif px-2.5 py-1 rounded-md border border-[#C59B27]/40 shadow-md">
                        🔍 Ampliar
                    </span>
                </div>
            </div>
        </div>
    `;

    // Render Página Direita (Ajustada para Mobile e Desktop)
    pagDir.innerHTML = `
        <div class="w-full h-full flex flex-col justify-center items-center">
            <div class="w-full h-full max-h-[42vh] md:max-h-none border-2 border-[#C59B27]/60 p-1.5 sm:p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg img-zoom-container cursor-pointer group relative overflow-hidden flex items-center justify-center" onclick="abrirGaleria(['${imgDir}'], '${livroObj.titulo}', '', '${livroObj.titulo}', '${livroObj.titulo}')">
                <div class="w-full h-full overflow-hidden rounded-lg relative flex items-center justify-center bg-stone-100 dark:bg-zinc-800">
                    <img src="${imgDir}" alt="Ilustração Direita" class="max-w-full max-h-[38vh] md:max-h-[65vh] w-auto h-auto object-contain img-zoom filter sepia-[0.08] contrast-105">
                    <span class="absolute bottom-2 right-2 bg-[#3D2314]/90 text-[#C59B27] text-[10px] font-serif px-2.5 py-1 rounded-md border border-[#C59B27]/40 shadow-md">
                        🔍 Ampliar
                    </span>
                </div>
            </div>
        </div>
    `;

    atualizarIndicadoresLivro();
}

function nextSpread() {
    const listaDados = obterLivroAtual().dados || [];
    if (paginaLivroAtual < listaDados.length - 1) {
        paginaLivroAtual++;
        renderizarPaginaLivro();
    }
}

function prevSpread() {
    if (paginaLivroAtual > -1) {
        paginaLivroAtual--;
        renderizarPaginaLivro();
    }
}

function goToSpread(index) {
    const listaDados = obterLivroAtual().dados || [];
    if (index === -1) {
        paginaLivroAtual = -1;
    } else if (index >= 0 && index < listaDados.length) {
        paginaLivroAtual = index;
    }
    renderizarPaginaLivro();
}

function openTocModal() {
    const livroObj = obterLivroAtual();
    const listaDados = livroObj.dados || [];

    const modal = document.getElementById('modalToc');
    const container = document.getElementById('tocContainer');
    if (!modal || !container) return;

    container.innerHTML = listaDados.map((item, idx) => `
        <button onclick="goToSpread(${idx}); closeModal('modalToc');" 
                class="w-full text-left p-3 rounded-lg bg-slate-800/80 hover:bg-amber-600/20 border border-slate-700/60 hover:border-amber-500/50 transition flex justify-between items-center text-xs text-amber-200">
            <span class="font-bold">${item.capitulo}: ${item.titulo || ('Página ' + (idx + 1))}</span>
            <span class="text-amber-400 font-serif">${item.paginaEsq || ('Pág. ' + (idx*2 + 2))}</span>
        </button>
    `).join('');

    modal.classList.remove('hidden');
}

function closeModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.add('hidden');
}

function toggleAudio() {
    audioAtivo = !audioAtivo;
    const btn = document.getElementById('btnAudio');
    if (btn) {
        btn.textContent = audioAtivo ? "🔊" : "🔇";
        btn.title = audioAtivo ? "Desativar Som" : "Ativar Som";
    }
}

// Configuração de Gestos no Leitor de Livros
let bookTouchStartX = 0;
let bookTouchEndX = 0;

function configurarSwipeLivro() {
    const container = document.getElementById('livro-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
        bookTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        bookTouchEndX = e.changedTouches[0].screenX;
        const diff = bookTouchStartX - bookTouchEndX;
        if (diff > 40) {
            nextSpread(); // Deslizou para esquerda -> Próxima página
        } else if (diff < -40) {
            prevSpread(); // Deslizou para direita -> Página anterior
        }
    }, { passive: true });
}

function abrirLeitorLivro(idLivro = 'livro1') {
    if (colecaoLivros[idLivro]) {
        livroChaveAtual = idLivro;
    } else {
        livroChaveAtual = 'livro1';
    }
    
    paginaLivroAtual = -1;

    const headerTitle = document.getElementById('headerBookTitle');
    if (headerTitle) {
        headerTitle.textContent = colecaoLivros[livroChaveAtual].titulo;
    }

    const modal = document.getElementById('modal-leitor-livro');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
    
    renderizarPaginaLivro();
    configurarSwipeLivro();

    document.removeEventListener('keydown', tratarTecladoLivro);
    document.addEventListener('keydown', tratarTecladoLivro);
}

function fecharLeitorLivro() {
    const modal = document.getElementById('modal-leitor-livro');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

    document.removeEventListener('keydown', tratarTecladoLivro);
}

function tratarTecladoLivro(e) {
    const modal = document.getElementById('modal-leitor-livro');
    if (!modal || modal.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        nextSpread();
    } else if (e.key === 'ArrowLeft') {
        prevSpread();
    } else if (e.key === 'Escape') {
        fecharLeitorLivro();
    }
}

// ==========================================
// 4. CARREGAMENTO GERAL DAS SEÇÕES
// ==========================================
const colecaoDados = {
    historia: { dados: dadosHistoria, tag: 'História' },
    geografia: { dados: dadosGeografia, tag: 'Geografia' },
    arte: { dados: dadosArte, tag: 'Arte' },
    trabalhos: { dados: trabalhosAlunos, tag: 'Trabalho de Aluno' }
};

function criarCardHtml(item, tag, categoria, index) {
    const listaImagens = (item.imagens && item.imagens.length > 0) ? item.imagens : [item.imagem || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"];
    const qtdFotos = listaImagens.length;

    return `
        <div class="bg-white dark:bg-zinc-900 border border-[#D4C4A8] dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div class="img-zoom-container relative aspect-video cursor-pointer" onclick="abrirGaleriaPorIndice('${categoria}', ${index})">
                <img src="${listaImagens[0]}" alt="${item.titulo}" class="w-full h-full object-cover img-zoom" loading="lazy">
                ${qtdFotos > 1 ? `
                    <span class="absolute bottom-2 right-2 bg-stone-900/80 text-[#C59B27] text-[10px] font-serif font-bold px-2 py-1 rounded-md border border-[#C59B27]/30 shadow">
                        📷 ${qtdFotos} fotos
                    </span>
                ` : ''}
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
    const render = (idContainer, categoria) => {
        const el = document.getElementById(idContainer);
        const grupo = colecaoDados[categoria];
        if (el && grupo) {
            el.innerHTML = grupo.dados.map((item, index) => criarCardHtml(item, grupo.tag, categoria, index)).join('');
        }
    };

    render('grid-historia', 'historia');
    render('grid-geografia', 'geografia');
    render('grid-arte', 'arte');
    render('grid-trabalhos', 'trabalhos');

    renderizarPaginaLivro();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarSecoes);
} else {
    carregarSecoes();
}

// ==========================================
// 5. LIGHTBOX / SLIDES (COM GESTOS SWIPE)
// ==========================================
let galeriaImagensAtual = [];
let indiceSlideAtual = 0;
let lightboxTouchStartX = 0;
let lightboxTouchEndX = 0;

function abrirGaleriaPorIndice(categoria, index) {
    const grupo = colecaoDados[categoria];
    if (!grupo) return;
    const item = grupo.dados[index];
    if (!item) return;

    const listaImagens = (item.imagens && item.imagens.length > 0) ? item.imagens : [item.imagem];
    abrirGaleria(listaImagens, item.titulo, item.descricaoDetalhada || item.descricao, item.autor, grupo.tag);
}

function abrirGaleria(listaImagens, titulo, descDetalhada, autor, tag, indiceInicial = 0) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    galeriaImagensAtual = Array.isArray(listaImagens) ? listaImagens : [listaImagens];
    indiceSlideAtual = indiceInicial;

    document.getElementById('lightbox-title').textContent = titulo;
    document.getElementById('lightbox-desc').textContent = descDetalhada;
    document.getElementById('lightbox-autor').textContent = autor;
    document.getElementById('lightbox-tag').textContent = tag;

    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    if (btnPrev && btnNext) {
        if (galeriaImagensAtual.length <= 1) {
            btnPrev.classList.add('hidden');
            btnNext.classList.add('hidden');
        } else {
            btnPrev.classList.remove('hidden');
            btnNext.classList.remove('hidden');
        }
    }

    renderizarThumbnails();
    atualizarExibicaoSlide();

    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';

    configurarSwipeLightbox();
}

function configurarSwipeLightbox() {
    const container = document.getElementById('lightbox-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
        lightboxTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        lightboxTouchEndX = e.changedTouches[0].screenX;
        const diff = lightboxTouchStartX - lightboxTouchEndX;
        if (diff > 40) {
            mudarSlide(1);  // Avançar slide
        } else if (diff < -40) {
            mudarSlide(-1); // Voltar slide
        }
    }, { passive: true });
}

function renderizarThumbnails() {
    const containerThumbs = document.getElementById('lightbox-thumbs');
    if (!containerThumbs) return;

    if (galeriaImagensAtual.length <= 1) {
        containerThumbs.parentElement.classList.add('hidden');
        return;
    }

    containerThumbs.parentElement.classList.remove('hidden');
    containerThumbs.innerHTML = galeriaImagensAtual.map((imgSrc, idx) => `
        <button onclick="irParaSlide(${idx})" class="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === indiceSlideAtual ? 'border-[#C59B27] scale-105 shadow-md ring-2 ring-[#C59B27]/50' : 'border-transparent opacity-60 hover:opacity-100'}">
            <img src="${imgSrc}" class="w-full h-full object-cover">
        </button>
    `).join('');
}

function atualizarExibicaoSlide() {
    const imgEl = document.getElementById('lightbox-img');
    const contadorEl = document.getElementById('lightbox-contador');

    if (imgEl && galeriaImagensAtual.length > 0) {
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
            imgEl.src = galeriaImagensAtual[indiceSlideAtual];
            imgEl.style.opacity = '1';
        }, 150);
    }

    if (contadorEl) {
        contadorEl.textContent = `${indiceSlideAtual + 1} / ${galeriaImagensAtual.length}`;
    }

    renderizarThumbnails();
}

function mudarSlide(delta) {
    if (galeriaImagensAtual.length === 0) return;
    indiceSlideAtual = (indiceSlideAtual + delta + galeriaImagensAtual.length) % galeriaImagensAtual.length;
    atualizarExibicaoSlide();
}

function irParaSlide(index) {
    if (index >= 0 && index < galeriaImagensAtual.length) {
        indiceSlideAtual = index;
        atualizarExibicaoSlide();
    }
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

    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
}

function alternarTelaCheia() {
    const elem = document.getElementById('lightbox-container') || document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        mudarSlide(1);
    } else if (e.key === 'ArrowLeft') {
        mudarSlide(-1);
    } else if (e.key === 'Escape') {
        fecharLightbox();
    } else if (e.key === 'f' || e.key === 'F') {
        alternarTelaCheia();
    }
});

// ==========================================
// 6. SALA VIRTUAL 3D REALISTA (GALERIA CÚBICA)
// ==========================================
let cena, camera, renderizador, grupoQuadros, raycaster, mouse;
let interagindo = false;
let mouseX = 0, mouseY = 0, lon = 0, lat = 0, latOnDown = 0, lonOnDown = 0;
let startX = 0, startY = 0;
let animacaoId = null;
let fovAlvo = 65;
let lonAlvo = 0, latAlvo = 0;

function criarTexturaPiso() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2A1810';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#1A0E0A';
    ctx.lineWidth = 4;
    for (let i = 0; i < 512; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
}

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

    camera = new THREE.PerspectiveCamera(fovAlvo, container.clientWidth / container.clientHeight, 1, 2000);
    camera.target = new THREE.Vector3(0, 0, 0);

    renderizador = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 0.85;
    container.appendChild(renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xfff5e6, 0.35);
    cena.add(luzAmbiente);

    const luzTeto = new THREE.HemisphereLight(0xffffff, 0x332211, 0.45);
    cena.add(luzTeto);

    const largura = 800, altura = 300, profundidade = 800;

    const geoPiso = new THREE.PlaneGeometry(largura, profundidade);
    const matPiso = new THREE.MeshStandardMaterial({
        map: criarTexturaPiso(),
        roughness: 0.25,
        metalness: 0.1
    });
    const piso = new THREE.Mesh(geoPiso, matPiso);
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -altura / 2;
    piso.receiveShadow = true;
    cena.add(piso);

    const geoTeto = new THREE.PlaneGeometry(largura, profundidade);
    const matTeto = new THREE.MeshStandardMaterial({ color: 0xF5F2EB, roughness: 0.9 });
    const teto = new THREE.Mesh(geoTeto, matTeto);
    teto.rotation.x = Math.PI / 2;
    teto.position.y = altura / 2;
    cena.add(teto);

    const matParede = new THREE.MeshStandardMaterial({ color: 0xE5DFD3, roughness: 0.85 });
    const criarParede = (w, h, x, y, z, rotY) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matParede);
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotY;
        mesh.receiveShadow = true;
        cena.add(mesh);
    };

    criarParede(largura, altura, 0, 0, -profundidade / 2, 0);
    criarParede(largura, altura, 0, 0, profundidade / 2, Math.PI);
    criarParede(profundidade, altura, -largura / 2, 0, 0, Math.PI / 2);
    criarParede(profundidade, altura, largura / 2, 0, 0, -Math.PI / 2);

    const matRodape = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.4 });
    const geoRodapeL = new THREE.BoxGeometry(largura, 12, 4);
    const r1 = new THREE.Mesh(geoRodapeL, matRodape); r1.position.set(0, -altura/2 + 6, -profundidade/2 + 2); cena.add(r1);
    const r2 = new THREE.Mesh(geoRodapeL, matRodape); r2.position.set(0, -altura/2 + 6, profundidade/2 - 2); cena.add(r2);

    grupoQuadros = new THREE.Group();
    cena.add(grupoQuadros);

    // EVENTOS DE MOUSE
    container.addEventListener('mousedown', (e) => {
        interagindo = true;
        mouseX = e.clientX; mouseY = e.clientY;
        startX = e.clientX; startY = e.clientY;
        lonOnDown = lon; latOnDown = lat;
    });

    container.addEventListener('mousemove', (e) => {
        if (interagindo) {
            lonAlvo = (mouseX - e.clientX) * 0.15 + lonOnDown;
            latAlvo = (e.clientY - mouseY) * 0.15 + latOnDown;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (interagindo) {
            interagindo = false;
            if (Math.hypot(e.clientX - startX, e.clientY - startY) < 8) {
                checarCliqueObra(e);
            }
        }
    });

    // EVENTOS DE TOUCH (CELULARES / TCLAS INTERATIVAS)
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            interagindo = true;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            startX = mouseX;
            startY = mouseY;
            lonOnDown = lon;
            latOnDown = lat;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (interagindo && e.touches.length === 1) {
            lonAlvo = (mouseX - e.touches[0].clientX) * 0.2 + lonOnDown;
            latAlvo = (e.touches[0].clientY - mouseY) * 0.2 + latOnDown;
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (interagindo) {
            interagindo = false;
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                if (Math.hypot(touch.clientX - startX, touch.clientY - startY) < 12) {
                    checarCliqueObra(touch);
                }
            }
        }
    });

    window.addEventListener('resize', noRedimensionamento);
    window.addEventListener('orientationchange', () => setTimeout(noRedimensionamento, 200));

    montarObrasEPlacas3D();
}

function montarObrasEPlacas3D() {
    limparRecursos3D(grupoQuadros);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const raioMural = 390;
    const passoAngulo = 360 / trabalhosAlunos.length;

    trabalhosAlunos.forEach((item, index) => {
        const grupoArte = new THREE.Group();
      
        const geoMoldura = new THREE.BoxGeometry(116, 86, 6);
        const matMoldura = new THREE.MeshStandardMaterial({ color: 0xC59B27, metalness: 0.6, roughness: 0.3 });
        const meshMoldura = new THREE.Mesh(geoMoldura, matMoldura);
        meshMoldura.castShadow = true;

        const geoTela = new THREE.PlaneGeometry(104, 74);
        const matTela = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.2 });
        const meshTela = new THREE.Mesh(geoTela, matTela);
        meshTela.position.z = 3.2;

        const geoPlaca = new THREE.BoxGeometry(35, 18, 2);
        const matPlaca = new THREE.MeshStandardMaterial({ color: 0xFAF8F5, roughness: 0.5 });
        const meshPlaca = new THREE.Mesh(geoPlaca, matPlaca);
        meshPlaca.position.set(0, -56, 1);

        meshMoldura.userData = item;
        meshTela.userData = item;

        grupoArte.add(meshMoldura);
        grupoArte.add(meshTela);
        grupoArte.add(meshPlaca);

        const anguloDeg = index * passoAngulo;
        const rad = THREE.MathUtils.degToRad(anguloDeg);

        grupoArte.position.x = raioMural * Math.sin(rad);
        grupoArte.position.y = 10;
        grupoArte.position.z = raioMural * Math.cos(rad);
        grupoArte.lookAt(0, 10, 0);

        const spot = new THREE.SpotLight(0xFFF0DD, 1.2);
        spot.position.set(grupoArte.position.x * 0.7, 130, grupoArte.position.z * 0.7);
        spot.target = grupoArte;
        spot.angle = Math.PI / 6;
        spot.penumbra = 0.4;
        spot.castShadow = true;
        cena.add(spot);

        grupoQuadros.add(grupoArte);

        const urlImagem3D = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : item.imagem;
        loader.load(urlImagem3D, (tex) => {
            matTela.map = tex;
            matTela.needsUpdate = true;
        });
    });
}

function focarObraMaisProxima() {
    if (!trabalhosAlunos || trabalhosAlunos.length === 0) return;
    const lonNorm = ((lon % 360) + 360) % 360;
    let obraMaisProxima = trabalhosAlunos[0];
    let menorDiferenca = 360;

    trabalhosAlunos.forEach(obra => {
        const dif = Math.abs((obra.lon || 0) - lonNorm);
        if (dif < menorDiferenca) {
            menorDiferenca = dif;
            obraMaisProxima = obra;
        }
    });

    lonAlvo = obraMaisProxima.lon || 0;
    latAlvo = 0;
}

function checarCliqueObra(e) {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !grupoQuadros) return;
    const rect = container.getBoundingClientRect();
    
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(grupoQuadros.children, true);

    if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (data && data.titulo) {
            const listaImagens = (data.imagens && data.imagens.length > 0) ? data.imagens : [data.imagem];
            abrirGaleria(listaImagens, data.titulo, data.descricaoDetalhada || data.descricao, data.autor, data.disciplina || 'Trabalho de Aluno');
        }
    }
}

function noRedimensionamento() {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !renderizador) return;
    
    const largura = container.clientWidth;
    const altura = container.clientHeight;
    
    camera.aspect = largura / altura;
    camera.fov = largura < 768 ? 85 : 65; // Ajuste dinâmico de FOV para mobile
    camera.updateProjectionMatrix();
    
    renderizador.setSize(largura, altura);
}

function animar3D() {
    animacaoId = requestAnimationFrame(animar3D);

    if (!interagindo) {
        lonAlvo += 0.04;
    }

    lon += (lonAlvo - lon) * 0.05;
    lat += (latAlvo - lat) * 0.05;
    camera.fov += (fovAlvo - camera.fov) * 0.05;
    camera.updateProjectionMatrix();

    lat = Math.max(-45, Math.min(45, lat));

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
        if (cena) {
            limparRecursos3D(cena);
            cena = null;
        }
        if (renderizador) {
            renderizador.dispose();
            if (renderizador.domElement) {
                renderizador.domElement.remove();
            }
            renderizador = null;
        }
        camera = null;
        grupoQuadros = null;
    }, 300);

    document.body.style.overflow = 'auto';
}

// ==========================================
// 7. SALA VIRTUAL 3D: GALERIA COM ÁRVORE DAS ARTES
// ==========================================
let cenaArvore, cameraArvore, renderizadorArvore, grupoArvore, raycasterArvore, mouseArvore;
let interagindoArvore = false;
let mouseXArvore = 0, mouseYArvore = 0, lonArvore = 0, latArvore = 0, latOnDownArvore = 0, lonOnDownArvore = 0;
let startXArvore = 0, startYArvore = 0;
let animacaoIdArvore = null;
let fovAlvoArvore = 65;
let lonAlvoArvore = 0, latAlvoArvore = 0;
let quadrosPendurados = [];
let pontasDosGalhosDeCafe = [];

let estadoPlacaCafe = { titulo: "Pé de Café", descricao: "Coffea arabica • Símbolo da riqueza agrícola e patrimônio cultural do Paraná" };
let meshTelaPlacaCafe = null;

const CONFIG_GALERIA_CLASSICA = {
    corParede: 0x2A3A35,
    corBoiserie: 0x1E2B27,
    corPiso: 0x3D2314,
    corRodape: 0x1A120B,
    corTeto: 0xF5F2EB,
    corLuzGaleria: 0xFFF2A3,
    intensidadeSpotlight: 0.8,
    larguraSala: 1000,
    alturaSala: 420,
    profundidadeSala: 1000,
    alturaRodape: 24,
    larguraMolduraBoiserie: 160,
    alturaMolduraBoiserie: 220,
    raioGalhos: 210,
    alturaTronco: 240,
    grossuraTronco: 28,
    comprimentoCorda: 50,
    corTronco: 0x28170D,
    corFolhas: 0x1E361A,
    corCorda: 0xC59B27,
    velocidadeBalanco: 0.0015,
    amplitudebalanco: 0.04
};

function gerarTexturaPlaca(titulo, descricao) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 300);
    grad.addColorStop(0, '#FAF8F5');
    grad.addColorStop(1, '#EFE8DA');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 300);

    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, 496, 284);

    ctx.strokeStyle = '#7A1C1C';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, 476, 264);

    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A1C1C';
    ctx.fillText('☕  EXPOSIÇÃO BOTÂNICA & ARTE  ☕', 256, 52);

    ctx.beginPath();
    ctx.moveTo(60, 68);
    ctx.lineTo(452, 68);
    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = '#3D2314';
    ctx.fillText(titulo || 'Pé de Café', 256, 120);

    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillStyle = '#5A3D28';

    const palavras = (descricao || '').split(' ');
    let linha = '';
    let y = 165;
    const maxLargura = 420;
    const alturaLinha = 24;

    for (let n = 0; n < palavras.length; n++) {
        const testeLinha = linha + palavras[n] + ' ';
        const metricas = ctx.measureText(testeLinha);
        if (metricas.width > maxLargura && n > 0) {
            ctx.fillText(linha, 256, y);
            linha = palavras[n] + ' ';
            y += alturaLinha;
        } else {
            linha = testeLinha;
        }
    }
    ctx.fillText(linha, 256, y);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function abrirModalInfoPlaca() {
    const modal = document.getElementById('modal-info-placa');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
}

function fecharModalInfoPlaca() {
    const modal = document.getElementById('modal-info-placa');
    if (!modal) return;
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

function initSalaArvore3D() {
    const container = document.getElementById('arvore-canvas-container');
    if (!container) return;

    if (renderizadorArvore) {
        noRedimensionamentoArvore();
        return;
    }

    raycasterArvore = new THREE.Raycaster();
    mouseArvore = new THREE.Vector2();
    cenaArvore = new THREE.Scene();

    cenaArvore.fog = new THREE.FogExp2(0x111815, 0.0008);

    cameraArvore = new THREE.PerspectiveCamera(fovAlvoArvore, container.clientWidth / container.clientHeight, 1, 2000);
    cameraArvore.target = new THREE.Vector3(0, 40, 0);

    renderizadorArvore = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderizadorArvore.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizadorArvore.setSize(container.clientWidth, container.clientHeight);
    renderizadorArvore.shadowMap.enabled = true;
    renderizadorArvore.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizadorArvore.toneMapping = THREE.ACESFilmicToneMapping;
    renderizadorArvore.toneMappingExposure = 1.1;
    container.appendChild(renderizadorArvore.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xFFE8C5, 0.7);
    cenaArvore.add(luzAmbiente);

    const luzLustreCentral = new THREE.PointLight(CONFIG_GALERIA_CLASSICA.corLuzGaleria, 1.8, 800);
    luzLustreCentral.position.set(0, CONFIG_GALERIA_CLASSICA.alturaSala - 120, 0);
    luzLustreCentral.castShadow = true;
    cenaArvore.add(luzLustreCentral);

    grupoArvore = new THREE.Group();
    cenaArvore.add(grupoArvore);

    construirRecintoElegante();
    construirArvoreCentral();
    construirPlacaCafeStand();
    montarObrasNasPontas();

    // EVENTOS DE MOUSE
    container.addEventListener('mousedown', (e) => {
        interagindoArvore = true;
        mouseXArvore = e.clientX; mouseYArvore = e.clientY;
        startXArvore = e.clientX; startYArvore = e.clientY;
        lonOnDownArvore = lonArvore; latOnDownArvore = latArvore;
    });

    container.addEventListener('mousemove', (e) => {
        if (interagindoArvore) {
            lonAlvoArvore = (mouseXArvore - e.clientX) * 0.15 + lonOnDownArvore;
            latAlvoArvore = (e.clientY - mouseYArvore) * 0.15 + latOnDownArvore;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (interagindoArvore) {
            interagindoArvore = false;
            if (Math.hypot(e.clientX - startXArvore, e.clientY - startYArvore) < 8) {
                checarCliqueObraArvore(e);
            }
        }
    });

    // EVENTOS DE TOUCH (CELULARES / TELAS TOUCH)
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            interagindoArvore = true;
            mouseXArvore = e.touches[0].clientX;
            mouseYArvore = e.touches[0].clientY;
            startXArvore = mouseXArvore;
            startYArvore = mouseYArvore;
            lonOnDownArvore = lonArvore;
            latOnDownArvore = latArvore;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (interagindoArvore && e.touches.length === 1) {
            lonAlvoArvore = (mouseXArvore - e.touches[0].clientX) * 0.2 + lonOnDownArvore;
            latAlvoArvore = (e.touches[0].clientY - mouseYArvore) * 0.2 + latOnDownArvore;
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (interagindoArvore) {
            interagindoArvore = false;
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                if (Math.hypot(touch.clientX - startXArvore, touch.clientY - startYArvore) < 12) {
                    checarCliqueObraArvore(touch);
                }
            }
        }
    });

    window.addEventListener('resize', noRedimensionamentoArvore);
    window.addEventListener('orientationchange', () => setTimeout(noRedimensionamentoArvore, 200));
}

function construirRecintoElegante() {
    const W = CONFIG_GALERIA_CLASSICA.larguraSala;
    const H = CONFIG_GALERIA_CLASSICA.alturaSala;
    const D = CONFIG_GALERIA_CLASSICA.profundidadeSala;

    const matParede = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corParede, roughness: 0.7 });
    const matBoiserie = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corBoiserie, roughness: 0.5 });
    const matMadeiraEscura = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corRodape, roughness: 0.4 });

    const geoPiso = new THREE.PlaneGeometry(W, D);
    const matPiso = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corPiso, roughness: 0.3, metalness: 0.1 });
    const piso = new THREE.Mesh(geoPiso, matPiso);
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -100;
    piso.receiveShadow = true;
    cenaArvore.add(piso);

    const geoTeto = new THREE.PlaneGeometry(W, D);
    const matTeto = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corTeto, roughness: 0.9 });
    const teto = new THREE.Mesh(geoTeto, matTeto);
    teto.rotation.x = Math.PI / 2;
    teto.position.y = -100 + H;
    cenaArvore.add(teto);

    const criarParedeClassica = (largura, x, z, rotY) => {
        const grupoParede = new THREE.Group();

        const meshP = new THREE.Mesh(new THREE.PlaneGeometry(largura, H), matParede);
        meshP.receiveShadow = true;
        grupoParede.add(meshP);

        const geoRodape = new THREE.BoxGeometry(largura, CONFIG_GALERIA_CLASSICA.alturaRodape, 8);
        const rodape = new THREE.Mesh(geoRodape, matMadeiraEscura);
        rodape.position.set(0, -H / 2 + CONFIG_GALERIA_CLASSICA.alturaRodape / 2, 4);
        grupoParede.add(rodape);

        const geoCimalha = new THREE.BoxGeometry(largura, 18, 12);
        const cimalha = new THREE.Mesh(geoCimalha, matMadeiraEscura);
        cimalha.position.set(0, H / 2 - 9, 6);
        grupoParede.add(cimalha);

        const qtdQuadros = 4;
        const espacamento = largura / (qtdQuadros + 1);
        const wB = CONFIG_GALERIA_CLASSICA.larguraMolduraBoiserie;
        const hB = CONFIG_GALERIA_CLASSICA.alturaMolduraBoiserie;
        const eB = 3;

        for (let i = 1; i <= qtdQuadros; i++) {
            const posX = -largura / 2 + (i * espacamento);
            const posY = 10;

            const geoH = new THREE.BoxGeometry(wB, 6, eB);
            const bSup = new THREE.Mesh(geoH, matBoiserie); bSup.position.set(posX, posY + hB / 2, eB);
            const bInf = new THREE.Mesh(geoH, matBoiserie); bInf.position.set(posX, posY - hB / 2, eB);

            const geoV = new THREE.BoxGeometry(6, hB, eB);
            const bEsq = new THREE.Mesh(geoV, matBoiserie); bEsq.position.set(posX - wB / 2, posY, eB);
            const bDir = new THREE.Mesh(geoV, matBoiserie); bDir.position.set(posX + wB / 2, posY, eB);

            grupoParede.add(bSup); grupoParede.add(bInf);
            grupoParede.add(bEsq); grupoParede.add(bDir);
        }

        grupoParede.position.set(x, -100 + H / 2, z);
        grupoParede.rotation.y = rotY;
        cenaArvore.add(grupoParede);
    };

    criarParedeClassica(W, 0, -D / 2, 0);
    criarParedeClassica(W, 0, D / 2, Math.PI);
    criarParedeClassica(D, -W / 2, 0, Math.PI / 2);
    criarParedeClassica(D, W / 2, 0, -Math.PI / 2);
}

function construirArvoreCentral() {
    pontasDosGalhosDeCafe = [];

    const matTronco = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.85 });
    const matFolhas = new THREE.MeshStandardMaterial({
        color: 0x143818,
        roughness: 0.3,
        metalness: 0.1,
        flatShading: true
    });
    const matCafeMaduro = new THREE.MeshStandardMaterial({ color: 0x9E0C0C, roughness: 0.2, metalness: 0.1 });
    const matCafeVerde = new THREE.MeshStandardMaterial({ color: 0x486B28, roughness: 0.3 });

    const altTronco = CONFIG_GALERIA_CLASSICA.alturaTronco;

    const geoTronco = new THREE.CylinderGeometry(10, 22, altTronco, 12);
    const tronco = new THREE.Mesh(geoTronco, matTronco);
    tronco.position.y = -100 + (altTronco / 2);
    tronco.castShadow = true;
    grupoArvore.add(tronco);

    const geoClusterFolhas = new THREE.DodecahedronGeometry(20, 1);
    const geoGraoCafe = new THREE.SphereGeometry(3, 8, 8);

    const camadas = 5;
    const galhosPorCamada = 6;

    for (let i = 0; i < camadas; i++) {
        const alturaCamada = -100 + (altTronco * 0.35) + (i * (altTronco * 0.6 / camadas));
        const raioCamada = 140 - (i * 20);

        for (let j = 0; j < galhosPorCamada; j++) {
            const angulo = (j * (Math.PI * 2 / galhosPorCamada)) + (i * 0.4);

            const posX = Math.sin(angulo) * raioCamada;
            const posZ = Math.cos(angulo) * raioCamada;
            const posY = alturaCamada;

            const pontoInicio = new THREE.Vector3(0, posY - 8, 0);
            const pontoMedio = new THREE.Vector3(posX * 0.5, posY + 12, posZ * 0.5);
            const pontoFim = new THREE.Vector3(posX, posY + 4, posZ);

            const curvaGalho = new THREE.CatmullRomCurve3([pontoInicio, pontoMedio, pontoFim]);
            const geoGalho = new THREE.TubeGeometry(curvaGalho, 10, 3, 8, false);
            const meshGalho = new THREE.Mesh(geoGalho, matTronco);
            meshGalho.castShadow = true;
            grupoArvore.add(meshGalho);

            const folhagem = new THREE.Mesh(geoClusterFolhas, matFolhas);
            folhagem.position.set(posX, posY + 4, posZ);
            folhagem.scale.set(1.5, 0.5, 1.5);
            folhagem.rotation.y = Math.random() * Math.PI;
            folhagem.castShadow = true;
            grupoArvore.add(folhagem);

            const quantidadeFrutos = 8;
            for (let k = 0; k < quantidadeFrutos; k++) {
                const ehMaduro = Math.random() > 0.2;
                const matFruto = ehMaduro ? matCafeMaduro : matCafeVerde;
                const fruto = new THREE.Mesh(geoGraoCafe, matFruto);

                const offsetX = (Math.random() - 0.5) * 18;
                const offsetY = (Math.random() - 0.5) * 10 - 4;
                const offsetZ = (Math.random() - 0.5) * 18;

                fruto.position.set(posX + offsetX, posY + offsetY, posZ + offsetZ);
                fruto.scale.set(1, 1.2, 1);
                fruto.castShadow = true;
                grupoArvore.add(fruto);
            }

            pontasDosGalhosDeCafe.push({
                posicao: pontoFim.clone(),
                angulo: angulo
            });
        }
    }
}

function construirPlacaCafeStand() {
    const grupoPlaca = new THREE.Group();
    grupoPlaca.name = "placaInformativa";
    grupoPlaca.userData = { isPlaca: true };

    grupoPlaca.position.set(120, -100, 250);
    grupoPlaca.rotation.y = -Math.PI / 6;

    const matBase = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.4 });
    const matAste = new THREE.MeshStandardMaterial({ color: 0xC59B27, metalness: 0.7, roughness: 0.3 });
    const matMoldura = new THREE.MeshStandardMaterial({ color: 0x7A1C1C, roughness: 0.5 });

    const geoBase = new THREE.BoxGeometry(35, 6, 25);
    const meshBase = new THREE.Mesh(geoBase, matBase);
    meshBase.position.y = 3;
    meshBase.castShadow = true;
    meshBase.userData = { isPlaca: true };
    grupoPlaca.add(meshBase);

    const geoHaste = new THREE.CylinderGeometry(1.8, 1.8, 45, 12);
    const meshHaste = new THREE.Mesh(geoHaste, matAste);
    meshHaste.position.y = 28;
    meshHaste.castShadow = true;
    meshHaste.userData = { isPlaca: true };
    grupoPlaca.add(meshHaste);

    const grupoPainel = new THREE.Group();
    grupoPainel.position.set(0, 50, 0);
    grupoPainel.rotation.x = -Math.PI / 8;

    const geoMolduraPlaca = new THREE.BoxGeometry(64, 40, 4);
    const meshMolduraPlaca = new THREE.Mesh(geoMolduraPlaca, matMoldura);
    meshMolduraPlaca.castShadow = true;
    meshMolduraPlaca.name = "placaInformativa";
    meshMolduraPlaca.userData = { isPlaca: true };
    meshMolduraPlaca.renderOrder = 10;
    grupoPainel.add(meshMolduraPlaca);

    const geoTelaPlaca = new THREE.PlaneGeometry(60, 36);
    const matTelaPlaca = new THREE.MeshStandardMaterial({
        map: gerarTexturaPlaca(estadoPlacaCafe.titulo, estadoPlacaCafe.descricao),
        roughness: 0.2
    });
    meshTelaPlacaCafe = new THREE.Mesh(geoTelaPlaca, matTelaPlaca);
    meshTelaPlacaCafe.position.z = 2.2;
    meshTelaPlacaCafe.name = "placaInformativa";
    meshTelaPlacaCafe.userData = { isPlaca: true };
    meshTelaPlacaCafe.renderOrder = 11;
    grupoPainel.add(meshTelaPlacaCafe);

    grupoPlaca.add(grupoPainel);
    grupoArvore.add(grupoPlaca);
}

function montarObrasNasPontas() {
    quadrosPendurados = [];
    if (!obrasCafe || obrasCafe.length === 0) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const matCorda = new THREE.MeshStandardMaterial({ 
        color: CONFIG_GALERIA_CLASSICA.corCorda, 
        metalness: 0.6, 
        roughness: 0.2 
    });
    const matHasteSuporte = new THREE.MeshStandardMaterial({
        color: 0x3D2314,
        roughness: 0.7
    });

    const totalObras = obrasCafe.length;
    const passoAngulo = (Math.PI * 2) / totalObras;
    const raioAncoragem = 220;

    obrasCafe.forEach((item, index) => {
        const anguloObra = (index * passoAngulo) + 0.2;

        const dirX = Math.sin(anguloObra);
        const dirZ = Math.cos(anguloObra);

        const camadaIdx = (index % 3) + 1;
        const alturaGalhoBase = -100 + (CONFIG_GALERIA_CLASSICA.alturaTronco * 0.35) + (camadaIdx * (CONFIG_GALERIA_CLASSICA.alturaTronco * 0.6 / 5));

        const pontoOrigem = new THREE.Vector3(dirX * 60, alturaGalhoBase + 10, dirZ * 60);

        const pontoAncoragem = new THREE.Vector3(
            dirX * raioAncoragem,
            alturaGalhoBase + (index % 2 === 0 ? 15 : 0),
            dirZ * raioAncoragem
        );

        const curvaHaste = new THREE.CatmullRomCurve3([
            new THREE.Vector3(dirX * 20, alturaGalhoBase, dirZ * 20),
            pontoOrigem,
            new THREE.Vector3(dirX * (raioAncoragem * 0.65), alturaGalhoBase + 8, dirZ * (raioAncoragem * 0.65)),
            pontoAncoragem
        ]);
        const geoHaste = new THREE.TubeGeometry(curvaHaste, 12, 2.2, 8, false);
        const meshHaste = new THREE.Mesh(geoHaste, matHasteSuporte);
        meshHaste.castShadow = true;
        grupoArvore.add(meshHaste);

        const grupoPendulo = new THREE.Group();
        grupoPendulo.position.copy(pontoAncoragem);

        const comprimentoCorda = 42;
        const geoCorda = new THREE.CylinderGeometry(0.8, 0.8, comprimentoCorda, 8);
        const meshCorda = new THREE.Mesh(geoCorda, matCorda);
        meshCorda.position.y = -comprimentoCorda / 2;
        grupoPendulo.add(meshCorda);

        const geoMoldura = new THREE.BoxGeometry(80, 60, 4);
        const matMoldura = new THREE.MeshStandardMaterial({ color: 0x8C6D2B, metalness: 0.7, roughness: 0.3 });
        const meshMoldura = new THREE.Mesh(geoMoldura, matMoldura);
        meshMoldura.position.y = -comprimentoCorda - 30;

        const geoTela = new THREE.PlaneGeometry(72, 52);
        const matTela = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.2 });
        const meshTela = new THREE.Mesh(geoTela, matTela);
        meshTela.position.set(0, -comprimentoCorda - 30, 2.2);

        meshMoldura.userData = item;
        meshTela.userData = item;

        grupoPendulo.add(meshMoldura);
        grupoPendulo.add(meshTela);

        grupoPendulo.rotation.set(0, Math.atan2(pontoAncoragem.x, pontoAncoragem.z), 0);

        const spot = new THREE.SpotLight(CONFIG_GALERIA_CLASSICA.corLuzGaleria, CONFIG_GALERIA_CLASSICA.intensidadeSpotlight);
        spot.position.set(pontoAncoragem.x * 1.2, pontoAncoragem.y + 35, pontoAncoragem.z * 1.2);
        spot.target = meshTela;
        spot.angle = Math.PI / 6;
        cenaArvore.add(spot);

        grupoArvore.add(grupoPendulo);

        quadrosPendurados.push({ grupo: grupoPendulo, offsetTempo: index * 1.5 });

        const urlImagem3D = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : item.imagem;
        loader.load(urlImagem3D, (tex) => {
            matTela.map = tex;
            matTela.needsUpdate = true;
        });
    });
}

function animarArvore3D() {
    animacaoIdArvore = requestAnimationFrame(animarArvore3D);

    const tempo = Date.now() * CONFIG_GALERIA_CLASSICA.velocidadeBalanco;

    quadrosPendurados.forEach((item) => {
        item.grupo.rotation.z = Math.sin(tempo + item.offsetTempo) * CONFIG_GALERIA_CLASSICA.amplitudebalanco;
        item.grupo.rotation.x = Math.cos(tempo * 0.8 + item.offsetTempo) * (CONFIG_GALERIA_CLASSICA.amplitudebalanco * 0.5);
    });

    if (!interagindoArvore) {
        lonAlvoArvore += 0.03;
    }

    lonArvore += (lonAlvoArvore - lonArvore) * 0.05;
    latArvore += (latAlvoArvore - latArvore) * 0.05;

    latArvore = Math.max(-18, Math.min(28, latArvore));

    cameraArvore.fov += (fovAlvoArvore - cameraArvore.fov) * 0.05;
    cameraArvore.updateProjectionMatrix();

    const phi = THREE.MathUtils.degToRad(90 - latArvore);
    const theta = THREE.MathUtils.degToRad(lonArvore);

    const raioOrbita = 410;

    let posX = raioOrbita * Math.sin(phi) * Math.sin(theta);
    let posY = raioOrbita * Math.cos(phi) + 20;
    let posZ = raioOrbita * Math.sin(phi) * Math.cos(theta);

    const margemParede = (CONFIG_GALERIA_CLASSICA.larguraSala / 2) - 80;
    const alturaMinima = -60;
    const alturaMaxima = CONFIG_GALERIA_CLASSICA.alturaSala - 120;

    cameraArvore.position.x = Math.max(-margemParede, Math.min(margemParede, posX));
    cameraArvore.position.y = Math.max(alturaMinima, Math.min(alturaMaxima, posY));
    cameraArvore.position.z = Math.max(-margemParede, Math.min(margemParede, posZ));

    cameraArvore.lookAt(0, 20, 0);

    renderizadorArvore.render(cenaArvore, cameraArvore);
}

function checarCliqueObraArvore(e) {
    const container = document.getElementById('arvore-canvas-container');
    if (!container || !cameraArvore || !grupoArvore) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    mouseArvore.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouseArvore.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycasterArvore.setFromCamera(mouseArvore, cameraArvore);
    const intersects = raycasterArvore.intersectObjects(grupoArvore.children, true);

    if (intersects.length > 0) {
        const hitObj = intersects[0].object;

        if (hitObj.userData && hitObj.userData.isPlaca) {
            abrirModalInfoPlaca();
            return;
        }

        const data = hitObj.userData;
        if (data && data.titulo) {
            const listaImagens = (data.imagens && data.imagens.length > 0) ? data.imagens : [data.imagem];
            abrirGaleria(listaImagens, data.titulo, data.descricaoDetalhada || data.descricao, data.autor, data.disciplina || 'Trabalho de Aluno');
        }
    }
}

function noRedimensionamentoArvore() {
    const container = document.getElementById('arvore-canvas-container');
    if (!container || !cameraArvore || !renderizadorArvore) return;
    
    const largura = container.clientWidth;
    const altura = container.clientHeight;

    cameraArvore.aspect = largura / altura;
    cameraArvore.fov = largura < 768 ? 85 : 65;
    cameraArvore.updateProjectionMatrix();
    
    renderizadorArvore.setSize(largura, altura);
}

function abrirTourArvoreVirtual() {
    const modal = document.getElementById('arvore-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        initSalaArvore3D();
        noRedimensionamentoArvore();
        if (!animacaoIdArvore) animarArvore3D();
    }, 50);
    document.body.style.overflow = 'hidden';
}

function fecharTourArvoreVirtual() {
    const modal = document.getElementById('arvore-modal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');

        if (animacaoIdArvore) {
            cancelAnimationFrame(animacaoIdArvore);
            animacaoIdArvore = null;
        }
        if (cenaArvore) {
            limparRecursos3D(cenaArvore);
            cenaArvore = null;
        }
        if (renderizadorArvore) {
            renderizadorArvore.dispose();
            if (renderizadorArvore.domElement) {
                renderizadorArvore.domElement.remove();
            }
            renderizadorArvore = null;
        }
        cameraArvore = null;
        grupoArvore = null;
        quadrosPendurados = [];
        meshTelaPlacaCafe = null;
    }, 300);

    document.body.style.overflow = 'auto';
}