const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  static async registro(req, res) {
    try {
      const { nombre, correo, password } = req.body;
      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'nombre, correo y password son obligatorios' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const usuario = await Usuario.crear({ nombre, correo, password: passwordHash });
      res.status(201).json(usuario);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { correo, password } = req.body;
      if (!correo || !password) {
        return res.status(400).json({ error: 'correo y password son obligatorios' });
      }
      const usuario = await Usuario.buscarPorCorreo(correo);
      if (!usuario || !usuario.estado) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      const coincide = await bcrypt.compare(password, usuario.password);
      if (!coincide) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      const token = jwt.sign(
        { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async perfil(req, res) {
    try {
      const usuario = await Usuario.obtener(req.usuario.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarPassword(req, res) {
    try {
      const { passwordActual, passwordNueva } = req.body;
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ error: 'passwordActual y passwordNueva son obligatorios' });
      }
      const usuario = await Usuario.obtenerConPassword(req.usuario.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      const coincide = await bcrypt.compare(passwordActual, usuario.password);
      if (!coincide) {
        return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      }
      const passwordHash = await bcrypt.hash(passwordNueva, 10);
      await Usuario.actualizar(req.usuario.id, { password: passwordHash });
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminarCuenta(req, res) {
    try {
      const usuario = await Usuario.eliminar(req.usuario.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ mensaje: 'Cuenta eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;