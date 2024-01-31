const mongoose = require("mongoose");
const Usuario = require(__dirname + "/models/usuario");

async function cargarDatos() {
  try {
    // Conectar a la base de datos
    await mongoose.connect('mongodb://127.0.0.1:27017/hotel', { useNewUrlParser: true, useUnifiedTopology: true });

    // Operaciones de carga de datos
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

    await Usuario.insertMany(usuarios);
    
    console.log('Datos cargados con éxito.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    // Cerrar la conexión después de cargar datos
    mongoose.disconnect();
  }
}

// Llamar a la función para cargar datos
cargarDatos();