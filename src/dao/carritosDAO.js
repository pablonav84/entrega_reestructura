import Cart from "./models/cartModelo.js"

export class CarritosDAO{

    async getAll(){
        return await productsModelo.find().lean()
    }

    async getOneBy(filtro={}){
        return await Cart.findOne(filtro).lean()
    }

    async getOneByPopulate(filtro={}){
        return await Cart.findOne(filtro).populate("productos.producto").lean()
    }

    async create(){
        return await Cart.create({productos:[]})
    }

    async update(id, carrito){
        return await Cart.updateOne({_id:id}, carrito)
    }
}