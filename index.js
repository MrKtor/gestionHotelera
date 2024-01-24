const mongoose = require("mongoose");
const express = require("express");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
var dateFilter = require('nunjucks-date-filter');
// var env = new nunjucks.Environment();
dotenv.config();


const Habitacion = require(__dirname + "/routes/habitaciones");
const Limpieza = require(__dirname + "/routes/limpiezas");
// const auth = require(__dirname + '/routes/auth');

mongoose.connect(process.env.DATABASE_URL); 

let app = express();


const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

env.addFilter('date', dateFilter);

app.set('view engine', 'njk');

// env.addFilter('date', dateFilter);
// dateFilter.setDefaultFormat('YYYY');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
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
// app.use('/auth', auth);
app.use("/habitaciones", Habitacion);
app.use("/limpiezas", Limpieza);

// app.get('/', (req, res) => {
//     res.redirect('/login');
//   });


app.listen(process.env.PORT);
