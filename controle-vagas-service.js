const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Servidor
let porta = 8082;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

const controleVagas = require('./model/controle-vagas');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";
const dataBaseDB = "MinhaLOjaDB";
const collectionDB = "controleVagas";
let db = null;

MongoClient.connect(uri, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log('Erro ao conectar no banco de dados ' + dataBaseDB + '!');
        throw error;
    }
    db = client.db(dataBaseDB).collection(collectionDB);
    console.log('Conectado a base de dados: ' + dataBaseDB + '!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Retorna todos os controles de vaga
app.get('/ControleVagas', (req, res, next) => {
    db.find({}).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
        res.send(result);
    });
});

// Retorna uma vaga controlada associada a um numero
app.get('/ControleVagas/:numeroVaga', (req, res) => {
    db.findOne({ "numeroVaga": req.params.numeroVaga }, (err, result) => {
        if (err) return console.log("Vaga não encontrada")
    });
    res.send(result);
});

// Cria uma nova vaga controlada
app.post('/ControleVagas', (req, res, next) => {
    const vagaControlada = new controleVagas({
        "numeroVaga": req.body.numeroVaga,
        "horarioFicouOcupado": req.body.horarioFicouOcupado,
    });
    db.insertOne(vagaControlada, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Vaga controlada cadastrada com sucesso no BD!');
        console.log(result)
        res.send('Vaga controlada cadastrada com sucesso no BD!');
    });
});

// Atualiza o horário da vaga ocupada
app.put('/ControleVagas/:numeroVaga', (req, res, next) => {
    db.updateOne({"numeroVaga": req.params.numeroVaga }, {
        $set: {
            "horarioFicouOcupado": req.body.horarioFicouOcupado,
        }
    }, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Vaga controlada atualizada com sucesso no BD!');
        res.send('Vaga controlada atualizada com sucesso no BD!');
    });
});

// Remove a vaga controlada
app.delete('/ControleVagas/:numeroVaga', (req, res, next) => {
    db.deleteOne({numeroVaga: req.params.numeroVaga },(err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Vaga controlada removida do BD!');
        res.send('Vaga controlada removida do BD!');
    });
});