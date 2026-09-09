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
    
    // Pré-preencher data e mês apenas se estiverem vazios
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    // Pré-preencher mês se estiver vazio
    const mesInput = document.getElementById('mesConsulta');
    if (mesInput && !mesInput.value) {
      mesInput.value = mes;
    }
    
    // Pré-preencher ano se estiver vazio
    const anoInput = document.getElementById('anoConsulta');
    if (anoInput && !anoInput.value) {
      anoInput.value = ano;
    }
    
    // Pré-preencher data de agendamento se estiver vazia
    const dataAgInput = document.getElementById('dataAgendamento');
    if (dataAgInput && !dataAgInput.value) {
      dataAgInput.value = ano + '-' + mes + '-' + dia;
    }
    
    this.carregarConsultas();
  },

  fecharModal() {
    this.modalConsultas.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // NÃO resetar o formulário - manter os dados
  },

  async adicionarConsulta(e) {
    e.preventDefault();

    const mesValue = document.getElementById('mesConsulta').value;
    const anoValue = document.getElementById('anoConsulta').value;

    // Validar mês e ano
    if (!mesValue || !anoValue) {
      alert('Mês e Ano são obrigatórios!');
      return;
    }

    const dados = {
      mes: mesValue, // Já vem formatado como "09", "10", etc.
      ano: parseInt(anoValue),
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

    if (!dados.data_agendamento) {
      alert('Data de agendamento é obrigatória!');
      return;
    }

    if (!dados.data_consulta) {
      alert('Data da consulta é obrigatória!');
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
        this.mostrarMensagem('sucesso', 'Consulta #' + resultado.numero_pessoa + ' adicionada em ' + dados.mes + '/' + dados.ano + '!');
        
        // Limpar apenas alguns campos
        document.getElementById('nomeConsulta').value = '';
        document.getElementById('telefoneConsulta').value = '';
        document.getElementById('notasConsulta').value = '';
        document.getElementById('dataConsulta').value = '';
        document.getElementById('formaPagamento').value = '';
        document.getElementById('valorConsulta').value = '';
        
        this.carregarConsultas();
      } else {
        this.mostrarMensagem('erro', 'Erro: ' + (resultado.erro || 'desconhecido'));
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro de conexão: ' + error.message);
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

  nomeMes(numMes) {
    const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mes = parseInt(numMes);
    return meses[mes] || numMes;
  },

  renderizarConsultas() {
    const container = document.getElementById('containerConsultas');
    if (!container) return;

    if (!this.consultas || this.consultas.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma consulta registrada</p></div>';
      return;
    }

    // Limpar container
    container.innerHTML = '';
    
    // Agrupar por mês
    const porMes = {};
    this.consultas.forEach(c => {
      if (!c.ano || !c.mes) return;
      // Garantir que mês sempre tem 2 dígitos para ordenação correta
      const mesFormatado = String(c.mes).padStart(2, '0');
      const chave = c.ano + '-' + mesFormatado;
      if (!porMes[chave]) {
        porMes[chave] = {
          ano: c.ano,
          mes: mesFormatado,
          consultas: []
        };
      }
      porMes[chave].consultas.push(c);
    });

    // Ordenar por ano/mês decrescente
    const chaves = Object.keys(porMes).sort().reverse();
    
    if (chaves.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma consulta registrada</p></div>';
      return;
    }

    // Criar container de abas
    const abasContainer = document.createElement('div');
    abasContainer.className = 'abas-container';
    
    // Criar abas
    chaves.forEach((chave, index) => {
      const grupo = porMes[chave];
      const mesStr = this.nomeMes(grupo.mes) + '/' + grupo.ano;
      
      const aba = document.createElement('button');
      aba.className = 'aba-mes-top';
      if (index === 0) aba.classList.add('aba-ativa');
      aba.textContent = mesStr;
      aba.setAttribute('data-mes', chave);
      
      aba.addEventListener('click', () => {
        // Remover classe ativa de todas
        document.querySelectorAll('.aba-mes-top').forEach(a => {
          a.classList.remove('aba-ativa');
        });
        // Adicionar classe ativa nesta
        aba.classList.add('aba-ativa');
        
        // Mostrar/esconder linhas
        document.querySelectorAll('[data-mes-linha]').forEach(linha => {
          linha.style.display = 'none';
        });
        document.querySelectorAll('[data-mes-linha="' + chave + '"]').forEach(linha => {
          linha.style.display = '';
        });
      });
      
      abasContainer.appendChild(aba);
    });
    
    container.appendChild(abasContainer);

    // Criar tabela
    const tabela = document.createElement('table');
    tabela.className = 'tabela-consultas-com-abas';
    
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>#</th><th>Nome</th><th>Telefone</th><th>Agendamento</th><th>Consulta</th><th>Pagamento</th><th>Valor</th><th>Notas</th><th>Acao</th></tr>';
    tabela.appendChild(thead);

    const tbody = document.createElement('tbody');
    
    // Adicionar linhas de todas as consultas com atributo data-mes-linha
    chaves.forEach((chave, indexMes) => {
      const grupo = porMes[chave];
      
      grupo.consultas.forEach((c) => {
        // Formatar datas
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
        row.setAttribute('data-mes-linha', chave);
        if (indexMes > 0) row.style.display = 'none'; // Esconder linhas que não são do primeiro mês
        
        row.innerHTML = '<td class="numero-col"><strong>#' + c.numero_pessoa + '</strong></td>' +
          '<td class="nome-col">' + (c.nome || '-') + '</td>' +
          '<td class="tel-col">' + (c.telefone || '-') + '</td>' +
          '<td class="data-col">' + dataAg + '</td>' +
          '<td class="data-col"><strong>' + dataC + '</strong></td>' +
          '<td class="pagamento-col">' + (c.forma_pagamento || '-') + '</td>' +
          '<td class="valor-col">' + (c.valor ? 'R$ ' + c.valor.toFixed(2) : '-') + '</td>' +
          '<td class="notas-col">' + (c.notas || '-') + '</td>' +
          '<td class="acao-col"><button class="btn-editar" onclick="CONSULTAS_APP.abrirEditarConsulta(' + c.id + ')">✏️</button> <button class="btn-del" onclick="CONSULTAS_APP.deletarConsulta(' + c.id + ', ' + c.ano + ', \'' + c.mes + '\')">X</button></td>';
        
        tbody.appendChild(row);
      });
    });
    
    tabela.appendChild(tbody);
    container.appendChild(tabela);
  },

  async deletarConsulta(id, ano, mes) {
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
        // Deletar consulta
        await fetch(this.API_URL + '/api/consultas/' + id, { method: 'DELETE' });
        
        // Reorganizar números do mesmo mês/ano
        await this.reorganizarNumeros(ano, mes);
        
        this.mostrarMensagem('sucesso', 'Consultoria deletada e números atualizados!');
        this.carregarConsultas();
      } catch (error) {
        this.mostrarMensagem('erro', 'Erro ao deletar');
      }
    });
  },

  async reorganizarNumeros(ano, mes) {
    try {
      // Buscar todas as consultas do mês/ano
      const response = await fetch(this.API_URL + '/api/consultas');
      const todasConsultas = await response.json();
      
      // Filtrar apenas as do mês/ano
      const consultasMes = todasConsultas
        .filter(c => c.ano == ano && c.mes == mes)
        .sort((a, b) => a.id - b.id); // Ordenar por ID
      
      // Reorganizar números
      for (let i = 0; i < consultasMes.length; i++) {
        const novoNumero = i + 1;
        if (consultasMes[i].numero_pessoa !== novoNumero) {
          await fetch(this.API_URL + '/api/consultas/' + consultasMes[i].id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero_pessoa: novoNumero })
          });
        }
      }
    } catch (error) {
      console.error('Erro ao reorganizar números:', error);
    }
  },

  async abrirEditarConsulta(id) {
    // Buscar consulta
    try {
      const response = await fetch(this.API_URL + '/api/consultas');
      const consultas = await response.json();
      const consulta = consultas.find(c => c.id === id);
      
      if (!consulta) {
        this.mostrarMensagem('erro', 'Consulta não encontrada');
        return;
      }

      // Criar modal de edição
      this.mostrarModalEditar(consulta);
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro ao carregar consulta');
    }
  },

  mostrarModalEditar(consulta) {
    const modal = document.createElement('div');
    modal.className = 'modal-editar-consulta';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 3000; overflow: auto;';

    const container = document.createElement('div');
    container.style.cssText = 'background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';

    const titulo = document.createElement('h2');
    titulo.textContent = 'Editar Consulta #' + consulta.numero_pessoa;
    titulo.style.cssText = 'color: #667eea; margin: 0 0 20px 0;';
    container.appendChild(titulo);

    // Formulário
    const form = document.createElement('form');
    form.style.cssText = 'display: grid; gap: 15px;';

    // Nome
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Nome</label>' +
      '<input type="text" id="editNome" value="' + (consulta.nome || '') + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '</div>';

    // Telefone
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Telefone</label>' +
      '<input type="text" id="editTelefone" value="' + (consulta.telefone || '') + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '</div>';

    // Data Agendamento
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Data de Agendamento</label>' +
      '<input type="date" id="editDataAg" value="' + (consulta.data_agendamento || '') + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '</div>';

    // Data Consulta
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Data da Consulta</label>' +
      '<input type="date" id="editDataConsulta" value="' + (consulta.data_consulta || '') + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '</div>';

    // Forma de Pagamento
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Forma de Pagamento</label>' +
      '<select id="editFormaPagamento" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '<option value="">Selecione...</option>' +
      '<option value="Dinheiro" ' + (consulta.forma_pagamento === 'Dinheiro' ? 'selected' : '') + '>Dinheiro</option>' +
      '<option value="Débito" ' + (consulta.forma_pagamento === 'Débito' ? 'selected' : '') + '>Débito</option>' +
      '<option value="Crédito" ' + (consulta.forma_pagamento === 'Crédito' ? 'selected' : '') + '>Crédito</option>' +
      '<option value="PIX" ' + (consulta.forma_pagamento === 'PIX' ? 'selected' : '') + '>PIX</option>' +
      '<option value="Cheque" ' + (consulta.forma_pagamento === 'Cheque' ? 'selected' : '') + '>Cheque</option>' +
      '<option value="Outro" ' + (consulta.forma_pagamento === 'Outro' ? 'selected' : '') + '>Outro</option>' +
      '</select>' +
      '</div>';

    // Valor
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Valor (R$)</label>' +
      '<input type="number" id="editValor" value="' + (consulta.valor || '') + '" step="0.01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;">' +
      '</div>';

    // Notas
    form.innerHTML += '<div>' +
      '<label style="display: block; margin-bottom: 5px; color: #333; font-weight: 600;">Notas</label>' +
      '<textarea id="editNotas" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial; min-height: 80px;">' + (consulta.notas || '') + '</textarea>' +
      '</div>';

    container.appendChild(form);

    // Botões
    const botoes = document.createElement('div');
    botoes.style.cssText = 'display: flex; gap: 10px; margin-top: 20px;';

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.style.cssText = 'flex: 1; background: #6c757d; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600;';
    btnCancelar.onclick = () => modal.remove();

    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = '💾 Salvar';
    btnSalvar.style.cssText = 'flex: 1; background: #667eea; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600;';
    btnSalvar.onclick = (e) => {
      e.preventDefault();
      this.salvarEdicaoConsulta(consulta.id, modal);
    };

    botoes.appendChild(btnCancelar);
    botoes.appendChild(btnSalvar);
    container.appendChild(botoes);

    modal.appendChild(container);
    document.body.appendChild(modal);
  },

  async salvarEdicaoConsulta(id, modal) {
    const dados = {
      nome: document.getElementById('editNome').value.trim(),
      telefone: document.getElementById('editTelefone').value.trim() || null,
      data_agendamento: document.getElementById('editDataAg').value,
      data_consulta: document.getElementById('editDataConsulta').value,
      forma_pagamento: document.getElementById('editFormaPagamento').value || null,
      valor: parseFloat(document.getElementById('editValor').value) || null,
      notas: document.getElementById('editNotas').value.trim() || null
    };

    if (!dados.nome) {
      alert('Nome é obrigatório!');
      return;
    }

    try {
      const response = await fetch(this.API_URL + '/api/consultas/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        modal.remove();
        this.mostrarMensagem('sucesso', 'Consulta atualizada!');
        this.carregarConsultas();
      } else {
        this.mostrarMensagem('erro', 'Erro ao salvar');
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro de conexão');
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
        this.mostrarPreviewRelatorio(dados);
      }
    } catch (error) {
      this.mostrarMensagem('erro', 'Erro ao gerar relatório');
    }
  },

  mostrarPreviewRelatorio(dados) {
    // Criar modal de preview
    const modal = document.createElement('div');
    modal.className = 'modal-relatorio-preview';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 3000; overflow: auto;';

    const container = document.createElement('div');
    container.style.cssText = 'background: white; border-radius: 12px; max-width: 900px; width: 90%; max-height: 80vh; overflow: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);';

    // Header do modal
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 2px solid #667eea; background: #f5f7fa;';
    header.innerHTML = '<h2 style="margin: 0; color: #667eea;">Preview - Relatório de Consultas</h2>';
    
    const btnFechar = document.createElement('button');
    btnFechar.textContent = '✕';
    btnFechar.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; color: #667eea;';
    btnFechar.onclick = () => modal.remove();
    header.appendChild(btnFechar);
    
    container.appendChild(header);

    // Conteúdo do relatório
    const conteudo = document.createElement('div');
    conteudo.style.cssText = 'padding: 30px;';
    conteudo.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #667eea; margin: 0 0 5px 0;">📊 Relatório de Consultas</h1>
        <p style="color: #999; margin: 0;">Sistema de Lembretes - Gabriela</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
        <div style="padding: 15px; background: #f5f7fa; border-left: 4px solid #667eea; border-radius: 4px;">
          <div style="font-weight: 600; color: #667eea; font-size: 12px; margin-bottom: 5px;">PERÍODO</div>
          <div style="font-size: 16px; color: #333; font-weight: 600;">${dados.mes}/${dados.ano}</div>
        </div>
        <div style="padding: 15px; background: #f5f7fa; border-left: 4px solid #667eea; border-radius: 4px;">
          <div style="font-weight: 600; color: #667eea; font-size: 12px; margin-bottom: 5px;">TOTAL DE CONSULTAS</div>
          <div style="font-size: 16px; color: #333; font-weight: 600;">${dados.total_consultas}</div>
        </div>
        <div style="padding: 15px; background: #f5f7fa; border-left: 4px solid #667eea; border-radius: 4px;">
          <div style="font-weight: 600; color: #667eea; font-size: 12px; margin-bottom: 5px;">GERADO EM</div>
          <div style="font-size: 16px; color: #333; font-weight: 600;">${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif;">
        <thead>
          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <th style="padding: 12px; text-align: left; font-weight: 600;">#</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Nome</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Telefone</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Agendamento</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Consulta</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Pagamento</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${dados.dados.map((d, i) => `
            <tr style="border-bottom: 1px solid #e0e0e0; background: ${i % 2 === 0 ? '#fff' : '#fafbfc'};">
              <td style="padding: 10px 12px; color: #667eea; font-weight: 700;">#${d.numero}</td>
              <td style="padding: 10px 12px; color: #333;">${d.nome}</td>
              <td style="padding: 10px 12px; color: #333;">${d.telefone || '-'}</td>
              <td style="padding: 10px 12px; color: #333;">${d.data_agendamento}</td>
              <td style="padding: 10px 12px; color: #333; font-weight: 600;">${d.data_consulta}</td>
              <td style="padding: 10px 12px; color: #333;">${d.forma_pagamento || '-'}</td>
              <td style="padding: 10px 12px; color: #28a745; font-weight: 600; text-align: right;">R$ ${d.valor ? d.valor.toFixed(2) : '0.00'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.appendChild(conteudo);

    // Footer com botões
    const footer = document.createElement('div');
    footer.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; padding: 20px; border-top: 1px solid #e0e0e0; background: #f5f7fa;';
    
    const btnFecharFooter = document.createElement('button');
    btnFecharFooter.textContent = 'Fechar';
    btnFecharFooter.style.cssText = 'background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;';
    btnFecharFooter.onclick = () => modal.remove();
    footer.appendChild(btnFecharFooter);

    const btnBaixarPDF = document.createElement('button');
    btnBaixarPDF.textContent = '⬇️ Baixar como PDF';
    btnBaixarPDF.style.cssText = 'background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;';
    btnBaixarPDF.onclick = () => {
      modal.remove();
      this.gerarPDFSimples(dados);
    };
    footer.appendChild(btnBaixarPDF);

    container.appendChild(footer);
    modal.appendChild(container);
    document.body.appendChild(modal);
  },

  gerarPDFSimples(dados) {
    // Criar um link temporário para download
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    
    script.onload = () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape
        
        let yPos = 20;
        
        // Título
        doc.setFontSize(18);
        doc.setTextColor(102, 126, 234);
        doc.text('Relatório de Consultas', 15, yPos);
        
        // Subtítulo
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Sistema de Lembretes - Gabriela', 15, yPos);
        
        // Info boxes
        yPos += 15;
        doc.setFontSize(10);
        doc.setTextColor(102, 126, 234);
        doc.text('Período: ' + dados.mes + '/' + dados.ano, 15, yPos);
        
        yPos += 7;
        doc.text('Total de Consultas: ' + dados.total_consultas, 15, yPos);
        
        yPos += 7;
        doc.setTextColor(100, 100, 100);
        doc.text('Gerado em: ' + new Date().toLocaleString('pt-BR'), 15, yPos);
        
        // Tabela manual
        yPos += 15;
        
        // Headers
        const headers = ['#', 'Nome', 'Telefone', 'Agendamento', 'Consulta', 'Pagamento', 'Valor'];
        const colWidths = [10, 35, 30, 28, 28, 25, 28];
        let xPos = 15;
        
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(102, 126, 234);
        
        // Desenhar headers
        headers.forEach((header, i) => {
          doc.rect(xPos, yPos, colWidths[i], 8, 'F');
          doc.text(header, xPos + 2, yPos + 5);
          xPos += colWidths[i];
        });
        
        yPos += 8;
        
        // Linhas de dados
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(8);
        
        dados.dados.forEach((d, idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          const rowData = [
            '#' + d.numero,
            d.nome,
            d.telefone || '-',
            d.data_agendamento,
            d.data_consulta,
            d.forma_pagamento || '-',
            'R$ ' + (d.valor ? d.valor.toFixed(2) : '0.00')
          ];
          
          // Cor alternada
          if (idx % 2 === 0) {
            doc.setFillColor(250, 251, 252);
            xPos = 15;
            headers.forEach((h, i) => {
              doc.rect(xPos, yPos, colWidths[i], 7, 'F');
              xPos += colWidths[i];
            });
          }
          
          xPos = 15;
          rowData.forEach((text, i) => {
            doc.text(text.toString(), xPos + 2, yPos + 4.5);
            xPos += colWidths[i];
          });
          
          yPos += 7;
        });
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Documento gerado automaticamente pelo Sistema de Lembretes - Gabriela', 15, 280);
        
        // Download
        doc.save('relatorio-consultas-' + new Date().getTime() + '.pdf');
        this.mostrarMensagem('sucesso', 'PDF baixado com sucesso!');
      } catch (error) {
        this.mostrarMensagem('erro', 'Erro ao gerar PDF: ' + error.message);
      }
    };
    
    script.onerror = () => {
      this.mostrarMensagem('erro', 'Erro ao carregar biblioteca PDF');
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
