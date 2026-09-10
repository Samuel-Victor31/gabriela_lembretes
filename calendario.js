/**
 * CALENDÁRIO VISUAL DE LEMBRETES - VERSÃO PROFISSIONAL
 * Mostra dias com lembretes, navegação e legenda
 */

const CALENDARIO = {
  mesAtual: new Date().getMonth() + 1,
  anoAtual: new Date().getFullYear(),
  
  nomesMeses: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  
  nomesDosSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  
  init() {
    this.container = document.getElementById('containerCalendario');
    this.btnMesAnterior = document.getElementById('btnMesAnterior');
    this.btnMesProximo = document.getElementById('btnMesProximo');
    this.mesAnoDisplay = document.getElementById('mesAnoDisplay');
    
    if (!this.container) return;
    
    // Event listeners
    if (this.btnMesAnterior) {
      this.btnMesAnterior.addEventListener('click', () => this.irMesAnterior());
    }
    if (this.btnMesProximo) {
      this.btnMesProximo.addEventListener('click', () => this.irMesProximo());
    }
    
    // Aguardar lembretes carregarem antes de renderizar
    setTimeout(() => {
      this.renderizar();
    }, 1000);
  },
  
  irMesAnterior() {
    this.mesAtual--;
    if (this.mesAtual < 1) {
      this.mesAtual = 12;
      this.anoAtual--;
    }
    this.renderizar();
  },
  
  irMesProximo() {
    this.mesAtual++;
    if (this.mesAtual > 12) {
      this.mesAtual = 1;
      this.anoAtual++;
    }
    this.renderizar();
  },
  
  renderizar() {
    if (!this.container) return;
    
    // Limpar
    this.container.innerHTML = '';
    
    // Atualizar título
    if (this.mesAnoDisplay) {
      this.mesAnoDisplay.textContent = `${this.nomesMeses[this.mesAtual - 1]} ${this.anoAtual}`;
    }
    
    // Criar cabeçalho com dias da semana
    const headerDias = document.createElement('div');
    headerDias.className = 'calendario-header-dias';
    
    this.nomesDosSemana.forEach(dia => {
      const diaEl = document.createElement('div');
      diaEl.className = 'calendario-dia-semana';
      diaEl.textContent = dia;
      headerDias.appendChild(diaEl);
    });
    
    this.container.appendChild(headerDias);
    
    // Criar grid de dias
    const gridDias = document.createElement('div');
    gridDias.className = 'calendario-grid-dias';
    
    // Primeira data do mês
    const primeiroDia = new Date(this.anoAtual, this.mesAtual - 1, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtual, 0);
    const diaSemanaInicio = primeiroDia.getDay();
    const diasNoMes = ultimoDia.getDate();
    
    // Dias em branco do mês anterior
    for (let i = 0; i < diaSemanaInicio; i++) {
      const vazio = document.createElement('div');
      vazio.className = 'calendario-dia calendario-dia-vazio';
      gridDias.appendChild(vazio);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const diaEl = document.createElement('div');
      diaEl.className = 'calendario-dia';
      
      const dataObj = new Date(this.anoAtual, this.mesAtual - 1, dia);
      
      // Verificar se é hoje
      const ehHoje = this.ehHoje(dataObj);
      if (ehHoje) {
        diaEl.classList.add('calendario-hoje');
      }
      
      // Contar lembretes
      const lembretes = this.contarLembretes(dataObj);
      const temLembretes = lembretes > 0;
      
      if (temLembretes) {
        diaEl.classList.add('calendario-com-lembrete');
      }
      
      // Conteúdo do dia
      diaEl.innerHTML = `
        <div class="calendario-dia-numero">${dia}</div>
        ${temLembretes ? `<div class="calendario-quantidade">${lembretes}</div>` : ''}
      `;
      
      // Click para adicionar lembrete com data selecionada
      diaEl.style.cursor = 'pointer';
      diaEl.addEventListener('click', (e) => {
        // Se clicou no badge, mostrar lembretes
        if (e.target.classList.contains('calendario-quantidade')) {
          this.mostrarLembretesDoDia(dataObj);
        } else {
          // Se clicou no dia, abrir formulário com data
          this.abrirFormularioComData(dataObj);
        }
      });
      
      gridDias.appendChild(diaEl);
    }
    
    this.container.appendChild(gridDias);
    
    // Adicionar legenda
    this.adicionarLegenda();
  },
  
  adicionarLegenda() {
    const legenda = document.createElement('div');
    legenda.className = 'calendario-legenda';
    
    const legendaTitulo = document.createElement('div');
    legendaTitulo.className = 'calendario-legenda-titulo';
    legendaTitulo.textContent = '📋 Legenda:';
    legenda.appendChild(legendaTitulo);
    
    // Item 1: Hoje
    const item1 = document.createElement('div');
    item1.className = 'calendario-legenda-item';
    item1.innerHTML = `
      <div class="calendario-legenda-box calendario-legenda-hoje"></div>
      <span>= Dia de Hoje</span>
    `;
    legenda.appendChild(item1);
    
    // Item 2: Com lembretes
    const item2 = document.createElement('div');
    item2.className = 'calendario-legenda-item';
    item2.innerHTML = `
      <div class="calendario-legenda-box calendario-legenda-lembrete"></div>
      <span>= Com Lembretes</span>
    `;
    legenda.appendChild(item2);
    
    // Item 3: Sem lembretes
    const item3 = document.createElement('div');
    item3.className = 'calendario-legenda-item';
    item3.innerHTML = `
      <div class="calendario-legenda-box calendario-legenda-vazio"></div>
      <span>= Sem Lembretes</span>
    `;
    legenda.appendChild(item3);
    
    // Info
    const info = document.createElement('div');
    info.className = 'calendario-legenda-info';
    info.innerHTML = `✨ Clique em um dia com lembretes para ver detalhes`;
    legenda.appendChild(info);
    
    this.container.appendChild(legenda);
  },
  
  ehHoje(data) {
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
  },
  
  contarLembretes(data) {
    if (!window.APP || !window.APP.lembretes) return 0;
    
    const dataStr = data.toISOString().split('T')[0];
    return window.APP.lembretes.filter(l => l.data === dataStr).length;
  },
  
  abrirFormularioComData(data) {
    if (!window.APP) return;
    
    // Abrir o modal de adicionar lembrete primeiro
    window.APP.abrirModal();
    
    // Depois preencher a data (após o reset do modal)
    setTimeout(() => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      
      const inputData = document.getElementById('data');
      if (inputData) {
        inputData.value = dataFormatada;
        console.log('Data preenchida:', dataFormatada);
      }
    }, 50);
  },
  
  mostrarLembretesDoDia(data) {
    if (!window.APP || !window.APP.lembretes) return;
    
    const dataStr = data.toISOString().split('T')[0];
    const lembretesDodia = window.APP.lembretes.filter(l => l.data === dataStr);
    
    if (lembretesDodia.length === 0) return;
    
    const dataFormatada = data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal-lembretes-dia';
    
    const conteudo = document.createElement('div');
    conteudo.className = 'modal-lembretes-conteudo';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-lembretes-header';
    header.innerHTML = `
      <h2>📅 Lembretes do Dia</h2>
      <button class="modal-lembretes-close">&times;</button>
    `;
    conteudo.appendChild(header);
    
    // Data
    const dataElem = document.createElement('p');
    dataElem.className = 'modal-lembretes-data';
    dataElem.textContent = dataFormatada;
    conteudo.appendChild(dataElem);
    
    // Divisor
    const divisor = document.createElement('div');
    divisor.className = 'modal-lembretes-divisor';
    conteudo.appendChild(divisor);
    
    // Lista de lembretes
    const lista = document.createElement('div');
    lista.className = 'modal-lembretes-lista';
    
    lembretesDodia.forEach((lembrete) => {
      const card = document.createElement('div');
      card.className = 'modal-lembretes-card';
      
      let html = `<div class="modal-lembretes-nome">${lembrete.nome || '(Sem nome)'}</div>`;
      
      if (lembrete.telefone) {
        html += `<div class="modal-lembretes-telefone">📱 ${lembrete.telefone}</div>`;
      }
      
      if (lembrete.descricao) {
        html += `<div class="modal-lembretes-descricao">"${lembrete.descricao}"</div>`;
      }
      
      card.innerHTML = html;
      lista.appendChild(card);
    });
    
    conteudo.appendChild(lista);
    
    // Botão fechar
    const btnFechar = document.createElement('button');
    btnFechar.className = 'modal-lembretes-btn-fechar';
    btnFechar.textContent = 'Fechar';
    conteudo.appendChild(btnFechar);
    
    modal.appendChild(conteudo);
    document.body.appendChild(modal);
    
    // Dark mode
    if (document.body.classList.contains('dark-mode')) {
      conteudo.classList.add('dark-mode');
    }
    
    // Eventos
    const fechar = () => modal.remove();
    conteudo.querySelector('.modal-lembretes-close').addEventListener('click', fechar);
    btnFechar.addEventListener('click', fechar);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fechar();
    });
  }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CALENDARIO.init());
} else {
  CALENDARIO.init();
}

// Expor globalmente
window.CALENDARIO = CALENDARIO;
