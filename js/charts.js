// js/charts.js – Dashboard and Chart.js visualizations
// Displays: Patrimônio Atual, Total Investido, Lucro Obtido, Rentabilidade
// Renders: Line Chart (Evolução Patrimonial) & Pie Chart (Investimento x Lucro)

export function renderDashboard(root) {
  const container = document.createElement('div');
  container.className = 'fade-in';

  // Gather stats from localStorage history
  const invHistory = JSON.parse(localStorage.getItem('inv_history') || '[]');
  
  // Default demo data if no simulations have been done yet
  const defaultData = {
    P: 10000,
    A: 500,
    taxaAnual: 12,
    meses: 24,
    saldo: 24654.49,
    totalInvestido: 22000,
    lucro: 2654.49,
    name: "Simulação de Exemplo",
    date: new Date().toISOString()
  };

  const hasRealData = invHistory.length > 0;
  // Use last calculation as primary focus, or demo data
  const data = hasRealData ? invHistory[invHistory.length - 1] : defaultData;

  const patrimonio = data.saldo;
  const investido = data.totalInvestido;
  const lucro = data.lucro;
  const rentabilidade = investido > 0 ? (lucro / investido) * 100 : 0;

  container.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2>Dashboard Financeiro</h2>
        <p class="section-desc">${hasRealData ? `Exibindo a simulação: <strong>${data.name || 'Sem Nome'}</strong>` : '<span class="demo-badge">Modo de Demonstração</span> Faça uma simulação em "Investimentos" para atualizar seu Dashboard.'}</p>
      </div>
      ${hasRealData && invHistory.length > 1 ? `
        <div class="sim-selector-group">
          <label for="dashboard-sim-select">Selecionar Simulação:</label>
          <select id="dashboard-sim-select">
            ${invHistory.map((item, idx) => `
              <option value="${idx}" ${idx === invHistory.length - 1 ? 'selected' : ''}>${item.name || `Simulação #${idx + 1}`} (${new Date(item.date).toLocaleDateString()})</option>
            `).join('')}
          </select>
        </div>
      ` : ''}
    </div>

    <!-- Cards Grid -->
    <div class="metrics-grid dashboard-metrics">
      <div class="metric-card card-gradient card-violet">
        <div class="metric-card-header">
          <span>Patrimônio Atual</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div class="metric-card-val" id="db-val-patrimonio">R$ ${patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <div class="metric-card card-gradient card-orange">
        <div class="metric-card-header">
          <span>Total Investido</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div class="metric-card-val" id="db-val-investido">R$ ${investido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <div class="metric-card card-gradient card-emerald">
        <div class="metric-card-header">
          <span>Lucro Obtido</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </div>
        <div class="metric-card-val" id="db-val-lucro">R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <div class="metric-card card-gradient card-gold">
        <div class="metric-card-header">
          <span>Rentabilidade</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="metric-card-val" id="db-val-rentabilidade">${rentabilidade.toFixed(2)}%</div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="card chart-card">
        <div class="card-header">
          <h3>Evolução Patrimonial</h3>
        </div>
        <div class="chart-wrapper">
          <canvas id="lineChart"></canvas>
        </div>
      </div>

      <div class="card chart-card">
        <div class="card-header">
          <h3>Investimento x Lucro</h3>
        </div>
        <div class="chart-wrapper">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  `;

  root.appendChild(container);

  let lineChart = null;
  let pieChart = null;

  function buildCharts(simData) {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColour = isDark ? '#e0e0e0' : '#212529';
    const borderColour = isDark ? '#3a3a3a' : '#eaeaea';

    // 1. Line Chart Data
    const months = [];
    const balances = [];
    const investedTrend = [];

    const P = simData.P || simData.valor || 0;
    const A = simData.A || 0;
    const rate = simData.taxaOrig || 0;
    const period = simData.periodoOrig || simData.parcelasOrig || simData.tempoOrig || 12;
    const periodType = simData.periodoTipo || simData.tempoTipo || 'meses';
    const rateType = simData.taxaTipo || 'mensal';

    let n = period;
    if (periodType === 'anos') n = period * 12;

    let i = rate / 100;
    if (rateType === 'anual') i = Math.pow(1 + i, 1/12) - 1;

    let runningBalance = P;
    let runningInvested = P;

    for (let m = 0; m <= n; m++) {
      months.push(`Mês ${m}`);
      balances.push(runningBalance.toFixed(2));
      investedTrend.push(runningInvested.toFixed(2));

      if (m < n) {
        runningBalance = runningBalance * (1 + i) + A;
        runningInvested += A;
      }
    }

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) lineChart.destroy();
    
    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Saldo Acumulado',
            data: balances,
            borderColor: 'hsl(260, 80%, 60%)', // Purple
            backgroundColor: 'rgba(130, 10, 209, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: n > 36 ? 0 : 3
          },
          {
            label: 'Total Investido',
            data: investedTrend,
            borderColor: 'hsl(25, 100%, 55%)', // Inter Orange
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textColour }
          }
        },
        scales: {
          x: {
            grid: { color: borderColour },
            ticks: { color: textColour }
          },
          y: {
            grid: { color: borderColour },
            ticks: { color: textColour }
          }
        }
      }
    });

    // 2. Pie Chart Data
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();

    const finalInvested = simData.totalInvestido || simData.valor || 0;
    const finalLucro = simData.lucro || simData.jurosPago || 0;

    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Total Investido', 'Rendimento Acumulado'],
        datasets: [{
          data: [finalInvested, finalLucro],
          backgroundColor: [
            'hsl(25, 100%, 55%)', // Orange
            'hsl(150, 80%, 40%)'  // Emerald Green
          ],
          borderWidth: isDark ? 2 : 1,
          borderColor: isDark ? '#1e1e1e' : '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColour }
          }
        },
        cutout: '60%'
      }
    });
  }

  // Build with initial choice
  buildCharts(data);

  // Selector listener if multiple saved simulations
  const selector = container.querySelector('#dashboard-sim-select');
  if (selector) {
    selector.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value);
      const selectedSim = invHistory[idx];
      
      const pat = selectedSim.saldo;
      const inv = selectedSim.totalInvestido;
      const luc = selectedSim.lucro;
      const rent = inv > 0 ? (luc / inv) * 100 : 0;

      container.querySelector('#db-val-patrimonio').textContent = `R$ ${pat.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      container.querySelector('#db-val-investido').textContent = `R$ ${inv.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      container.querySelector('#db-val-lucro').textContent = `R$ ${luc.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      container.querySelector('#db-val-rentabilidade').textContent = `${rent.toFixed(2)}%`;

      buildCharts(selectedSim);
    });
  }

  // Redraw charts on theme change automatically
  const observer = new MutationObserver(() => {
    const activeIdx = selector ? parseInt(selector.value) : -1;
    const activeData = activeIdx >= 0 ? invHistory[activeIdx] : data;
    buildCharts(activeData);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
