import { Router } from 'express';
import jwt from "jsonwebtoken";
import { passportCall } from '../utils.js';
import { usuarioModelo } from '../dao/models/usuariosModelo.js';
import { auth } from '../middleware/auth.js';
import { config } from '../config/config.js';
import passport from 'passport';

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
        console.log(usuarios)
        res.setHeader('Content-Type', 'application/json');
        console.log({usuarios})
        return res.status(200).json({ usuarios });
      } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
      }
})

router.post("/registro", passportCall("registro"), (req, res)=>{
let usuario=req.user
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({status:"registro correcto", usuario});
})

router.post('/login', passportCall("login"), async(req,res)=>{
  try {
    let usuario=req.user;
    usuario={...usuario};
    delete usuario.password;

    let token=jwt.sign(usuario, config.SECRET, {expiresIn:"1h"});

    res.cookie("coderCookie", token, {maxAge: 1000*60*60, signed:true, httpOnly: true});

    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Login correcto", usuario
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al realizar el login' });
  }
});

router.get('/logout', (req, res) => {

  res.clearCookie('coderCookie');

  res.send('<script>alert("Logout exitoso"); window.location.href="/?mensaje=Logout exitoso";</script>');
});

//Login con Github
router.get('/github', passportCall("github"), (req,res)=>{})

router.get('/callbackGithub', passportCall("github", {failureRedirect:"/api/sessions/errorGitHub"}), (req,res)=>{

  req.usuario=req.user
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({
      payload:"Login correcto", 
      usuario:req.user
  });
})

router.get("/errorGitHub", (req, res)=>{
  res.setHeader('Content-Type','application/json');
  return res.status(500).json(
      {
          error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle:`Fallo al autenticar con GitHub`
      }
  )
})