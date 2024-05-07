import dotenv from "dotenv"

dotenv.config(
    {
        path:"./src/.env", 
        override: true
    }
)

export const config={
    PORT:process.env.PORT,
    MENSAJE:process.env.MENSAJE,
    SECRET:process.env.SECRET,
    PRUEBA_PORT:process.env.PRUEBA_PORT,
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME
}