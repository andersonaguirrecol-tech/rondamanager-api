const db = require('../config/db');

class Producto {
  static async listar() {
    const r = await db.query('SELECT * FROM productos ORDER BY id');
    return r.rows;
  }

  static async obtener(id) {
    const r = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
    return r.rows[0];
  }

  static async crear({ nombre, descripcion, cantidad }) {
    const r = await db.query(
      `INSERT INTO productos (nombre, descripcion, cantidad)
       VALUES ($1, $2, COALESCE($3, 0))
       RETURNING *`,
      [nombre, descripcion, cantidad]
    );
    return r.rows[0];
  }

  static async actualizar(id, { nombre, descripcion, cantidad, estado }) {
    const r = await db.query(
      `UPDATE productos SET
         nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         cantidad = COALESCE($3, cantidad),
         estado = COALESCE($4, estado)
       WHERE id = $5
       RETURNING *`,
      [nombre, descripcion, cantidad, estado, id]
    );
    return r.rows[0];
  }

  static async eliminar(id) {
    const r = await db.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
    return r.rows[0];
  }
}

module.exports = Producto;