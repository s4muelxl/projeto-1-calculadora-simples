# FinanceCalc Pro

## 📊 Descrição
FinanceCalc Pro é uma calculadora financeira profissional desenvolvida com **HTML5**, **CSS3**, **JavaScript Vanilla** e **Chart.js**. Ela oferece:

- **Juros Simples** e **Juros Compostos**
- **Simulador de Investimentos** (aporte mensal, taxa anual, período)
- **Simulador de Empréstimos** (valor, taxa mensal, parcelas)
- **Dashboard Financeiro** com gráficos interativos de evolução patrimonial (linha) e distribuição investimento × lucro (pizza)
- **Histórico de Simulações** persistido em **LocalStorage**
- **Exportação** para PDF e Excel (via biblioteca cliente)
- **Modo Escuro** e **Design responsivo** inspirado em Nubank, Inter e XP Investimentos
- **PWA instalável** (manifest e service‑worker) para uso offline em dispositivos móveis

## 🚀 Tecnologias
- HTML5 & CSS3 (variáveis, dark‑mode, flexbox, responsividade) 
- JavaScript ES6 módulos
- [Chart.js](https://www.chartjs.org/) – visualizações
- Google Font **Inter**
- LocalStorage – persistência de dados
- [jsPDF](https://github.com/parallax/jsPDF) – exportação PDF (client‑side)
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) – exportação Excel
- PWA – `manifest.json` + service worker

## 📂 Estrutura de pastas
```
finance-calc-pro/
├─ index.html
├─ css/
│   └─ style.css          # design premium + dark mode
├─ js/
│   ├─ app.js             # roteamento, tema, carregamento de seções
│   ├─ jurosSimples.js    # cálculo e UI de juros simples
│   ├─ jurosCompostos.js  # cálculo e UI de juros compostos
│   ├─ investimentos.js   # simulador de investimentos
│   ├─ emprestimos.js     # simulador de empréstimos
│   └─ charts.js          # dashboard com Chart.js
├─ assets/                 # ícones e imagens (placeholder generated)
├─ manifest.json           # PWA manifest
├─ service-worker.js       # cache estático
└─ README.md               # este documento
```

## 🛠️ Instalação & Execução
1. Clone o repositório ou copie a pasta para o seu computador.
2. Abra `index.html` em qualquer navegador moderno.
3. **Nenhuma dependência externa** precisa ser instalada – tudo é carregado via CDN.
4. (Opcional) Para usar como PWA, acesse o site via `https://` ou `http://localhost` e clique em **Instalar** no navegador.

## 🎨 Design & Experiência
- **Paleta de cores**: tons de azul vibrante (`hsl(210,78%,56%)`) com acento magenta (`hsl(340,65%,47%)`).
- **Tipografia**: *Inter* – leitura limpa e moderna.
- **Micro‑animações**: hover nas navegações, transição de botões e sombras sutis.
- **Responsividade**: layout flexível, colapsa o menu em telas < 768 px.
- **Modo escuro**: persistido em `localStorage` com toggle no header.

## 📁 Exportação de Dados
### PDF
```js
import jsPDF from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js";
function exportPDF(content) {
  const doc = new jsPDF();
  doc.text(content, 10, 10);
  doc.save('simulacao.pdf');
}
```
### Excel
```js
import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
function exportExcel(data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Simulacoes");
  XLSX.writeFile(wb, "simulacao.xlsx");
}
```
> *Essas funções são chamadas nos botões “Exportar PDF” e “Exportar Excel” que podem ser inseridos nas telas de simuladores.*

## 📜 Licença
Este projeto está licenciado sob a **MIT License** – sinta‑se livre para usar, modificar e distribuir.
