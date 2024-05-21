import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { engine } from "express-handlebars";
import cookieParser from 'cookie-parser';
import path from "path";
import { initPassport } from './config/passport.config.js';
import { UsuariosRouter } from "./routes/router/usuariosRouter.js";
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as carritosRouter } from './routes/carritosRouter.js';
import { ProductosRouter } from './routes/router/productosRouter.js';
import { config } from './config/config.js';
import __dirname from "./utils.js";
import {router as vistasRouter} from "./routes/vistasRouter.js"

const PORT = config.PORT;

const app = express();
const productosRouter=new ProductosRouter()
const usuariosRouter=new UsuariosRouter()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", engine({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
 },
}))
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

initPassport()
app.use(passport.initialize())

app.use(cookieParser("CoderCoder123"))

app.use("/", vistasRouter)
app.use("/api/usuarios", usuariosRouter.getRouter())
app.use("/api/productos", productosRouter.getRouter())
app.use("/api/carritos", carritosRouter)
app.use("/api/sessions", sessionsRouter)

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const connect = async () => {
  try {
    await mongoose.connect(config.MONGO_URL,{
        dbName: config.DB_NAME
    })
    console.log("DB online")
} catch (error) {
    console.log(error.message)
}
  };
  connect();