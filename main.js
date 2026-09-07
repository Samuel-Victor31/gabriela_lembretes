const API_URL = 'https://lembrete-gabriela.samuelvivi1996.workers.dev';
const MODAL = document.getElementById('modalAdicionar');
const FORM = document.getElementById('formLembrete');
const BTN_ADICIONAR = document.getElementById('btnAdicionar');
const BTN_VERIFICAR = document.getElementById('btnVerificar');
const BTN_CLOSE = document.getElementById('closeModal');
const THEME_TOGGLE = document.getElementById('themeToggle');
const DAILY_MESSAGE = document.getElementById('dailyMessage');
const CONTAINER_LEMBRETES = document.getElementById('containerLembretes');
const COUNT_LEMBRETES = document.getElementById('countLembretes');

const MENSAGENS = [
  '🌅 Ótimo dia para ser produtivo!',
  '💪 Você consegue conquistar tudo hoje!',
  '✨ Que seu dia seja tão brilhante quanto você!',
  '🎯 Vamos alcançar nossos objetivos!',
  '☀️ Um novo dia, novas oportunidades!',
];

document.addEventListener('DOMContentLoaded', () => {
  carregarTemaSalvo();
  gerarMensagemDiaria();
  carregarLembretesDoDia();
  
  BTN_ADICIONAR.addEventListener('click', abrirModal);
  BTN_VERIFICAR.addEventListener('click', carregarLembretesDoDia);
  BTN_CLOSE.addEventListener('click', fecharModal);
  THEME_TOGGLE.addEventListener('click', alternarTema);
  FORM.addEventListener('submit', adicionarLembrete);
  
  MODAL.addEventListener('click', (e) => {
    if (e.target === MODAL) fecharModal();
  });
});

function gerarMensagemDiaria() {
  const mensagem = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
  DAILY_MESSAGE.textContent = mensagem;
}

function alternarTema() {
  document.body.classList.toggle('dark-mode');
  const temaSalvo = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('tema', temaSalvo);
  THEME_TOGGLE.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
}

function carregarTemaSalvo() {
  const tema = localStorage.getItem('tema') || 'light';
  if (tema === 'dark') {
    document.body.classList.add('dark-mode');
    THEME_TOGGLE.textContent = '☀️';
  }
}

function abrirModal() {
  MODAL.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  MODAL.classList.add('hidden');
  document.body.style.overflow = 'auto';
  FORM.reset();
}

// Feedback visual
function mostrarMensagem(tipo, texto) {
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${tipo === 'sucesso' ? '#28a745' : '#dc3545'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  div.textContent = texto;
  document.body.appendChild(div);
  
  setTimeout(() => div.remove(), 3000);
}

// Copiar para clipboard
async function copiarTexto(texto, tipo) {
  try {
    await navigator.clipboard.writeText(texto);
    mostrarMensagem('sucesso', `✅ ${tipo} copiado!`);
  } catch (error) {
    console.error('Erro ao copiar:', error);
  }
}

async function adicionarLembrete(e) {
  e.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    data: document.getElementById('data').value,
    descricao: document.getElementById('descricao').value,
  };

  try {
    const response = await fetch(`${API_URL}/api/lembretes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      mostrarMensagem('sucesso', '✅ Lembrete adicionado!');
      fecharModal();
      carregarLembretesDoDia();
    } else {
      mostrarMensagem('erro', '❌ Erro ao adicionar');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('erro', '❌ Erro de conexão');
  }
}

async function carregarLembretesDoDia() {
  const hoje = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(`${API_URL}/api/lembretes`);
    const lembretes = await response.json();

    const lembretesHoje = lembretes.filter(l => l.data.startsWith(hoje));

    COUNT_LEMBRETES.textContent = lembretesHoje.length;

    if (lembretesHoje.length === 0) {
      CONTAINER_LEMBRETES.innerHTML = `
        <div class="empty-state">
          <p>📭 Nenhum lembrete para hoje</p>
          <p class="empty-text">Clique em "Adicionar Lembrete" para criar um novo</p>
        </div>
      `;
      return;
    }

    CONTAINER_LEMBRETES.innerHTML = '';

    lembretesHoje.forEach(lembrete => {
      const card = criarCardLembrete(lembrete);
      CONTAINER_LEMBRETES.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar lembretes:', error);
    mostrarMensagem('erro', '❌ Erro ao conectar');
  }
}

function criarCardLembrete(lembrete) {
  const card = document.createElement('div');
  card.className = 'lembrete-card';

  const dataFormatada = new Date(lembrete.data).toLocaleDateString('pt-BR');
  const status = lembrete.enviado ? 'Enviado' : 'Pendente';
  const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';

  card.innerHTML = `
    <div class="lembrete-header">
      <div class="lembrete-info">
        <h3>${lembrete.nome}</h3>
        <p class="lembrete-telefone" style="cursor: pointer; user-select: all;" title="Clique para copiar">
          📱 ${lembrete.telefone}
        </p>
      </div>
      <span class="lembrete-status ${statusClass}">${status}</span>
    </div>

    <div class="lembrete-body">
      <p class="lembrete-data">📅 ${dataFormatada}</p>
      <p class="lembrete-descricao" style="cursor: pointer; user-select: all;" title="Clique para copiar">
        ${lembrete.descricao}
      </p>
    </div>

    <div class="lembrete-actions">
      <button class="lembrete-btn btn-copiar" onclick="copiarTexto('${lembrete.telefone}', 'Telefone')">
        📋 Telefone
      </button>
      <button class="lembrete-btn btn-copiar" onclick="copiarTexto('${lembrete.descricao}', 'Mensagem')">
        📋 Mensagem
      </button>
      <button class="lembrete-btn btn-enviado" onclick="marcarEnviado(${lembrete.id}, ${!lembrete.enviado})">
        ${lembrete.enviado ? '✓ Enviado' : 'Marcar Enviado'}
      </button>
      <button class="lembrete-btn btn-deletar" onclick="deletarLembrete(${lembrete.id})">
        🗑️ Deletar
      </button>
    </div>
  `;

  // Adicionar evento de clique para copiar
  card.querySelector('.lembrete-telefone').addEventListener('click', () => {
    copiarTexto(lembrete.telefone, 'Telefone');
  });

  card.querySelector('.lembrete-descricao').addEventListener('click', () => {
    copiarTexto(lembrete.descricao, 'Mensagem');
  });

  return card;
}

async function marcarEnviado(id, enviado) {
  try {
    const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enviado }),
    });

    if (response.ok) {
      carregarLembretesDoDia();
      mostrarMensagem('sucesso', enviado ? '✅ Marcado como enviado!' : '✅ Marcado como pendente!');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('erro', '❌ Erro ao atualizar');
  }
}

async function deletarLembrete(id) {
  if (!confirm('Tem certeza que deseja deletar este lembrete?')) return;

  try {
    const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      carregarLembretesDoDia();
      mostrarMensagem('sucesso', '✅ Lembrete deletado!');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('erro', '❌ Erro ao deletar');
  }
}
