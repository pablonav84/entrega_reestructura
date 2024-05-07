import ProductosController from "../../controller/productos.controller.js";
import { ProductsManager } from "../../dao/productosMongoDAO.js";
import { auth } from "../../middleware/auth.js";
import { passportCall } from "../../utils.js";
import { CustomRouter } from "./router.js";

const productsManager=new ProductsManager()

export class ProductosRouter extends CustomRouter{
    init(){
        this.get("/", passportCall("current"), auth(["usuario"]), ProductosController.getProductos)

        
    }
}