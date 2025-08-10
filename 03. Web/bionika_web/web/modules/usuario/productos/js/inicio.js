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
    const idSucursal = parseInt(localStorage.getItem("idSucursal")) || 1;
    let url = `http://localhost:8080/bionika_web/api/producto/getAll?idSucursal=${idSucursal}`;
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
  <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-300 p-4 flex flex-col items-center space-y-3">
    <img src="data:image/jpeg;base64,${p.foto}" alt="Producto"
         class="w-full h-56 object-cover rounded-md" />
    <div class="w-full text-left">
      <h2 class="text-sm font-bold text-gray-900">${p.nombre}</h2>
      <p class="text-xs text-gray-500">${p.descripcion}</p>
      <p class="text-base font-bold text-gray-800 mt-1">$${p.precio}</p>
    </div>
    <button onclick="verDetalle(${p.idProducto})"
            class="self-end text-black hover:text-purple-600 transition" title="Ver más">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 12H9m6 0l-3-3m3 3l-3 3" />
      </svg>
    </button>
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

    const coloresMap = {
        "ROJO": "#dc2626",
        "AZUL": "#3b82f6",
        "VERDE": "#16a34a",
        "NEGRO": "#000000",
        "BLANCO": "#ffffff",
        "GRIS": "#6b7280",
        "AMARILLO": "#facc15",
        "MORADO": "#8b5cf6",
        "NARANJA": "#f97316",
        "BEIGE": "#d1bc8a"
    };

    let detallesHTML = "";
    if (producto.detalles && producto.detalles.length > 0) {
        detallesHTML += `<ul class="mt-3 space-y-2 text-left text-sm text-gray-700 max-h-56 overflow-y-auto pr-2">`;
        producto.detalles.forEach(d => {
            const hayStock = d.stock > 0;
            const colorHex = coloresMap[d.nombreColor?.toUpperCase()] || "#d1d5db";
            detallesHTML += `
                <li class="flex items-center gap-3">
                    <div class="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style="background-color:${colorHex};"></div>
                    <span class="text-sm">
                        <strong>Talla:</strong> ${d.nombreTalla}, 
                        <strong>Stock:</strong> 
                        <span class="text-purple-800 font-semibold">
                            ${hayStock ? 'Disponible' : 'No disponible'}
                        </span>
                    </span>
                </li>`;
        });
        detallesHTML += `</ul>`;
    } else {
        detallesHTML = `<p class="text-sm text-gray-500 italic mt-2">No hay detalles disponibles.</p>`;
    }

    Swal.fire({
        title: `<span class="text-black font-bold text-xl">${producto.nombre}</span>`,
        html: `
            <div class="text-center">
                <img src="data:image/jpeg;base64,${producto.foto}" 
                     alt="Imagen" 
                     class="mx-auto w-full h-52 object-cover rounded-lg shadow-md transform hover:scale-105 transition duration-300 mb-4">
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
                    <h3 class="text-md font-semibold text-purple-800 mb-2">Disponibilidad por combinación:</h3>
                    ${detallesHTML}
                </div>
            </div>
        `,
        width: 620,
        showCloseButton: true,
        showConfirmButton: false,
        background: 'linear-gradient(to bottom, #fdfcfe, #f4f0fa)',
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
  <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-300 p-4 flex flex-col items-center space-y-3 ring-1 ring-offset-2 ring-gray-300">
    <img src="data:image/jpeg;base64,${lista[i].foto}" alt="Producto"
         class="w-full h-56 object-cover rounded-md" />
    <div class="w-full text-left">
      <h2 class="text-sm font-bold text-gray-900">${lista[i].nombre}</h2>
      <p class="text-xs text-gray-500">${lista[i].descripcion ?? ''}</p>
      <p class="text-base font-bold text-gray-800 mt-1">$${lista[i].precio}</p>
    </div>
    <button onclick="verDetalle(${lista[i].idProducto})"
            class="self-end text-black hover:text-purple-600 transition" title="Ver más">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 12H9m6 0l-3-3m3 3l-3 3" />
      </svg>
    </button>
  </div>
`;
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