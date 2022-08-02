require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear server express
const app = express();

//Config cors
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios-route'));
app.use('/api/login', require('./routes/auth-route'));


app.listen(3000, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
})