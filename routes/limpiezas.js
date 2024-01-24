const express = require("express");

const Limpieza = require(__dirname + "/../models/limpieza.js");
const Habitacion = require(__dirname + "/../models/habitacion.js");
// const auth = require(__dirname + '/../utils/auth.js');

const router = express.Router();

//getId Limpiezas
router.get("/:id", (req, res) => {
    Limpieza.find(
        {
            idHabitacion: req.params.id,
        }
    ).sort({ fechaHora: -1 })
        .then((resultado) => {
            Habitacion.findById(req.params.id)
                .then((habitacion) => {
                    res.render("limpiezas_listado", {
                        limpiezas: resultado,
                        habitacion: habitacion,
                    });
                })
                .catch((error) => {
                    res.render("error", {
                        error: "Error obteniendo habitación1",
                    });
                });
        })
        .catch((error) => {
            res.render("error", { error: "Error obteniendo limpiezas2" });
        });
});

// Formulario de nueva limpieza
router.get("/nueva/:id", (req, res) => {
    const fecha = new Date();
    const anyo = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate();

    const idHabitacion = req.params.id;
    res.render("limpiezas_nueva", { anyo, mes, dia, idHabitacion });
});

//POST limpieza idHabitación ,  auth.protegerRuta, 
router.post("/:id", (req, res) => {
    let nuevaLimpieza = new Limpieza({
        idHabitacion: req.params.id,
        fechaHora: req.body.fecha,
    });
    if (req.body.observaciones) {
        nuevaLimpieza.observaciones = req.body.observaciones;
    }
    nuevaLimpieza
        .save()
        .then((resultado) => {
            if (resultado) {
                Habitacion.findById(req.params.id)
                    .then((habitacion) => {
                        Limpieza.find({ idHabitacion: habitacion._id })
                            .sort({ fechaHora: -1 })
                            .then((resultadoLimpieza) => {
                                habitacion.ultimaLimpieza =
                                    resultadoLimpieza[0].fechaHora;
                                habitacion.save().then(() => {
                                    res.render("limpiezas_listado", {
                                        limpiezas: resultadoLimpieza,
                                        habitacion: habitacion,
                                    });
                                });
                            })
                            .catch((error) => {
                                res.render("error", {
                                    error: "Error actualizando limpieza",
                                });
                            });
                    })
                    .catch((error) => {
                        res.render("error", {
                            error: "Error actualizando limpieza",
                        });
                    });
            } else {
                res.render("error", {
                    error: "Error actualizando limpieza",
                });
            }
        })
        .catch((error) => {
            res.render("error", { error: "Error actualizando limpieza" });
        });
});

module.exports = router;
