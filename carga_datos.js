const mongoose = require("mongoose");
const Usuario = require(__dirname + "/models/usuario");

async function cargarDatos() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/hotel');

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

    // Utilizar Promise.all para esperar a que todas las operaciones de guardado se completen
    await Promise.all(usuarios.map(u => u.save()));

    console.log('Datos cargados con éxito.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    // Cerrar la conexión después de cargar datos
    await mongoose.disconnect();
  }
}

// Llamar a la función para cargar datos
cargarDatos();