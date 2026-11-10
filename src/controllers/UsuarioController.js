const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

class UsuarioController {
  static async listar(req, res) {
    try {
      res.json(await Usuario.listar());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtener(req, res) {
    try {
      const usuario = await Usuario.obtener(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { nombre, correo, password, rol } = req.body;
      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'nombre, correo y password son obligatorios' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const usuario = await Usuario.crear({ nombre, correo, password: passwordHash, rol });
      res.status(201).json(usuario);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const datos = { ...req.body };
      if (datos.password) {
        datos.password = await bcrypt.hash(datos.password, 10);
      }
      const usuario = await Usuario.actualizar(req.params.id, datos);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const usuario = await Usuario.eliminar(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsuarioController;