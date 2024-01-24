const mongoose = require("mongoose");
const Usuario = require(__dirname + "/models/usuario");

mongoose.connect('mongodb://127.0.0.1:27017/hotel');

//USUARIOS CARGADOS PARA EL EJERCICIO
let usuarios = [
    new Usuario({
        login: "usuario5",
        password: "1234567"
    }),
    new Usuario({
        login: "usuario2",
        password: "123456789"
    }),
    new Usuario({
        login: "usuario3",
        password: "123456789"
    }),
    new Usuario({
        login: "usuario4",
        password: "123456789"
    })
];

usuarios.forEach(u => u.save());