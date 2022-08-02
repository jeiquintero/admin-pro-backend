const { response }= require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario-module');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        
        const usuarioDb = await Usuario.findOne({email});

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Email incorrecto'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Password erroneo'
            });
        }

        const token = await generarJWT(usuarioDb.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = { login }