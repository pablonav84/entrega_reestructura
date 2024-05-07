import mongoose from "mongoose";

const productsEsquema=mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock:Number,
    category:String,
    password:String
},
{
    collection: "productos",
    timestamps: true
  });
  

  export const productsModelo = mongoose.model("productos", productsEsquema);