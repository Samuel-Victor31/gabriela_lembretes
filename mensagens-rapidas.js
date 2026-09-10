/**
 * MENSAGENS RÁPIDAS
 * Sistema tipo WhatsApp para gerenciar mensagens pré-configuradas
 */
const MENSAGENS_RAPIDAS = {
  API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',
  mensagens: [],
  mensagensCopiadas: [],
  
  // Categorias predefinidas
  categorias: [
    'Confirmação',
    'Agradecimento',
    'Follow-up',
    'Promissória',
    'Desconto',
    'Outro'
  ],
  
  init() {
    this.btnMensagensRapidas = document.getElementById('btnMensagensRapidas');
    this.modalMensagensRapidas = document.getElementById('modalMensagensRapidas');
    this.containerMensagens = document.getElementById('containerMensagens');
    this.formMensagem = document.getElementById('formMensagem');
    this.searchMensagens = document.getElementById('searchMensagens');
    this.filterCategoria = document.getElementById('filterCategoria');
    this.filtroFavoritos = document.getElementById('filtroFavoritos');
    
    if (this.btnMensagensRapidas) {
      this.btnMensagensRapidas.addEventListener('click', () => this.abrirModal());
    }
    
    if (this.formMensagem) {
      this.formMensagem.addEventListener('submit', (e) => this.adicionarMensagem(e));
    }
    
    if (this.searchMensagens) {
      this.searchMensagens.addEventListener('input', () => this.renderizarMensagens());
    }
    
    if (this.filterCategoria) {
      this.filterCategoria.addEventListener('change', () => this.renderizarMensagens());
    }
    
    if (this.filtroFavoritos) {
      this.filtroFavoritos.addEventListener('change', () => this.renderizarMensagens());
    }
    
    // Buscar mensagens salvas
    this.carregarMensagens();
    
    // Fechar modal ao clicar fora
    if (this.modalMensagensRapidas) {
      this.modalMensagensRapidas.addEventListener('click', (e) => {
        if (e.target === this.modalMensagensRapidas) {
          this.fecharModal();
        }
      });
    }
  },
  
  abrirModal() {
    if (this.modalMensagensRapidas) {
      this.modalMensagensRapidas.classList.remove('hidden');
      this.renderizarMensagens();
      // Sincronizar dark mode
      this.sincronizarDarkMode();
    }
  },
  
  fecharModal() {
    if (this.modalMensagensRapidas) {
      this.modalMensagensRapidas.classList.add('hidden');
    }
  },
  
  sincronizarDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
      this.modalMensagensRapidas?.classList.add('dark-mode');
    } else {
      this.modalMensagensRapidas?.classList.remove('dark-mode');
    }
  },
  
  adicionarMensagem(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('tituloMensagem').value.trim();
    const conteudo = document.getElementById('conteudoMensagem').value.trim();
    const categoria = document.getElementById('categoriaMensagem').value;
    
    if (!titulo || !conteudo) {
      this.mostrarMensagem('erro', 'Preencha título e conteúdo');
      return;
    }
    
    const novaMensagem = {
      id: Date.now(),
      titulo,
      conteudo,
      categoria,
      favorito: false,
      criado_em: new Date().toISOString(),
      copiasRealizadas: 0
    };
    
    this.mensagens.push(novaMensagem);
    this.salvarMensagens();
    
    this.mostrarMensagem('sucesso', '✅ Mensagem adicionada!');
    this.formMensagem.reset();
    this.renderizarMensagens();
  },
  
  async salvarMensagens() {
    try {
      localStorage.setItem('mensagens_rapidas', JSON.stringify(this.mensagens));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  },
  
  async carregarMensagens() {
    try {
      const salvo = localStorage.getItem('mensagens_rapidas');
      if (salvo) {
        this.mensagens = JSON.parse(salvo);
      } else {
        // Mensagens padrão
        this.mensagens = [
          {
            id: 1,
            titulo: 'Confirmação de Agendamento',
            conteudo: 'Olá {nome_cliente}! Sua consulta está confirmada para {data} às {hora}. Qualquer dúvida, é só chamar! 😊',
            categoria: 'Confirmação',
            favorito: true,
            criado_em: new Date().toISOString(),
            copiasRealizadas: 0
          },
          {
            id: 2,
            titulo: 'Obrigado pela Confiança',
            conteudo: 'Muito obrigada {nome_cliente}! Sua confiança significa muito pra mim. Volte sempre! 🙏❤️',
            categoria: 'Agradecimento',
            favorito: true,
            criado_em: new Date().toISOString(),
            copiasRealizadas: 0
          },
          {
            id: 3,
            titulo: 'Lembrete de Consulta',
            conteudo: 'Oi {nome_cliente}! Isso é um lembrete: sua consulta é amanhã às {hora}. Nos vemos lá! 💅',
            categoria: 'Follow-up',
            favorito: false,
            criado_em: new Date().toISOString(),
            copiasRealizadas: 0
          }
        ];
        this.salvarMensagens();
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  },
  
  renderizarMensagens() {
    const termo = (this.searchMensagens?.value || '').toLowerCase();
    const categoria = this.filterCategoria?.value || '';
    const apensFavoritos = this.filtroFavoritos?.checked || false;
    
    let filtradas = this.mensagens.filter(m => {
      const correspondeTermo = m.titulo.toLowerCase().includes(termo) || 
                             m.conteudo.toLowerCase().includes(termo);
      const correspondeCategoria = !categoria || m.categoria === categoria;
      const correspondeFavorito = !apensFavoritos || m.favorito;
      
      return correspondeTermo && correspondeCategoria && correspondeFavorito;
    });
    
    if (this.containerMensagens) {
      this.containerMensagens.innerHTML = '';
    }
    
    if (filtradas.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<p>📭 Nenhuma mensagem encontrada</p>';
      if (this.containerMensagens) {
        this.containerMensagens.appendChild(empty);
      }
      return;
    }
    
    filtradas.forEach(msg => {
      const card = this.criarCardMensagem(msg);
      if (this.containerMensagens) {
        this.containerMensagens.appendChild(card);
      }
    });
  },
  
  criarCardMensagem(msg) {
    const card = document.createElement('div');
    card.className = 'card-mensagem-rapida';
    card.innerHTML = `
      <div class="mensagem-header">
        <div class="mensagem-titulo-categoria">
          <h3 class="mensagem-titulo">${msg.titulo}</h3>
          <span class="categoria-badge categoria-${msg.categoria.toLowerCase()}">${msg.categoria}</span>
        </div>
        <button class="btn-favorito ${msg.favorito ? 'favorito' : ''}" title="Favoritar">
          ${msg.favorito ? '⭐' : '☆'}
        </button>
      </div>
      
      <div class="mensagem-conteudo">${this.escaparHtml(msg.conteudo)}</div>
      
      <div class="mensagem-templates">
        <small class="info-template">📝 Placeholders: {nome_cliente} {data} {hora} {telefone}</small>
      </div>
      
      <div class="mensagem-stats">
        <small>Copiado ${msg.copiasRealizadas}x</small>
      </div>
      
      <div class="mensagem-acoes">
        <button class="btn-copy" title="Copiar (${this.contarCaracteres(msg.conteudo)} caracteres)">
          📋 Copiar
        </button>
        <button class="btn-editar">
          ✏️ Editar
        </button>
        <button class="btn-deletar">
          🗑️ Deletar
        </button>
      </div>
    `;
    
    // Event listeners
    const btnFavorito = card.querySelector('.btn-favorito');
    const btnCopy = card.querySelector('.btn-copy');
    const btnEditar = card.querySelector('.btn-editar');
    const btnDeletar = card.querySelector('.btn-deletar');
    
    btnFavorito.addEventListener('click', () => this.toggleFavorito(msg.id));
    btnCopy.addEventListener('click', () => this.copiarMensagem(msg));
    btnEditar.addEventListener('click', () => this.abrirModalEditar(msg));
    btnDeletar.addEventListener('click', () => this.deletarMensagem(msg.id));
    
    return card;
  },
  
  toggleFavorito(id) {
    const msg = this.mensagens.find(m => m.id === id);
    if (msg) {
      msg.favorito = !msg.favorito;
      this.salvarMensagens();
      this.renderizarMensagens();
    }
  },
  
  copiarMensagem(msg) {
    // Copiar conteúdo para clipboard
    navigator.clipboard.writeText(msg.conteudo).then(() => {
      msg.copiasRealizadas = (msg.copiasRealizadas || 0) + 1;
      this.salvarMensagens();
      this.mostrarMensagem('sucesso', '✅ Copiado para clipboard!');
      this.renderizarMensagens();
      
      // Registrar no histórico
      this.mensagensCopiadas.unshift({
        titulo: msg.titulo,
        data: new Date(),
        conteudo: msg.conteudo
      });
      
      // Manter apenas últimas 10
      if (this.mensagensCopiadas.length > 10) {
        this.mensagensCopiadas.pop();
      }
    }).catch(err => {
      this.mostrarMensagem('erro', '❌ Erro ao copiar');
    });
  },
  
  abrirModalEditar(msg) {
    const modal = document.createElement('div');
    modal.className = 'modal-editar-mensagem';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2001;';
    
    const conteudo = document.createElement('div');
    conteudo.style.cssText = 'background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
    
    conteudo.innerHTML = `
      <h2 style="color: #667eea; margin-top: 0;">Editar Mensagem</h2>
      <form id="formEditarMensagem">
        <div class="form-group">
          <label for="editTitulo">Título:</label>
          <input type="text" id="editTitulo" value="${msg.titulo}" required>
        </div>
        
        <div class="form-group">
          <label for="editConteudo">Conteúdo:</label>
          <textarea id="editConteudo" required>${msg.conteudo}</textarea>
          <small id="charCount" style="color: #999; margin-top: 5px;"></small>
        </div>
        
        <div class="form-group">
          <label for="editCategoria">Categoria:</label>
          <select id="editCategoria">
            ${this.categorias.map(cat => `
              <option value="${cat}" ${msg.categoria === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="submit" style="flex: 1; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Salvar
          </button>
          <button type="button" id="btnCancelarEdicao" style="flex: 1; padding: 12px; background: #ccc; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Cancelar
          </button>
        </div>
      </form>
    `;
    
    modal.appendChild(conteudo);
    document.body.appendChild(modal);
    
    const editConteudo = conteudo.querySelector('#editConteudo');
    const charCount = conteudo.querySelector('#charCount');
    
    // Atualizar contador de caracteres
    const atualizarContador = () => {
      const count = editConteudo.value.length;
      charCount.textContent = `${count} caracteres`;
    };
    editConteudo.addEventListener('input', atualizarContador);
    atualizarContador();
    
    conteudo.querySelector('#formEditarMensagem').addEventListener('submit', (e) => {
      e.preventDefault();
      msg.titulo = conteudo.querySelector('#editTitulo').value;
      msg.conteudo = editConteudo.value;
      msg.categoria = conteudo.querySelector('#editCategoria').value;
      this.salvarMensagens();
      this.mostrarMensagem('sucesso', '✅ Mensagem atualizada!');
      modal.remove();
      this.renderizarMensagens();
    });
    
    conteudo.querySelector('#btnCancelarEdicao').addEventListener('click', () => modal.remove());
  },
  
  deletarMensagem(id) {
    if (confirm('Tem certeza que quer deletar essa mensagem?')) {
      this.mensagens = this.mensagens.filter(m => m.id !== id);
      this.salvarMensagens();
      this.mostrarMensagem('sucesso', '✅ Mensagem deletada!');
      this.renderizarMensagens();
    }
  },
  
  contarCaracteres(texto) {
    return texto.length;
  },
  
  escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML.replace(/\n/g, '<br>');
  },
  
  mostrarMensagem(tipo, texto) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = texto;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${tipo === 'sucesso' ? '#4caf50' : '#f44336'};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 3000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MENSAGENS_RAPIDAS.init());
} else {
  MENSAGENS_RAPIDAS.init();
}
