import { isValidObjectId } from "mongoose"
import { generaHash } from "../utils.js"
import { productosService } from "../services/productos.service.js"


export default class ProductosController{

    static getProductos=async(req,res)=>{

        let productos=await productosService.getAllProductos()

        res.setHeader('Content-Type','application/json')
        res.status(200).json({productos})
    }

    static getProductoById=async(req,res)=>{

        let {id}=req.params
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id de MongoDB válido`})
        }

        let producto=await productosService.getProductoBy({_id:id})

        if (!producto) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `El ID ingresado no corresponde a un producto existente` });
        }

        res.setHeader('Content-Type','application/json')
        res.status(200).json({producto})
    }

    static newProducto=async (req, res) => {
        let {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
          password,
        } = req.body;
        // Verificar si alguno de los campos está incompleto
        if (
          !title ||
          !description ||
          !price ||
          !code ||
          !stock ||
          !category ||
          !password
        ) {
          res.status(400).json({ error: "Hay campos que faltan ser completados" });
          return;
        }
        // Verificar si el código ya existe
        let existCode = await productosService.getProductoBy({code});
        if (existCode) {
          res.status(400).json({ error: "Ya existe un producto con el mismo código" });
          return;
        }
        password = generaHash(password);
        try {
          let nuevoProducto = await productosService.crearProducto({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            password,
          });
          res.setHeader("Content-Type", "application/json");
          return res.status(201).json({ nuevoProducto: nuevoProducto });
        } catch (error) {
          return res.status(500).json({ error: `Error inesperado en el servidor`, detalle: error.message });
        }
}
}