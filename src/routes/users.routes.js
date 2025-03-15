import { Router } from "express";

import { getUsers, getUser1, postUser, deleteUser, putUser, loginUser} from "../controllers/users.controllers.js";

const router = Router();

// Get para obtener el listado de usuarios
router.get('/users', getUsers);


// Get para obtener un usuario en específico
router.get('/users/:pk_correo', getUser1);


// Post para crear un usuario
router.post('/users', postUser);


// Post para iniciar sesión
router.post('/login', loginUser);


// Delete para eliminar un usuario
router.delete('/user:pk_correo', deleteUser);
 

// Put para actualizar un usuario
router.put('/users/:pk_correo', putUser);

export default router;
