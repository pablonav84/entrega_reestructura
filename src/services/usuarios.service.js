import { UsuariosManager as UsuariosDAO } from "../dao/usuariosMongoDAO.js"



class UsuariosService{
    constructor(dao){
        this.UsuariosDAO=dao
    }
    async getAllUsuarios(){
        return this.UsuariosDAO.getAll()
    }
    async getUsuarioByEmail(email){
        return await this.UsuariosDAO.getBy(email)
    }
    async getUsuarioById(id){
        return await this.UsuariosDAO.getBy({_id:id})
    }
    async crearUsuario(usuario){
        return await this.UsuariosDAO.create(usuario)
    }
}

export const usuariosService=new UsuariosService(new UsuariosDAO())