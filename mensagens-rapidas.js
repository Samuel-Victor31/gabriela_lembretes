/**
 * MENSAGENS RÁPIDAS - COM BANCO DE DADOS
 * Sistema tipo WhatsApp para gerenciar mensagens pré-configuradas
 * Agora salva no banco de dados (D1) em vez de localStorage
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
    this.btnMensagensRapidas = document.getElementById('btnMensagensRapidasMain');
    this.btnFecharMensagensRapidas = document.getElementById('btnFecharMensagensRapidas');
    this.btnAbaMensagensLista = document.getElementById('btnAbaMensagensLista');
    this.btnAbaCadastrarMensagem = document.getElementById('btnAbaCadastrarMensagem');
    this.abaListaMensagens = document.getElementById('abaListaMensagens');
    this.abaCadastrarMensagem = document.getElementById('abaCadastrarMensagem');
    this.modalMensagensRapidas = document.getElementById('modalMensagensRapidas');
    this.containerMensagens = document.getElementById('containerMensagens');
    this.formMensagem = document.getElementById('formMensagem');
    this.searchMensagens = document.getElementById('searchMensagens');
    this.filterCategoria = document.getElementById('filterCategoria');
    this.filtroFavoritos = document.getElementById('filtroFavoritos');
    
    if (this.btnMensagensRapidas) {
      this.btnMensagensRapidas.addEventListener('click', () => this.abrirModal());
    }
    
    if (this.btnFecharMensagensRapidas) {
      this.btnFecharMensagensRapidas.addEventListener('click', () => this.fecharModal());
    }
    
    // Alternar entre abas
    if (this.btnAbaMensagensLista) {
      this.btnAbaMensagensLista.addEventListener('click', () => this.ativarAba('lista'));
    }
    
    if (this.btnAbaCadastrarMensagem) {
      this.btnAbaCadastrarMensagem.addEventListener('click', () => this.ativarAba('cadastrar'));
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
    
    // Buscar mensagens do banco de dados
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
  
  ativarAba(aba) {
    if (aba === 'lista') {
      this.abaListaMensagens?.classList.add('active');
      this.abaCadastrarMensagem?.classList.remove('active');
      this.btnAbaMensagensLista?.classList.add('active');
      this.btnAbaCadastrarMensagem?.classList.remove('active');
    } else if (aba === 'cadastrar') {
      this.abaListaMensagens?.classList.remove('active');
      this.abaCadastrarMensagem?.classList.add('active');
      this.btnAbaMensagensLista?.classList.remove('active');
      this.btnAbaCadastrarMensagem?.classList.add('active');
    }
  },
  
  abrirModal() {
    if (this.modalMensagensRapidas) {
      this.modalMensagensRapidas.classList.remove('hidden');
      // Ativar aba de mensagens cadastradas por padrão
      this.ativarAba('lista');
      this.carregarMensagens();
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
  
  async adicionarMensagem(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('tituloMensagem').value.trim();
    const conteudo = document.getElementById('conteudoMensagem').value.trim();
    const categoria = document.getElementById('categoriaMensagem').value;
    
    if (!titulo || !conteudo) {
      this.mostrarMensagem('erro', 'Preencha título e conteúdo');
      return;
    }
    
    try {
      const response = await fetch(`${this.API_URL}/api/mensagens-rapidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          conteudo,
          categoria,
          favorito: false
        })
      });
      
      if (response.ok) {
        this.mostrarMensagem('sucesso', '✅ Mensagem adicionada!');
        this.formMensagem.reset();
        this.carregarMensagens();
      } else {
        this.mostrarMensagem('erro', '❌ Erro ao adicionar');
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },
  
  async carregarMensagens() {
    try {
      const response = await fetch(`${this.API_URL}/api/mensagens-rapidas`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        this.mensagens = data;
      } else {
        this.mensagens = [];
      }
      
      this.renderizarMensagens();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      this.mostrarMensagem('erro', 'Erro ao carregar mensagens');
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
        <small>Copiado ${msg.copias_realizadas || 0}x</small>
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
  
  async toggleFavorito(id) {
    const msg = this.mensagens.find(m => m.id === id);
    if (!msg) return;
    
    try {
      const response = await fetch(`${this.API_URL}/api/mensagens-rapidas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: msg.titulo,
          conteudo: msg.conteudo,
          categoria: msg.categoria,
          favorito: !msg.favorito,
          copias_realizadas: msg.copias_realizadas
        })
      });
      
      if (response.ok) {
        msg.favorito = !msg.favorito;
        this.renderizarMensagens();
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  },
  
  async copiarMensagem(msg) {
    navigator.clipboard.writeText(msg.conteudo).then(async () => {
      // Incrementar contador no servidor
      try {
        await fetch(`${this.API_URL}/api/mensagens-rapidas/${msg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: msg.titulo,
            conteudo: msg.conteudo,
            categoria: msg.categoria,
            favorito: msg.favorito,
            copias_realizadas: (msg.copias_realizadas || 0) + 1
          })
        });
      } catch (error) {
        console.error('Erro ao atualizar contador:', error);
      }
      
      this.mostrarMensagem('sucesso', '✅ Copiado para clipboard!');
      this.carregarMensagens();
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
    
    const atualizarContador = () => {
      const count = editConteudo.value.length;
      charCount.textContent = `${count} caracteres`;
    };
    editConteudo.addEventListener('input', atualizarContador);
    atualizarContador();
    
    conteudo.querySelector('#formEditarMensagem').addEventListener('submit', async (e) => {
      e.preventDefault();
      const novoTitulo = conteudo.querySelector('#editTitulo').value;
      const novoConteudo = editConteudo.value;
      const novaCategoria = conteudo.querySelector('#editCategoria').value;
      
      try {
        const response = await fetch(`${this.API_URL}/api/mensagens-rapidas/${msg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: novoTitulo,
            conteudo: novoConteudo,
            categoria: novaCategoria,
            favorito: msg.favorito,
            copias_realizadas: msg.copias_realizadas
          })
        });
        
        if (response.ok) {
          this.mostrarMensagem('sucesso', '✅ Mensagem atualizada!');
          modal.remove();
          this.carregarMensagens();
        } else {
          this.mostrarMensagem('erro', '❌ Erro ao atualizar');
        }
      } catch (error) {
        console.error('Erro:', error);
        this.mostrarMensagem('erro', '❌ Erro de conexão');
      }
    });
    
    conteudo.querySelector('#btnCancelarEdicao').addEventListener('click', () => modal.remove());
  },
  
  async deletarMensagem(id) {
    if (confirm('Tem certeza que quer deletar essa mensagem?')) {
      try {
        const response = await fetch(`${this.API_URL}/api/mensagens-rapidas/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          this.mostrarMensagem('sucesso', '✅ Mensagem deletada!');
          this.carregarMensagens();
        } else {
          this.mostrarMensagem('erro', '❌ Erro ao deletar');
        }
      } catch (error) {
        console.error('Erro:', error);
        this.mostrarMensagem('erro', '❌ Erro de conexão');
      }
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
