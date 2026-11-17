export class Sesion {
  constructor() {
    this.clave = 'rondamanager_token';
  }

  guardar(token) {
    localStorage.setItem(this.clave, token);
  }

  obtenerToken() {
    return localStorage.getItem(this.clave);
  }

  datos() {
    const token = this.obtenerToken();
    if (!token) return null;
    try {
      const carga = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(carga));
    } catch (error) {
      return null;
    }
  }

  estaActiva() {
    const datos = this.datos();
    return datos !== null && datos.exp * 1000 > Date.now();
  }

  cerrar() {
    localStorage.removeItem(this.clave);
  }
}
