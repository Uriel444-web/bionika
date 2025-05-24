let productos = [];
let categorias = [];
let tallas = [];
let colores = [];
let productosFiltrados = productos; // el valor inicial va a ser todos los productos para que no cause conflictos
let inputFileFotoProducto = null;

export async function inicializar(){
    cargarProductos();
    cargarColores();
    cargarTallas();
    cargarCategorias();
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
//boton para hacer que cada que se de click se va a guardar en un arreglo local la talla, color y stock
document.getElementById("btnAgregarDetalle").addEventListener('click', agregarDetalleStock);
//boton para generar el reporte pdf con su codigo interno del producto y sus detalles
document.getElementById("btnReporte").addEventListener('click', enviar);

// funcion para guardar y a la vez actualizar.
export async function save() {
    // definimos la ruta que se ejecutara.
    const url = "http://localhost:8080/bionika_web/api/producto/save";

    // Obtenemos los datos del formulario
    const idProducto = parseInt(document.getElementById("txtIdProducto").value) || 0;
    const foto = document.getElementById("txtaFoto").value;
    const nombre = document.getElementById("txtNombreProducto").value;
    const descripcion = document.getElementById("txtDescripcion").value;
    const precio = parseFloat(document.getElementById("txtPrecio").value) || 0;
    const codigoInterno = document.getElementById("txtCodigoInterno").value;
    const idCategoria = parseInt(document.getElementById("categoriaDetalle").value) || 0;

    // la variable detalles se va a llenar con la función agregarDetalleStock()
    const detalles = window.detallesStock || [];

    // Validaciones de los datos ingresados
    if (!nombre || !codigoInterno || idCategoria === 0 || detalles.length === 0) {
        alert("Completa todos los campos obligatorios y agrega al menos un detalle de stock.");
        return;
    }

   // Transformamos la variable detalles a JSON antes de enviarlos a la api, ya que eso es lo que espera.
    const detallesTransformados = detalles.map(d => ({
    idTalla :   d.idTalla,
    idColor :   d.idColor,
    stock   :   d.stock
    }));
    
    // Aqui construimos el objeto de producto que es el que se enviara a la API.
    const producto = {
    idProducto,
    foto,
    nombre,
    descripcion,
    precio,
    codigoInterno,
    categoria: { idCategoria },
    detalles: detallesTransformados
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
        //cargarProductos();
        // muestra alerta de que se realizo correctamente la operacion
        Swal.fire({
                        icon: "success",
                        title: "Realizado",
                        text: "Datos insertados correctamente."
                    });
        cargarProductos();
    }
}


// CARGAR LOS PRODUCTOS GETALL
//export async function cargarProductos() {
  //let url = "http://localhost:8080/bionika_web/api/producto/getAll";
  //let resp = await fetch(url);
  //let datos = await resp.json();

  //let contenido = '';

  //if (datos.error) {
    //Swal.fire('Error', datos.error, 'error');
    //return;
  //} else {
    //productos = datos;
    //for (let i = 0; i < productos.length; i++) {
      //contenido += `
        //<div class="bg-gray-100 rounded-l-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
          //<img src="data:image/jpeg;base64,${productos[i].foto}" alt="Producto" class="w-full h-48 object-cover">
         // <div class="p-4">
           // <h2 class="text-xl font-semibold text-black-700">${productos[i].nombre}</h2>
           // <p class="text-gray-600 mt-2">${productos[i].descripcion}</p>
            //<p class="text-purple-800 font-bold mt-2">$${productos[i].precio}</p>
            //<p class="text-sm text-gray-500">Stock: ${productos[i].stock}</p>
            //<p class="text-sm text-gray-500">Categoría: ${productos[i].categoria.nombre}</p>
            //<div class="flex gap-2 mt-4">
              //<button onclick="verDetalle(${productos[i].idProducto})"
                //      class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
               // Ver Detalles
              //</button>
            //</div>
          //</div>
        //</div>
     // `;
   // }
 // }
  //document.getElementById('productosContainer').innerHTML = contenido;
 // cargarCategorias();
//}

// funcion para ver el detalle del producto
//export function verDetalle(idProducto) {
  //let p = productos.find(p => p.idProducto === idProducto);
  //console.log("Producto encontrado:");

  //if (!p) {
    //console.log("no se encontraron los datos");
   // return;
  //}
  //cargarFotografia();
  //setDetalleVisible(true);
  
//  document.getElementById("btnEliminar").style.display = "inline-block";
  //document.getElementById("txtIdProducto").value = p.idProducto;
  //document.getElementById("txtNombreProducto").value = p.nombre;
  //document.getElementById("txtDescripcion").value = p.descripcion;
  //document.getElementById("txtPrecio").value = p.precio;
  //document.getElementById("txtStock").value = p.stock;
  //document.getElementById("txtCodigoInterno").value = p.codigoInterno;
  // Cargar categorías con la seleccionada por defecto
 // cargarCategorias(p.categoria.idCategoria);
  
  //if (p.foto != null) {
    //document.getElementById("txtaFoto").value = p.foto;
    //document.getElementById("imgFoto").src = `data:image/jpeg;base64,${p.foto}`;
//} else {
  //  document.getElementById("txtaFoto").value = '';
    //document.getElementById("imgFoto").src = ''; // Limpia la imagen
//}
//document.getElementById("inputFoto").value = ''; // Limpiar input file
//}

// NUEVA FUNCION PARA CARGAR PRODUCTOS
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
        let detallesHTML = '';
        if (p.detalles && p.detalles.length > 0) {
            detallesHTML += `
                <div class="mt-2">
                    <h3 class="font-semibold text-gray-700">Detalles:</h3>
                    <ul class="text-sm text-gray-600 list-disc list-inside">`;

            p.detalles.forEach(d => {
                detallesHTML += `
                    <li>
                        Talla: ${d.nombreTalla}, Color: ${d.nombreColor}, Stock: ${d.stock}
                    </li>`;
            });

            detallesHTML += `
                    </ul>
                </div>`;
        }

        contenido += `
            <div class="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
                <img src="data:image/jpeg;base64,${p.foto}" alt="Producto" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold text-black-700">${p.nombre}</h2>
                    <p class="text-gray-600 mt-2">${p.descripcion}</p>
                    <p class="text-purple-800 font-bold mt-2">$${p.precio}</p>
                    <p class="text-sm text-gray-500">Código: ${p.codigoInterno}</p>
                    <p class="text-sm text-gray-500">Categoría: ${p.categoria.nombre}</p>
                    ${detallesHTML}
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

// NUEVA FUNCION PARA VER DETALLE DEL PRODUCTO
function verDetalle(producto) {
    let p = productos.find(p => p.idProducto === producto);
  //console.log("Producto encontrado:");
    //console.log(p);
    setDetalleVisible(true);
    // Llenar campos principales
    document.getElementById("txtIdProducto").value = p.idProducto;
    document.getElementById("txtNombreProducto").value = p.nombre;
    document.getElementById("txtDescripcion").value = p.descripcion;
    document.getElementById("txtPrecio").value = p.precio;
    document.getElementById("txtCodigoInterno").value = p.codigoInterno;
    if (p.foto != null) {
        document.getElementById("txtaFoto").value = p.foto;
        document.getElementById("imgFoto").src = `data:image/jpeg;base64,${p.foto}`;
    } else {
        document.getElementById("txtaFoto").value = '';
        document.getElementById("imgFoto").src = ''; // Limpia la imagen
    }
    document.getElementById("inputFoto").value = ''; // Limpiar input file

    // Seleccionar la categoría
    const selectCategoria = document.getElementById("categoriaDetalle");
    for (let option of selectCategoria.options) {
        if (parseInt(option.value) === p.categoria.idCategoria) {
            option.selected = true;
            break;
        }
    }
    //p.detalles.forEach(det => {
    // Agregamos los detalles como objetos coherentes con renderizarTablaDetalles
    //detallesStock.push({
    //talla: det.idTalla,
    //color: det.idColor,
    //stock: det.stock
      //  });
    //});
    
    // NUEVA FORMA PARA SUUBIR LOS DATOS AL ARREGLO DETALLESTOCK PARA TENER MEJOR ESTRUCTURA DE LOS DATOS LOL
    p.detalles.forEach(det => {
        let talla = tallas.find(t => t.idTalla === det.idTalla);
        let color = colores.find(c => c.idColor === det.idColor);

        detallesStock.push({
        idTalla: det.idTalla,
        nombreTalla: talla ? talla.nombre : "Desconocido",
        idColor: det.idColor,
        nombreColor: color ? color.nombre : "Desconocido",
        stock: det.stock
        });
    });

    renderizarTablaDetalles(); // llamamos la funcion para cargar la tabla con la informacion de los detalles
    //console.log('detalle del stock: '+detallesStock);
}

// FUNCION PARA CARGAR CATEGORIAS EN EL COMBOBOX
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
    productosFiltrados = productos;
    mostrarProductos(productos);
  } else {
    productosFiltrados = productos.filter(p => p.categoria.idCategoria === idCat);
    mostrarProductos(productosFiltrados); 
  }
}

export function enviar(){
    generarReportePDF(productosFiltrados);
}

//export function mostrarProductos(lista) {
 // let contenido = '';
 // for (let i = 0; i < lista.length; i++) {
   // contenido += `
     // <div class="bg-gray-100 rounded-l-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
       // <img src="data:image/jpeg;base64,${lista[i].foto}" alt="Producto" class="w-full h-48 object-cover">
        //<div class="p-4">
          //<h2 class="text-xl font-semibold text-black-700">${lista[i].nombre}</h2>
          //<p class="text-gray-600 mt-2">${lista[i].descripcion}</p>
          //<p class="text-purple-800 font-bold mt-2">$${lista[i].precio}</p>
          //<p class="text-sm text-gray-500">Stock: ${lista[i].stock}</p>
          //<p class="text-sm text-gray-500">Categoría: ${lista[i].categoria.nombre}</p>
          //<div class="flex gap-2 mt-4">
            //<button onclick="verDetalle(${lista[i].idProducto})"
              //      class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              //Ver Detalles
            //</button>
          //</div>
        //</div>
      //</div>
    //`;
  //}
  //document.getElementById('productosContainer').innerHTML = contenido;
//}

// NUEVO MOSTRARPRODUCTO
export function mostrarProductos(lista) {
    let contenido = '';

    lista.forEach(p => {
        let detallesHTML = '';
        if (p.detalles && p.detalles.length > 0) {
            detallesHTML += `
                <div class="mt-2">
                    <h3 class="font-semibold text-gray-700">Detalles:</h3>
                    <ul class="text-sm text-gray-600 list-disc list-inside">`;

            p.detalles.forEach(d => {
                detallesHTML += `
                    <li>
                        Talla: ${d.nombreTalla}, Color: ${d.nombreColor}, Stock: ${d.stock}
                    </li>`;
            });

            detallesHTML += `
                    </ul>
                </div>`;
        }

        contenido += `
            <div class="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 ring-1 ring-offset-2 ring-gray-400">
                <img src="data:image/jpeg;base64,${p.foto}" alt="Producto" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold text-black-700">${p.nombre}</h2>
                    <p class="text-gray-600 mt-2">${p.descripcion}</p>
                    <p class="text-purple-800 font-bold mt-2">$${p.precio}</p>
                    <p class="text-sm text-gray-500">Código: ${p.codigoInterno}</p>
                    <p class="text-sm text-gray-500">Categoría: ${p.categoria.nombre}</p>
                    ${detallesHTML}
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

export function setDetalleVisible(value) {
  document.getElementById("divDetalle").style.display = value ? '' : 'none';
  document.getElementById("divCatalogo").style.display = value ? 'none' : '';
}

export function regresar() {
  setDetalleVisible(false);
  limpiar();
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

// funcion para limpiar el formulario, imagen el array de detalleStock y la tabla
function limpiar() {
    document.querySelectorAll("#divDetalle input[type='text'], #divDetalle input[type='number']").forEach(input => {
        input.value = "";
    });
    document.querySelectorAll("#divDetalle textarea").forEach(textarea => {
        textarea.value = "";
    });
    document.querySelectorAll("#divDetalle select").forEach(select => {
        select.selectedIndex = 0;
    });
    document.getElementById("imgFoto").src = "";
    document.getElementById("txtaFoto").value = "";
    document.getElementById("inputFoto").value = "";
    if (window.detallesStock) {
        window.detallesStock = [];
    }
    document.getElementById("tablaDetalles").innerHTML = "";
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

// Funciones para eliminar producto
async function eliminarProducto(pos) {
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

function agregarDetalleStock() {
    const idTalla = parseInt(document.getElementById("selectTalla").value);
    const nombreTalla = document.getElementById("selectTalla").options[document.getElementById("selectTalla").selectedIndex].text;

    const idColor = parseInt(document.getElementById("selectColor").value);
    const nombreColor = document.getElementById("selectColor").options[document.getElementById("selectColor").selectedIndex].text;

    const stock = parseInt(document.getElementById("inputStockDetalle").value);

    if (!idTalla || !idColor || !stock) {
        alert("Completa talla, color y stock.");
        return;
    }

    const detalle = {
        idTalla,
        nombreTalla,
        idColor,
        nombreColor,
        stock
    };

    // Asegura que existe el arreglo
    if (!window.detallesStock) {
        window.detallesStock = [];
    }

    window.detallesStock.push(detalle);

    // (opcional) Actualiza tabla de vista
    renderizarTablaDetalles();
}
// esta funcion se ejecutara cada que se agregue una talla, color y stock en el producto y se 
// reflejaran en esta tabla.
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

// al hacer click en el boton de eliminar, eliminara el detalle de la tabla
function eliminarDetalleStock(index) {
    // Elimina el elemento en la posición index
    window.detallesStock.splice(index, 1);
    renderizarTablaDetalles();
}

// funcion para actualizar el detalle de la tabla
function actualizarDetalleStock(index) {
    const detalle = window.detallesStock[index];

    // Llenamos los campos con los valores actuales
    document.getElementById("selectTalla").value = detalle.idTalla;
    document.getElementById("selectColor").value = detalle.idColor;
    document.getElementById("inputStockDetalle").value = detalle.stock;

    // Quitamos el detalle anterior para que luego se agregue como nuevo si se modifica
    window.detallesStock.splice(index, 1);
    renderizarTablaDetalles();
}

// FUNCION PARA GENERAR REPORTE PDF
function generarReportePDF(lista) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Productos", 14, 15);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 25);

    let data = [];

    lista.forEach(p => {
        if (p.detalles && p.detalles.length > 0) {
            p.detalles.forEach(d => {
                data.push([
                    p.codigoInterno,
                    p.nombre,
                    d.nombreTalla,
                    d.nombreColor,
                    d.stock
                ]);
            });
        } else {
            data.push([
                p.codigoInterno,
                p.nombre,
                "Sin talla",
                "Sin color",
                "Sin stock"
            ]);
        }
    });

    doc.autoTable({
        startY: 30,
        head: [['Clave','Nombre', 'Talla', 'Color', 'Stock']],
        body: data,
        styles: { fontSize: 10 }
    });

    doc.save("reporte_productos.pdf");
}

window.verDetalle = verDetalle;
window.detallesStock = [];
window.filtrarPorCategoria = filtrarPorCategoria;
window.regresar = regresar;
window.cargarFotografia = cargarFotografia;
window.eliminarProducto = eliminarProducto;
window.eliminarDetalleStock = eliminarDetalleStock;
window.actualizarDetalleStock = actualizarDetalleStock;