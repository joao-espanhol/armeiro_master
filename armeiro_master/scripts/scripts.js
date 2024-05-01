console.log("1");

function loadDoc() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      myFunction(this);
  }
  xhttp.open("GET", "data/materiais.xml");
  xhttp.send();
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
            "</td><td><button class='delete-icon' onclick='excluirRadio(" + i + ", xmlDoc)'><img src='lixeira.png'></button></td></tr>";
    }
    document.getElementById("corpo-tabela").innerHTML = table;

    preencherFiltros(); // Preencher os filtros após carregar os dados

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
            'filtroAlteracao': document.getElementById('filtroAlteracao').value.toUpperCase(),
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

function excluirRadio(index, xmlDoc){
    console.log("Exlcuindo rádio" + index);
    x = xmlDoc.getElementsByTagName("radio")[index];

    x.parentNode.removeChild(x);
}
// Função para preencher os menus dropdown com opções únicas da tabela
function preencherFiltros() {
    const tabela = document.getElementById('tabela');
    const numRows = tabela.rows.length;
    const numCols = tabela.rows[0].cells.length;
    const dropdowns = document.querySelectorAll(".filtro-dropdown");

    const nomesFiltros = [
        "REF", "Grupo", "Modelo", "Número de Série",
        "Bateria", "Antena", "Situação", "Alteração"
    ];

    // Preencher os dropdowns com opções únicas para cada coluna da tabela
    dropdowns.forEach((dropdown, index) => {
        dropdown.innerHTML = ''; // Limpar opções existentes

        const opcoes = new Set(); // Usar um conjunto para garantir opções únicas

        // Preencher conjunto com opções únicas para a coluna correspondente
        for (let j = 1; j < numRows; j++) {
            const celula = tabela.rows[j].cells[index];
            const valorCelula = celula.textContent.trim();
            opcoes.add(valorCelula);
        }

        // Adicionar opções únicas ao dropdown
        const optionVazia = document.createElement('option');
        optionVazia.value = "";
        optionVazia.textContent = "Selecione...";
        dropdown.appendChild(optionVazia);

        opcoes.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao;
            option.textContent = opcao;
            dropdown.appendChild(option);
        });
    });

    // Adicionar evento de mudança para acionar a filtragem da tabela
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filtrarTabela();
        });
    });
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


//Cadastro dos rádios

document.querySelector('.bt_cadastrar').addEventListener('click', function() {
    cadastrarRadio();
});

function cadastrarRadio() {
    const ref = document.getElementById('REF').value;
    const grupo = document.getElementById('Grupo').value;
    const modelo = document.getElementById('Modelo').value;
    const bateria = document.getElementById('Bateria').value;
    const antena = document.getElementById('Antena').value;
    const situacao = document.getElementById('Situação').value;
    const alteracao = document.getElementById('Alteração').value;

    // Crie um novo objeto XML para o rádio
    const novoRadio = `
        <radio>
            <ref>${ref}</ref>
            <grupo>${grupo}</grupo>
            <modelo>${modelo}</modelo>
            <ns></ns>
            <bateria>${bateria}</bateria>
            <antena>${antena}</antena>
            <situacao>${situacao}</situacao>
            <alteracao>${alteracao}</alteracao>
        </radio>
    `;

    // Carregar o XML atual
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        const xmlDoc = xhttp.responseXML;
        const radios = xmlDoc.getElementsByTagName("radios")[0];
        radios.innerHTML += novoRadio;
        console.log("Novo rádio cadastrado com sucesso!");
    }
    xhttp.open("GET", "data/materiais.xml"); // Substitua pelo caminho do seu arquivo XML
    xhttp.send();
}
