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
      console.error('❌ bt
    if (!this.modalConsultas) {
      console.nConsultas não encontrado');
      return;
    }
    error('❌ modalConsultas não encontrado');
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
    div.text// Sistema de Consultas - Gabriela (Versão Lista)
const CONSULTAS_APP = {
  API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',
  consultas: [],

  init() {
    this.btnConsultas = document.getElementById('btnConsultas');
    this.modalConsultas = document.getElementById('modalConsultas');
    
    if (!this.btnConsultas || !this.modalConsultas) {
      return;
    }

    this.adicionarEventos();
    this.carregarConsultas();
  },

  adicionarEventos() {
    this.btnConsultas.addEventListener('click', () => {
      this.abrirModal();
    });

    const closeBtn = document.getElementById('closeConsultas');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.fecharModal());
    }

    this.modalConsultas.addEventListener('click', (e) => {
      if (e.target === this.modalConsultas) {
        this.fecharModal();
      }
    });

    const form = document.getElementById('formConsulta');
    if (form) {
      form.addEventListener('submit', (e) => this.adicionarConsulta(e));
    }

    const btnRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnRelatorio) {
      btnRelatorio.addEventListener('click', () => this.gerarRelatorio());
    }
  },

  abrirModal() {
    this.modalConsultas.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.carregarConsultas();
  },

  fecharModal() {
    this.modalConsultas.classList.add('hidden');
    document.body.style.overflow = 'auto';
  },

  async adicionarConsulta(e) {
    e.preventDefault();

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
        this.mostrarMensagem('sucesso', `✅ Consulta #${resultado.numero_pessoa} adicionada!`);
        document.getElementById('formConsulta').reset();
        this.carregarConsultas();
      } else {
        this.mostrarMensagem('erro', `❌ ${resultado.erro}`);
      }
    } catch (error) {
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },

  async carregarConsultas() {
    try {
      const response = await fetch(`${this.API_URL}/api/consultas`);
      this.consultas = await response.json();
      this.renderizarConsultas();
    } catch (error) {
      // Erro silencioso
    }
  },

  renderizarConsultas() {
    const container = document.getElementById('containerConsultas');
    if (!container) return;

    if (this.consultas.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>📭 Nenhuma consulta</p></div>';
      return;
    }

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
      secao.className = 'secao-mes-lista';

      const titulo = document.createElement('h3');
      titulo.className = 'titulo-mes-lista';
      titulo.textContent = `${mes}/${ano} (${consultas.length} consulta${consultas.length !== 1 ? 's' : ''})`;
      secao.appendChild(titulo);

      const tabela = document.createElement('table');
      tabela.className = 'tabela-consultas';
      
      // Header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Agendamento</th>
          <th>Consulta</th>
          <th>Pagamento</th>
          <th>Valor</th>
          <th>Notas</th>
          <th>Ação</th>
        </tr>
      `;
      tabela.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      consultas.forEach(c => {
        const row = document.createElement('tr');
        row.className = 'linha-consulta';

        const [anoAg, mesAg, diaAg] = c.data_agendamento.split('-');
        const [anoC, mesC, diaC] = c.data_consulta.split('-');

        row.innerHTML = `
          <td class="numero-col"><strong>#${c.numero_pessoa}</strong></td>
          <td class="nome-col">${c.nome}</td>
          <td class="tel-col">${c.telefone || '-'}</td>
          <td class="data-col">${diaAg}/${mesAg}/${anoAg}</td>
          <td class="data-col"><strong>${diaC}/${mesC}/${anoC}</strong></td>
          <td class="pagamento-col">${c.forma_pagamento || '-'}</td>
          <td class="valor-col">${c.valor ? `R$ ${c.valor.toFixed(2)}` : '-'}</td>
          <td class="notas-col">${c.notas || '-'}</td>
          <td class="acao-col">
            <button class="btn-del" onclick="CONSULTAS_APP.deletarConsulta(${c.id}, '${c.nome.replace(/'/g, "\\'")}')">🗑️</button>
          </td>
        `;
        tbody.appendChild(row);
      });
      tabela.appendChild(tbody);

      secao.appendChild(tabela);
      container.appendChild(secao);
    });
  },

  async deletarConsulta(id, nome) {
    if (!confirm(`Deletar consulta de "${nome}"?`)) return;

    try {
      await fetch(`${this.API_URL}/api/consultas/${id}`, { method: 'DELETE' });
      this.mostrarMensagem('sucesso', '✅ Deletado!');
      this.carregarConsultas();
    } catch (error) {
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
      this.mostrarMensagem('erro', '❌ Erro ao gerar relatório');
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
        <td>R$ ${d.valor ? d.valor.toFixed(2) : '0.00'}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Consultas</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 30px;
            background: #fff;
            color: #333;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #667eea; 
            font-size: 2em;
            margin-bottom: 10px;
          }
          .info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f5f7fa;
            border-radius: 8px;
          }
          .info-item {
            padding: 15px;
            background: white;
            border-left: 4px solid #667eea;
            border-radius: 4px;
          }
          .info-label {
            font-weight: 600;
            color: #667eea;
            font-size: 0.9em;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 1.1em;
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          th { 
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 0.95em;
          }
          td { 
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 0.95em;
          }
          tbody tr:hover {
            background: #f9f9f9;
          }
          tbody tr:nth-child(even) {
            background: #fafbfc;
          }
          .numero { font-weight: 700; color: #667eea; }
          .valor { font-weight: 600; color: #28a745; }
          .footer {
            margin-top: 40px;
            text-align: right;
            color: #999;
            font-size: 0.9em;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; margin: 0; }
            .container { max-width: 100%; }
            table { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Relatório de Consultas</h1>
            <p>Sistema de Lembretes - Gabriela</p>
          </div>

          <div class="info">
            <div class="info-item">
              <div class="info-label">📅 Período</div>
              <div class="info-value">${dados.mes}/${dados.ano || 'Todos os anos'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📋 Total de Consultas</div>
              <div class="info-value">${dados.total_consultas}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📆 Gerado em</div>
              <div class="info-value">${new Date().toLocaleString('pt-BR')}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Data Agendamento</th>
                <th>Data Consulta</th>
                <th>Forma Pagamento</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="footer">
            <p>Relatório impresso em ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
      </html>
    `;
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
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    div.textContent = texto;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CONSULTAS_APP.init();
});
