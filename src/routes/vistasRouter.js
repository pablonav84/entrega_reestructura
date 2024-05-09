import { Router } from 'express';
import { passportCall } from '../utils.js';
import { auth } from '../middleware/auth.js';
import { rolModelo } from '../dao/models/rolModelo.js';
import { productsModelo } from '../dao/models/productosModelo.js';

export const router = Router();

router.get('/', (req, res) => {
  res.status(200).render('login');
})

router.get('/home', passportCall("jwt", {session:false}), async (req,res)=>{
    
    const rol = await rolModelo.findById(req.user.rol);

    res.status(200).render('home', {usuario: req.user, rol:rol.descrip})
})

router.get("/productos", async (req, res) => {
  let { pagina, limit, sort } = req.query;
  if (!pagina) {
    pagina = 1;
  }
  let sortOption = {}; // Inicializa un objeto vacío para las opciones de ordenamiento
  if (sort) {
    // Verifica si se proporciona el parámetro 'sort'
    if (sort === "asc") {
      sortOption = {
        /* Define los criterios de ordenamiento para el orden ascendente */
      };
    } else if (sort === "desc") {
      sortOption = {
        /* Define los criterios de ordenamiento para el orden descendente */
      };
    }
  }
  let {
    docs: productos,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
  } = await productsModelo.paginate(
    {},
    { limit: limit || 10, page: pagina, lean: true, sort: sortOption }
  );
  res.setHeader("Content-Type", "text/html");
  return res
    .status(200)
    .render("productos", {
      productos,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    });
});

router.get("/productos/:id", async (req, res) => {
  let id = req.params.id;
  let product = await productsModelo.findById(id);

  res.setHeader("Content-Type", "text/html");
  return res.status(200).render("detailProducts", { product });
});

router.get("/registro", (req, res) => {

  return res.status(200).render("registro");
})