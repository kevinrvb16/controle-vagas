const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ControleVagasSchema = new Schema({
    numeroVaga: {
        type: Number, 
        required: [true, 'Número da Vaga é Obrigatório']
    },
    horarioFicouOcupado: {
        type: String, 
        required: [true, 'Horário em que a vaga começou a ser usada é obrigatório']
    },
});
// Exportar o modelo
module.exports = mongoose.model('controleVagas', ControleVagasSchema);