import { Sesion } from './Sesion.js';
import { ApiClient } from './ApiClient.js';
import { UsuariosModulo } from './UsuariosModulo.js';
import { ServiciosModulo } from './ServiciosModulo.js';
import { ProductosModulo } from './ProductosModulo.js';

export class App {
  constructor() {
    this.sesion = new Sesion();
    this.api = new ApiClient(this.sesion);
    this.api.alSesionInvalida = () => this.cerrarSesion('Tu sesión expiró. Inicia sesión de nuevo.');
    this.vistaLogin = document.getElementById('vistaLogin');
    this.vistaApp = document.getElementById('vistaApp');
    this.contenido = document.getElementById('contenido');
    this.navegacion = document.getElementById('navegacion');
    this.mensaje = document.getElementById('mensaje');
    this.dialogo = document.getElementById('dialogo');
    this.modulos = {};
    this.temporizador = null;
  }

  iniciar() {
    document.getElementById('formLogin').addEventListener('submit', (evento) => this.iniciarSesion(evento));
    document.getElementById('botonSalir').addEventListener('click', () => this.cerrarSesion());
    this.navegacion.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-modulo]');
      if (boton) this.irA(boton.dataset.modulo);
    });
    if (this.sesion.estaActiva()) {
      this.mostrarApp();
    } else {
      this.sesion.cerrar();
      this.mostrarLogin();
    }
  }

  async iniciarSesion(evento) {
    evento.preventDefault();
    const formulario = evento.target;
    const boton = document.getElementById('botonLogin');
    const errorLogin = document.getElementById('errorLogin');
    errorLogin.hidden = true;
    boton.disabled = true;
    boton.textContent = 'Ingresando…';
    try {
      const respuesta = await this.api.post('/auth/login', {
        correo: document.getElementById('loginCorreo').value.trim(),
        password: document.getElementById('loginPassword').value
      });
      this.sesion.guardar(respuesta.token);
      formulario.reset();
      this.mostrarApp();
    } catch (error) {
      errorLogin.textContent = error.message;
      errorLogin.hidden = false;
    } finally {
      boton.disabled = false;
      boton.textContent = 'Iniciar sesión';
    }
  }

  cerrarSesion(mensaje) {
    if (this.dialogo.open) this.dialogo.close();
    this.sesion.cerrar();
    this.modulos = {};
    this.mostrarLogin();
    if (mensaje) this.notificar(mensaje, 'error');
  }

  mostrarLogin() {
    this.vistaApp.hidden = true;
    this.vistaLogin.hidden = false;
  }

  mostrarApp() {
    const datos = this.sesion.datos();
    const esAdministrador = datos.rol === 'administrador';
    const notificar = (texto, tipo) => this.notificar(texto, tipo);

    document.getElementById('datosUsuario').textContent = `${datos.correo} · ${datos.rol}`;

    this.modulos = {
      servicios: new ServiciosModulo({ api: this.api, dialogo: this.dialogo, notificar }),
      productos: new ProductosModulo({ api: this.api, dialogo: this.dialogo, notificar })
    };
    if (esAdministrador) {
      this.modulos.usuarios = new UsuariosModulo({
        api: this.api, dialogo: this.dialogo, notificar, sesion: this.sesion
      });
    }
    this.navegacion.querySelector('[data-modulo="usuarios"]').hidden = !esAdministrador;

    this.vistaLogin.hidden = true;
    this.vistaApp.hidden = false;
    this.irA(esAdministrador ? 'usuarios' : 'servicios');
  }

  async irA(nombre) {
    this.navegacion.querySelectorAll('button[data-modulo]').forEach((boton) => {
      if (boton.dataset.modulo === nombre) {
        boton.setAttribute('aria-current', 'page');
      } else {
        boton.removeAttribute('aria-current');
      }
    });
    await this.modulos[nombre].mostrar(this.contenido);
  }

  notificar(texto, tipo = 'exito') {
    clearTimeout(this.temporizador);
    this.mensaje.textContent = `${tipo === 'error' ? '⚠' : '✔'} ${texto}`;
    this.mensaje.className = `mensaje ${tipo}`;
    this.mensaje.hidden = false;
    this.temporizador = setTimeout(() => { this.mensaje.hidden = true; }, 5000);
  }
}
