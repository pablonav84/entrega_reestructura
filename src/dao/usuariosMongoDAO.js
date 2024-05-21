import { usuarioModelo } from "./models/usuariosModelo.js";

export class UsuariosManager{

    async getAll(filtro={}){
        return await usuarioModelo.find(filtro).populate('cart').populate('rol').lean() 
    }

    async getBy(filtro){   // {email}
        return await usuarioModelo.findOne(filtro).lean()
    }

    async create(usuario){
        return await usuarioModelo.create(usuario)
    }

    async validarEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //Uso expresiones regulares
        return emailRegex.test(email);
    }    

    async validarPassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    }
}