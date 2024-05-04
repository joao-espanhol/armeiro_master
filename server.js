const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors()); // Configuração do CORS

// Middleware para analisar dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Rota para cadastrar um novo modelo
app.post('/cadastrar-modelo', (req, res) => {
    const novoModelo = req.body.novoModelo;
    const novoGrupo = req.body.novoGrupo;

    // Ler o arquivo XML
    fs.readFile(path.join(__dirname, 'armeiro_master', 'data', 'modelos.xml'), (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo XML:', err);
            return res.status(500).send('Erro ao processar a solicitação.');
        }

        // Converter XML para JSON
        xml2js.parseString(data, (err, result) => {
            if (err) {
                console.error('Erro ao converter XML para JSON:', err);
                return res.status(500).send('Erro ao processar a solicitação.');
            }

            // Adicionar novo modelo ao JSON
            const novoModeloXml = {
                nome: novoModelo,
                pre: 'RAD' + (result.modelos.modelo.length + 1),
                grupo: novoGrupo
            };
            result.modelos.modelo.push(novoModeloXml);

            // Converter JSON de volta para XML
            const builder = new xml2js.Builder();
            const novoXml = builder.buildObject(result);

            // Escrever o novo XML no arquivo
            fs.writeFile(path.join(__dirname, 'armeiro_master', 'data', 'modelos.xml'), novoXml, (err) => {
                if (err) {
                    console.error('Erro ao escrever arquivo XML:', err);
                    return res.status(500).send('Erro ao processar a solicitação.');
                }

                console.log('Modelo cadastrado com sucesso:', novoModelo);
                res.send('Modelo cadastrado com sucesso!');
            });
        });
    });
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
