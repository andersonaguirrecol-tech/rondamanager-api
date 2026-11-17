import { escapar } from './utilidades.js';

export class ModuloCrud {
  constructor({ api, dialogo, notificar, ruta, titulo, singular, columnas, campos }) {
    this.api = api;
    this.dialogo = dialogo;
    this.notificar = notificar;
    this.ruta = ruta;
    this.titulo = titulo;
    this.singular = singular;
    this.columnas = columnas;
    this.campos = campos;
    this.registros = [];
    this.editandoId = null;
  }

  async mostrar(contenedor) {
    contenedor.innerHTML = `
      <div class="cabecera-modulo">
        <h2>${escapar(this.titulo)}</h2>
        <button type="button" class="boton primario" id="botonNuevo">+ Nuevo ${escapar(this.singular)}</button>
      </div>
      <div class="tabla-contenedor" id="zonaTabla"><p class="vacio">Cargando…</p></div>`;
    this.zonaTabla = contenedor.querySelector('#zonaTabla');
    contenedor.querySelector('#botonNuevo').addEventListener('click', () => this.abrirFormulario());
    this.zonaTabla.addEventListener('click', (evento) => this.manejarClicTabla(evento));
    await this.cargar();
  }

  // GET: consulta los registros
  async cargar() {
    try {
      this.registros = await this.api.get(this.ruta);
      this.dibujarTabla();
    } catch (error) {
      this.zonaTabla.innerHTML = '<p class="vacio">No se pudieron cargar los datos.</p>';
      this.notificar(error.message, 'error');
    }
  }

  dibujarTabla() {
    if (this.registros.length === 0) {
      this.zonaTabla.innerHTML = '<p class="vacio">Aún no hay registros. Crea el primero con el botón “Nuevo”.</p>';
      return;
    }
    const encabezados = this.columnas
      .map((c) => `<th scope="col">${escapar(c.etiqueta)}</th>`)
      .join('');
    const filas = this.registros.map((registro) => {
      const celdas = this.columnas.map((c) => `<td>${this.formatearCelda(c, registro)}</td>`).join('');
      const botonEliminar = this.puedeEliminar(registro)
        ? `<button type="button" class="boton peligro pequeno" data-accion="eliminar" data-id="${registro.id}">Eliminar</button>`
        : '';
      return `<tr>${celdas}<td><div class="acciones-fila">
        <button type="button" class="boton secundario pequeno" data-accion="editar" data-id="${registro.id}">Editar</button>
        ${botonEliminar}</div></td></tr>`;
    }).join('');
    this.zonaTabla.innerHTML = `<table>
      <thead><tr>${encabezados}<th scope="col">Acciones</th></tr></thead>
      <tbody>${filas}</tbody></table>`;
  }

  formatearCelda(columna, registro) {
    const valor = registro[columna.clave];
    return columna.formato ? columna.formato(valor, registro) : escapar(valor);
  }

  puedeEliminar(registro) {
    return true;
  }

  manejarClicTabla(evento) {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === 'editar') {
      this.abrirFormulario(this.registros.find((r) => r.id === id));
    } else if (boton.dataset.accion === 'eliminar') {
      this.eliminar(id);
    }
  }

  abrirFormulario(registro = null) {
    const esEdicion = registro !== null;
    this.editandoId = esEdicion ? registro.id : null;
    this.dialogo.querySelector('#dialogoTitulo').textContent =
      `${esEdicion ? 'Editar' : 'Nuevo'} ${this.singular}`;
    this.dialogo.querySelector('#camposFormulario').innerHTML =
      this.campos.map((campo) => this.dibujarCampo(campo, registro)).join('');
    this.dialogo.querySelector('#errorFormulario').hidden = true;
    this.dialogo.querySelector('form').onsubmit = (evento) => this.guardar(evento);
    this.dialogo.querySelector('#cancelarDialogo').onclick = () => this.dialogo.close();
    this.dialogo.showModal();
  }

  dibujarCampo(campo, registro) {
    const esEdicion = registro !== null;
    const valor = esEdicion ? registro[campo.nombre] : campo.valorInicial;
    const id = `campo_${campo.nombre}`;
    const requerido = campo.requerido || (campo.requeridoAlCrear && !esEdicion);
    const atributos = `id="${id}" name="${campo.nombre}" ${requerido ? 'required' : ''}`;

    if (campo.tipo === 'checkbox') {
      return `<div class="campo campo-check"><label>
        <input type="checkbox" id="${id}" name="${campo.nombre}" ${valor ? 'checked' : ''}>
        ${escapar(campo.etiqueta)}</label></div>`;
    }

    let control;
    if (campo.tipo === 'textarea') {
      control = `<textarea ${atributos} rows="3">${escapar(valor)}</textarea>`;
    } else if (campo.tipo === 'select') {
      const opciones = campo.opciones
        .map((o) => `<option value="${escapar(o.valor)}" ${o.valor === valor ? 'selected' : ''}>${escapar(o.texto)}</option>`)
        .join('');
      control = `<select ${atributos}>${opciones}</select>`;
    } else {
      const valorTexto = campo.tipo === 'password' ? '' : escapar(valor);
      const minimo = campo.min !== undefined ? `min="${campo.min}"` : '';
      control = `<input type="${campo.tipo}" ${atributos} value="${valorTexto}" ${minimo} maxlength="${campo.max || 255}">`;
    }
    const ayuda = esEdicion && campo.ayudaEdicion ? `<small>${escapar(campo.ayudaEdicion)}</small>` : '';
    return `<div class="campo"><label for="${id}">${escapar(campo.etiqueta)}${requerido ? ' *' : ''}</label>${control}${ayuda}</div>`;
  }

  leerFormulario(esEdicion) {
    const datos = {};
    for (const campo of this.campos) {
      const elemento = this.dialogo.querySelector(`#campo_${campo.nombre}`);
      if (campo.tipo === 'checkbox') {
        datos[campo.nombre] = elemento.checked;
      } else if (campo.tipo === 'number') {
        datos[campo.nombre] = Number(elemento.value);
      } else if (campo.tipo === 'password') {
        if (esEdicion && elemento.value === '') continue;
        datos[campo.nombre] = elemento.value;
      } else {
        datos[campo.nombre] = elemento.value.trim();
      }
    }
    return datos;
  }

  // POST (crear) o PUT (actualizar)
  async guardar(evento) {
    evento.preventDefault();
    const esEdicion = this.editandoId !== null;
    const datos = this.leerFormulario(esEdicion);
    try {
      if (esEdicion) {
        await this.api.put(`${this.ruta}/${this.editandoId}`, datos);
      } else {
        await this.api.post(this.ruta, datos);
      }
      this.dialogo.close();
      this.notificar(esEdicion ? 'Cambios guardados correctamente.' : 'Registro creado correctamente.', 'exito');
      await this.cargar();
    } catch (error) {
      const zonaError = this.dialogo.querySelector('#errorFormulario');
      zonaError.textContent = error.message;
      zonaError.hidden = false;
    }
  }

  // DELETE
  async eliminar(id) {
    if (!confirm(`¿Seguro que quieres eliminar este ${this.singular}? Esta acción no se puede deshacer.`)) return;
    try {
      await this.api.delete(`${this.ruta}/${id}`);
      this.notificar('Registro eliminado correctamente.', 'exito');
      await this.cargar();
    } catch (error) {
      this.notificar(error.message, 'error');
    }
  }
}
