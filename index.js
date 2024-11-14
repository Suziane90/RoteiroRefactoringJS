const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas) {
    let totalFatura = 0;
    //let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    /*const formato = new Intl.NumberFormat("pt-BR",
                          { style: "currency", currency: "BRL",
                            minimumFractionDigits: 2 }).format;*/
  
    /*for (let apre of fatura.apresentacoes) {
      const peca = pecas[apre.id];
      let total = 0;
  
      switch (peca.tipo) {
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
          throw new Error(`Peça desconhecia: ${peca.tipo}`);
      }
  
      // créditos para próximas contratações
      creditos += Math.max(apre.audiencia - 30, 0);
      if (peca.tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
  
      // mais uma linha da fatura
      faturaStr += `  ${peca.nome}: ${formato(total/100)} (${apre.audiencia} assentos)\n`;
      totalFatura += total;
    }
    faturaStr += `Valor total: ${formato(totalFatura/100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
  */

    // função query
    function getPeca(apresentacao){
      return pecas[apresentacao.id];
    }

    for (let apre of fatura.apresentacoes){
      //const peca = getPeca(apre);
    }
  

    // função extraída
    function calcularTotalApresentacao(apre) {
      let total = 0;
      switch (getPeca(apre).tipo) {
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
          throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
      }
      return total;
    }

    function calcularCredito(apre){
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
          if (getPeca(apre).tipo === "comedia") 
             creditos += Math.floor(apre.audiencia / 5);
          return creditos;
    }

  // função extraída
  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",
      { style: "currency", currency: "BRL",
        minimumFractionDigits: 2 }).format(valor/100);
  }    

    for (let apre of fatura.apresentacoes) {
      const peca = pecas[apre.id];
      let total = calcularTotalApresentacao(apre);


      /* Créditos para próximas contratações
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      */
      

  
      // Mais uma linha da fatura
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
      totalFatura += total;
  }

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${calcularCredito(fatura.apresentacoes[0])} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
