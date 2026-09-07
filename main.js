const API_URL = 'https://lembrete-gabriela.samuelvivi1996.workers.dev';
 
const MENSAGENS = [
  '🌅 Ótimo dia para ser produtivo!',
  '💪 Você consegue conquistar tudo hoje!',
  '✨ Que seu dia seja tão brilhante quanto você!',
  '🎯 Vamos alcançar nossos objetivos!',
  '☀️ Um novo dia, novas oportunidades!',
];
 
// Estrutura centralizada do App
const APP = {
  modal: document.getElementById('modalAdicionar'),
  form: document.getElementById('formLembrete'),
  btnAdicionar: document.getElementById('btnAdicionar'),
  btnVerificar: document.getElementById('btnVerificar'),
  btnClose: document.getElementById('closeModal'),
  themeToggle: document.getElementById('themeToggle'),
  dailyMessage: document.getElementById('dailyMessage'),
  containerLembretes: document.getElementById('containerLembretes'),
  countLembretes: document.getElementById('countLembretes'),
 
  init() {
    this.carregarTemaSalvo();
    this.gerarMensagemDiaria();
    this.carregarLembretesDoDia();
    this.adicionarEventos();
  },
 
  adicionarEventos() {
    this.btnAdicionar.addEventListener('click', () => this.abrirModal());
    this.btnVerificar.addEventListener('click', () => this.atualizarLembretes());
    this.btnClose.addEventListener('click', () => this.fecharModal());
    this.themeToggle.addEventListener('click', () => this.alternarTema());
    this.form.addEventListener('submit', (e) => this.adicionarLembrete(e));
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.fecharModal();
    });
  },
 
  gerarMensagemDiaria() {
    const mensagem = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
    this.dailyMessage.textContent = mensagem;
  },
 
  alternarTema() {
    document.body.classList.toggle('dark-mode');
    const temaSalvo = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('tema', temaSalvo);
    this.themeToggle.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
  },
 
  carregarTemaSalvo() {
    const tema = localStorage.getItem('tema') || 'light';
    if (tema === 'dark') {
      document.body.classList.add('dark-mode');
      this.themeToggle.textContent = '☀️';
    }
  },
 
  abrirModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.form.reset();
  },
 
  fecharModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.form.reset();
  },
 
  mostrarMensagem(tipo, texto) {
    const div = document.createElement('div');
    const bgColor = tipo === 'sucesso' ? '#28a745' : '#dc3545';
    
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${bgColor};
      color: white;
      border-radius: 8px;
      font-weight: 600;
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    
    div.textContent = texto;
    document.body.appendChild(div);
    
    setTimeout(() => div.remove(), 3000);
  },
 
  async copiarTexto(texto, tipo) {
    try {
      await navigator.clipboard.writeText(texto);
      this.mostrarMensagem('sucesso', `✅ ${tipo} copiado!`);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  },
 
  atualizarLembretes() {
    this.mostrarMensagem('sucesso', '🔄 Atualizando...');
    this.carregarLembretesDoDia();
  },
 
  async adicionarLembrete(e) {
    e.preventDefault();
 
    const dados = {
      nome: document.getElementById('nome').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      data: document.getElementById('data').value,
      descricao: document.getElementById('descricao').value.trim(),
    };
 
    try {
      const response = await fetch(`${API_URL}/api/lembretes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
 
      if (response.ok) {
        this.mostrarMensagem('sucesso', '✅ Lembrete adicionado!');
        this.fecharModal();
        this.carregarLembretesDoDia();
      } else {
        this.mostrarMensagem('erro', '❌ Erro ao adicionar');
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },
 
  async carregarLembretesDoDia() {
    const hoje = new Date().toISOString().split('T')[0];
 
    try {
      const response = await fetch(`${API_URL}/api/lembretes`);
      const lembretes = await response.json();
 
      const lembretesHoje = lembretes.filter(l => l.data && l.data.startsWith(hoje));
 
      this.countLembretes.textContent = lembretesHoje.length;
 
      if (lembretesHoje.length === 0) {
        this.containerLembretes.innerHTML = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
          <p>📭 Nenhum lembrete para hoje</p>
          <p class="empty-text">Clique em "Adicionar Lembrete" para criar um novo</p>
        `;
        this.containerLembretes.appendChild(emptyDiv);
        return;
      }
 
      this.containerLembretes.innerHTML = '';
 
      lembretesHoje.forEach(lembrete => {
        const card = this.criarCardLembrete(lembrete);
        this.containerLembretes.appendChild(card);
      });
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      this.mostrarMensagem('erro', '❌ Erro ao conectar');
    }
  },
 
  criarCardLembrete(lembrete) {
    const card = document.createElement('div');
    card.className = 'lembrete-card';
 
    const dataFormatada = lembrete.data ? new Date(lembrete.data).toLocaleDateString('pt-BR') : 'Sem data';
    const status = lembrete.enviado ? 'Enviado' : 'Pendente';
    const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';
 
    // Criar header
    const header = document.createElement('div');
    header.className = 'lembrete-header';
 
    const info = document.createElement('div');
    info.className = 'lembrete-info';
 
    if (lembrete.nome) {
      const nome = document.createElement('h3');
      nome.textContent = lembrete.nome;
      info.appendChild(nome);
    }
 
    if (lembrete.telefone) {
      const telefone = document.createElement('div');
      telefone.className = 'lembrete-telefone-destaque';
      telefone.style.cursor = 'pointer';
      telefone.setAttribute('title', 'Clique para copiar');
      
      const icon = document.createElement('span');
      icon.textContent = '📱 ';
      
      const num = document.createElement('span');
      num.textContent = lembrete.telefone;
      
      telefone.appendChild(icon);
      telefone.appendChild(num);
      
      telefone.addEventListener('click', () => {
        this.copiarTexto(lembrete.telefone, 'Telefone');
      });
      
      info.appendChild(telefone);
    }
 
    const statusSpan = document.createElement('span');
    statusSpan.className = `lembrete-status ${statusClass}`;
    statusSpan.textContent = status;
 
    header.appendChild(info);
    header.appendChild(statusSpan);
    card.appendChild(header);
 
    // Criar body
    const body = document.createElement('div');
    body.className = 'lembrete-body';
 
    if (lembrete.data) {
      const data = document.createElement('p');
      data.className = 'lembrete-data';
      data.textContent = `📅 ${dataFormatada}`;
      body.appendChild(data);
    }
 
    if (lembrete.descricao) {
      const descricao = document.createElement('div');
      descricao.className = 'lembrete-mensagem-destaque';
      descricao.style.cursor = 'pointer';
      descricao.setAttribute('title', 'Clique para copiar');
      
      const msgText = document.createElement('p');
      msgText.textContent = lembrete.descricao;
      
      descricao.appendChild(msgText);
      
      descricao.addEventListener('click', () => {
        this.copiarTexto(lembrete.descricao, 'Mensagem');
      });
      
      body.appendChild(descricao);
    }
 
    card.appendChild(body);
 
    // Criar actions
    const actions = document.createElement('div');
    actions.className = 'lembrete-actions';
 
    if (lembrete.telefone) {
      const btnTelefone = document.createElement('button');
      btnTelefone.className = 'lembrete-btn btn-copiar';
      btnTelefone.textContent = '📋 Telefone';
      btnTelefone.addEventListener('click', () => {
        this.copiarTexto(lembrete.telefone, 'Telefone');
      });
      actions.appendChild(btnTelefone);
    }
 
    if (lembrete.descricao) {
      const btnMensagem = document.createElement('button');
      btnMensagem.className = 'lembrete-btn btn-copiar';
      btnMensagem.textContent = '📋 Mensagem';
      btnMensagem.addEventListener('click', () => {
        this.copiarTexto(lembrete.descricao, 'Mensagem');
      });
      actions.appendChild(btnMensagem);
    }
 
    const btnEnviado = document.createElement('button');
    btnEnviado.className = 'lembrete-btn btn-enviado';
    btnEnviado.textContent = lembrete.enviado ? '✓ Enviado' : 'Marcar Enviado';
    btnEnviado.addEventListener('click', () => {
      this.marcarEnviado(lembrete.id, !lembrete.enviado);
    });
    actions.appendChild(btnEnviado);
 
    const btnDeletar = document.createElement('button');
    btnDeletar.className = 'lembrete-btn btn-deletar';
    btnDeletar.textContent = '🗑️ Deletar';
    btnDeletar.addEventListener('click', () => {
      this.deletarLembrete(lembrete.id);
    });
    actions.appendChild(btnDeletar);
 
    card.appendChild(actions);
 
    return card;
  },
 
  async marcarEnviado(id, enviado) {
    try {
      const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enviado }),
      });
 
      if (response.ok) {
        this.carregarLembretesDoDia();
        const msg = enviado ? '✅ Marcado como enviado!' : '✅ Marcado como pendente!';
        this.mostrarMensagem('sucesso', msg);
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro ao atualizar');
    }
  },
 
  deletarLembrete(id) {
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'modal-confirmacao';
    
    const content = document.createElement('div');
    content.className = 'modal-confirmacao-content';
    
    const titulo = document.createElement('h3');
    titulo.textContent = 'Deletar Lembrete?';
    content.appendChild(titulo);
    
    const mensagem = document.createElement('p');
    mensagem.textContent = 'Esta ação não pode ser desfeita';
    content.appendChild(mensagem);
    
    const botoes = document.createElement('div');
    botoes.className = 'modal-confirmacao-buttons';
    
    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn-confirm-delete';
    btnConfirm.textContent = '🗑️ Deletar';
    
    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn-cancel-delete';
    btnCancel.textContent = 'Cancelar';
    
    botoes.appendChild(btnConfirm);
    botoes.appendChild(btnCancel);
    content.appendChild(botoes);
    
    confirmDelete.appendChild(content);
    document.body.appendChild(confirmDelete);
    
    btnCancel.addEventListener('click', () => {
      confirmDelete.remove();
    });
    
    btnConfirm.addEventListener('click', async () => {
      confirmDelete.remove();
      
      try {
        const response = await fetch(`${API_URL}/api/lembretes/${id}`, {
          method: 'DELETE',
        });
 
        if (response.ok) {
          this.carregarLembretesDoDia();
          this.mostrarMensagem('sucesso', '✅ Lembrete deletado!');
        }
      } catch (error) {
        console.error('Erro:', error);
        this.mostrarMensagem('erro', '❌ Erro ao deletar');
      }
    });
  }
};
 
// Inicializar quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
