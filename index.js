const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}


function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  
  return faturaStr;
}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}
// lembrar: se usa ${fatura.cliente} para chamar o valor
/*function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = `
    <html>
    <body>
      <p>Fatura ${fatura.cliente}</p>
      <ul>
  `;

  // ps: esta dando cauculo errado, chamar função calcularTotalApresentacao!
  for (let apre of fatura.apresentacoes) {
    faturaHTML += `<li>${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)</li>`;
  }

  faturaHTML += `
      </ul>
      <p>Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}</p>
      <p>Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)}</p>
    </body>
    </html>
  `;

  return faturaHTML;
}*/


class ServicoCalculoFatura {

  constructor(repo) {
    this.repo = repo;
 }
  
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }
  
  calcularTotalCreditos(apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularCredito(apre);
    }
    return total;
  }

  calcularTotalFatura(apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(apre);
    }
    return total;
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${getPeca(this.repo.getPeca(apre).tipo).tipo}`);
    }
    return total;
  }

}


// Leitura dos arquivos de faturas e peças
const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
//console.log(gerarFaturaHTML);
