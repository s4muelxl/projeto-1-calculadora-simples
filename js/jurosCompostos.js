// js/jurosCompostos.js – Compound Interest Calculator
// Implements UI, formulas, history persistence, PDF/Excel export, and simulation loading

export function renderCompoundInterest(root) {
  const container = document.createElement('div');
  container.className = 'fade-in';
  
  container.innerHTML = `
    <div class="calculator-grid">
      <div class="card calculation-card">
        <div class="card-header">
          <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
          <h2>Juros Compostos</h2>
        </div>
        <p class="section-desc">Calcule o crescimento do seu capital sob efeito de juros compostos (juros sobre juros).</p>
        
        <form id="compound-form" class="calc-form">
          <div class="input-group">
            <label for="ci-capital">Capital Inicial (R$)</label>
            <div class="input-wrapper">
              <span class="input-prefix">R$</span>
              <input type="number" id="ci-capital" placeholder="0,00" min="0" step="0.01" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label for="ci-taxa">Taxa de Juros (%)</label>
              <input type="number" id="ci-taxa" placeholder="Ex: 1" min="0" step="0.01" required />
            </div>
            <div class="input-group">
              <label for="ci-taxa-tipo">Período da Taxa</label>
              <select id="ci-taxa-tipo">
                <option value="mensal" selected>Ao Mês (% a.m.)</option>
                <option value="anual">Ao Ano (% a.a.)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label for="ci-tempo">Tempo</label>
              <input type="number" id="ci-tempo" placeholder="Ex: 12" min="1" step="1" required />
            </div>
            <div class="input-group">
              <label for="ci-tempo-tipo">Unidade de Tempo</label>
              <select id="ci-tempo-tipo">
                <option value="meses" selected>Meses</option>
                <option value="anos">Anos</option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <label for="ci-name">Nome da Simulação (Opcional)</label>
            <input type="text" id="ci-name" placeholder="Ex: Viagem de Férias" />
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
              Calcular
            </button>
            <button type="button" id="ci-clear" class="btn btn-secondary">Limpar</button>
          </div>
        </form>
      </div>

      <div class="card result-card" id="ci-result-card" style="display: none;">
        <h3>Resultado da Simulação</h3>
        <div class="metrics-grid">
          <div class="metric-box">
            <span class="metric-label">Montante Acumulado</span>
            <span class="metric-value text-primary" id="ci-res-montante">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Capital Inicial</span>
            <span class="metric-value" id="ci-res-capital">R$ 0,00</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Lucro Obtido (Juros)</span>
            <span class="metric-value text-accent" id="ci-res-lucro">R$ 0,00</span>
          </div>
        </div>

        <div class="export-actions">
          <button id="ci-pdf" class="btn btn-export btn-pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0 -2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exportar PDF
          </button>
          <button id="ci-excel" class="btn btn-export btn-excel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Exportar Excel
          </button>
        </div>
      </div>
    </div>

    <div class="card history-card" style="margin-top: 2rem;">
      <div class="card-header">
        <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
        <h2>Histórico de Simulações</h2>
      </div>
      <div class="table-responsive">
        <table class="history-table" id="ci-history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Capital Inicial</th>
              <th>Taxa</th>
              <th>Tempo</th>
              <th>Montante</th>
              <th>Lucro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="8" class="text-center text-muted">Nenhuma simulação no histórico.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  root.appendChild(container);

  // Grab element references
  const form = container.querySelector('#compound-form');
  const resultCard = container.querySelector('#ci-result-card');
  const resMontante = container.querySelector('#ci-res-montante');
  const resCapital = container.querySelector('#ci-res-capital');
  const resLucro = container.querySelector('#ci-res-lucro');
  const clearBtn = container.querySelector('#ci-clear');
  const historyTableBody = container.querySelector('#ci-history-table tbody');

  const pdfBtn = container.querySelector('#ci-pdf');
  const excelBtn = container.querySelector('#ci-excel');

  let currentResult = null;

  // Render history list
  function renderHistory() {
    const history = JSON.parse(localStorage.getItem('ci_history') || '[]');
    if (history.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Nenhuma simulação no histórico.</td></tr>`;
      return;
    }

    historyTableBody.innerHTML = history.map((item, index) => {
      const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return `
        <tr>
          <td>${formattedDate}</td>
          <td><strong>${item.name || 'Sem nome'}</strong></td>
          <td>R$ ${item.C.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>${item.taxaOrig.toFixed(2)}% (${item.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})</td>
          <td>${item.tempoOrig} ${item.tempoTipo === 'meses' ? 'meses' : 'anos'}</td>
          <td class="text-primary font-semibold">R$ ${item.M.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td class="text-accent font-semibold">R$ ${item.J.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>
            <div class="action-buttons">
              <button class="btn-action btn-load" data-index="${index}" title="Carregar Simulação">
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

    // Attach load/delete listeners
    container.querySelectorAll('.btn-load').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        const item = history[idx];
        container.querySelector('#ci-capital').value = item.C;
        container.querySelector('#ci-taxa').value = item.taxaOrig;
        container.querySelector('#ci-taxa-tipo').value = item.taxaTipo;
        container.querySelector('#ci-tempo').value = item.tempoOrig;
        container.querySelector('#ci-tempo-tipo').value = item.tempoTipo;
        container.querySelector('#ci-name').value = item.name || '';
        
        // Trigger calculate automatically
        form.dispatchEvent(new Event('submit'));
      });
    });

    container.querySelectorAll('.btn-delete').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        history.splice(idx, 1);
        localStorage.setItem('ci_history', JSON.stringify(history));
        renderHistory();
      });
    });
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const C = parseFloat(container.querySelector('#ci-capital').value) || 0;
    const taxaOrig = parseFloat(container.querySelector('#ci-taxa').value) || 0;
    const taxaTipo = container.querySelector('#ci-taxa-tipo').value;
    const tempoOrig = parseFloat(container.querySelector('#ci-tempo').value) || 0;
    const tempoTipo = container.querySelector('#ci-tempo-tipo').value;
    const name = container.querySelector('#ci-name').value.trim();

    // Convert time to months for compound formula M = C * (1 + i)^t
    // And convert rates to monthly
    let t = tempoOrig;
    if (tempoTipo === 'anos') {
      t = tempoOrig * 12;
    }

    let i = taxaOrig / 100;
    if (taxaTipo === 'anual') {
      // Convert annual rate to monthly rate: (1 + i_a) = (1 + i_m)^12  =>  i_m = (1 + i_a)^(1/12) - 1
      i = Math.pow(1 + i, 1/12) - 1;
    } else {
      // Monthly rate, just division
      i = taxaOrig / 100;
    }

    const M = C * Math.pow(1 + i, t);
    const J = M - C;

    currentResult = { C, M, J, taxaOrig, taxaTipo, tempoOrig, tempoTipo, name, date: new Date().toISOString() };

    // Format and show result card
    resMontante.textContent = `R$ ${M.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resCapital.textContent = `R$ ${C.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resLucro.textContent = `R$ ${J.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save simulation to history
    const history = JSON.parse(localStorage.getItem('ci_history') || '[]');
    history.push(currentResult);
    localStorage.setItem('ci_history', JSON.stringify(history));

    renderHistory();
  });

  // Handle clear action
  clearBtn.addEventListener('click', () => {
    form.reset();
    resultCard.style.display = 'none';
    currentResult = null;
  });

  // PDF Export using client-side libraries
  pdfBtn.addEventListener('click', () => {
    if (!currentResult) return;
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert('Carregando biblioteca PDF... Tente novamente em alguns segundos.');
      return;
    }

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(130, 10, 209); // Nubank-like Purple
    doc.text('FinanceCalc Pro', 14, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text('Relatório de Simulação: Juros Compostos', 14, 33);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${new Date(currentResult.date).toLocaleString('pt-BR')}`, 14, 45);
    doc.text(`Identificação: ${currentResult.name || 'Sem nome definido'}`, 14, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text('Entradas Utilizadas:', 14, 65);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`- Capital Inicial: R$ ${currentResult.C.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 75);
    doc.text(`- Taxa de Juros: ${currentResult.taxaOrig.toFixed(2)}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`, 14, 83);
    doc.text(`- Tempo de Aplicação: ${currentResult.tempoOrig} ${currentResult.tempoTipo === 'meses' ? 'meses' : 'anos'}`, 14, 91);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resultados Obtidos:', 14, 105);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(130, 10, 209);
    doc.text(`Montante Acumulado: R$ ${currentResult.M.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 115);
    doc.setTextColor(220, 53, 69);
    doc.text(`Lucro Obtido (Juros): R$ ${currentResult.J.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 123);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento gerado automaticamente pelo FinanceCalc Pro.', 14, 280);

    doc.save(`financecalc-juros-compostos-${Date.now()}.pdf`);
  });

  // Excel Export using SheetJS (XLSX)
  excelBtn.addEventListener('click', () => {
    if (!currentResult) return;
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert('Biblioteca de planilhas indisponível. Aguarde um instante.');
      return;
    }

    const rows = [
      ['FinanceCalc Pro - Relatório de Juros Compostos'],
      [''],
      ['Data de Geração', new Date(currentResult.date).toLocaleString('pt-BR')],
      ['Nome da Simulação', currentResult.name || 'Sem nome'],
      [''],
      ['Variável', 'Valor Informado', 'Fórmula Aplicada'],
      ['Capital Inicial (C)', currentResult.C, 'C'],
      ['Taxa de Juros (i)', `${currentResult.taxaOrig}% (${currentResult.taxaTipo === 'mensal' ? 'a.m.' : 'a.a.'})`, 'i'],
      ['Tempo de Aplicação (t)', `${currentResult.tempoOrig} ${currentResult.tempoTipo === 'meses' ? 'meses' : 'anos'}`, 't'],
      [''],
      ['Métricas de Saída', 'Resultado'],
      ['Montante Acumulado (M)', currentResult.M],
      ['Lucro Obtido (Juros)', currentResult.J]
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Juros Compostos");
    XLSX.writeFile(wb, `financecalc-juros-compostos-${Date.now()}.xlsx`);
  });

  // Init
  renderHistory();
}
