const CONSULTAS_APP = {
  API_URL: 'https://lembrete-gabriela.samuelvivi1996.workers.dev',
  consultas: [],

  init() {
    this.btnConsultas = document.getElementById('btnConsultas');
    this.modalConsultas = document.getElementById('modalConsultas');
    
    if (!this.btnConsultas || !this.modalConsultas) return;

    this.adicionarEventos();
    this.carregarConsultas();
  },

  adicionarEventos() {
    this.btnConsultas.addEventListener('click', () => this.abrirModal());
    
    const closeBtn = document.getElementById('closeConsultas');
    if (closeBtn) closeBtn.addEventListener('click', () => this.fecharModal());

    this.modalConsultas.addEventListener('click', (e) => {
      if (e.target === this.modalConsultas) this.fecharModal();
    });

    const form = document.getElementById('formConsulta');
    if (form) form.addEventListener('submit', (e) => this.adicionarConsulta(e));

    const btnRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnRelatorio) btnRelatorio.addEventListener('click', () => this.gerarRelatorio());
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
      alert('Nome é obrigatório!');
      return;
    }

    try {
      const response = await fetch(this.API_URL + '/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const resultado = await response.json();

      if (response.ok) {
        this.mostrarMensagem('sucesso', 'Consulta adicionada com sucesso!');
        document.getElementById('formConsulta').reset();
        this.carregarConsultas();
      } else {
        this.mostrarMensagem('erro', 'Erro ao adicionar');
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro de conexão');
    }
  },

  async carregarConsultas() {
    try {
      const response = await fetch(this.API_URL + '/api/consultas');
      this.consultas = await response.json();
      this.renderizarConsultas();
    } catch (error) {
      // silencioso
    }
  },

  renderizarConsultas() {
    const container = document.getElementById('containerConsultas');
    if (!container) return;

    if (this.consultas.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma consulta registrada</p></div>';
      return;
    }

    const porMes = {};
    this.consultas.forEach(c => {
      const chave = c.ano + '-' + c.mes;
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
      titulo.textContent = mes + '/' + ano + ' (' + consultas.length + ')';
      secao.appendChild(titulo);

      const tabela = document.createElement('table');
      tabela.className = 'tabela-consultas';
      
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>#</th><th>Nome</th><th>Telefone</th><th>Agendamento</th><th>Consulta</th><th>Pagamento</th><th>Valor</th><th>Notas</th><th>Acao</th></tr>';
      tabela.appendChild(thead);

      const tbody = document.createElement('tbody');
      
      consultas.forEach(c => {
        const [anoAg, mesAg, diaAg] = c.data_agendamento.split('-');
        const [anoC, mesC, diaC] = c.data_consulta.split('-');

        const row = document.createElement('tr');
        row.innerHTML = '<td class="numero-col">#' + c.numero_pessoa + '</td>' +
          '<td class="nome-col">' + c.nome + '</td>' +
          '<td class="tel-col">' + (c.telefone || '-') + '</td>' +
          '<td class="data-col">' + diaAg + '/' + mesAg + '/' + anoAg + '</td>' +
          '<td class="data-col"><strong>' + diaC + '/' + mesC + '/' + anoC + '</strong></td>' +
          '<td class="pagamento-col">' + (c.forma_pagamento || '-') + '</td>' +
          '<td class="valor-col">' + (c.valor ? 'R$ ' + c.valor.toFixed(2) : '-') + '</td>' +
          '<td class="notas-col">' + (c.notas || '-') + '</td>' +
          '<td class="acao-col"><button class="btn-del" onclick="CONSULTAS_APP.deletarConsulta(' + c.id + ')">X</button></td>';
        
        tbody.appendChild(row);
      });
      
      tabela.appendChild(tbody);
      secao.appendChild(tabela);
      container.appendChild(secao);
    });
  },

  async deletarConsulta(id) {
    if (!confirm('Deletar consulta?')) return;

    try {
      await fetch(this.API_URL + '/api/consultas/' + id, { method: 'DELETE' });
      this.mostrarMensagem('sucesso', 'Deletado!');
      this.carregarConsultas();
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro');
    }
  },

  async gerarRelatorio() {
    const mes = document.getElementById('filtroMesRelatorio') ? document.getElementById('filtroMesRelatorio').value : '';
    const ano = document.getElementById('filtroAnoRelatorio') ? document.getElementById('filtroAnoRelatorio').value : '';

    try {
      let url = this.API_URL + '/api/relatorios/gerar';
      if (mes) url += '?mes=' + mes;
      if (ano) url += (mes ? '&' : '?') + 'ano=' + ano;

      const response = await fetch(url);
      const dados = await response.json();

      if (response.ok) {
        this.abrirRelatorio(dados);
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro');
    }
  },

  abrirRelatorio(dados) {
    const rows = dados.dados.map(d => 
      '<tr><td>#' + d.numero + '</td>' +
      '<td>' + d.nome + '</td>' +
      '<td>' + (d.telefone || '-') + '</td>' +
      '<td>' + d.data_agendamento + '</td>' +
      '<td>' + d.data_consulta + '</td>' +
      '<td>' + (d.forma_pagamento || '-') + '</td>' +
      '<td>R$ ' + (d.valor ? d.valor.toFixed(2) : '0.00') + '</td></tr>'
    ).join('');

    const html = '<!DOCTYPE html>' +
      '<html><head><meta charset="UTF-8"><title>Relatorio</title>' +
      '<style>' +
      'body { font-family: Arial; margin: 30px; background: #fff; }' +
      '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }' +
      '.header h1 { color: #667eea; margin: 0; }' +
      '.info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }' +
      '.info-item { padding: 15px; background: #f5f7fa; border-left: 4px solid #667eea; border-radius: 4px; }' +
      '.info-label { font-weight: 600; color: #667eea; font-size: 0.9em; margin-bottom: 5px; }' +
      '.info-value { font-size: 1.1em; color: #333; }' +
      'table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }' +
      'thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }' +
      'th { padding: 15px; text-align: left; font-weight: 600; }' +
      'td { padding: 12px 15px; border-bottom: 1px solid #e0e0e0; }' +
      'tbody tr:hover { background: #f9f9f9; }' +
      'tbody tr:nth-child(even) { background: #fafbfc; }' +
      '.footer { margin-top: 30px; text-align: right; color: #999; font-size: 0.9em; }' +
      '</style>' +
      '</head><body>' +
      '<div class="header"><h1>Relatorio de Consultas</h1></div>' +
      '<div class="info">' +
      '<div class="info-item"><div class="info-label">Periodo</div><div class="info-value">' + dados.mes + '/' + dados.ano + '</div></div>' +
      '<div class="info-item"><div class="info-label">Total</div><div class="info-value">' + dados.total_consultas + ' consulta(s)</div></div>' +
      '<div class="info-item"><div class="info-label">Gerado em</div><div class="info-value">' + new Date().toLocaleString() + '</div></div>' +
      '</div>' +
      '<table><thead><tr><th>#</th><th>Nome</th><th>Telefone</th><th>Agendamento</th><th>Consulta</th><th>Pagamento</th><th>Valor</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<div class="footer"><p>Relatorio impresso</p></div>' +
      '<script>setTimeout(() => window.print(), 500);</script>' +
      '</body></html>';

    const janela = window.open();
    janela.document.write(html);
    janela.document.close();
  },

  mostrarMensagem(tipo, texto) {
    const div = document.createElement('div');
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: ' + 
      (tipo === 'sucesso' ? '#28a745' : '#dc3545') + '; color: white; border-radius: 8px; z-index: 2000; font-weight: 600;';
    div.textContent = texto;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CONSULTAS_APP.init();
});
