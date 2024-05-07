import { Router } from 'express';
import UsuariosController from '../../controller/usuarios.controller.js';
import { CustomRouter } from './router.js';
import { UsuariosManager } from '../../dao/usuariosMongoDAO.js';
export const router=Router()

const usuariosManager=new UsuariosManager()

export class UsuariosRouter extends CustomRouter{
    init(){
        this.get('/', UsuariosController.getUsuarios)
        this.get("/:id", UsuariosController.getUsuarioById)
        this.post("/", UsuariosController.create)
    }
}