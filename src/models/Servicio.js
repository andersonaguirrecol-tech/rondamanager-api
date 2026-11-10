const db = require('../config/db');

class Servicio {
  static async listar() {
    const r = await db.query('SELECT * FROM servicios ORDER BY id');
    return r.rows;
  }

  static async obtener(id) {
    const r = await db.query('SELECT * FROM servicios WHERE id = $1', [id]);
    return r.rows[0];
  }

  static async crear({ nombre, descripcion, duracion_minutos }) {
    const r = await db.query(
      `INSERT INTO servicios (nombre, descripcion, duracion_minutos)
       VALUES ($1, $2, COALESCE($3, 0))
       RETURNING *`,
      [nombre, descripcion, duracion_minutos]
    );
    return r.rows[0];
  }

  static async actualizar(id, { nombre, descripcion, duracion_minutos, estado }) {
    const r = await db.query(
      `UPDATE servicios SET
         nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         duracion_minutos = COALESCE($3, duracion_minutos),
         estado = COALESCE($4, estado)
       WHERE id = $5
       RETURNING *`,
      [nombre, descripcion, duracion_minutos, estado, id]
    );
    return r.rows[0];
  }

  static async eliminar(id) {
    const r = await db.query('DELETE FROM servicios WHERE id = $1 RETURNING id', [id]);
    return r.rows[0];
  }
}

module.exports = Servicio;