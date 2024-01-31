const mongoose = require("mongoose");
const express = require("express");
const session = require('express-session');
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
var dateFilter = require('nunjucks-date-filter');
dotenv.config();


const habitacion = require(__dirname + "/routes/habitaciones");
const limpieza = require(__dirname + "/routes/limpiezas");
const auth = require(__dirname + '/routes/auth');

mongoose.connect(process.env.DATABASE_URL); 

let app = express();


const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

env.addFilter('date', dateFilter);

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Configuración de la sesión
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
  }));
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
app.use("/auth", auth);
app.use("/habitaciones", habitacion);
app.use("/limpiezas", limpieza);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
  });


app.listen(process.env.PORT);
