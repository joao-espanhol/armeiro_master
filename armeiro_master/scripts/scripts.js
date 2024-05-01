console.log("1");

function loadDoc() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      myFunction(this);
  }
  xhttp.open("GET", "data/materiais.xml");
  xhttp.send();
  console.log("2");
}

console.log("3");

function myFunction(xml) {
    const xmlDoc = xml.responseXML;
    const x = xmlDoc.getElementsByTagName("radio");
    let table = "";
    for (let i = 0; i < x.length; i++) {
        table += "<tr><td>" +
            x[i].getElementsByTagName("ref")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("grupo")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("modelo")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("ns")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("bateria")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("antena")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("situacao")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("alteracao")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
    document.getElementById("corpo-tabela").innerHTML = table;

    exibirPagina(paginaAtual);

    document.getElementById('botaoFiltrar').addEventListener('click', function() {
        console.log("Botão de filtrar clicado!");
    
        const filtros = {
            'filtroRef': document.getElementById('filtroRef').value.toUpperCase(),
            'filtroGrupo': document.getElementById('filtroGrupo').value.toUpperCase(),
            'filtroModelo': document.getElementById('filtroModelo').value.toUpperCase(),
            'filtroNS': document.getElementById('filtroNS').value.toUpperCase(),
            'filtroBateria': document.getElementById('filtroBateria').value.toUpperCase(),
            'filtroAntena': document.getElementById('filtroAntena').value.toUpperCase(),
            'filtroSituacao': document.getElementById('filtroSituacao').value.toUpperCase(),
            'filtroAlteracao': document.getElementById('filtroAlteracao').value.toUpperCase()
        };
    
        console.log(filtros);
    
        const todasLinhas = document.querySelectorAll("#corpo-tabela tr");
    
        todasLinhas.forEach(function(linha) {
            let mostrar = false;
            for (let key in filtros) {
                const indiceColuna = Array.from(linha.cells).findIndex(cell => cell.id === key);
                const textoCelula = linha.cells[indiceColuna].textContent.toUpperCase();
                if (textoCelula.includes(filtros[key]) && filtros[key] !== '') {
                    mostrar = true;
                    break;
                }
            }
            linha.style.display = mostrar ? "" : "none";
        });
    });   

}

// Variáveis para controlar a página atual e o número de linhas por página
let paginaAtual = 1;
const linhasPorPagina = 15;

// Função para exibir as linhas da tabela de acordo com a página atual
function exibirPagina(pagina) {
    const todasLinhas = document.querySelectorAll("#corpo-tabela tr");

    todasLinhas.forEach(function(linha, indice) {
        if (indice >= (pagina - 1) * linhasPorPagina && indice < pagina * linhasPorPagina) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

// Função para ir para a página anterior
document.getElementById('paginaAnterior').addEventListener('click', function() {
    console.log("Botão de página anterior clicado!");
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirPagina(paginaAtual);
    }
});

// Função para ir para a próxima página
document.getElementById('paginaSeguinte').addEventListener('click', function() {
    console.log("Botão de próxima página clicado!");
    const todasLinhas = document.querySelectorAll("#corpo-tabela tr");

    if (paginaAtual < Math.ceil(todasLinhas.length / linhasPorPagina)) {
        paginaAtual++;
        exibirPagina(paginaAtual);
    }
});

