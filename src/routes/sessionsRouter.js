import { Router } from 'express';
import jwt from "jsonwebtoken";
import { passportCall } from '../utils.js';
import { usuarioModelo } from '../dao/models/usuariosModelo.js';
import { auth } from '../middleware/auth.js';
import { config } from '../config/config.js';

export const router=Router()

router.get('/current', passportCall("jwt"), auth(["usuario"]), async(req,res)=>{
    
  try {
        let usuario = await
        usuarioModelo.findById(req.user._id).populate('cart').populate('rol').lean();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          mensaje: 'Perfil usuario',
          datosUsuario: usuario
        });
      } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
      }
});

router.get("/usuarios", async(req, res)=>{
    try {
        let usuarios = await usuarioModelo.find().populate("rol").populate("cart").lean();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ usuarios });
      } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
      }
})

router.post("/registro", passportCall("registro"), (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(201).json({status:"registro correcto", usuario:req.user});
})

router.post('/login', passportCall("login"), async(req,res)=>{
    let usuario=req.user
    usuario={...usuario}
    delete usuario.password

    let token=jwt.sign(usuario, config.SECRET, {expiresIn:"1h"})

    res.cookie("coderCookie", token, {maxAge: 1000*60*60, signed:true, httpOnly: true})
    
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Login correcto", usuario
    })
});