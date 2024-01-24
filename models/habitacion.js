const mongoose = require('mongoose');

let incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'Es necesaria la descripción de la incidencia'],
    },
    imagen: {
        type: String,
        required: false
    },
    fechaInicio: {
        type: Date,
        required: [true, 'Es necesaria la fecha de inicio de la incidencia'],
        default: Date.now
    },
    fechaFin: {
        type:Date
    }
});

let habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true, 'Es necesario el número de la habitación'],
        min: [1, 'El número de la habitación debe ser mayor que 0'],
        max: [100, 'El número de la habitación debe ser menor que 100']
    },
    tipo: {
        type: String,
        required: [true, 'Es necesario el tipo de la habitación'],
        enum: ['individual', 'doble', 'familiar', 'suite']
    },
    descripcion: {
        type: String,
        required: [true, 'Es necesario la descripción de la habitación'],
    },
    ultimaLimpieza: {
        type: Date,
        required: [true, 'Es necesario la fecha de la ultima limpieza'],
        default: Date.now
    },
    precio: {
        type: Number,
        required: [true, 'Es necesario el precio de la habitación'],
        min: [0, 'El precio de la habitación debe ser mayor o igual que 0'],
        max: [250, 'El precio de la habitación debe ser menor o igual que 250'] 
    },
    imagen: {
        type: String
    },
    incidencias: [incidenciaSchema]
});

let Habitacion = mongoose.model('habitaciones', habitacionSchema);
module.exports = Habitacion;