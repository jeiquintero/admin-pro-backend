require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear server express
const app = express();

//Config cors
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get( '/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hello word'
    })

});

app.listen(3000, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
})