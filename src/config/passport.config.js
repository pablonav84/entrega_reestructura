import passport from "passport"
import local from "passport-local"
import passportjwt from "passport-jwt"
import bcrypt from 'bcrypt'
import { generaHash } from "../utils.js"
import { rolModelo } from "../dao/models/rolModelo.js"
import { usuarioModelo } from "../dao/models/usuariosModelo.js"
import { UsuariosManager } from "../dao/usuariosMongoDAO.js"
import { Cart } from "../dao/models/cartModelo.js"
import { config } from "./config.js"


const buscaToken=(req)=>{
    let token=null

    if(req.signedCookies.coderCookie){
        token=req.signedCookies.coderCookie
    }
    return token
}

export const initPassport=()=>{
    const manager = new UsuariosManager();

    passport.use(
        "current",
        new passportjwt.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: new passportjwt.ExtractJwt.fromExtractors([buscaToken])
            },
            async (contenidoToken, done)=>{
                try {
                    return done(null, contenidoToken)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async (req, username, password, done)=>{
                try {
                    let {nombre}=req.body
                    if(!nombre){
                        return done(null, false, {message:"Complete nombre"})
                    }
                    let {apellido}=req.body
                    if(!apellido){
                        return done(null, false, {message:"Complete apellido"})
                    }
                    let {edad}=req.body
                    if(!edad){
                        return done(null, false, {message:"Complete edad"})
                    }
                    let existe=await usuarioModelo.findOne({email:username})
                    if(existe){
                        return done(null, false, {message:`Ya existe un usuario registrado con el email ${username}`})
                    }

                    password=generaHash(password)

                    let rol=await rolModelo.findOne({descrip:"usuario"})
                    if(!rol){
                        rol=await rolModelo.create({descrip:"usuario"})
                    }
                    rol:rol._id

                    let cart=await Cart.findOne()
                    if(!cart){
                        cart=await Cart.create()
                    }
                    cart:cart._id

                    let usuario=await usuarioModelo.create({
                        nombre, apellido, email:username, edad, password, rol, cart
                    })
                    return done(null, usuario)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
          {
            usernameField: "email"
          },
          async (username, password, done) => {
            if (!username || !password) {
              return done(null, false);
            }
            try {
              let usuario = await manager.getBy({ email: username });
              
              if (!usuario) {
                return done(null, false, { message: "Correo electrónico incorrecto o no encontrado" });
              }
              //bcrypt.compare para comparar la contraseña proporcionada con la contraseña almacenada
              const passwordMatch = await bcrypt.compare(password, usuario.password);
              if (!passwordMatch) {
                return done(null, false, { message: "Contraseña incorrecta" });
              }
              return done(null, usuario);
            } catch (error) {
              return done(error, false, { message: "Error al autenticar el usuario" });
            }
          }
        )
      );   
}