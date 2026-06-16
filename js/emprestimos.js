// js/emprestimos.js – Loan Simulator
// Implements UI, formulas, amortization table (PRICE system), history, and PDF/Excel export

export function renderLoanSimulator(root) {
  const container = document.createElement('div');
  container.className = 'fade-in';
  
  container.innerHTML = `
    <div class="calculator-grid">
      <div class="card calculation-card">
        <div class="card-header">
          <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-percent"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg></div>
          <h2>Simulador de Empréstimos</h2>
        </div>
        <p class="section-desc">Simule financiamentos e empréstimos calculando o valor da parcela mensal fixa e o custo total de juros.</p>
        
        <form id="loan-form" class="calc-form">
          <div class="input-group">
            <label for="loan-valor">Valor do Empréstimo (R$)</label>
            <div class="input-wrapper">
              <span class="input-prefix">R$</span>
              <input type="number" id="loan-valor" placeholder="0,00" min="0" step="0.01" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label for="loan-taxa">Taxa de Juros (%)</label>
              <input type="number" id="loan-taxa" placeholder="Ex: 2" min="0" step="0.01" required />
            </div>
            <div class="input-group">
              <label for="loan-taxa-tipo">Período da Taxa</label>
              <select id="loan-taxa-tipo">
                <option value="mensal" selected>Ao Mês (% a.m.)</option>
                <option value="anual">Ao Ano (% a.a.)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label for="loan-parcelas">Número de Parcelas</label>
              <input type="number" id="loan-parcelas" placeholder="Ex: 24" min="1" step="1" required />
            </div>
            <div class="input-group">
              <label for="loan-periodo-tipo">Unidade de Tempo</label>
              <select id="loan-periodo-tipo">
                <option value="meses" selected>Meses</option>
                <option value="anos">Anos</option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <label for="loan-name">Nome da Simulação (Opcional)</label>
            <input type="text" id="loan-name" placeholder="Ex: Financiamento Imobiliário Caixa" />
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
              Calcular
            </button>
            <button type="button" id="loan-clear" class="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>

      <div class="card result-card" id="loan-result-card" style="display: none;">
        <h3>Resultado do Financiamento</h3>
        <div class="metrics-grid">
          <div class="metric-box">
            <span class="metric-label">Valor da Parcela (Mensal)</span>
            <span class="metric-value text-primary" id="loan-res-parcela">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Total a Pagar</span>
            <span class="metric-value" id="loan-res-total">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Total em Juros</span>
            <span class="metric-value text-accent" id="loan-res-juros">R$ 0,00</span>
          </div>
        </div>

        <div class="export-actions">
          <button id="loan-pdf" class="btn btn-export btn-pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0 -2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exportar PDF
          </button>
          <button id="loan-excel" class="btn btn-export btn-excel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Exportar Excel
          </button>
        </div>

        <div class="evolution-table-container" style="margin-top: 1.5rem;">
          <h4 style="margin-bottom: 0.5rem;">Tabela Price (Amortização Constante)</h4>
          <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
            <table class="history-table compact-table" id="loan-amortization-table">
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Prestação</th>
                  <th>Juros</th>
                  <th>Amortização</th>
                  <th>Saldo Devedor</th>
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
        <h2>Histórico de Empréstimos</h2>
      </div>
      <div class="table-responsive">
        <table class="history-table" id="loan-history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Valor do Empréstimo</th>
              <th>Taxa</th>
              <th>Parcelas</th>
              <th>Vlr. Parcela</th>
              <th>Total Pago</th>
              <th>Total Juros</th>
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

  const form = container.querySelector('#loan-form');
  const resultCard = container.querySelector('#loan-result-card');
  const resParcela = container.querySelector('#loan-res-parcela');
  const resTotal = container.querySelector('#loan-res-total');
  const resJuros = container.querySelector('#loan-res-juros');
  const clearBtn = container.querySelector('#loan-clear');
  const historyTableBody = container.querySelector('#loan-history-table tbody');
  const amortizationTableBody = container.querySelector('#loan-amortization-table tbody');

  const pdfBtn = container.querySelector('#loan-pdf');
  const excelBtn = container.querySelector('#loan-excel');

  let currentResult = null;
  let amortizationSchedule = [];

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem('loan_history') || '[]');
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
          <td>R$ ${item.valor.toLocaleString('pt-BR')}</td>
          <td>${item.taxaOrig.toFixed(2)}% (${item.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})</td>
          <td>${item.parcelasOrig} ${item.periodoTipo === 'meses' ? 'meses' : 'anos'}</td>
          <td class="text-primary font-semibold">R$ ${item.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>R$ ${item.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="text-accent font-semibold">R$ ${item.jurosPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
        container.querySelector('#loan-valor').value = item.valor;
        container.querySelector('#loan-taxa').value = item.taxaOrig;
        container.querySelector('#loan-taxa-tipo').value = item.taxaTipo;
        container.querySelector('#loan-parcelas').value = item.parcelasOrig;
        container.querySelector('#loan-periodo-tipo').value = item.periodoTipo;
        container.querySelector('#loan-name').value = item.name || '';
        form.dispatchEvent(new Event('submit'));
      });
    });

    container.querySelectorAll('.btn-delete').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        history.splice(idx, 1);
        localStorage.setItem('loan_history', JSON.stringify(history));
        renderHistory();
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valor = parseFloat(container.querySelector('#loan-valor').value) || 0;
    const taxaOrig = parseFloat(container.querySelector('#loan-taxa').value) || 0;
    const taxaTipo = container.querySelector('#loan-taxa-tipo').value;
    const parcelasOrig = parseInt(container.querySelector('#loan-parcelas').value) || 0;
    const periodoTipo = container.querySelector('#loan-periodo-tipo').value;
    const name = container.querySelector('#loan-name').value.trim();

    let n = parcelasOrig;
    if (periodoTipo === 'anos') {
      n = parcelasOrig * 12;
    }

    let i = taxaOrig / 100;
    if (taxaTipo === 'anual') {
      i = Math.pow(1 + i, 1/12) - 1; // monthly rate equivalent
    }

    // PMT calculation: PV * i * (1+i)^n / ((1+i)^n - 1)
    let parcela = 0;
    if (i > 0) {
      const fator = Math.pow(1 + i, n);
      parcela = valor * i * fator / (fator - 1);
    } else {
      parcela = valor / n;
    }

    const totalPago = parcela * n;
    const jurosPago = totalPago - valor;

    // Generate amortization schedule (PRICE System)
    amortizationSchedule = [];
    let saldoDevedor = valor;
    for (let m = 1; m <= n; m++) {
      const jurosParcela = saldoDevedor * i;
      const amortizacao = parcela - jurosParcela;
      saldoDevedor -= amortizacao;

      // Handle minor floating point rounding errors at the end
      const finalSaldo = Math.max(0, saldoDevedor);

      amortizationSchedule.push({
        num: m,
        prestacao: parcela,
        juros: jurosParcela,
        amortizacao: amortizacao,
        saldoDevedor: finalSaldo
      });
    }

    currentResult = { valor, taxaOrig, taxaTipo, parcelasOrig, periodoTipo, parcela, totalPago, jurosPago, name, date: new Date().toISOString() };

    resParcela.textContent = `R$ ${parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resTotal.textContent = `R$ ${totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resJuros.textContent = `R$ ${jurosPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    amortizationTableBody.innerHTML = amortizationSchedule.map(row => `
      <tr>
        <td>${row.num}</td>
        <td>R$ ${row.prestacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>R$ ${row.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>R$ ${row.amortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td class="font-semibold text-muted">R$ ${row.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save simulation to history
    const history = JSON.parse(localStorage.getItem('loan_history') || '[]');
    history.push(currentResult);
    localStorage.setItem('loan_history', JSON.stringify(history));

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
    doc.text('Relatório: Simulador de Empréstimos', 14, 33);
    
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
    doc.text(`- Valor do Empréstimo: R$ ${currentResult.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 75);
    doc.text(`- Taxa de Juros: ${currentResult.taxaOrig.toFixed(2)}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`, 14, 83);
    doc.text(`- Número de Parcelas: ${currentResult.parcelasOrig} ${currentResult.periodoTipo === 'meses' ? 'meses' : 'anos'}`, 14, 91);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resultados Obtidos:', 14, 105);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(130, 10, 209);
    doc.text(`Valor da Parcela (Mensal): R$ ${currentResult.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 115);
    doc.setTextColor(33, 33, 33);
    doc.text(`Total a Pagar: R$ ${currentResult.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 123);
    doc.setTextColor(220, 53, 69);
    doc.text(`Total em Juros Pagos: R$ ${currentResult.jurosPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 131);

    doc.save(`financecalc-emprestimos-${Date.now()}.pdf`);
  });

  // Excel Export
  excelBtn.addEventListener('click', () => {
    if (!currentResult) return;
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert('Biblioteca de planilhas indisponível.');
      return;
    }

    const rows = [
      ['FinanceCalc Pro - Simulador de Empréstimos (Tabela Price)'],
      [''],
      ['Data de Geração', new Date(currentResult.date).toLocaleString('pt-BR')],
      ['Nome da Simulação', currentResult.name || 'Sem nome'],
      ['Valor do Empréstimo', currentResult.valor],
      ['Taxa de Juros', `${currentResult.taxaOrig}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`],
      ['Total de Parcelas', `${currentResult.parcelasOrig} ${currentResult.periodoTipo === 'meses' ? 'meses' : 'anos'}`],
      [''],
      ['Métrica', 'Valor'],
      ['Valor da Parcela', currentResult.parcela],
      ['Total Pago ao Final', currentResult.totalPago],
      ['Total em Juros Pagos', currentResult.jurosPago],
      [''],
      ['TABELA DE AMORTIZAÇÃO (PRICE)'],
      ['Parcela', 'Prestação (R$)', 'Juros (R$)', 'Amortização (R$)', 'Saldo Devedor (R$)']
    ];

    amortizationSchedule.forEach(row => {
      rows.push([
        row.num,
        row.prestacao,
        row.juros,
        row.amortizacao,
        row.saldoDevedor
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulação de Empréstimo");
    XLSX.writeFile(wb, `financecalc-emprestimos-${Date.now()}.xlsx`);
  });

  renderHistory();
}
