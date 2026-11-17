import { ModuloCrud } from './ModuloCrud.js';
import { etiquetaEstado } from './utilidades.js';

export class ProductosModulo extends ModuloCrud {
  constructor({ api, dialogo, notificar }) {
    super({
      api,
      dialogo,
      notificar,
      ruta: '/productos',
      titulo: 'Productos',
      singular: 'producto',
      columnas: [
        { clave: 'nombre', etiqueta: 'Nombre' },
        { clave: 'descripcion', etiqueta: 'Descripción' },
        { clave: 'cantidad', etiqueta: 'Cantidad' },
        { clave: 'estado', etiqueta: 'Estado', formato: etiquetaEstado }
      ],
      campos: [
        { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 100 },
        { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
        { nombre: 'cantidad', etiqueta: 'Cantidad disponible', tipo: 'number', min: 0, valorInicial: 0 },
        { nombre: 'estado', etiqueta: 'Producto activo', tipo: 'checkbox', valorInicial: true }
      ]
    });
  }
}
