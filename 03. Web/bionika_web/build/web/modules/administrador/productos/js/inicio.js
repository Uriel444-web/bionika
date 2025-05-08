let productos = [];
let categorias = [];
let inputFileFotoProducto = null;

export async function inicializar(){
    cargarProductos();
    setDetalleVisible(false);
    document.getElementById("btnRegresar").addEventListener('click', regresar);
    // boton para guardar
    document.getElementById("btnSave").addEventListener('click', save);
    // boton para limpiar campos
    document.getElementById("btnLimpiar").addEventListener('click', limpiar);
    // Se obtiene el <input> de tipo file asociado con la foto del producto:
    inputFileFotoProducto = document.getElementById("inputFoto");
    // Se agrega un oyente para cuando el usuario seleccione un archivo,
    // se invoque a la funcion "cargarFotografia()":
    inputFileFotoProducto.onchange = function(evt){cargarFotografia();};
    // Agregamos un oyente al boton que permite al usuario cargar una imagen
    // para que cuando lo presione, se active el <input> de tipo file:
    document.getElementById("btnCargarFoto").onclick = function(evt) { inputFileFotoProducto.click(); };
}
document.getElementById("btnNew").addEventListener('click', nuevoProducto);
export async function save(){
    let url = "http://localhost:8080/bionika_web/api/producto/save";
    let producto = {
        idProducto:0,
        foto : document.getElementById("txtaFoto").value,
        nombre : document.getElementById("txtNombreProducto").value,
        descripcion : document.getElementById("txtDescripcion").value,
        precio : parseFloat(document.getElementById("txtPrecio").value),
        stock : parseInt(document.getElementById("txtStock").value),
        codigoInterno : document.getElementById("txtCodigoInterno").value,
        categoria : {
           idCategoria : parseInt(document.getElementById("categoriaDetalle").value) 
        }
    };
    
    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;
    // vemos si el valor del id es 0 para saber si es  crear o actualizar
     if (document.getElementById("txtIdProducto").value.trim() != '')
    {
        producto.idProducto = parseInt(document.getElementById("txtIdProducto").value.trim());
    }
    datos = {datosProducto : JSON.stringify(producto)};
    params = new URLSearchParams(datos);
    opciones =  {
                    method  : "POST",
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body    : params
                };
    
    resp = await fetch(url, opciones);
    data = await resp.json();
    
    if (data.error != null)
    {
        console.log(data.error);
    }else{
        document.getElementById("txtIdProducto").value = data.idProducto;
        cargarProductos();
        // muestra alerta de que se realizo correctamente la operacion
        Swal.fire({
                        icon: "success",
                        title: "Realizado",
                        text: "Datos insertados correctamente."
                    });
    }
}

// CARGAR LOS PRODUCTOS GETALL
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
          <img src="data:image/jpeg;base64,${productos[i].foto}" alt="Producto" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-black-700">${productos[i].nombre}</h2>
            <p class="text-gray-600 mt-2">${productos[i].descripcion}</p>
            <p class="text-purple-800 font-bold mt-2">$${productos[i].precio}</p>
            <p class="text-sm text-gray-500">Stock: ${productos[i].stock}</p>
            <p class="text-sm text-gray-500">Categoría: ${productos[i].categoria.nombre}</p>
            <div class="flex gap-2 mt-4">
              <button onclick="verDetalle(${productos[i].idProducto})"
                      class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }
  document.getElementById('productosContainer').innerHTML = contenido;
  cargarCategorias();
}

