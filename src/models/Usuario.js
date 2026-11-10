const db = require('../config/db');

class Usuario {
  static async listar() {
    const r = await db.query(
      'SELECT id, nombre, correo, rol, estado, creado_en FROM usuarios ORDER BY id'
    );
    return r.rows;
  }

  static async obtener(id) {
    const r = await db.query(
      'SELECT id, nombre, correo, rol, estado, creado_en FROM usuarios WHERE id = $1',
      [id]
    );
    return r.rows[0];
  }

  static async crear({ nombre, correo, password, rol }) {
    const r = await db.query(
      `INSERT INTO usuarios (nombre, correo, password, rol)
       VALUES ($1, $2, $3, COALESCE($4, 'supervisor'))
       RETURNING id, nombre, correo, rol, estado, creado_en`,
      [nombre, correo, password, rol]
    );
    return r.rows[0];
  }

  static async actualizar(id, { nombre, correo, password, rol, estado }) {
    const r = await db.query(
      `UPDATE usuarios SET
         nombre = COALESCE($1, nombre),
         correo = COALESCE($2, correo),
         password = COALESCE($3, password),
         rol = COALESCE($4, rol),
         estado = COALESCE($5, estado)
       WHERE id = $6
       RETURNING id, nombre, correo, rol, estado, creado_en`,
      [nombre, correo, password, rol, estado, id]
    );
    return r.rows[0];
  }

  static async eliminar(id) {
    const r = await db.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );
    return r.rows[0];
  }
    static async buscarPorCorreo(correo) {
    const r = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return r.rows[0];
  }

  static async obtenerConPassword(id) {
    const r = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return r.rows[0];
  }
}

module.exports = Usuario;