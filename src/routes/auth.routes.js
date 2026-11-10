const express = require('express');
const AuthController = require('../controllers/AuthController');
const verificarToken = require('../middlewares/verificarToken');

const router = express.Router();

router.post('/registro', AuthController.registro);
router.post('/login', AuthController.login);
router.get('/perfil', verificarToken, AuthController.perfil);
router.put('/cambiar-password', verificarToken, AuthController.cambiarPassword);
router.delete('/cuenta', verificarToken, AuthController.eliminarCuenta);

module.exports = router;