const express = require("express");

const upload = require(__dirname + "/../utils/uploads");
const Habitacion = require(__dirname + "/../models/habitacion");
const Limpieza = require(__dirname + "/../models/limpieza");
const auth = require(__dirname + "/../utils/auth.js");

let router = express.Router();

//GET Habitaciones
router.get("/", (req, res) => {
    Habitacion.find()
        .then((resultado) => {
            if (resultado.length > 0) {
                res.render("habitaciones_listado", { habitaciones: resultado });
            } else {
                res.render("error", { error: "No hay habitaciones" });
            }
        })
        .catch((error) => {
            res.render("error", { error: "No hay habitaciones" });
        });
});

// Formulario de nueva habitación
router.get("/editar/:id", auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params["id"])
        .then((resultado) => {
            if (resultado) {
                res.render("habitaciones_edicion", { habitacion: resultado });
            } else {
                res.render("error", { error: "Habitación no encontrada" });
            }
        })
        .catch((error) => {
            res.render("error", { error: "Habitación no encontrada" });
        });
});

// Formulario de nueva habitación
router.get("/nueva", auth.autenticacion, (req, res) => {
    res.render("habitaciones_nueva");
});

//GETID Habitación
router.get("/:id", (req, res) => {
    Habitacion.findById(req.params.id)
        .then((resultado) => {
            if (resultado) {
                res.render("habitaciones_ficha", { habitacion: resultado });
            } else {
                res.render("error", {
                    error: "No existe el número de habitación",
                });
            }
        })
        .catch((error) => {
            res.render("error", { error: "Error obteniendo habitación" });
        });
});

// //POST Habitación //POSIBLEMENTE AÑADIR A POSTERIORI
router.post(
    "/",
    auth.autenticacion,
    upload.uploadHabitaciones.single("imagen"),
    (req, res) => {
        let nuevaHabitacion = new Habitacion({
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: req.body.ultimaLimpieza ?? Date.now(),
            precio: req.body.precio,
        });
        if (req.file) nuevaHabitacion.imagen = req.file.filename;

        nuevaHabitacion
            .save()
            .then((resultado) => {
                if (resultado) {
                    res.redirect(req.baseUrl);
                } else {
                    res.render("error", {
                        error: "Error insertando la habitación",
                    });
                }
            })
            .catch((error) => {
                let errores = {
                    general: "Error insertando la habitación",
                };
                if (error.errors.numero) {
                    errores.numero = error.errors.numero.message;
                }
                if (error.errors.tipo) {
                    errores.tipo = error.errors.tipo.message;
                }
                if (error.errors.descripcion) {
                    errores.descripcion = error.errors.descripcion.message;
                }
                if (error.errors.ultimaLimpieza) {
                    errores.ultimaLimpieza =
                        error.errors.ultimaLimpieza.message;
                }
                if (error.errors.precio) {
                    errores.precio = error.errors.precio.message;
                }

                res.render("habitaciones_nueva", {
                    errores: errores,
                    datos: req.body,
                });
            });
    }
);

// //DELETE Habitación
router.delete("/:id", auth.autenticacion, (req, res) => {
    Habitacion.findByIdAndDelete(req.params.id)
        .then((resultado) => {
            res.redirect("/habitaciones");
        })
        .catch((error) => {
            res.render("error", {
                error: "Error Eliminando habitación",
            });
        });
});

//POST Incidencia
router.post(
    "/:id/incidencias",
    auth.autenticacion,
    upload.uploadIncidencias.single("imagen"),
    (req, res) => {
        Habitacion.findById(req.params.id)
            .then((resultado) => {
                if (resultado) {
                    let nuevaIncidencia = {
                        descripcion: req.body.descripcion,
                        fechaInicio: new Date(),
                    };
                    if (req.file) {
                        nuevaIncidencia.imagen = req.file.filename;
                    }
                    resultado.incidencias.push(nuevaIncidencia);
                    resultado.save().then((resultadoIncidencia) => {
                        res.redirect(`/habitaciones/${req.params.id}`);
                    });
                } else {
                    res.render("error", {
                        error: "Error añadiendo la incidencia",
                    });
                }
            })
            .catch((error) => {
                let errores = {
                    general: "Error insertando incidencia",
                };
                if (error.errors.descripcion) {
                    errores.descripcion = error.errors.descripcion.message;
                }

                res.render("habitacion_ficha", {
                    errores: errores,
                    datos: req.body,
                });
            });
    }
);

//PUT* modificado para Habitación
//Editar habitación
router.post("/:id", auth.autenticacion, upload.uploadHabitaciones.single('imagen'), (req, res) => {
    Habitacion.findById(req.params.id)
        .then((resultado) => {
            if (resultado) {
                resultado.numero = req.body.numero;
                resultado.tipo = req.body.tipo;
                resultado.descripcion = req.body.descripcion;
                (resultado.ultimaLimpieza =
                    req.body.ultimaLimpieza ?? resultado.ultimaLimpieza),
                    (resultado.precio = req.body.precio);
                if (req.file) {
                    resultado.imagen = req.file.filename;
                }
                resultado
                    .save()
                    .then((resultado2) => {
                        if (resultado2) {
                            res.redirect(req.baseUrl);
                        } else {
                            res.render("error", {
                                error: "Error actualizando la habitación",
                            });
                        }
                    })
                    .catch((error) => {
                        let errores = {
                            general: "Error insertando la habitación",
                        };
                        if (error.errors.numero) {
                            errores.numero = error.errors.numero.message;
                        }
                        if (error.errors.tipo) {
                            errores.tipo = error.errors.tipo.message;
                        }
                        if (error.errors.descripcion) {
                            errores.descripcion =
                                error.errors.descripcion.message;
                        }
                        if (error.errors.ultimaLimpieza) {
                            errores.ultimaLimpieza =
                                error.errors.ultimaLimpieza.message;
                        }
                        if (error.errors.precio) {
                            errores.precio = error.errors.precio.message;
                        }

                        res.render("habitaciones_nueva", {
                            errores: errores,
                            datos: req.body,
                        });
                    });
            } else res.render("error", { error: "Habitación no encontrada" });
        })
        .catch((error) => {
            res.render("error", {
                error: "Error editando habitación",
            });
        });
});

//PUT Incidencias
router.put("/:idH/incidencias/:idI", auth.autenticacion, (req, res) => {
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
                    error: "Incidencia no encontrada",
                });
            }
        })
        .catch((error) => {
            res.render("error", {
                error: "Error actualizando incidencia",
            });
        });
});

module.exports = router;
