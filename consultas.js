// Sistema de Consultas - Gabriela
const CONSULTAS_APP = {
  API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',
  consultas: [],
 
  // Inicializar quando DOM estiver pronto
  init() {
    console.log('✅ CONSULTAS_APP iniciado');
    
    this.btnConsultas = document.getElementById('btnConsultas');
    this.modalConsultas = document.getElementById('modalConsultas');
    
    if (!this.btnConsultas) {
      console.error('❌ btnConsultas não encontrado');
      return;
    }
    
    if (!this.modalConsultas) {
      console.error('❌ modalConsultas não encontrado');
      return;
    }
 
    this.adicionarEventos();
    this.carregarConsultas();
  },
 
  adicionarEventos() {
    // Botão Consultas
    this.btnConsultas.addEventListener('click', () => {
      console.log('🔵 Clicou em Consultas');
      this.abrirModal();
    });
 
    // Fechar modal
    const closeBtn = document.getElementById('closeConsultas');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.fecharModal());
    }
 
    // Clique fora do modal
    this.modalConsultas.addEventListener('click', (e) => {
      if (e.target === this.modalConsultas) {
        this.fecharModal();
      }
    });
 
    // Formulário
    const form = document.getElementById('formConsulta');
    if (form) {
      form.addEventListener('submit', (e) => this.adicionarConsulta(e));
    }
 
    // Botão Relatório
    const btnRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnRelatorio) {
      btnRelatorio.addEventListener('click', () => this.gerarRelatorio());
    }
  },
 
  abrirModal() {
    console.log('📂 Abrindo modal');
    this.modalConsultas.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.carregarConsultas();
  },
 
  fecharModal() {
    console.log('📁 Fechando modal');
    this.modalConsultas.classList.add('hidden');
    document.body.style.overflow = 'auto';
  },
 
  async adicionarConsulta(e) {
    e.preventDefault();
    console.log('➕ Adicionando consulta');
 
    const dados = {
      mes: document.getElementById('mesConsulta').value,
      ano: parseInt(document.getElementById('anoConsulta').value),
      nome: document.getElementById('nomeConsulta').value.trim(),
      telefone: document.getElementById('telefoneConsulta').value.trim() || null,
      data_agendamento: document.getElementById('dataAgendamento').value,
      data_consulta: document.getElementById('dataConsulta').value,
      forma_pagamento: document.getElementById('formaPagamento').value || null,
      valor: parseFloat(document.getElementById('valorConsulta').value) || null,
      notas: document.getElementById('notasConsulta').value.trim() || null
    };
 
    if (!dados.nome) {
      alert('❌ Nome é obrigatório!');
      return;
    }
 
    try {
      const response = await fetch(`${this.API_URL}/api/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
 
      const resultado = await response.json();
 
      if (response.ok) {
        console.log('✅ Consulta adicionada:', resultado);
        this.mostrarMensagem('sucesso', `✅ Consulta #${resultado.numero_pessoa} adicionada!`);
        this.dispararConfete();
        document.getElementById('formConsulta').reset();
        this.carregarConsultas();
      } else {
        console.error('❌ Erro:', resultado);
        this.mostrarMensagem('erro', `❌ ${resultado.erro}`);
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },
 
  async carregarConsultas() {
    try {
      const response = await fetch(`${this.API_URL}/api/consultas`);
      this.consultas = await response.json();
      console.log('📋 Consultas carregadas:', this.consultas.length);
      this.renderizarConsultas();
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
    }
  },
 
  renderizarConsultas() {
    const container = document.getElementById('containerConsultas');
    if (!container) return;
 
    if (this.consultas.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>📭 Nenhuma consulta</p></div>';
      return;
    }
 
    // Agrupar por mês
    const porMes = {};
    this.consultas.forEach(c => {
      const chave = `${c.ano}-${c.mes}`;
      if (!porMes[chave]) porMes[chave] = [];
      porMes[chave].push(c);
    });
 
    container.innerHTML = '';
    Object.keys(porMes).sort().reverse().forEach(chave => {
      const [ano, mes] = chave.split('-');
      const consultas = porMes[chave];
 
      const secao = document.createElement('div');
      secao.className = 'secao-mes';
      secao.innerHTML = `<h3 class="titulo-mes">${mes}/${ano} (${consultas.length})</h3>`;
 
      const grid = document.createElement('div');
      grid.className = 'grid-consultas';
 
      consultas.forEach(c => {
        grid.appendChild(this.criarCard(c));
      });
 
      secao.appendChild(grid);
      container.appendChild(secao);
    });
  },
 
  criarCard(c) {
    const card = document.createElement('div');
    card.className = 'consulta-card';
 
    const [anoAg, mesAg, diaAg] = c.data_agendamento.split('-');
    const [anoC, mesC, diaC] = c.data_consulta.split('-');
 
    card.innerHTML = `
      <div class="consulta-header">
        <div>
          <span class="numero-badge">#${c.numero_pessoa}</span>
          <h3>${c.nome}</h3>
        </div>
        <div class="consulta-actions">
          <button class="btn-deletar" onclick="CONSULTAS_APP.deletarConsulta(${c.id}, '${c.nome}')">🗑️</button>
        </div>
      </div>
      <div class="consulta-body">
        ${c.telefone ? `<p><span class="label">📱:</span> ${c.telefone}</p>` : ''}
        <p><span class="label">📅 Agendado:</span> ${diaAg}/${mesAg}/${anoAg}</p>
        <p><span class="label">🏥 Consulta:</span> <strong>${diaC}/${mesC}/${anoC}</strong></p>
        <p><span class="label">💳:</span> ${c.forma_pagamento || '-'}</p>
        ${c.valor ? `<p><span class="label">💰:</span> R$ ${c.valor.toFixed(2)}</p>` : ''}
        ${c.notas ? `<p><span class="label">📝:</span> ${c.notas}</p>` : ''}
      </div>
    `;
 
    return card;
  },
 
  async deletarConsulta(id, nome) {
    if (!confirm(`Deletar "${nome}"?`)) return;
 
    try {
      await fetch(`${this.API_URL}/api/consultas/${id}`, { method: 'DELETE' });
      this.mostrarMensagem('sucesso', '✅ Deletado!');
      this.carregarConsultas();
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro ao deletar');
    }
  },
 
  async gerarRelatorio() {
    const mes = document.getElementById('filtroMesRelatorio')?.value;
    const ano = document.getElementById('filtroAnoRelatorio')?.value;
 
    try {
      let url = `${this.API_URL}/api/relatorios/gerar`;
      if (mes) url += `?mes=${mes}`;
      if (ano) url += `${mes ? '&' : '?'}ano=${ano}`;
 
      const response = await fetch(url);
      const dados = await response.json();
 
      if (response.ok) {
        const html = this.gerarHTML(dados);
        const janela = window.open();
        janela.document.write(html);
        janela.document.close();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  },
 
  gerarHTML(dados) {
    const rows = dados.dados.map(d => `
      <tr>
        <td>#${d.numero}</td>
        <td>${d.nome}</td>
        <td>${d.telefone || '-'}</td>
        <td>${d.data_agendamento}</td>
        <td>${d.data_consulta}</td>
        <td>${d.forma_pagamento || '-'}</td>
        <td>${d.valor ? `R$ ${d.valor.toFixed(2)}` : '-'}</td>
      </tr>
    `).join('');
 
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #667eea; color: white; padding: 10px; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>📊 Relatório de Consultas</h1>
        <p>Período: ${dados.mes}/${dados.ano || 'Todos'}</p>
        <p>Total: ${dados.total_consultas} consulta(s)</p>
        <table>
          <tr>
            <th>#</th><th>Nome</th><th>Telefone</th>
            <th>Agendamento</th><th>Consulta</th>
            <th>Pagamento</th><th>Valor</th>
          </tr>
          ${rows}
        </table>
      </body>
      </html>
    `;
  },
 
  dispararConfete() {
    for (let i = 0; i < 50; i++) {
      const c = document.createElement('div');
      c.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: 10px;
        height: 10px;
        background: ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        z-index: 9999;
        animation: cair ${2 + Math.random()}s linear;
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2000);
    }
 
    if (!document.querySelector('style[data-confete]')) {
      const s = document.createElement('style');
      s.setAttribute('data-confete', '1');
      s.textContent = '@keyframes cair { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }';
      document.head.appendChild(s);
    }
  },
 
  mostrarMensagem(tipo, texto) {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${tipo === 'sucesso' ? '#28a745' : '#dc3545'};
      color: white;
      border-radius: 8px;
      z-index: 2000;
    `;
    div.textContent = texto;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};
 
// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado');
  CONSULTAS_APP.init();
});
 
console.log('✅ consultas.js carregado');
 
