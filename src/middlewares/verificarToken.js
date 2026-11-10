const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const cabecera = req.headers['authorization'];
  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    req.usuario = jwt.verify(cabecera.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;