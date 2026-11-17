export function escapar(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function etiquetaEstado(activo) {
  return activo
    ? '<span class="etiqueta ok">✔ Activo</span>'
    : '<span class="etiqueta inactivo">✖ Inactivo</span>';
}

export function formatearFecha(valor) {
  return escapar(new Date(valor).toLocaleString('es-CO'));
}
