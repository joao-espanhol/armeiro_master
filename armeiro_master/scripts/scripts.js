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

    preencherFiltros(); // Preencher os filtros após carregar os dados

    exibirPagina(paginaAtual);

    document.getElementById('botaoFiltrar').addEventListener('click', function() {
        console.log("Botão de filtrar clicado!");
    
        const filtros = {
            'filtroRef': document.getElementById('filtroRef').value.toUpperCase()
            // Adicione os outros filtros aqui
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

    // Atualizar os botões de navegação
    const botaoAnterior = document.getElementById('paginaAnterior');
    const botaoSeguinte = document.getElementById('paginaSeguinte');

    botaoAnterior.disabled = pagina === 1;
    botaoSeguinte.disabled = pagina === Math.ceil(todasLinhas.length / linhasPorPagina);
}

// Função para ir para a página anterior
document.getElementById('paginaAnterior').addEventListener('click', function() {
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirPagina(paginaAtual);
    }
});

// Função para ir para a próxima página
document.getElementById('paginaSeguinte').addEventListener('click', function() {
    const todasLinhas = document.querySelectorAll("#corpo-tabela tr");
    if (paginaAtual < Math.ceil(todasLinhas.length / linhasPorPagina)) {
        paginaAtual++;
        exibirPagina(paginaAtual);
    }
});


// Função para preencher os menus dropdown com opções únicas da tabela
function preencherFiltros() {
    const tabela = document.getElementById('tabela');
    const numRows = tabela.rows.length;
    const numCols = tabela.rows[0].cells.length;
    const dropdowns = document.querySelectorAll(".filtro-dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filtrarTabela();
        });
    });
    
    

    const nomesFiltros = [
        "REF", "Grupo", "Modelo", "Número de Série",
        "Bateria", "Antena", "Situação", "Alteração"
    ];

    for (let i = 0; i < numCols; i++) {
        const opcoes = {};

        // Preencher objeto de opções únicas para a coluna
        for (let j = 1; j < numRows; j++) {
            const celula = tabela.rows[j].cells[i];
            const valorCelula = celula.textContent.trim();
            opcoes[valorCelula] = true;
        }

        // Preencher o menu dropdown com opções únicas
        const opcoesUnicas = Object.keys(opcoes);
        const dropdown = dropdowns[i];
        dropdown.innerHTML = ''; // Limpar opções existentes

        const label = document.createElement('label');
        label.textContent = nomesFiltros[i] + ": ";
        dropdown.parentNode.insertBefore(label, dropdown);

        const optionVazia = document.createElement('option');
        optionVazia.value = "";
        optionVazia.textContent = "Selecione...";
        dropdown.appendChild(optionVazia);

        opcoesUnicas.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao;
            option.textContent = opcao;
            dropdown.appendChild(option);
        });
    }
}

// Função para filtrar a tabela com base nas opções selecionadas nos dropdowns
function filtrarTabela() {
    const todasLinhas = document.querySelectorAll("#corpo-tabela tr");
    const filtros = {};

    // Obter os valores selecionados em cada dropdown e armazená-los em um objeto de filtros
    const dropdowns = document.getElementsByClassName('filtro-dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        const filtro = dropdowns[i].id.replace('filtro', '').toLowerCase();
        filtros[filtro] = dropdowns[i].value.toUpperCase();
    }

    todasLinhas.forEach(function(linha) {
        let mostrar = true;

        // Verificar se a linha atende aos critérios de filtro
        for (let filtro in filtros) {
            if (filtros[filtro] !== "") {
                const indiceColuna = Array.from(linha.cells).findIndex(cell => cell.textContent.toUpperCase().includes(filtros[filtro]));
                if (indiceColuna === -1) {
                    mostrar = false;
                    break;
                }
            }
        }

        // Ocultar ou exibir a linha conforme necessário
        linha.style.display = mostrar ? "" : "none";
    });

    // Atualizar as opções dos outros dropdowns com base na seleção atual
    for (let i = 0; i < dropdowns.length; i++) {
        const filtro = dropdowns[i].id.replace('filtro', '').toLowerCase();
        atualizarOpcoesDropdown(filtro, filtros);
    }
}

// Função para atualizar as opções dos dropdowns com base na seleção atual
function atualizarOpcoesDropdown(filtroAtual, filtros) {
    const todasLinhas = document.querySelectorAll("#corpo-tabela tr");
    const opcoes = {};

    // Preencher objeto de opções únicas para o filtro atual
    todasLinhas.forEach(function(linha) {
        const indiceColuna = Array.from(linha.cells).findIndex(cell => cell.id === 'filtro' + filtroAtual);
        const textoCelula = linha.cells[indiceColuna].textContent.toUpperCase();
        opcoes[textoCelula] = true;
    });

    // Atualizar o dropdown correspondente com as opções únicas
    const dropdown = document.getElementById('filtro' + filtroAtual);
    dropdown.innerHTML = ''; // Limpar opções existentes

    // Adicionar uma opção vazia como a primeira opção
    const optionVazia = document.createElement('option');
    optionVazia.value = "";
    optionVazia.textContent = "Selecione...";
    dropdown.appendChild(optionVazia);

    Object.keys(opcoes).forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao;
        option.textContent = opcao;
        dropdown.appendChild(option);
    });

    // Restaurar a seleção anterior se ainda estiver disponível
    if (filtros[filtroAtual] !== "") {
        dropdown.value = filtros[filtroAtual];
    }
}

// Adicionar o evento de clique ao botão de filtrar
document.getElementById('botaoFiltrar').addEventListener('click', function() {
    console.log("Botão de filtrar clicado!");
    filtrarTabela();
});


window.onload = function() {
    loadDoc();
};
