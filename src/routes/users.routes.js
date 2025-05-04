import { Router } from "express";
import { getUsers, getUser1, postUser, deleteUser, putUser, loginUser, changePassword, getName, getInstitution} from "../controllers/users.controllers.js";

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


// Post para cambiar la contraseña
router.post('/users/change-password', changePassword);


// Get para obtener el nombre de un usuario
router.get('/users/name/:pk_correo', getName);


// Get para obtener la institución de un usuario
router.get('/users/institution/:pk_correo', getInstitution);

export default router;
