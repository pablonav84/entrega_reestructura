import { ProductsManager as ProductosDAO } from "../dao/productosMongoDAO.js"


class ProductosService{
    constructor(dao){
        this.ProductosDAO=dao
    }

    async getAllProductos(){
        return await this.ProductosDAO.getAll()
    }
    async getProductoBy(code){
        return await this.ProductosDAO.getProductBy(code)
    }
    async crearProducto(producto){
        return await this.ProductosDAO.addProduct(producto)
    }
}

export const productosService=new ProductosService(new ProductosDAO())