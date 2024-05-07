import { ProductsManager as ProductosDAO } from "../dao/productosMongoDAO.js"

const productosDAO=new ProductosDAO()

export default class ProductosController{

    static getProductos=async(req,res)=>{

        let productos=await productosDAO.getAll()

        res.setHeader('Content-Type','application/json')
        res.status(200).json({productos})
    }
}