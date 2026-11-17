import { ModuloCrud } from './ModuloCrud.js';
import { escapar, etiquetaEstado, formatearFecha } from './utilidades.js';

export class UsuariosModulo extends ModuloCrud {
  constructor({ api, dialogo, notificar, sesion }) {
    super({
      api,
      dialogo,
      notificar,
      ruta: '/usuarios',
      titulo: 'Usuarios',
      singular: 'usuario',
      columnas: [
        { clave: 'nombre', etiqueta: 'Nombre' },
        { clave: 'correo', etiqueta: 'Correo' },
        { clave: 'rol', etiqueta: 'Rol', formato: (v) => escapar(v.charAt(0).toUpperCase() + v.slice(1)) },
        { clave: 'estado', etiqueta: 'Estado', formato: etiquetaEstado },
        { clave: 'creado_en', etiqueta: 'Creado', formato: formatearFecha }
      ],
      campos: [
        { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 100 },
        { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', requerido: true, max: 100 },
        { nombre: 'password', etiqueta: 'Contraseña', tipo: 'password', requeridoAlCrear: true,
          ayudaEdicion: 'Déjala vacía si no quieres cambiarla.' },
        { nombre: 'rol', etiqueta: 'Rol', tipo: 'select', valorInicial: 'supervisor',
          opciones: [
            { valor: 'supervisor', texto: 'Supervisor' },
            { valor: 'administrador', texto: 'Administrador' }
          ] },
        { nombre: 'estado', etiqueta: 'Usuario activo', tipo: 'checkbox', valorInicial: true }
      ]
    });
    this.sesion = sesion;
  }

  // Un usuario no puede eliminar su propia cuenta desde el panel
  puedeEliminar(registro) {
    const actual = this.sesion.datos();
    return !actual || registro.id !== actual.id;
  }
}
