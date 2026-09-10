/**
 * CALENDÁRIO VISUAL DE LEMBRETES
 * Mostra dias com lembretes e quantidade
 */

const CALENDARIO = {
  mesAtual: new Date().getMonth(),
  anoAtual: new Date().getFullYear(),
  hoje: new Date().getDate(),
  
  init() {
    this.btnAnterior = document.getElementById('btnMesAnterior');
    this.btnProximo = document.getElementById('btnMesProximo');
    this.containerCalendario = document.getElementById('containerCalendario');
    this.mesAnoDisplay = document.getElementById('mesAnoDisplay');
    
    if (this.btnAnterior) this.btnAnterior.addEventListener('click', () => this.irMesAnterior());
    if (this.btnProximo) this.btnProximo.addEventListener('click', () => this.irMesProximo());
    
    this.renderizar();
  },
  
  irMesAnterior() {
    this.mesAtual--;
    if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
    this.renderizar();
  },
  
  irMesProximo() {
    this.mesAtual++;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    }
    this.renderizar();
  },
  
  renderizar() {
    // Atualizar título
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    if (this.mesAnoDisplay) {
      this.mesAnoDisplay.textContent = meses[this.mesAtual] + ' ' + this.anoAtual;
    }
    
    // Limpar container
    if (this.containerCalendario) {
      this.containerCalendario.innerHTML = '';
    }
    
    // Criar headers dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const headerContainer = document.createElement('div');
    headerContainer.className = 'calendario-header';
    diasSemana.forEach(dia => {
      const header = document.createElement('div');
      header.className = 'calendario-dia-semana';
      header.textContent = dia;
      headerContainer.appendChild(header);
    });
    if (this.containerCalendario) {
      this.containerCalendario.appendChild(headerContainer);
    }
    
    // Obter primeiro dia do mês
    const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1).getDay();
    const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
    
    // Criar células vazias antes do primeiro dia
    const diasContainer = document.createElement('div');
    diasContainer.className = 'calendario-dias';
    
    for (let i = 0; i < primeiroDia; i++) {
      const celulaVazia = document.createElement('div');
      celulaVazia.className = 'calendario-celula-vazia';
      diasContainer.appendChild(celulaVazia);
    }
    
    // Criar células dos dias
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const celula = document.createElement('div');
      celula.className = 'calendario-dia';
      
      // Contar lembretes para este dia
      const dataAtual = new Date(this.anoAtual, this.mesAtual, dia);
      const lembretesDoDia = this.contar
Lembretes(dataAtual);
      
      // Marcar como hoje
      if (dia === this.hoje && this.mesAtual === new Date().getMonth() && this.anoAtual === new Date().getFullYear()) {
        celula.classList.add('calendario-hoje');
      }
      
      // Adicionar conteúdo
      if (lembretesDoDia > 0) {
        celula.classList.add('calendario-com-lembrete');
        celula.innerHTML = `
          <div class="calendario-dia-numero">${dia}</div>
          <div class="calendario-quantidade">${lembretesDoDia}</div>
        `;
        celula.style.cursor = 'pointer';
        celula.addEventListener('click', () => this.mostrarLembretesDoDia(dataAtual));
      } else {
        celula.innerHTML = `<div class="calendario-dia-numero">${dia}</div>`;
      }
      
      diasContainer.appendChild(celula);
    }
    
    if (this.containerCalendario) {
      this.containerCalendario.appendChild(diasContainer);
    }
  },
  
  contarLembretes(data) {
    if (!window.APP || !window.APP.lembretes) return 0;
    
    const dataFormatada = data.toISOString().split('T')[0];
    return window.APP.lembretes.filter(l => l.data === dataFormatada).length;
  },
  
  mostrarLembretesDoDia(data) {
    if (!window.APP || !window.APP.lembretes) return;
    
    const dataFormatada = data.toISOString().split('T')[0];
    const lembretesDoDia = window.APP.lembretes.filter(l => l.data === dataFormatada);
    
    if (lembretesDoDia.length === 0) return;
    
    // Criar modal com lembretes do dia
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;';
    
    const conteudo = document.createElement('div');
    conteudo.style.cssText = 'background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Lembretes de ' + data.toLocaleDateString('pt-BR');
    titulo.style.cssText = 'color: #667eea; margin-top: 0; margin-bottom: 20px;';
    conteudo.appendChild(titulo);
    
    lembretesDoDia.forEach((lembrete, index) => {
      const card = document.createElement('div');
      card.style.cssText = 'padding: 15px; background: #f5f7fa; border-left: 4px solid #667eea; margin-bottom: 15px; border-radius: 6px;';
      
      card.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${lembrete.nome || '(sem nome)'}</div>
        <div style="font-size: 12px; color: #999; margin-bottom: 5px;">${lembrete.telefone || '(sem telefone)'}</div>
        <div style="font-size: 14px; color: #555;">${lembrete.descricao || '(sem descrição)'}</div>
      `;
      conteudo.appendChild(card);
    });
    
    const btnFechar = document.createElement('button');
    btnFechar.textContent = 'Fechar';
    btnFechar.style.cssText = 'width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 20px;';
    btnFechar.onclick = () => modal.remove();
    conteudo.appendChild(btnFechar);
    
    modal.appendChild(conteudo);
    document.body.appendChild(modal);
  }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CALENDARIO.init());
} else {
  CALENDARIO.init();
}
