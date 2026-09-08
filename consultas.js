/**
 * SISTEMA DE CONSULTAS - GABRIELA
 * Gerenciar consultas, pagamentos, comprovantes e relatórios
 */

const CONSULTAS_APP = {
  API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',
  
  // DOM Elements
  modalConsultas: null,
  btnConsultas: null,
  consultas: [],

  init() {
    this.modalConsultas = document.getElementById('modalConsultas');
    this.btnConsultas = document.getElementById('btnConsultas');
    
    if (this.btnConsultas) {
      this.adicionarEventos();
      this.carregarConsultas();
    }
  },

  adicionarEventos() {
    this.btnConsultas.addEventListener('click', () => this.abrirModalConsultas());
    
    const closeConsultas = document.getElementById('closeConsultas');
    if (closeConsultas) {
      closeConsultas.addEventListener('click', () => this.fecharModalConsultas());
    }

    const formConsulta = document.getElementById('formConsulta');
    if (formConsulta) {
      formConsulta.addEventListener('submit', (e) => this.adicionarConsulta(e));
    }

    const btnGerarRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnGerarRelatorio) {
      btnGerarRelatorio.addEventListener('click', () => this.gerarRelatorio());
    }

    // Fechar modal ao clicar fora
    if (this.modalConsultas) {
      this.modalConsultas.addEventListener('click', (e) => {
        if (e.target === this.modalConsultas) this.fecharModalConsultas();
      });
    }
  },

  abrirModalConsultas() {
    this.modalConsultas.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.carregarConsultas();
  },

  fecharModalConsultas() {
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
      forma_pagamento: document.getElementById('formaPagamento').value,
      valor: parseFloat(document.getElementById('valorConsulta').value) || null,
      notas: document.getElementById('notasConsulta').value.trim() || null
    };

    if (!dados.nome) {
      alert('❌ Nome da pessoa é obrigatório!');
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/api/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        const resultado = await response.json();
        this.mostrarMensagem('sucesso', `✅ Consulta #${resultado.numero_pessoa} adicionada!`);
        
        // Confete! 🎉
        this.dispararConfete();
        
        document.getElementById('formConsulta').reset();
        this.carregarConsultas();
      } else {
        const erro = await response.json();
        this.mostrarMensagem('erro', `❌ ${erro.erro || 'Erro ao adicionar'}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro de conexão');
    }
  },

  async carregarConsultas() {
    try {
      const response = await fetch(`${this.API_URL}/api/consultas`);
      this.consultas = await response.json();
      this.renderizarConsultas();
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  },

  renderizarConsultas() {
    const container = document.getElementById('containerConsultas');
    if (!container) return;

    if (this.consultas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>📭 Nenhuma consulta registrada</p>
          <p class="empty-text">Adicione sua primeira consulta!</p>
        </div>
      `;
      return;
    }

    // Agrupar por mês/ano
    const porMes = {};
    this.consultas.forEach(c => {
      const chave = `${c.ano}-${c.mes}`;
      if (!porMes[chave]) {
        porMes[chave] = [];
      }
      porMes[chave].push(c);
    });

    // Renderizar agrupado por mês
    container.innerHTML = '';
    
    Object.keys(porMes).sort().reverse().forEach(chave => {
      const [ano, mes] = chave.split('-');
      const consultasDoMes = porMes[chave];

      const secaoMes = document.createElement('div');
      secaoMes.className = 'secao-mes';

      const titulo = document.createElement('h3');
      titulo.className = 'titulo-mes';
      titulo.textContent = `${mes}/${ano} (${consultasDoMes.length} consulta${consultasDoMes.length !== 1 ? 's' : ''})`;
      secaoMes.appendChild(titulo);

      const gridCards = document.createElement('div');
      gridCards.className = 'grid-consultas';

      consultasDoMes.forEach(consulta => {
        const card = this.criarCardConsulta(consulta);
        gridCards.appendChild(card);
      });

      secaoMes.appendChild(gridCards);
      container.appendChild(secaoMes);
    });
  },

  criarCardConsulta(consulta) {
    const card = document.createElement('div');
    card.className = 'consulta-card';

    const [anoAg, mesAg, diaAg] = consulta.data_agendamento.split('-');
    const [anoC, mesC, diaC] = consulta.data_consulta.split('-');

    card.innerHTML = `
      <div class="consulta-header">
        <div class="consulta-numero">
          <span class="numero-badge">#${consulta.numero_pessoa}</span>
          <h3>${consulta.nome}</h3>
        </div>
        <div class="consulta-actions">
          <button class="btn-editar" onclick="CONSULTAS_APP.abrirEdicao(${consulta.id})">✏️</button>
          <button class="btn-deletar" onclick="CONSULTAS_APP.deletarConsulta(${consulta.id}, '${consulta.nome}')">🗑️</button>
        </div>
      </div>

      <div class="consulta-body">
        ${consulta.telefone ? `<p><span class="label">📱 Telefone:</span> ${consulta.telefone}</p>` : ''}
        <p><span class="label">📅 Agendado:</span> ${diaAg}/${mesAg}/${anoAg}</p>
        <p><span class="label">🏥 Consulta:</span> <strong>${diaC}/${mesC}/${anoC}</strong></p>
        <p><span class="label">💳 Pagamento:</span> ${consulta.forma_pagamento || 'Não informado'}</p>
        ${consulta.valor ? `<p><span class="label">💰 Valor:</span> R$ ${consulta.valor.toFixed(2)}</p>` : ''}
        ${consulta.comprovante_url ? `<p><a href="${consulta.comprovante_url}" target="_blank" class="link-comprovante">📎 Ver Comprovante</a></p>` : ''}
        ${consulta.notas ? `<p><span class="label">📝 Notas:</span> ${consulta.notas}</p>` : ''}
      </div>
    `;

    return card;
  },

  async deletarConsulta(id, nome) {
    if (!confirm(`Deletar consulta de "${nome}"?`)) return;

    try {
      const response = await fetch(`${this.API_URL}/api/consultas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.mostrarMensagem('sucesso', '✅ Consulta deletada!');
        this.carregarConsultas();
      }
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
        this.exibirRelatorio(dados);
      }
    } catch (error) {
      console.error('Erro:', error);
      this.mostrarMensagem('erro', '❌ Erro ao gerar relatório');
    }
  },

  exibirRelatorio(dados) {
    const html = this.gerarHTMLRelatorio(dados);
    const janela = window.open();
    janela.document.write(html);
    janela.document.close();
  },

  gerarHTMLRelatorio(dados) {
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
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Consultas</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #667eea; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #667eea; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background: #f5f5f5; }
          .info { color: #666; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>📊 Relatório de Consultas</h1>
        <p class="info">
          <strong>Período:</strong> ${dados.mes}/${dados.ano || 'Todos os anos'}<br>
          <strong>Total:</strong> ${dados.total_consultas} consulta${dados.total_consultas !== 1 ? 's' : ''}<br>
          <strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}
        </p>
        
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
      </body>
      </html>
    `;
  },

  dispararConfete() {
    // Confete simples com CSS/JS
    const confetes = [];
    for (let i = 0; i < 50; i++) {
      const confete = document.createElement('div');
      confete.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: 10px;
        height: 10px;
        background: ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#FF6348'][Math.floor(Math.random() * 5)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: cair ${2 + Math.random()}s linear;
      `;
      document.body.appendChild(confete);
      
      setTimeout(() => confete.remove(), 2000);
    }

    // Adicionar animação CSS se não existir
    if (!document.querySelector('style[data-confete]')) {
      const style = document.createElement('style');
      style.setAttribute('data-confete', 'true');
      style.textContent = `
        @keyframes cair {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
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

  abrirEdicao(id) {
    const consulta = this.consultas.find(c => c.id === id);
    if (!consulta) return;

    // Aqui você pode abrir um modal de edição
    // Por enquanto, vou deixar simples
    alert('Edição em desenvolvimento!');
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  CONSULTAS_APP.init();
});
