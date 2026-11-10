const Servicio = require('../models/Servicio');

class ServicioController {
  static async listar(req, res) {
    try {
      res.json(await Servicio.listar());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtener(req, res) {
    try {
      const servicio = await Servicio.obtener(req.params.id);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { nombre } = req.body;
      if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
      res.status(201).json(await Servicio.crear(req.body));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const servicio = await Servicio.actualizar(req.params.id, req.body);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const servicio = await Servicio.eliminar(req.params.id);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      res.json({ mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ServicioController;