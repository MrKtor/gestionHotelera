const mongoose = require('mongoose');

let limpiezaScheme = new mongoose.Schema({
    idHabitacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habitaciones'
    },
    fechaHora: {
        type: Date,
        required: [true, 'Es necesario la fecha de la limpieza'],
        default: Date.now
    },
    observaciones: {
        type: String
    }
});

let Limpieza = mongoose.model('limpiezas', limpiezaScheme);

module.exports = Limpieza;