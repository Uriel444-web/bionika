let productos = [];
let categorias = [];

export async function inicializar(){
    cargarProductos();
    setDetalleVisible(false);
    document.getElementById("btnRegresar").addEventListener('click', regresar);
}

export async function cargarProductos() {
  let url = "http://localhost:8080/bionika_web/api/producto/getAll";
  let resp = await fetch(url);
  let datos = await resp.json();

  let contenido = '';

  if (datos.error) {
    Swal.fire('Error', datos.error, 'error');
    return;
  } else {
    productos = datos;
    for (let i = 0; i < productos.length; i++) {
      contenido += `
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <img src="${productos[i].foto}" alt="Producto" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-purple-700">${productos[i].nombre}</h2>
            <p class="text-gray-600 mt-2">${productos[i].descripcion}</p>
            <p class="text-purple-800 font-bold mt-2">$${productos[i].precio}</p>
            <p class="text-sm text-gray-500">Stock: ${productos[i].stock}</p>
            <p class="text-sm text-gray-500">Categoría: ${productos[i].categoria.nombre}</p>
            <div class="flex gap-2 mt-4">
              <button onclick="verDetalle(${i})"
                      class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                Ver Detalles
              </button>
          </div>
        </div>
      `;
    }
  }

  document.getElementById('productosContainer').innerHTML = contenido;
  cargarCategorias();
}

export function verDetalle(pos) {
  let p = productos[pos];
  console.log("datos recibidos...");
  console.log(p);

  if (!p) {
    console.log("no se encontraron los datos");
    return;
  }

  setDetalleVisible(true);

  document.getElementById("txtNombreProducto").value = p.nombre;
  document.getElementById("txtDescripcion").value = p.descripcion;
  document.getElementById("txtPrecio").value = p.precio;
  document.getElementById("txtStock").value = p.stock;

  // Cargar categorías con la seleccionada por defecto
  cargarCategorias(p.categoria.idCategoria);
}


async function cargarCategorias(idCategoriaSeleccionada = null) {
  let url = "http://localhost:8080/bionika_web/api/producto/getAllCategorias";
  let resp = await fetch(url);
  let datos = await resp.json();

  if (datos.error) return;

  categorias = datos;

  // Para filtro
  let selectFiltro = document.getElementById("categoriaFiltro");
  selectFiltro.innerHTML = '<option value="0">Todas</option>';
  categorias.forEach(cat => {
    selectFiltro.innerHTML += `<option value="${cat.idCategoria}">${cat.nombre}</option>`;
  });

  // Para detalle
  let selectDetalle = document.getElementById("categoriaDetalle");
  selectDetalle.innerHTML = '';
  categorias.forEach(cat => {
    let selected = (cat.idCategoria === idCategoriaSeleccionada) ? 'selected' : '';
    selectDetalle.innerHTML += `<option value="${cat.idCategoria}" ${selected}>${cat.nombre}</option>`;
  });
}


export function filtrarPorCategoria() {
  let idCat = parseInt(document.getElementById("categoriaFiltro").value);
  if (idCat === 0) {
    mostrarProductos(productos);
  } else {
    let filtrados = productos.filter(p => p.categoria.idCategoria === idCat);
    mostrarProductos(filtrados);
  }
}


export function mostrarProductos(lista) {
  let contenido = '';
  for (let i = 0; i < lista.length; i++) {
    contenido += `
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <img src="${lista[i].foto}" alt="Producto" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-purple-700">${lista[i].nombre}</h2>
          <p class="text-gray-600 mt-2">${lista[i].descripcion}</p>
          <p class="text-purple-800 font-bold mt-2">$${lista[i].precio}</p>
          <p class="text-sm text-gray-500">Stock: ${lista[i].stock}</p>
          <p class="text-sm text-gray-500">Categoría: ${lista[i].categoria.nombre}</p>
          <div class="flex gap-2 mt-4">
            <button onclick="verDetalle(${i})"
                    class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById('productosContainer').innerHTML = contenido;
}

export function setDetalleVisible(value) {
  document.getElementById("divDetalle").style.display = value ? '' : 'none';
  document.getElementById("divCatalogo").style.display = value ? 'none' : '';
}

export function regresar() {
  setDetalleVisible(false);
}

// Funciones futuras para editar y eliminar (por implementar)


window.eliminarProducto = async function (pos) {
  let producto = productos[pos];
  const confirm = await Swal.fire({
    title: "¿Eliminar producto?",
    text: `¿Deseas eliminar "${producto.nombre}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (confirm.isConfirmed) {
    // Aquí iría el DELETE al backend
    Swal.fire("Eliminado", `"${producto.nombre}" ha sido eliminado.`, "success");
    // Recargar lista
    cargarProductos();
  }
};
window.verDetalle = verDetalle;
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;