// const express = require("express");

// const Usuario = require(__dirname + "/models/usuario");

// const router = express.Router();



// router.get("/login", (req, res) => {
//     res.render("login");
// });

// router.post("/login", (req, res) => {
//     Usuario.findOne({
//         login: req.body.login,
//         password: req.body.password,
//     }).then((resultado) => {
//         if (resultado) {
//             req.session.usuario = resultado.login;
//             res.redirect("/habitaciones");
//         } else {
//             res.render("login", { error: "Usuario o contraseña incorrectos" });
//         }
//     });
// });

// router.get("/logout", (req, res) => {
//     req.session.destroy();
//     res.redirect("/");
// });

// module.exports = router;
