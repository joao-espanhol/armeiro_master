// Funcao para carregar um XML generico
function loadXML(url, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        callback(this);
    }
    xhttp.open("GET", url);
    xhttp.send();
}

// Funcao para preencher Dropdowns
function preencherDropdown(xmlDoc, dropdown, tagName) {
    dropdown.innerHTML = "";
    
    const options = xmlDoc.getElementsByTagName(tagName);
    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].textContent;
        const option = new Option(optionText, optionText);
        dropdown.appendChild(option);
    }
}

// Carregar o XML de Modelos
function loadModelos() {
    loadXML("data/modelos.xml", processarModelos);
}

// Carregar o XML de Materiais
function loadMateriais() {
    loadXML("data/materiais.xml", myFunction);
}

function processarModelos(xml) {
    const xmlDoc = xml.responseXML;
    const selectModelo = document.getElementById("Modelo");
    preencherDropdown(xmlDoc, selectModelo, "nome");
    
    // Adicionar evento de mudança ao select de modelos
    selectModelo.addEventListener('change', function() {
        console.log("Modelo selecionado:", this.value);
        // Chamar a função atualizarREFeGrupo() passando o valor do modelo selecionado como argumento
        atualizarREFeGrupo(this.value);
    });
}

// Carregar os XMLs ao carregar a página
window.onload = function() {
    loadMateriais();
    loadModelos();
};

function myFunction(xml) {
    const xmlDoc = xml.responseXML;
    const radios = xmlDoc.getElementsByTagName("radio");

    let table = "";
    for (let i = 0; i < radios.length; i++) {
        table += "<tr>";
        table += "<td data-col='filtroRef'>" + radios[i].getElementsByTagName("ref")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroGrupo'>" + radios[i].getElementsByTagName("grupo")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroModelo'>" + radios[i].getElementsByTagName("modelo")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroNS'>" + radios[i].getElementsByTagName("ns")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroBateria'>" + radios[i].getElementsByTagName("bateria")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroAntena'>" + radios[i].getElementsByTagName("antena")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroSituacao'>" + radios[i].getElementsByTagName("situacao")[0].childNodes[0].nodeValue + "</td>";
        table += "<td data-col='filtroAlteracao'>" + radios[i].getElementsByTagName("alteracao")[0].childNodes[0].nodeValue + "</td>";
        table += "</tr>";
    }
    document.getElementById("corpo-tabela").innerHTML = table;

    // Armazenar os valores dos filtros
    const refSet = new Set();
    const grupoSet = new Set();
    const modeloSet = new Set();
    const nsSet = new Set();
    const bateriaSet = new Set();
    const antenaSet = new Set();
    const situacaoSet = new Set();
    const alteracaoSet = new Set();
    
    for (let i = 0; i < radios.length; i++) {
        refSet.add(radios[i].getElementsByTagName("ref")[0].textContent);
        grupoSet.add(radios[i].getElementsByTagName("grupo")[0].textContent);
        modeloSet.add(radios[i].getElementsByTagName("modelo")[0].textContent);
        nsSet.add(radios[i].getElementsByTagName("ns")[0].textContent);
        bateriaSet.add(radios[i].getElementsByTagName("bateria")[0].textContent);
        antenaSet.add(radios[i].getElementsByTagName("antena")[0].textContent);
        situacaoSet.add(radios[i].getElementsByTagName("situacao")[0].textContent);
        alteracaoSet.add(radios[i].getElementsByTagName("alteracao")[0].textContent);
    }
    
    preencherDropdownComSet(refSet, "filtroRef");
    preencherDropdownComSet(grupoSet, "filtroGrupo");
    preencherDropdownComSet(modeloSet, "filtroModelo");
    preencherDropdownComSet(nsSet, "filtroNS");
    preencherDropdownComSet(bateriaSet, "filtroBateria");
    preencherDropdownComSet(antenaSet, "filtroAntena");
    preencherDropdownComSet(situacaoSet, "filtroSituacao");
    preencherDropdownComSet(alteracaoSet, "filtroAlteracao");

    // Ouvintes dos filtros
    document.getElementById('filtroRef').addEventListener('change', filtrarTabela);
    document.getElementById('filtroGrupo').addEventListener('change', filtrarTabela);
    document.getElementById('filtroModelo').addEventListener('change', filtrarTabela);
    document.getElementById('filtroNS').addEventListener('change', filtrarTabela);
    document.getElementById('filtroBateria').addEventListener('change', filtrarTabela);
    document.getElementById('filtroAntena').addEventListener('change', filtrarTabela);
    document.getElementById('filtroSituacao').addEventListener('change', filtrarTabela);
    document.getElementById('filtroAlteracao').addEventListener('change', filtrarTabela);
}

function preencherDropdownComSet(valores, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    
    // Adicionar uma opção para cada valor no conjunto
    valores.forEach(function(valor) {
        const option = new Option(valor, valor);
        dropdown.appendChild(option);
    });

    
}

// Função para filtrar a tabela com base nos filtros selecionados
function filtrarTabela() {
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
        let mostrar = true;
    
        for (let key in filtros) {
            const valorFiltro = filtros[key];
    
            if (valorFiltro !== '') {
                const indiceColuna = Array.from(linha.children).findIndex(cell => cell.getAttribute('data-col') === key);
    
                if (indiceColuna !== -1) {
                    const textoCelula = linha.children[indiceColuna].textContent.toUpperCase();

                    if (!textoCelula.includes(valorFiltro)) {
                        mostrar = false;
                        break;
                    }
                }
            }
        }
        
        linha.style.display = mostrar ? "" : "none";
    });
    
}

// Função para exportar o XML filtrado
function exportarTabela() {
    const tabelaFiltrada = document.querySelectorAll("#corpo-tabela tr");

    // Inicializar uma string para armazenar os dados CSV
    let csv = "REF,Grupo,Modelo,Número de Série,Bateria,Antena,Situação,Alteração\n";

    // Adicionar no CSV as linhas da tabela filtrada
    tabelaFiltrada.forEach(function(linha) {
        if (linha.style.display !== "none") {
            const celulas = linha.querySelectorAll("td");
            celulas.forEach(function(celula, index) {
                csv += celula.textContent;
                if (index < celulas.length - 1) {
                    csv += ",";
                }
            });
            csv += "\n";
        }
    });

    // Fazer o Download do arquivo CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'tabela_filtrada.csv';
    link.click();

    alert("Tabela exportada com sucesso!");
}

// Listener do Clique do Botão Exportar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('bt_exportar').addEventListener('click', exportarTabela);
});

// FUNÇÕES DE CADASTRO DE NOVOS RÁDIOS

// Adicionar o evento de clique ao botão de cadastrar rádio

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


