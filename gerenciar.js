/**
 * Gerenciador de Lembretes - gerenciar.js
 * Carrega lembretes de até 2 semanas com edição e deleção
 */

const GERENCIADOR = {
  lembretesAtivos: [],
  lembreteSelecionado: null,
  filtroSemana: 'duas-semanas',
  filtroStatus: 'todos',

  async init() {
    this.adicionarEventos();
    await this.carregarLembretes();
  },

  adicionarEventos() {
    const filtroSemana = document.getElementById('filtroSemana');
    const filtroStatus = document.getElementById('filtroStatus');
    const formEditar = document.getElementById('formEditar');

    if (filtroSemana) {
      filtroSemana.addEventListener('change', (e) => {
        this.filtroSemana = e.target.value;
        this.carregarLembretes();
      });
    }

    if (filtroStatus) {
      filtroStatus.addEventListener('change', (e) => {
        this.filtroStatus = e.target.value;
        this.renderizarLembretes();
      });
    }

    if (formEditar) {
      formEditar.addEventListener('submit', (e) => this.salvarEdicao(e));
    }
  },

  async carregarLembretes() {
    const container = document.getElementById('containerGerenciar');

    try {
      container.innerHTML = '<div class="loading">Carregando lembretes...</div>';

      const response = await fetch(`${APP.API_URL}/api/lembretes`);
      const lembretes = await response.json();

      // Filtrar por período
      const hoje = new Date();
      const lembretesFilterados = lembretes.filter(l => {
        if (!l.data) return false;

        const dataLembrete = new Date(l.data);
        let diasAtrás = 0;

        switch (this.filtroSemana) {
          case 'semana':
            diasAtrás = 7;
            break;
          case 'duas-semanas':
            diasAtrás = 14;
            break;
          case 'mes':
            diasAtrás = 30;
            break;
          default:
            return true;
        }

        const dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - diasAtrás);

        return dataLembrete >= dataLimite && dataLembrete <= hoje;
      });

      this.lembretesAtivos = lembretesFilterados.sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
      });

      this.renderizarLembretes();
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

  renderizarLembretes() {
    const container = document.getElementById('containerGerenciar');

    // Filtrar por status
    let lembretesExibir = this.lembretesAtivos;

    if (this.filtroStatus === 'pendentes') {
      lembretesExibir = lembretesExibir.filter(l => !l.enviado);
    } else if (this.filtroStatus === 'enviados') {
      lembretesExibir = lembretesExibir.filter(l => l.enviado);
    }

    // Contar estatísticas
    this.atualizarEstatisticas();

    if (lembretesExibir.length === 0) {
      container.innerHTML = `
        <div class="sem-lembretes">
          <div class="sem-lembretes-icon">📭</div>
          <p class="sem-lembretes-texto">Nenhum lembrete encontrado</p>
          <p class="sem-lembretes-texto" style="font-size: 0.9em; color: var(--text-secondary);">
            Ajuste os filtros ou crie um novo lembrete
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    lembretesExibir.forEach(lembrete => {
      const card = this.criarCard(lembrete);
      container.appendChild(card);
    });
  },

  criarCard(lembrete) {
    const card = document.createElement('div');
    card.className = 'lembrete-gerenciar-card';

    const dataFormatada = new Date(lembrete.data).toLocaleDateString('pt-BR');
    const status = lembrete.enviado ? 'Enviado' : 'Pendente';
    const statusClass = lembrete.enviado ? 'status-enviado' : 'status-pendente';

    // Header
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

    // Body
    const body = document.createElement('div');
    body.className = 'lembrete-card-body';

    // Data
    if (lembrete.data) {
      const dataDiv = document.createElement('div');
      dataDiv.className = 'lembrete-info-item';
      dataDiv.innerHTML = `
        <span class="lembrete-info-label">📅 Data:</span>
        <span class="lembrete-info-value">${dataFormatada}</span>
      `;
      body.appendChild(dataDiv);
    }

    // Telefone
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

    // Mensagem
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

    // Actions
    const actions = document.createElement('div');
    actions.className = 'lembrete-card-actions';

    // Botão Editar
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn-card-acao btn-editar';
    btnEditar.textContent = '✏️ Editar';
    btnEditar.addEventListener('click', () => {
      this.abrirModalEdicao(lembrete);
    });
    actions.appendChild(btnEditar);

    // Botão Marcar Enviado
    const btnEnviado = document.createElement('button');
    btnEnviado.className = `btn-card-acao btn-marcar-enviado ${lembrete.enviado ? 'enviado' : ''}`;
    btnEnviado.textContent = lembrete.enviado ? '✅ Enviado' : '⬜ Marcar Enviado';
    btnEnviado.addEventListener('click', () => {
      this.marcarEnviado(lembrete.id, !lembrete.enviado);
    });
    actions.appendChild(btnEnviado);

    // Botão Deletar
    const btnDeletar = document.createElement('button');
    btnDeletar.className = 'btn-card-acao btn-deletar-card';
    btnDeletar.textContent = '🗑️ Deletar';
    btnDeletar.addEventListener('click', () => {
      this.confirmarDelecao(lembrete.id, lembrete.nome || 'Lembrete');
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

    const modal = document.getElementById('modalEditar');
    modal.classList.remove('hidden');
  },

  fecharModalEditar() {
    const modal = document.getElementById('modalEditar');
    modal.classList.add('hidden');
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
        `${APP.API_URL}/api/lembretes/${this.lembreteSelecionado.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        }
      );

      if (response.ok) {
        APP.mostrarMensagem('sucesso', '✅ Lembrete atualizado com sucesso!');
        this.fecharModalEditar();
        await this.carregarLembretes();
      } else {
        APP.mostrarMensagem('erro', '❌ Erro ao atualizar lembrete');
      }
    } catch (error) {
      console.error('Erro:', error);
      APP.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },

  async marcarEnviado(id, enviado) {
    try {
      const response = await fetch(
        `${APP.API_URL}/api/lembretes/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enviado }),
        }
      );

      if (response.ok) {
        const msg = enviado ? '✅ Marcado como enviado!' : '✅ Marcado como pendente!';
        APP.mostrarMensagem('sucesso', msg);
        await this.carregarLembretes();
      }
    } catch (error) {
      console.error('Erro:', error);
      APP.mostrarMensagem('erro', '❌ Erro ao atualizar');
    }
  },

  confirmarDelecao(id, nome) {
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
          `${APP.API_URL}/api/lembretes/${id}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          APP.mostrarMensagem('sucesso', '✅ Lembrete deletado!');
          await this.carregarLembretes();
        }
      } catch (error) {
        console.error('Erro:', error);
        APP.mostrarMensagem('erro', '❌ Erro ao deletar');
      }
    });
  },

  async copiarTexto(texto, tipo) {
    try {
      await navigator.clipboard.writeText(texto);
      APP.mostrarMensagem('sucesso', `✅ ${tipo} copiado!`);
    } catch (error) {
      console.error('Erro:', error);
    }
  },

  atualizarEstatisticas() {
    const total = this.lembretesAtivos.length;
    const pendentes = this.lembretesAtivos.filter(l => !l.enviado).length;
    const enviados = this.lembretesAtivos.filter(l => l.enviado).length;

    const totalStats = document.getElementById('totalStats');
    const pendentesStats = document.getElementById('pendentesStats');
    const enviadosStats = document.getElementById('enviadosStats');

    if (totalStats) totalStats.textContent = total;
    if (pendentesStats) pendentesStats.textContent = pendentes;
    if (enviadosStats) enviadosStats.textContent = enviados;
  },
};

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  GERENCIADOR.init();
});
