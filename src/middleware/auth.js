import { usuarioModelo } from "../dao/models/usuariosModelo.js";

export const auth = (accesos = []) => {
    return async (req, res, next) => {
        accesos = accesos.map(a => a.toLowerCase());

        if (accesos.includes("usuario")) {
            return next();
        }
        try {
            const usuario = await usuarioModelo.findById(req.user._id).populate('rol');

            if (!usuario || !usuario.rol) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ error: `No se encontró el usuario o el rol asociado` });
            }
            const rolUsuario = usuario.rol;

            if (!accesos.includes(rolUsuario)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: `No tiene privilegios suficientes para acceder al recurso` });
            }

            next();
            
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error al procesar la solicitud` });
        }
    }
}