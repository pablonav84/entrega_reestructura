import { Router } from 'express';
import { passportCall } from '../utils.js';
import { auth } from '../middleware/auth.js';
import { rolModelo } from '../dao/models/rolModelo.js';

export const router = Router();

router.get('/', (req, res) => {
  res.status(200).render('login');
})

router.get('/home', passportCall("current", {session:false}), async (req,res)=>{
    
    const rol = await rolModelo.findById(req.user.rol);

    res.status(200).render('home', {usuario: req.user, rol:rol.descrip})
})