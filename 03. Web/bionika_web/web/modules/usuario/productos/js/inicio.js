let productos = [];
let categorias = [];

// document.getElementById("btnRegresar").addEventListener('click', regresar);
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
  }else{
      productos = datos;
        for (var i = 0; i < productos.length; i++) {
            contenido += `
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-purple-700">${productos[i].nombre}</h2>
          <p class="text-gray-600 mt-2">${productos[i].descripcion}</p>
          <p class="text-purple-800 font-bold mt-2">$${productos[i].precio}</p>
          <p class="text-sm text-gray-500">Stock: ${productos[i].stock}</p>
          <p class="text-sm text-gray-500">Categoría: ${productos[i].categoria.nombre}</p>
          <button onclick="verDetalle(${i})"
                  class="mt-3 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
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
  //const p = productos.find(prod => prod.idProducto === idProducto);
  let p = productos[pos];
  console.log("datos recibidos...");
  console.log(p);
    if (p==null) {
        console.log("no se encontraron los datos");
    }
    else{
        setDetalleVisible(true);
        // Usamos innerText en vez de .value porque son etiquetas de texto, no inputs
        document.getElementById("txtNombreProducto").innerText = p.nombre;
        document.getElementById("txtCategoria").innerText = "Categoría: " + p.categoria.nombre;
        document.getElementById("txtDescripcion").innerText = p.descripcion;
        document.getElementById("txtPrecio").innerText = "Precio: $" + p.precio;
        document.getElementById("txtStock").innerText = "Stock disponible: " + p.stock;
        
    }
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
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-purple-700">${lista[i].nombre}</h2>
          <p class="text-gray-600 mt-2">${lista[i].descripcion}</p>
          <p class="text-purple-800 font-bold mt-2">$${lista[i].precio}</p>
          <p class="text-sm text-gray-500">Stock: ${lista[i].stock}</p>
          <p class="text-sm text-gray-500">Categoría: ${lista[i].categoria.nombre}</p>
          <button onclick="verDetalle(${i})"
                  class="mt-3 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
            Ver Detalles
          </button>
        </div>
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

window.verDetalle = verDetalle;
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;