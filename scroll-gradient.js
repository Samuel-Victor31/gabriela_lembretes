/**
 * Efeito de Gradiente Dinâmico com Scroll
 * Adicionar após o iniciar do APP
 */

// Cores para o gradiente (paleta bonita)
const PALETA_CORES = [
  { top: '#667eea', bottom: '#764ba2' },    // Roxo
  { top: '#f093fb', bottom: '#f5576c' },    // Rosa
  { top: '#4facfe', bottom: '#00f2fe' },    // Azul
  { top: '#43e97b', bottom: '#38f9d7' },    // Verde
  { top: '#fa709a', bottom: '#fee140' },    // Laranja
];

let indiceCorAtual = 0;
let ultimoScroll = 0;

function atualizarCorFundo() {
  const scrollTop = window.scrollY;
  const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

  if (alturaTotal === 0) return;

  // Porcentagem de scroll (0 a 1)
  const progresso = scrollTop / alturaTotal;

  // Qual cor estamos
  const indice = Math.floor(progresso * (PALETA_CORES.length - 1));
  const corAtual = PALETA_CORES[indice];
  const proximaCor = PALETA_CORES[Math.min(indice + 1, PALETA_CORES.length - 1)];

  // Transição entre cores (0 a 1)
  const transicao = (progresso * (PALETA_CORES.length - 1)) - indice;

  // Interpolar cores RGB
  const corTop = interpolarCor(corAtual.top, proximaCor.top, transicao);
  const corBottom = interpolarCor(corAtual.bottom, proximaCor.bottom, transicao);

  // Aplicar no fundo
  document.body.style.background = `linear-gradient(180deg, ${corTop} 0%, ${corBottom} 100%)`;
  document.body.style.backgroundAttachment = 'fixed';
}

function interpolarCor(cor1, cor2, t) {
  // Converter hex para RGB
  const rgb1 = hexToRgb(cor1);
  const rgb2 = hexToRgb(cor2);

  // Interpolar cada canal
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const resultado = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return resultado ? {
    r: parseInt(resultado[1], 16),
    g: parseInt(resultado[2], 16),
    b: parseInt(resultado[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Adicionar evento de scroll
window.addEventListener('scroll', atualizarCorFundo, { passive: true });

// Inicializar cor
atualizarCorFundo();

console.log('✨ Efeito de scroll ativado!');
