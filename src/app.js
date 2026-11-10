require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  rutas() {
    this.app.get('/', (req, res) => {
      res.json({ mensaje: 'API RondaManager funcionando' });
    });
    this.app.use('/api/usuarios', require('./routes/usuarios.routes'));
    this.app.use('/api/servicios', require('./routes/servicios.routes'));
    this.app.use('/api/productos', require('./routes/productos.routes')); 
    this.app.use('/api/auth', require('./routes/auth.routes'));
    this.app.get('/api/salud', async (req, res) => {
      try {
        const resultado = await db.query('SELECT NOW() AS hora');
        res.json({ conexion: 'ok', hora: resultado.rows[0].hora });
      } catch (error) {
        res.status(500).json({ conexion: 'error', detalle: error.message });
      }
    });
  }

  iniciar() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

new App().iniciar();