// funcion para ver el detalle del producto
export function verDetalle(idProducto) {
  let p = productos.find(p => p.idProducto === idProducto);
  console.log("Producto encontrado:");

  if (!p) {
    console.log("no se encontraron los datos");
    return;
  }
  cargarFotografia();
  setDetalleVisible(true);
  
  document.getElementById("btnEliminar").style.display = "inline-block";
  document.getElementById("txtIdProducto").value = p.idProducto;
  document.getElementById("txtNombreProducto").value = p.nombre;
  document.getElementById("txtDescripcion").value = p.descripcion;
  document.getElementById("txtPrecio").value = p.precio;
  document.getElementById("txtStock").value = p.stock;
  document.getElementById("txtCodigoInterno").value = p.codigoInterno;
  // Cargar categorías con la seleccionada por defecto
  cargarCategorias(p.categoria.idCategoria);
  
  if (p.foto != null) {
    document.getElementById("txtaFoto").value = p.foto;
    document.getElementById("imgFoto").src = `data:image/jpeg;base64,${p.foto}`;
} else {
    document.getElementById("txtaFoto").value = '';
    document.getElementById("imgFoto").src = ''; // Limpia la imagen
}
document.getElementById("inputFoto").value = ''; // Limpiar input file
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
        <img src="data:image/jpeg;base64,${lista[i].foto}" alt="Producto" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-black-700">${lista[i].nombre}</h2>
          <p class="text-gray-600 mt-2">${lista[i].descripcion}</p>
          <p class="text-purple-800 font-bold mt-2">$${lista[i].precio}</p>
          <p class="text-sm text-gray-500">Stock: ${lista[i].stock}</p>
          <p class="text-sm text-gray-500">Categoría: ${lista[i].categoria.nombre}</p>
          <div class="flex gap-2 mt-4">
            <button onclick="verDetalle(${lista[i].idProducto})"
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

function cargarFotografia()
{
    console.log('se activo cargar foto');
    //Revisamos que el usuario haya seleccionado un archivo:
    if (inputFileFotoProducto.files && inputFileFotoProducto.files[0]) 
    {
        let reader = new FileReader();

        //Agregamos un oyente al lector del archivo para que,
        //en cuanto el usuario cargue una imagen, esta se lea
        //y se convierta de forma automatica en una cadena de Base64:
        reader.onload = function (e) 
        {
            let fotoB64 = e.target.result;
            document.getElementById("imgFoto").src = fotoB64;            
            document.getElementById("txtaFoto").value = 
                    fotoB64.substring(fotoB64.indexOf(",") + 1, fotoB64.length);
        };

        //Leemos el archivo que selecciono el usuario y lo
        //convertimos en una cadena con la Base64:
        reader.readAsDataURL(inputFileFotoProducto.files[0]);            
    }
}

// funcion para limpiar los campos
function limpiar(){
    document.getElementById("txtIdProducto").value = "";
    document.getElementById("txtNombreProducto").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtStock").value = "";
    document.getElementById("txtCodigoInterno").value = "";
    document.getElementById("categoriaDetalle").selectedIndex = 0;
    document.getElementById("imgFoto").src = "";
    document.getElementById("txtaFoto").value = "";
    document.getElementById("inputFoto").value = "";
}

// Funcion para crear nuevo producto
function nuevoProducto() {
    setDetalleVisible(true);   // Mostrar la vista de detalle
    limpiar();           // Limpiar todos los campos
    document.getElementById("btnSave").style.display = "inline-block";
    document.getElementById("btnRegresar").style.display = "inline-block";
    document.getElementById("btnLimpiar").style.display = "inline-block";
    document.getElementById("btnEliminar").style.display = "none"; // Ocultar botón Eliminar
}

// Funciones para eliminar producto

window.eliminarProducto = async function (pos) {
    let idProducto = parseInt(document.getElementById("txtIdProducto").value);
    let filtrado = productos.find(p => p.idProducto === idProducto);

    const confirm = await Swal.fire({
        title: "¿Eliminar producto?",
        text: `¿Deseas eliminar "${filtrado.nombre}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
        let url = 'http://localhost:8080/bionika_web/api/producto/delete';
        let datos = new URLSearchParams({ idProducto });

        try {
            let resp = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: datos
            });

            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

            let data = await resp.json();
            if (data.eliminado === "ok") {
                Swal.fire("Eliminado", `"${filtrado.nombre}" ha sido eliminado.`, "success");
                cargarProductos();
                setDetalleVisible(false);
            } else {
                Swal.fire("Error", "No se pudo eliminar el producto.", "error");
            }

        } catch (error) {
            console.error(error.message);
            Swal.fire("Error", "Ocurrió un error al eliminar.", "error");
        }
    }
};

window.verDetalle = verDetalle;
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;
window.cargarFotografia = cargarFotografia;