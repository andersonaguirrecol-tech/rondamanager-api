import { ModuloCrud } from './ModuloCrud.js';
import { etiquetaEstado } from './utilidades.js';

export class ServiciosModulo extends ModuloCrud {
  constructor({ api, dialogo, notificar }) {
    super({
      api,
      dialogo,
      notificar,
      ruta: '/servicios',
      titulo: 'Servicios',
      singular: 'servicio',
      columnas: [
        { clave: 'nombre', etiqueta: 'Nombre' },
        { clave: 'descripcion', etiqueta: 'Descripción' },
        { clave: 'duracion_minutos', etiqueta: 'Duración (min)' },
        { clave: 'estado', etiqueta: 'Estado', formato: etiquetaEstado }
      ],
      campos: [
        { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 100 },
        { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
        { nombre: 'duracion_minutos', etiqueta: 'Duración estimada (minutos)', tipo: 'number', min: 0, valorInicial: 0 },
        { nombre: 'estado', etiqueta: 'Servicio activo', tipo: 'checkbox', valorInicial: true }
      ]
    });
  }
}
