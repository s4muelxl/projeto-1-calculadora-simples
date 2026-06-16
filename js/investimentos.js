// js/investimentos.js – Investment Simulator
// Implements UI, formulas, detailed monthly growth table, history, and PDF/Excel export

export function renderInvestmentSimulator(root) {
  const container = document.createElement('div');
  container.className = 'fade-in';
  
  container.innerHTML = `
    <div class="calculator-grid">
      <div class="card calculation-card">
        <div class="card-header">
          <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div>
          <h2>Simulador de Investimentos</h2>
        </div>
        <p class="section-desc">Planeje o acúmulo de riqueza simulando aplicações iniciais e aportes mensais recorrentes.</p>
        
        <form id="invest-form" class="calc-form">
          <div class="form-row">
            <div class="input-group">
              <label for="inv-inicial">Valor Inicial (R$)</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input type="number" id="inv-inicial" placeholder="0,00" min="0" step="0.01" required />
              </div>
            </div>
            <div class="input-group">
              <label for="inv-aporte">Aporte Mensal (R$)</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input type="number" id="inv-aporte" placeholder="0,00" min="0" step="0.01" required />
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label for="inv-taxa">Taxa de Rendimento (%)</label>
              <input type="number" id="inv-taxa" placeholder="Ex: 10" min="0" step="0.01" required />
            </div>
            <div class="input-group">
              <label for="inv-taxa-tipo">Período da Taxa</label>
              <select id="inv-taxa-tipo">
                <option value="mensal">Ao Mês (% a.m.)</option>
                <option value="anual" selected>Ao Ano (% a.a.)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label for="inv-periodo">Período</label>
              <input type="number" id="inv-periodo" placeholder="Ex: 5" min="1" step="1" required />
            </div>
            <div class="input-group">
              <label for="inv-periodo-tipo">Unidade de Tempo</label>
              <select id="inv-periodo-tipo">
                <option value="meses">Meses</option>
                <option value="anos" selected>Anos</option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <label for="inv-name">Nome da Simulação (Opcional)</label>
            <input type="text" id="inv-name" placeholder="Ex: Aposentadoria 30 Anos" />
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
              Calcular
            </button>
            <button type="button" id="inv-clear" class="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>

      <div class="card result-card" id="inv-result-card" style="display: none;">
        <h3>Resultado do Planejamento</h3>
        <div class="metrics-grid">
          <div class="metric-box">
            <span class="metric-label">Patrimônio Final</span>
            <span class="metric-value text-primary" id="inv-res-saldo">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Total Investido</span>
            <span class="metric-value" id="inv-res-investido">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Total em Juros (Lucro)</span>
            <span class="metric-value text-accent" id="inv-res-lucro">R$ 0,00</span>
          </div>
        </div>

        <div class="export-actions">
          <button id="inv-pdf" class="btn btn-export btn-pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0 -2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exportar PDF
          </button>
          <button id="inv-excel" class="btn btn-export btn-excel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Exportar Excel
          </button>
        </div>

        <div class="evolution-table-container" style="margin-top: 1.5rem;">
          <h4 style="margin-bottom: 0.5rem;">Evolução Mês a Mês</h4>
          <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
            <table class="history-table compact-table" id="inv-monthly-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Depósito Total</th>
                  <th>Rendimento</th>
                  <th>Total Acumulado</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card history-card" style="margin-top: 2rem;">
      <div class="card-header">
        <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
        <h2>Histórico de Investimentos</h2>
      </div>
      <div class="table-responsive">
        <table class="history-table" id="inv-history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Inicial</th>
              <th>Aporte Mensal</th>
              <th>Taxa</th>
              <th>Período</th>
              <th>Final</th>
              <th>Lucro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="9" class="text-center text-muted">Nenhuma simulação no histórico.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  root.appendChild(container);

  const form = container.querySelector('#invest-form');
  const resultCard = container.querySelector('#inv-result-card');
  const resSaldo = container.querySelector('#inv-res-saldo');
  const resInvestido = container.querySelector('#inv-res-investido');
  const resLucro = container.querySelector('#inv-res-lucro');
  const clearBtn = container.querySelector('#inv-clear');
  const historyTableBody = container.querySelector('#inv-history-table tbody');
  const monthlyTableBody = container.querySelector('#inv-monthly-table tbody');

  const pdfBtn = container.querySelector('#inv-pdf');
  const excelBtn = container.querySelector('#inv-excel');

  let currentResult = null;
  let monthlySchedule = [];

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem('inv_history') || '[]');
    if (history.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Nenhuma simulação no histórico.</td></tr>`;
      return;
    }

    historyTableBody.innerHTML = history.map((item, index) => {
      const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `
        <tr>
          <td>${formattedDate}</td>
          <td><strong>${item.name || 'Sem nome'}</strong></td>
          <td>R$ ${item.P.toLocaleString('pt-BR')}</td>
          <td>R$ ${item.A.toLocaleString('pt-BR')}</td>
          <td>${item.taxaOrig.toFixed(2)}% (${item.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})</td>
          <td>${item.periodoOrig} ${item.periodoTipo === 'meses' ? 'meses' : 'anos'}</td>
          <td class="text-primary font-semibold">R$ ${item.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="text-accent font-semibold">R$ ${item.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>
            <div class="action-buttons">
              <button class="btn-action btn-load" data-index="${index}" title="Carregar">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              </button>
              <button class="btn-action btn-delete" data-index="${index}" title="Excluir">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.querySelectorAll('.btn-load').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        const item = history[idx];
        container.querySelector('#inv-inicial').value = item.P;
        container.querySelector('#inv-aporte').value = item.A;
        container.querySelector('#inv-taxa').value = item.taxaOrig;
        container.querySelector('#inv-taxa-tipo').value = item.taxaTipo;
        container.querySelector('#inv-periodo').value = item.periodoOrig;
        container.querySelector('#inv-periodo-tipo').value = item.periodoTipo;
        container.querySelector('#inv-name').value = item.name || '';
        form.dispatchEvent(new Event('submit'));
      });
    });

    container.querySelectorAll('.btn-delete').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        history.splice(idx, 1);
        localStorage.setItem('inv_history', JSON.stringify(history));
        renderHistory();
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const P = parseFloat(container.querySelector('#inv-inicial').value) || 0;
    const A = parseFloat(container.querySelector('#inv-aporte').value) || 0;
    const taxaOrig = parseFloat(container.querySelector('#inv-taxa').value) || 0;
    const taxaTipo = container.querySelector('#inv-taxa-tipo').value;
    const periodoOrig = parseFloat(container.querySelector('#inv-periodo').value) || 0;
    const periodoTipo = container.querySelector('#inv-periodo-tipo').value;
    const name = container.querySelector('#inv-name').value.trim();

    let meses = periodoOrig;
    if (periodoTipo === 'anos') {
      meses = periodoOrig * 12;
    }

    let i = taxaOrig / 100;
    if (taxaTipo === 'anual') {
      // Monthly equivalent rate: (1+i_a)^(1/12) - 1
      i = Math.pow(1 + i, 1/12) - 1;
    } else {
      i = taxaOrig / 100;
    }

    let saldo = P;
    let totalInvestido = P;
    monthlySchedule = [];

    // Store month 0 (initial state)
    monthlySchedule.push({
      mes: 0,
      deposito: totalInvestido,
      rendimento: 0,
      saldo: saldo
    });

    for (let m = 1; m <= meses; m++) {
      const rendimento = saldo * i;
      saldo = saldo + rendimento + A;
      totalInvestido += A;

      monthlySchedule.push({
        mes: m,
        deposito: totalInvestido,
        rendimento: rendimento,
        saldo: saldo
      });
    }

    const lucro = saldo - totalInvestido;

    currentResult = { P, A, taxaOrig, taxaTipo, periodoOrig, periodoTipo, saldo, totalInvestido, lucro, name, date: new Date().toISOString() };

    resSaldo.textContent = `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resInvestido.textContent = `R$ ${totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resLucro.textContent = `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Populate monthly table
    monthlyTableBody.innerHTML = monthlySchedule.map(row => `
      <tr>
        <td>Mês ${row.mes}</td>
        <td>R$ ${row.deposito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>R$ ${row.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td class="text-primary font-semibold">R$ ${row.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save simulation to history
    const history = JSON.parse(localStorage.getItem('inv_history') || '[]');
    history.push(currentResult);
    localStorage.setItem('inv_history', JSON.stringify(history));

    renderHistory();
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    resultCard.style.display = 'none';
    currentResult = null;
  });

  // PDF Export
  pdfBtn.addEventListener('click', () => {
    if (!currentResult) return;
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert('Biblioteca PDF indisponível.');
      return;
    }

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(130, 10, 209);
    doc.text('FinanceCalc Pro', 14, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text('Relatório: Simulador de Investimentos', 14, 33);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${new Date(currentResult.date).toLocaleString('pt-BR')}`, 14, 45);
    doc.text(`Identificação: ${currentResult.name || 'Sem nome'}`, 14, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text('Entradas Utilizadas:', 14, 65);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`- Valor Inicial: R$ ${currentResult.P.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 75);
    doc.text(`- Aporte Mensal: R$ ${currentResult.A.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 83);
    doc.text(`- Taxa: ${currentResult.taxaOrig.toFixed(2)}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`, 14, 91);
    doc.text(`- Período: ${currentResult.periodoOrig} ${currentResult.periodoTipo === 'meses' ? 'meses' : 'anos'}`, 14, 99);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resultados Obtidos:', 14, 115);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(130, 10, 209);
    doc.text(`Patrimônio Final: R$ ${currentResult.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 125);
    doc.setTextColor(33, 33, 33);
    doc.text(`Total Investido: R$ ${currentResult.totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 133);
    doc.setTextColor(220, 53, 69);
    doc.text(`Total em Juros (Lucro): R$ ${currentResult.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 141);

    doc.save(`financecalc-investimentos-${Date.now()}.pdf`);
  });

  // Excel Export
  excelBtn.addEventListener('click', () => {
    if (!currentResult) return;
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert('Biblioteca de planilhas indisponível.');
      return;
    }

    // Prepare overview rows followed by monthly schedule
    const rows = [
      ['FinanceCalc Pro - Simulador de Investimentos'],
      [''],
      ['Data de Geração', new Date(currentResult.date).toLocaleString('pt-BR')],
      ['Nome da Simulação', currentResult.name || 'Sem nome'],
      ['Valor Inicial', currentResult.P],
      ['Aporte Mensal', currentResult.A],
      ['Taxa de Rendimento', `${currentResult.taxaOrig}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`],
      ['Período', `${currentResult.periodoOrig} ${currentResult.periodoTipo === 'meses' ? 'meses' : 'anos'}`],
      [''],
      ['Métrica', 'Valor Final'],
      ['Patrimônio Final', currentResult.saldo],
      ['Total Investido', currentResult.totalInvestido],
      ['Lucro em Juros', currentResult.lucro],
      [''],
      ['DETALHE MÊS A MÊS'],
      ['Mês', 'Depósito Total (R$)', 'Rendimento Juros (R$)', 'Total Acumulado (R$)']
    ];

    monthlySchedule.forEach(row => {
      rows.push([
        `Mês ${row.mes}`,
        row.deposito,
        row.rendimento,
        row.saldo
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulação de Investimentos");
    XLSX.writeFile(wb, `financecalc-investimentos-${Date.now()}.xlsx`);
  });

  renderHistory();
}
