export class ApiClient {
  constructor(sesion, urlBase = '/api') {
    this.sesion = sesion;
    this.urlBase = urlBase;
    this.alSesionInvalida = null;
  }

  async solicitar(metodo, ruta, cuerpo) {
    const token = this.sesion.obtenerToken();
    const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
    if (token) opciones.headers['Authorization'] = `Bearer ${token}`;
    if (cuerpo !== undefined) opciones.body = JSON.stringify(cuerpo);

    let respuesta;
    try {
      respuesta = await fetch(`${this.urlBase}${ruta}`, opciones);
    } catch (error) {
      throw new Error('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
    }

    let datos = null;
    try {
      datos = await respuesta.json();
    } catch (error) {
      datos = null;
    }

    if (!respuesta.ok) {
      if (respuesta.status === 401 && token && this.alSesionInvalida) {
        this.alSesionInvalida();
      }
      throw new Error((datos && datos.error) || 'No se pudo completar la solicitud.');
    }
    return datos;
  }

  get(ruta) { return this.solicitar('GET', ruta); }
  post(ruta, cuerpo) { return this.solicitar('POST', ruta, cuerpo); }
  put(ruta, cuerpo) { return this.solicitar('PUT', ruta, cuerpo); }
  delete(ruta) { return this.solicitar('DELETE', ruta); }
}
