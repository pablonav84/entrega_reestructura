import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { ProductsManager } from '../dao/productosMongoDAO.js';
import { CarritosDAO } from '../dao/carritosDAO.js';
export const router=Router()

const carritosDAO=new CarritosDAO()
const productsManager=new ProductsManager()

router.get("/:cid", async(req, res)=>{
    let {cid}=req.params
    if(!cid){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese cid`})
    }

    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese cidcon formato válido de MongoDB id`})
    }

    let carrito=await carritosDAO.getOneBy({_id:cid})
    if(!carrito){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Carrito inexistente: ${cid}`})
    } 

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({carrito});

})

router.put('/:cid/producto/:pid',async(req,res)=>{

    let {cid, pid}=req.params
    if(!cid || !pid){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese cid y pid`})
    }

    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese cid / pid con formato válido de MongoDB id`})
    }

    let carrito=await carritosDAO.getOneBy({_id:cid})
    console.log(carrito)
    if(!carrito){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Carrito inexistente: ${cid}`})
    }

    let producto=await productsManager.getProductBy({_id:pid})
    if(!producto){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Producto inexistente: ${pid}`})
    }

    let indiceProducto=carrito.items.findIndex(p=>p.item==pid)
    console.log(indiceProducto)
    if(indiceProducto===-1){
        carrito.items.push({
            item: pid, cantidad: 1
        })
    }else{
        carrito.items[indiceProducto].cantidad++
    }

    try {
        let resultado=await carritosDAO.update(cid, carrito)
        if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Carrito actualizado...!!!"});
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                }
            )
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }

    res.setHeader('Content-Type','application/json')
    res.status(200).json({})
})