const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario-module');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'name email role img google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })

}

const crearUsuario = async(req, res = response) => {
    
    const { password, email } = req.body;
    
    try {

        const existe = await Usuario.findOne({ email });
        
        if (existe) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar contaseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        const token = await generarJWT(usuario.id);

        await usuario.save();

        res.json({
            ok: true,
            usuario, //es lo mismo que usuario: usuario
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarUsuario = async () => {
    const uid = req.params.id;

    try {
        
        const usuarioDB =  await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            })
        }

        const { password, google, email, ...campos } = req.body;
        
        if ( usuarioDB.email !== email) {
            const existEmail = await Usuario.findOne({ email });
            if (existEmail) {
                return req.status(400).json({
                    ok: false,
                    msg: 'Usuario ya existe con este email'
                });
            }
        }

        // delete campos.password;
        // delete campos.google;
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    
    try {
        
        const usuarioDB =  await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg: "Usuario eliminado"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario };