const express = require("express");

const upload = require(__dirname + "/../utils/uploads");
const Habitacion = require(__dirname + "/../models/habitacion");
const Limpieza = require(__dirname + "/../models/limpieza");
// const auth = require(__dirname + '/../utils/auth.js');

const router = express.Router();

//GET Habitaciones
router.get("/", (req, res) => {
    Habitacion.find()
        .then((resultado) => {
            if(resultado.length > 0) {
                res.render('habitaciones_listado', { habitaciones: resultado });
            }else {
                res.render("error", { error: 'No hay habitaciones' });
            }
        })
        .catch((error) => {
            res.render("error", { error: 'No hay habitaciones' });
        });
});




// Formulario de nueva habitación
router.get('/editar', (req, res) => {
    res.render('habitaciones_edicion');
});

// Formulario de nueva habitación
router.get('/nueva', (req, res) => {
    res.render('habitaciones_nueva');
});


//GETID Habitación
router.get("/:id", (req, res) => {
    Habitacion.findById(req.params.id)
        .then((resultado) => {
            if (resultado) {
                res.render('habitaciones_ficha' , { habitacion: resultado });
            } else {
                res.render("error", {
                    error: 'No existe el número de habitación',
                });
            }
        })
        .catch((error) => {
            res.render("error", { error: "Error obteniendo habitación" });
        });
});

// //POST Habitación //POSIBLEMENTE AÑADIR A POSTERIORI  auth.protegerRuta, 
router.post('/', upload.uploadHabitaciones.single('imagen'), (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: req.body.ultimaLimpieza ?? Date.now(),
        precio: req.body.precio,
    });
    if(req.file)
        nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion
        .save().then((resultado) => {
            if(resultado){
                res.redirect(req.baseUrl);
            }else {
                res.render('error', { 
                    error: 'Error insertando la habitación' });
            }
            
        })
        .catch((error) => {
            let errores = {
                general: 'Error insertando la habitación',
            };
            if(error.errors.numero)
            {
                errores.numero = error.errors.numero.message;
            }
            if(error.errors.tipo)
            {
                errores.tipo = error.errors.tipo.message;
            }
            if(error.errors.descripcion)
            {
                errores.descripcion = error.errors.descripcion.message;
            }
            if(error.errors.ultimaLimpieza)
            {
                errores.ultimaLimpieza = error.errors.ultimaLimpieza.message;
            }
            if(error.errors.precio)
            {
                errores.precio = error.errors.precio.message;
            }

            res.render('habitaciones_nueva', {errores:errores, datos: req.body});
        });
});

// //PUT TODAS las últimas limpiezas
// router.put("/ultimaLimpieza", async (req, res) => {
//     let habitacionesArray = [];
//     let habitacionesActualizadas = [];

//     try {
//         habitacionesArray = await Habitacion.find();

//         for( const habitacion of habitacionesArray) {
//             const fechas = await Limpieza.find({
//                 idHabitacion: habitacion._id,
//             },
//             {
//                 fechaHora: 1
//             }).sort({fechaHora: - 1});
//             if((fechas.length > 0) && (fechas[0].fechaHora > habitacion.ultimaLimpieza)){
//                const  habitacionActualizada = await Habitacion.findOneAndUpdate(
//                     {_id: habitacion._id},
//                     {ultimaLimpieza: fechas[0].fechaHora},
//                     { new: true}
//                 );

//                 habitacionesActualizadas.push(habitacionActualizada);
//             }
//         }

//         if(habitacionesActualizadas.length == 0){
//             throw new Error;
//         }
//         res.status(200).send({
//             resultado: habitacionesActualizadas
//         });
//     } catch (error) {
//         res.status(400).send({
//             error: "Error actualizando limpieza",
//         });
//     }
// });

// //PUT Habitación
// router.put("/:id", auth.protegerRuta, (req, res) => {
//     Habitacion.findByIdAndUpdate(
//         req.params.id,
//         {
//             $set: {
//                 numero: req.body.numero,
//                 tipo: req.body.tipo,
//                 descripcion: req.body.descripcion,
//                 ultimaLimpieza: req.body.ultimaLimpieza,
//                 precio: req.body.precio,
//             },
//         },
//         { new: true }
//     )
//         .then((resultado) => {
//             res.status(200).send({ resultado });
//         })
//         .catch((error) => {
//             res.status(400).send({
//                 error: "Error actualizando los datos de la habitación",
//             });
//         });
// });

// //DELETE Habitación **** auth.protegerRuta, 
router.delete("/:id", (req, res) => {
    Habitacion.findByIdAndDelete(req.params.id)
        .then((resultado) => {
            res.redirect('/habitaciones');
        })
        .catch((error) => {
            res.render("error", {
                error: 'Error Eliminando habitación',
            });
        });
});



//POST Incidencia  ****  auth.protegerRuta, 
router.post("/:id/incidencias",upload.uploadIncidencias.single('imagen'), (req, res) => {
    Habitacion.findById(req.params.id)
        .then((resultado) => {
            if (resultado) {
                let nuevaIncidencia = {
                    descripcion: req.body.descripcion,
                    fechaInicio: new Date(),
                };
                if(req.file){
                    nuevaIncidencia.imagen = req.file.filename;
                }
                resultado.incidencias.push(nuevaIncidencia);
                resultado.save().then((resultadoIncidencia) => {
                    res.redirect(`/habitaciones/${req.params.id}`);
                });
            } else {
                res.render("error", {
                    error: 'Error añadiendo la incidencia',
                });
            }
        })
        .catch((error) => {
            let errores = {
                general: 'Error insertando incidencia',
            };
            if(error.errors.descripcion)
            {
                errores.descripcion = error.errors.descripcion.message;
            }

            res.render('habitacion_ficha', {errores:errores, datos: req.body});
        });
});

//PUT Incidencias *****  auth.protegerRuta, 
router.put("/:idH/incidencias/:idI", (req, res) => {
    Habitacion.findOneAndUpdate(
        {
            _id: req.params.idH,
            incidencias: {
                $elemMatch: { _id: req.params.idI },
            },
        },
        {
            $set: {
                "incidencias.$.fechaFin": new Date(),
            },
        },
        { new: true }
    )
        .then((resultado) => {
            if (resultado) {
                res.redirect(`/habitaciones/${req.params.idH}`);
            } else {
                res.render("error", {
                    error: 'Incidencia no encontrada',
                });
            }
        })
        .catch((error) => {
            res.render("error", {
                error: 'Error actualizando incidencia',
            });
        });
});




// //PUT última limpieza
// router.put("/:id/ultimaLimpieza", auth.protegerRuta,(req, res) => {
//     Limpieza.find(
//         {
//             idHabitacion: req.params.id,
//         },
//         {
//             fechaHora: 1,
//             observaciones: 1,
//         }
//     )
//         .sort({ fechaHora: 1 })
//         .then((resultadoLimpieza) => {
//             const fechaActualizada =
//                 resultadoLimpieza[resultadoLimpieza.length - 1].fechaHora;
//             Habitacion.findByIdAndUpdate(
//                 req.params.id,
//                 {
//                     $set: {
//                         ultimaLimpieza: fechaActualizada,
//                     },
//                 },
//                 { new: true }
//             ).then((resultado) => {
//                 res.status(200).send({ resultado });
//             });
//         })
//         .catch((error) => {
//             res.status(400).send({
//                 error: "Error actualizando limpieza",
//             });
//         });
// });

module.exports = router;
