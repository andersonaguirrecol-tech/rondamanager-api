const express = require('express');
const ServicioController = require('../controllers/ServicioController');

const router = express.Router();

router.get('/', ServicioController.listar);
router.get('/:id', ServicioController.obtener);
router.post('/', ServicioController.crear);
router.put('/:id', ServicioController.actualizar);
router.delete('/:id', ServicioController.eliminar);

module.exports = router;