// Sistema de Consultas - Gabriela (Versão Lista - MELHORADO)
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
    
    // Pré-preencher data e mês
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    // Pré-preencher mês
    const mesInput = document.getElementById('mesConsulta');
    if (mesInput) {
      mesInput.value = mes;
    }
    
    // Pré-preencher ano
    const anoInput = document.getElementById('anoConsulta');
    if (anoInput) {
      anoInput.value = ano;
    }
    
    // Pré-preencher data de agendamento com hoje
    const dataAgInput = document.getElementById('dataAgendamento');
    if (dataAgInput) {
      dataAgInput.value = ano + '-' + mes + '-' + dia;
    }
    
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
      
      if (!Array.isArray(this.consultas)) {
        this.consultas = [];
      }
      
      this.renderizarConsultas();
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      this.mostrarMensagem('erro', 'Erro ao carregar consultas');
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
        // Formatar datas com segurança
        let dataAg = '-';
        let dataC = '-';
        
        if (c.data_agendamento) {
          try {
            const partes = c.data_agendamento.split('-');
            if (partes.length === 3) {
              dataAg = partes[2] + '/' + partes[1] + '/' + partes[0];
            }
          } catch (e) {
            dataAg = c.data_agendamento;
          }
        }
        
        if (c.data_consulta) {
          try {
            const partes = c.data_consulta.split('-');
            if (partes.length === 3) {
              dataC = partes[2] + '/' + partes[1] + '/' + partes[0];
            }
          } catch (e) {
            dataC = c.data_consulta;
          }
        }

        const row = document.createElement('tr');
        row.innerHTML = '<td class="numero-col"><strong>#' + c.numero_pessoa + '</strong></td>' +
          '<td class="nome-col">' + (c.nome || '-') + '</td>' +
          '<td class="tel-col">' + (c.telefone || '-') + '</td>' +
          '<td class="data-col">' + dataAg + '</td>' +
          '<td class="data-col"><strong>' + dataC + '</strong></td>' +
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
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'modal-confirmacao';
    confirmDelete.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 3000;';

    const content = document.createElement('div');
    content.className = 'modal-confirmacao-content';
    content.style.cssText = 'background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-width: 400px; text-align: center;';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Deletar Consulta?';
    titulo.style.cssText = 'color: #333; margin: 0 0 15px 0; font-size: 1.2em;';
    content.appendChild(titulo);

    const mensagem = document.createElement('p');
    mensagem.textContent = 'Esta ação não pode ser desfeita';
    mensagem.style.cssText = 'color: #666; margin: 0 0 25px 0;';
    content.appendChild(mensagem);

    const botoes = document.createElement('div');
    botoes.className = 'modal-confirmacao-buttons';
    botoes.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

    const btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn-confirm-delete';
    btnConfirm.textContent = '🗑️ Deletar';
    btnConfirm.style.cssText = 'background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn-cancel-delete';
    btnCancel.textContent = 'Cancelar';
    btnCancel.style.cssText = 'background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;';

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
        await fetch(this.API_URL + '/api/consultas/' + id, { method: 'DELETE' });
        this.mostrarMensagem('sucesso', 'Consultoria deletada!');
        this.carregarConsultas();
      } catch (error) {
        this.mostrarMensagem('erro', 'Erro ao deletar');
      }
    });
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
        this.gerarPDF(dados);
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro ao gerar relatório');
    }
  },

  gerarPDF(dados) {
    // Criar HTML para o PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Consultas</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 20px;
            color: #333;
            background: #fff;
          }
          .container { max-width: 1000px; margin: 0 auto; }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #667eea; 
            font-size: 24px;
            margin-bottom: 5px;
          }
          .header p { color: #999; font-size: 14px; }
          .info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .info-item {
            padding: 15px;
            background: #f5f7fa;
            border-left: 4px solid #667eea;
            border-radius: 4px;
          }
          .info-label {
            font-weight: 600;
            color: #667eea;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            color: #333;
            font-weight: 600;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white;
            margin-top: 20px;
          }
          thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          th { 
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
          }
          td { 
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
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
            margin-top: 30px;
            text-align: right;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
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
              <div class="info-label">PERÍODO</div>
              <div class="info-value">${dados.mes}/${dados.ano}</div>
            </div>
            <div class="info-item">
              <div class="info-label">TOTAL DE CONSULTAS</div>
              <div class="info-value">${dados.total_consultas}</div>
            </div>
            <div class="info-item">
              <div class="info-label">GERADO EM</div>
              <div class="info-value">${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Agendamento</th>
                <th>Consulta</th>
                <th>Pagamento</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${dados.dados.map(d => `
                <tr>
                  <td class="numero">#${d.numero}</td>
                  <td>${d.nome}</td>
                  <td>${d.telefone || '-'}</td>
                  <td>${d.data_agendamento}</td>
                  <td><strong>${d.data_consulta}</strong></td>
                  <td>${d.forma_pagamento || '-'}</td>
                  <td class="valor">R$ ${d.valor ? d.valor.toFixed(2) : '0.00'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Converter HTML para PDF usando html2pdf
    const element = document.createElement('div');
    element.innerHTML = html;
    
    // Usar html2pdf.js (alternativa simples)
    const opt = {
      margin: 10,
      filename: 'relatorio-consultas-' + new Date().getTime() + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };

    // Carregar html2pdf dinamicamente
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      html2pdf().set(opt).from(html).save();
      this.mostrarMensagem('sucesso', 'PDF baixado com sucesso!');
    };
    script.onerror = () => {
      // Fallback: abrir em nova janela
      const janela = window.open();
      janela.document.write(html);
      janela.document.close();
      this.mostrarMensagem('sucesso', 'Relatório aberto!');
    };
    document.head.appendChild(script);
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
