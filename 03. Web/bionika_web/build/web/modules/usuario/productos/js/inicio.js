let productos = [];
let categorias = [];
let tallas = [];
let colores = [];
// document.getElementById("btnRegresar").addEventListener('click', regresar);
export async function inicializar(){
    cargarProductos();
    cargarCategorias();
    setDetalleVisible(false);
    document.getElementById("btnRegresar").addEventListener('click', regresar);
}

// CARGAR PRODUCTOS PARA VISTA DE USUARIO
export async function cargarProductos() {
    let url = "http://localhost:8080/bionika_web/api/producto/getAll";
    let resp = await fetch(url);
    let data = await resp.json();

    if (data.error) {
        Swal.fire("Error", data.error, "error");
        return;
    }

    productos = data.productos;
    let contenido = '';

    productos.forEach(p => {
        contenido += `
            <div class="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
                <img src="data:image/jpeg;base64,${p.foto}" alt="Producto" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold text-black-700">${p.nombre}</h2>
                    <p class="text-purple-800 font-bold mt-2">$${p.precio}</p>
                    <div class="flex gap-2 mt-4">
                        <button onclick="verDetalle(${p.idProducto})"
                                class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>`;
    });

    document.getElementById('productosContainer').innerHTML = contenido;
}


function verDetalle(idProducto) {
    const producto = productos.find(p => p.idProducto === idProducto);
    if (!producto) {
        Swal.fire("Error", "Producto no encontrado", "error");
        return;
    }

    let detallesHTML = "";
    if (producto.detalles && producto.detalles.length > 0) {
        detallesHTML += `
            <ul class="list-disc text-left ml-6 text-sm text-gray-700">`;
        producto.detalles.forEach(d => {
            detallesHTML += `<li><strong>Talla:</strong> ${d.nombreTalla}, <strong>Color:</strong> ${d.nombreColor}, <strong>Stock:</strong> ${d.stock}</li>`;
        });
        detallesHTML += `</ul>`;
    } else {
        detallesHTML = `<p class="text-sm text-gray-500">No hay detalles disponibles.</p>`;
    }

    Swal.fire({
        title: producto.nombre,
        html: `
            <img src="data:image/jpeg;base64,${producto.foto}" alt="Imagen" class="w-full h-48 object-cover rounded-md mb-3">
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion}</p>
            <div class="mt-3">
                <h3 class="font-semibold text-gray-800">Disponibilidad:</h3>
                ${detallesHTML}
            </div>
        `,
        width: 600,
        showCloseButton: true,
        showConfirmButton: false,
        background: '#fefefe',
    });
}

async function cargarCategorias() {
  let url = "http://localhost:8080/bionika_web/api/producto/getAllCategorias";
  let resp = await fetch(url);
  let datos = await resp.json();

  if (datos.error) return;

  categorias = datos;
  let select = document.getElementById("categoria");
  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat.idCategoria}">${cat.nombre}</option>`;
  });
}

export function filtrarPorCategoria() {
  let idCat = parseInt(document.getElementById("categoria").value);
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
            <div class="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
                <img src="data:image/jpeg;base64,${lista[i].foto}" alt="Producto" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold text-black-700">${lista[i].nombre}</h2>
                    <p class="text-purple-800 font-bold mt-2">$${lista[i].precio}</p>
                    <div class="flex gap-2 mt-4">
                        <button onclick="verDetalle(${lista[i].idProducto})"
                                class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>`;
  }
  document.getElementById('productosContainer').innerHTML = contenido;
}


export function setDetalleVisible(value)
{
    if (value)
    {
        document.getElementById("divCatalogo").style.display = 'none';
        document.getElementById("divDetalle").style.display = '';
    }
    else
    {
        document.getElementById("divDetalle").style.display = 'none';
        document.getElementById("divCatalogo").style.display = '';
    }
}

export function regresar(){
    console.log("se oprimio el boton");
    setDetalleVisible(false);
}

// funcion para cargar combo box tallas
async function cargarTallas() {
  let url = "http://localhost:8080/bionika_web/api/producto/getAllTallas";
  let resp = await fetch(url);
  let datos = await resp.json();

  if (datos.error) return;

  tallas = datos;

  let selectTalla = document.getElementById("selectTalla");
  selectTalla.innerHTML = '<option value="">Seleccione</option>';
  tallas.forEach(talla => {
    selectTalla.innerHTML += `<option value="${talla.idTalla}">${talla.nombre}</option>`;
  });
}

// funcion para cargar combo box colores
async function cargarColores() {
  let url = "http://localhost:8080/bionika_web/api/producto/getAllColores";
  let resp = await fetch(url);
  let datos = await resp.json();

  if (datos.error) return;

  colores = datos;

  let selectColor = document.getElementById("selectColor");
  selectColor.innerHTML = '<option value="">Seleccione</option>';
  colores.forEach(color => {
    selectColor.innerHTML += `<option value="${color.idColor}">${color.nombre}</option>`;
  });
}

function renderizarTablaDetalles() {
  const tbody = document.getElementById("tablaDetalles");
  tbody.innerHTML = "";

  detallesStock.forEach((detalle, index) => {
    let talla = tallas.find(t => t.idTalla == detalle.idTalla);
    let color = colores.find(c => c.idColor == detalle.idColor);

    let nombreTalla = talla ? talla.nombre : "Desconocido";
    let nombreColor = color ? color.nombre : "Desconocido";


    tbody.innerHTML += `
      <tr>
        <td class="px-4 py-2 border">${nombreTalla}</td>
        <td class="px-4 py-2 border">${nombreColor}</td>
        <td class="px-4 py-2 border">${detalle.stock}</td>
        <td class="px-4 py-2 border text-center space-x-1">
          <button onclick="actualizarDetalleStock(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Actualizar</button>
          <button onclick="eliminarDetalleStock(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

window.verDetalle = verDetalle;
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;