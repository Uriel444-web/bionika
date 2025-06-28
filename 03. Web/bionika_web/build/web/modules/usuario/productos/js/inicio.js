let productos = [];
let categorias = [];
let tallas = [];
let colores = [];
// document.getElementById("btnRegresar").addEventListener('click', regresar);
document.getElementById("iconoRegistrarVenta").addEventListener('click', venta);
export async function inicializar() {
    cargarProductos();
    cargarCategorias();
    setDetalleVisible(false);
    document.getElementById("btnRegresar").addEventListener('click', regresar);
}

// funcion para cargar el modulo de venta
export async function venta() {
    console.log("cargando modulo venta");
    let url = "http://localhost:8080/bionika_web/modules/ventas/venta.html";
    let resp = await fetch(url);
    let contenido = await resp.text();
    document.getElementById('content').innerHTML = contenido;
    cm = await import("http://localhost:8080/bionika_web/modules/ventas/venta.js");
    cm = null;

    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
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
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-purple-100 transition-transform hover:scale-[1.02] duration-300">
    <img src="data:image/jpeg;base64,${p.foto}" alt="Producto"
         class="w-full h-40 object-cover transition-opacity hover:opacity-90" />
    <div class="p-4 text-center">
      <h2 class="text-base font-semibold text-gray-800 tracking-wide">${p.nombre}</h2>
      <p class="text-sm text-purple-700 font-medium mt-1">$${p.precio}</p>
      <button onclick="verDetalle(${p.idProducto})"
              class="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 text-sm rounded-md shadow transition">
        Ver Detalles
      </button>
    </div>
  </div>
`;
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
            <ul class="mt-2 space-y-2 text-left text-sm text-gray-700">`;
        producto.detalles.forEach(d => {
            detallesHTML += `
                <li class="flex items-start gap-2">
                    <svg class="h-4 w-4 text-purple-500 mt-1" fill="none" stroke="currentColor" stroke-width="2"
                         viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>
                        <strong>Talla:</strong> ${d.nombreTalla}, 
                        <strong>Color:</strong> ${d.nombreColor}, 
                        <strong>Disponibilidad:</strong> ${d.stock}
                    </span>
                </li>`;
        });
        detallesHTML += `</ul>`;
    } else {
        detallesHTML = `<p class="text-sm text-gray-500 italic mt-2">No hay detalles disponibles.</p>`;
    }

    Swal.fire({
        title: `<span class="text-purple-700 font-bold text-xl">${producto.nombre}</span>`,
        html: `
            <div class="text-center">
                <img src="data:image/jpeg;base64,${producto.foto}" 
                     alt="Imagen" 
                     class="mx-auto w-full h-52 object-cover rounded-lg shadow-lg transform hover:scale-105 transition duration-300 mb-4">
                <p class="inline-block bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 font-semibold px-4 py-1 rounded-full shadow text-sm mb-2">
                    $${producto.precio}
                </p>
                <div class="bg-purple-50 border border-purple-200 rounded-md p-3 text-sm text-gray-700 mb-4 flex items-start gap-2">
                    <svg class="w-4 h-4 text-purple-500 mt-1" fill="none" stroke="currentColor" stroke-width="2"
                         viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 20h9M12 4h9M4 9h16M4 15h16"/>
                    </svg>
                    <span><strong>Descripción:</strong> ${producto.descripcion}</span>
                </div>
                <div class="text-left">
                    <h3 class="text-md font-semibold text-purple-800">Disponibilidad por combinación:</h3>
                    ${detallesHTML}
                </div>
            </div>
        `,
        width: 620,
        showCloseButton: true,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: {
            popup: 'rounded-xl shadow-lg',
            title: 'mb-2'
        }
    });
}


async function cargarCategorias() {
    let url = "http://localhost:8080/bionika_web/api/producto/getAllCategorias";
    let resp = await fetch(url);
    let datos = await resp.json();

    if (datos.error)
        return;

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
    } else
    {
        document.getElementById("divDetalle").style.display = 'none';
        document.getElementById("divCatalogo").style.display = '';
    }
}

export function regresar() {
    console.log("se oprimio el boton");
    setDetalleVisible(false);
}

// funcion para cargar combo box tallas
async function cargarTallas() {
    let url = "http://localhost:8080/bionika_web/api/producto/getAllTallas";
    let resp = await fetch(url);
    let datos = await resp.json();

    if (datos.error)
        return;

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

    if (datos.error)
        return;

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

// funcion para buscar producto por nombre o clave
export async function buscarProductoPorTexto() {
    let texto = document.getElementById("txtBuscar").value.trim();

    // Si el campo está vacío, mostrar todos los productos
    if (texto === "") {
        productosDef();
        return;
    }

    let url = `http://localhost:8080/bionika_web/api/producto/buscar/${encodeURIComponent(texto)}`;

    try {
        let resp = await fetch(url);
        let productos = await resp.json();

        if (!productos || productos.length === 0 || productos.error) {
            document.getElementById("productosContainer").innerHTML = `
                <div class="col-span-full text-center text-red-500 font-semibold">No se encontraron productos.</div>
            `;
            return;
        }

        mostrarProductos(productos);
    } catch (e) {
        console.error(e);
        document.getElementById("productosContainer").innerHTML = `
            <div class="col-span-full text-center text-red-500 font-semibold">Error al buscar productos.</div>
        `;
    }
}


window.verDetalle = verDetalle;
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;
window.buscarProductoPorTexto = buscarProductoPorTexto;