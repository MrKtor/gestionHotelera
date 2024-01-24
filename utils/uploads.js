const multer = require('multer');

let storageHabitaciones = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/habitaciones')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' +file.originalname)
    }
});

let uploadHabitaciones = multer({storage: storageHabitaciones});


let storageIncidencias = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/incidencias')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' +file.originalname)
  }
});

let uploadIncidencias = multer({storage: storageIncidencias});

module.exports = {
  uploadHabitaciones: uploadHabitaciones,
  uploadIncidencias: uploadIncidencias
};
