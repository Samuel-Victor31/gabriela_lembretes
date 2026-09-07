const API_URL = 'https://lembrete-gabriela.samuelvivi1996.workers.dev';

// Mensagens inspiradoras em feminino - INCLUA O ARQUIVO mensagens.js ANTES DESTE
// <script src="mensagens.js"></script>

// Estrutura centralizada do App
const APP = {
  API_URL: API_URL,
  modal: document.getElementById('modalAdicionar'),
  form: document.getElementById('formLembrete'),
  btnAdicionar: document.getElementById('btnAdicionar'),
  btnVerificar: document.getElementById('btnVerificar'),
  btnClose: document.getElementById('closeModal'),
  themeToggle: document.getElementById('themeToggle'),
  dailyMessage: document.getElementById('dailyMessage'),
  containerLembretes: document.getElementById('containerLembretes'),
  countLembretes: document.getElementById('countLembretes'),

  // Modal Verificar
  modalVerificar: document.getElementById('modalVerificar'),
  containerVerificar: document.getElementById('containerVerificar'),
  closeVerificar: document.getElementById('closeVerificar'),
  btnFecharVerificar: document.getElementById('btnFecharVerificar'),
  btnAtualizarModal: document.getElementById('btnAtualizarModal'),
  filtroSemana: document.getElementById('filtroSemana'),
  filtroStatus: document.getElementById('filtroStatus'),

  // Modal Editar
  modalEditar: document.getElementById('modalEditar'),
  formEditar: document.getElementById('formEditar'),
  closeEditar: document.getElementById('closeEditar'),
  btnCancelarEditar: document.getElementById('btnCancelarEditar'),

  lembreteSelecionado: null,
  lembretesVerificar: [],
  intervaloMensagens: null,

  init() {
    this.carregarTemaSalvo();
    this.gerarMensagemDiaria();
    this.carregarLembretesDoDia();
    this.adicionarEventos();
  },

  adicionarEventos() {
    this.btnAdicionar.addEventListener('click', () => this.abrirModal());
    this.btnVerificar.addEventListener('click', () => this.abrirModalVerificar());
    this.btnClose.addEventListener('click', () => this.fecharModal());
    this.closeVerificar.addEventListener('click', () => this.fecharModalVerificar());
    this.btnFecharVerificar.addEventListener('click', () => this.fecharModalVerificar());
    this.closeEditar.addEventListener('click', () => this.fecharModalEditar());
    this.btnCancelarEditar.addEventListener('click', () => this.fecharModalEditar());
    this.themeToggle.addEventListener('click', () => this.alternarTema());
    this.form.addEventListener('submit', (e) => this.adicionarLembrete(e));
    this.formEditar.addEventListener('submit', (e) => this.salvarEdicao(e));
    this.btnAtualizarModal.addEventListener('click', () => this.carregarLembretesVerificar());
    this.filtroSemana.addEventListener('change', () => this.renderizarLembretesVerificar());
    this.filtroStatus.addEventListener('change', () => this.renderizarLembretesVerificar());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.fecharModal();
    });

    this.modalVerificar.addEventListener('click', (e) => {
      if (e.target === this.modalVerificar) this.fecharModalVerificar();
    });

    this.modalEditar.addEventListener('click', (e) => {
      if (e.target === this.modalEditar) this.fecharModalEditar();
    });
  },

  gerarMensagemDiaria() {
    const mensagem = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
    this.dailyMessage.textContent = mensagem;
    
    // Iniciar rotação automática a cada 10 minutos
    this.iniciarRotacaoMensagens();
  },

  iniciarRotacaoMensagens() {
    // Limpar intervalo anterior se existir
    if (this.intervaloMensagens) {
      clearInterval(this.intervaloMensagens);
    }
    
    // Trocar mensagem a cada 10 minutos (600000 ms)
    this.intervaloMensagens = setInterval(() => {
      const mensagem = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
      this.dailyMessage.textContent = mensagem;
      console.log('✨ Mensagem atualizada: ' + mensagem);
    }, 600000); // 10 minutos
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

  abrirModalVerificar() {
    this.modalVerificar.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.carregarLembretesVerificar();
  },

  fecharModalVerificar() {
    this.modalVerificar.classList.add('hidden');
    document.body.style.overflow = 'auto';
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

  async adicionarLembrete(e) {
    e.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      data: document.getElementById('data').value,
      descricao: document.getElementById('descricao').value.trim(),
    };

    try {
      const response = await fetch(`${this.API_URL}/api/lembretes`, {
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
      const response = await fetch(`${this.API_URL}/api/lembretes`);
      const lembretes = await response.json();

      const lembretesHoje = lembretes.filter(l => l.data && l.data.startsWith(hoje));

      this.countLembretes.textContent = lembretesHoje.length;

      if (lembretesHoje.length === 0) {
        this.containerLembretes.innerHTML = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
          <p>📭 Nenhum lembrete para hoje</p>
          <p class="empty-text">Clique em "Verificar Lembretes" para ver todos</p>
        `;
        this.containerLembretes.appendChild(emptyDiv);
        return;
      }

      this.containerLembretes.innerHTML = '';

      lembretesHoje.forEach(lembrete => {
        const card = this.criarCardLembreteDoDia(lembrete);
        this.containerLembretes.appendChild(card);
      });
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      this.mostrarMensagem('erro', '❌ Erro ao conectar');
    }
  },

  criarCardLembreteDoDia(lembrete) {
    const card = document.createElement('div');
    card.className = 'lembrete-card';

    const dataFormatada = lembrete.data ? new Date(lembrete.data).toLocaleDateString('pt-BR') : 'Sem data';
    const status = lembrete.enviado ? 'Enviado' : 'Pendente';
    const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';

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
      const response = await fetch(`${this.API_URL}/api/lembretes/${id}`, {
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
        const response = await fetch(`${this.API_URL}/api/lembretes/${id}`, {
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
  },

  // ========== FUNÇÕES PARA MODAL VERIFICAR ==========

  async carregarLembretesVerificar() {
    const container = this.containerVerificar;

    try {
      container.innerHTML = '<div class="loading">Carregando lembretes...</div>';

      const response = await fetch(`${this.API_URL}/api/lembretes`);
      const lembretes = await response.json();

      // IMPORTANTE: Não filtrar por data aqui
      // Carregar TODOS os lembretes
      this.lembretesVerificar = lembretes.sort((a, b) => {
        // Ordenar por data se tiver, senão por ID
        if (a.data && b.data) {
          return new Date(b.data) - new Date(a.data);
        }
        return b.id - a.id;
      });

      console.log(`📊 Lembretes carregados: ${this.lembretesVerificar.length}`);

      this.renderizarLembretesVerificar();
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      container.innerHTML = `
        <div class="sem-lembretes">
          <div class="sem-lembretes-icon">❌</div>
          <p class="sem-lembretes-texto">Erro ao carregar lembretes</p>
        </div>
      `;
    }
  },

  renderizarLembretesVerificar() {
    const container = this.containerVerificar;

    let lembretesExibir = this.lembretesVerificar;

    // Filtrar por período (agora funciona com lembretes sem data também)
    const periodoFiltro = this.filtroSemana.value;
    if (periodoFiltro !== 'todos') {
      const hoje = new Date();
      lembretesExibir = lembretesExibir.filter(l => {
        if (!l.data) return true; // Mostrar lembretes sem data em qualquer filtro
        
        const dataLembrete = new Date(l.data);
        let diasAtrás = 0;

        switch (periodoFiltro) {
          case 'semana':
            diasAtrás = 7;
            break;
          case 'duas-semanas':
            diasAtrás = 14;
            break;
          case 'mes':
            diasAtrás = 30;
            break;
        }

        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - diasAtrás);

        return dataLembrete >= dataLimite && dataLembrete <= hoje;
      });
    }

    // Filtrar por status
    if (this.filtroStatus.value === 'pendentes') {
      lembretesExibir = lembretesExibir.filter(l => !l.enviado);
    } else if (this.filtroStatus.value === 'enviados') {
      lembretesExibir = lembretesExibir.filter(l => l.enviado);
    }

    this.atualizarEstatisticas();

    if (lembretesExibir.length === 0) {
      container.innerHTML = `
        <div class="sem-lembretes">
          <div class="sem-lembretes-icon">📭</div>
          <p class="sem-lembretes-texto">Nenhum lembrete encontrado</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    lembretesExibir.forEach(lembrete => {
      const card = this.criarCardVerificar(lembrete);
      container.appendChild(card);
    });
  },

  criarCardVerificar(lembrete) {
    const card = document.createElement('div');
    card.className = 'lembrete-verificar-card';

    const dataFormatada = lembrete.data ? new Date(lembrete.data).toLocaleDateString('pt-BR') : 'Sem data';
    const status = lembrete.enviado ? 'Enviado' : 'Pendente';
    const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';

    const header = document.createElement('div');
    header.className = 'lembrete-card-header';

    const title = document.createElement('div');
    title.className = 'lembrete-card-title';

    if (lembrete.nome) {
      const nome = document.createElement('h3');
      nome.textContent = lembrete.nome;
      title.appendChild(nome);
    }

    const statusSpan = document.createElement('span');
    statusSpan.className = `lembrete-card-status ${statusClass}`;
    statusSpan.textContent = status;

    header.appendChild(title);
    header.appendChild(statusSpan);
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'lembrete-card-body';

    if (lembrete.data) {
      const dataDiv = document.createElement('div');
      dataDiv.className = 'lembrete-info-item';
      dataDiv.innerHTML = `
        <span class="lembrete-info-label">📅 Data:</span>
        <span class="lembrete-info-value">${dataFormatada}</span>
      `;
      body.appendChild(dataDiv);
    }

    if (lembrete.telefone) {
      const telefoneDiv = document.createElement('div');
      telefoneDiv.className = 'lembrete-info-item lembrete-telefone-card';
      telefoneDiv.style.cursor = 'pointer';
      telefoneDiv.setAttribute('title', 'Clique para copiar');
      telefoneDiv.innerHTML = `
        <span class="lembrete-info-label">📱 Telefone:</span>
        <span class="lembrete-info-value">${lembrete.telefone}</span>
      `;
      telefoneDiv.addEventListener('click', () => {
        this.copiarTexto(lembrete.telefone, 'Telefone');
      });
      body.appendChild(telefoneDiv);
    }

    if (lembrete.descricao) {
      const descricaoDiv = document.createElement('div');
      descricaoDiv.className = 'lembrete-info-item lembrete-mensagem-card';
      descricaoDiv.style.cursor = 'pointer';
      descricaoDiv.setAttribute('title', 'Clique para copiar');
      descricaoDiv.innerHTML = `
        <span class="lembrete-info-label">💬 Mensagem:</span>
        <span class="lembrete-info-value">${lembrete.descricao}</span>
      `;
      descricaoDiv.addEventListener('click', () => {
        this.copiarTexto(lembrete.descricao, 'Mensagem');
      });
      body.appendChild(descricaoDiv);
    }

    card.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'lembrete-card-actions';

    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn-card-acao btn-editar';
    btnEditar.textContent = '✏️ Editar';
    btnEditar.addEventListener('click', () => {
      this.abrirModalEdicao(lembrete);
    });
    actions.appendChild(btnEditar);

    const btnEnviado = document.createElement('button');
    btnEnviado.className = `btn-card-acao btn-marcar-enviado ${lembrete.enviado ? 'enviado' : ''}`;
    btnEnviado.textContent = lembrete.enviado ? '✅ Enviado' : '⬜ Marcar Enviado';
    btnEnviado.addEventListener('click', () => {
      this.marcarEnviadoVerificar(lembrete.id, !lembrete.enviado);
    });
    actions.appendChild(btnEnviado);

    const btnDeletar = document.createElement('button');
    btnDeletar.className = 'btn-card-acao btn-deletar-card';
    btnDeletar.textContent = '🗑️ Deletar';
    btnDeletar.addEventListener('click', () => {
      this.deletarLembreteVerificar(lembrete.id, lembrete.nome || 'Lembrete');
    });
    actions.appendChild(btnDeletar);

    card.appendChild(actions);

    return card;
  },

  abrirModalEdicao(lembrete) {
    this.lembreteSelecionado = lembrete;

    document.getElementById('editarNome').value = lembrete.nome || '';
    document.getElementById('editarTelefone').value = lembrete.telefone || '';
    document.getElementById('editarData').value = lembrete.data || '';
    document.getElementById('editarDescricao').value = lembrete.descricao || '';
    document.getElementById('editarEnviado').checked = lembrete.enviado || false;

    this.modalEditar.classList.remove('hidden');
  },

  fecharModalEditar() {
    this.modalEditar.classList.add('hidden');
    this.lembreteSelecionado = null;
  },

  async salvarEdicao(e) {
    e.preventDefault();

    if (!this.lembreteSelecionado) return;

    const dados = {
      nome: document.getElementById('editarNome').value.trim() || null,
      telefone: document.getElementById('editarTelefone').value.trim() || null,
      data: document.getElementById('editarData').value || null,
      descricao: document.getElementById('editarDescricao').value.trim() || null,
      enviado: document.getElementById('editarEnviado').checked,
    };

    try {
      const response = await fetch(
        `${this.API_URL}/api/lembretes/${this.lembreteSelecionado.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        }
      );

      if (response.ok) {
        this.mostrarMensagem('sucesso', '✅ Lembrete atualizado com sucesso!');
        this.fecharModalEditar();
        this.carregarLembretesVerificar();
        this.carregarLembretesDoDia();
      } else {
        this.mostrarMensagem('erro', '❌ Erro ao atualizar lembrete');
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },

  async marcarEnviadoVerificar(id, enviado) {
    try {
      const response = await fetch(
        `${this.API_URL}/api/lembretes/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enviado }),
        }
      );

      if (response.ok) {
        const msg = enviado ? '✅ Marcado como enviado!' : '✅ Marcado como pendente!';
        this.mostrarMensagem('sucesso', msg);
        this.carregarLembretesVerificar();
        this.carregarLembretesDoDia();
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro ao atualizar');
    }
  },

  deletarLembreteVerificar(id, nome) {
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'modal-confirmacao';

    const content = document.createElement('div');
    content.className = 'modal-confirmacao-content';

    const titulo = document.createElement('h3');
    titulo.textContent = `Deletar "${nome}"?`;
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
        const response = await fetch(
          `${this.API_URL}/api/lembretes/${id}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          this.mostrarMensagem('sucesso', '✅ Lembrete deletado!');
          this.carregarLembretesVerificar();
          this.carregarLembretesDoDia();
        }
      } catch (error) {
        console.error('Erro:', error);
        this.mostrarMensagem('erro', '❌ Erro ao deletar');
      }
    });
  },

  atualizarEstatisticas() {
    const total = this.lembretesVerificar.length;
    const pendentes = this.lembretesVerificar.filter(l => !l.enviado).length;
    const enviados = this.lembretesVerificar.filter(l => l.enviado).length;

    const totalStats = document.getElementById('totalStats');
    const pendentesStats = document.getElementById('pendentesStats');
    const enviadosStats = document.getElementById('enviadosStats');

    if (totalStats) totalStats.textContent = total;
    if (pendentesStats) pendentesStats.textContent = pendentes;
    if (enviadosStats) enviadosStats.textContent = enviados;
  }
};

// Inicializar quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
