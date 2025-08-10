
let suc = [];
let cm = null;
export async function inicializar(){
    await cargarMapa();
    await getAllSucursales();
    await cargarListaSucursales();
    document.getElementById("btnReporteVentas").addEventListener('click', reporteVentas);
    document.getElementById("registrarS").addEventListener('click', mostrarFormularioSucursal);
    document.getElementById("btnRegresar").addEventListener('click', ocultarFormularioSucursal);
    document.getElementById("registrarSucursal").addEventListener('click', saveSucursal);
}

export async function cargarMapa() {
    const contenedorMapa = document.getElementById("mapaSucursales");
    if (!contenedorMapa) return;

    // Crear el mapa centrado en una ubicación genérica
    const map = L.map("mapaSucursales").setView([20.659699, -103.349609], 13);

    // Cargar el tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; Carto & OpenStreetMap contributors'
    }).addTo(map);

    
    const myIcon = L.icon({
        iconUrl: "resources/bionika-logo.png",
        iconSize: [30, 36],
        iconAnchor: [15, 36],
        popupAnchor: [0, -30]
    });
    

    try {
        const response = await fetch("http://localhost:8080/bionika_web/api/sucursal/getAll");
        const sucursales = await response.json();

        if (!sucursales.length) {
            alert("No se encontraron sucursales activas.");
            return;
        }

        sucursales.forEach((sucursal) => {
            const lat = parseFloat(sucursal.latitud);
            const lon = parseFloat(sucursal.longitud);

            if (!isNaN(lat) && !isNaN(lon)) {
                const direccion = `${sucursal.calle} ${sucursal.numExt}, ${sucursal.colonia}, CP ${sucursal.codPos}`;
                const popupHtml = `
                    <strong>${sucursal.nombreSuc}</strong><br>
                    ${direccion}<br>
                    Tel: ${sucursal.telefono}<br>
                    <a class="text-purple-600 underline hover:text-purple-800" 
                       href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" 
                       target="_blank">
                       Ver en Google Maps
                    </a>
                `;
                L.marker([lat, lon], { icon: myIcon })
                    .addTo(map)
                    .bindPopup(popupHtml);
            }
        });
    } catch (error) {
        console.error("Error al cargar las sucursales:", error);
        alert("Hubo un problema al cargar el mapa de sucursales.");
    }
}


export async function saveSucursal() {
    let url = 'http://localhost:8080/bionika_web/api/sucursal/save';
    let sucursal = {
        idSucursal: parseInt(document.getElementById("txtIdSucursal").value) || 0,
        nombreSuc: document.getElementById("txtNombreSuc").value,
        colonia: document.getElementById("txtColonia").value,
        calle: document.getElementById("txtCalle").value,
        codPos: document.getElementById("txtCodPos").value,
        latitud: document.getElementById("txtLatitud").value,
        longitud: document.getElementById("txtLongitud").value,
        numExt: document.getElementById("txtNumExt").value,
        telefono: document.getElementById("txtTelefono").value
    };

    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;

//    if (document.getElementById("txtIdSucursal").value.trim() != '')
//    {
//        sucursal.id = parseInt(document.getElementById("txtIdSucursal").value.trim());
//
//    }

    datos = {datosSucursal: JSON.stringify(sucursal)};
    params = new URLSearchParams(datos);

    opciones = {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: params
    };

    resp = await fetch(url, opciones);
    data = await resp.json();

    if (!data.error)
    {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario agregado/Actualizado con éxito'
        });
        limpiarFormulario();
    } else
    {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error
        });
    }
}

export async function _delete()
{
    let url = "http://localhost:8080/bionika_web/api/sucursal/delete";

    let idSucursal = 0;
    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;

    if (document.getElementById("txtId").value.trim() != '')
    {
        idSucursal = parseInt(document.getElementById("txtId").value.trim());
    } else
    {
        Swal.fire('Seleccione un usuario para eliminarlo.', '', 'warning');
        return;
    }

    datos = {idSucursal: idSucursal};
    params = new URLSearchParams(datos);
    opciones = {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: params
    };

    resp = await fetch(url, opciones);
    data = await resp.json();

    if (data.error != null)
    {
        Swal.fire('', data.error, 'error');
    } else
    {
        recargarTablaUsuario();
        Swal.fire('Registro de usuario eliminado con Exito.', '', 'success');
        limpiarCampos();
    }
}

export async function getAllSucursales()
{
    let url = "http://localhost:8080/bionika_web/api/sucursal/getAll";

    let resp = await fetch(url);

    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('Error al consultar los usuarios.', datos.error, 'error');
    } else
    {
        suc = datos;

        console.log(suc);

        for (let i = 0; i < suc.length; i++)
        {

            contenido += `
  <div class="max-w-5xl mx-auto my-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div class="flex-1">
        <h3 class="text-2xl font-semibold text-purple-800 border-b-2 border-purple-300 pb-2 mb-2">
          ${suc[i].nombreSuc}
        </h3>
        <p class="text-gray-700 font-medium"><strong>Dirección:</strong> ${suc[i].colonia}, ${suc[i].calle}, ${suc[i].numExt}</p>
        <p class="text-gray-700 font-medium"><strong>Teléfono:</strong> ${suc[i].telefono}</p>
      </div>
      <div class="flex gap-2 flex-wrap justify-end sm:justify-start sm:pt-2">
        <button id="btnEliminar" title="Eliminar Sucursal" class="p-2 border-2 border-red-600 rounded-xl hover:border-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 7.5V19.5A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5V7.5m-13.5 0h15m-12 0V6A1.5 1.5 0 017.5 4.5h9A1.5 1.5 0 0118 6v1.5" />
          </svg>
        </button>
        <button id="btnEditar" onclick="verDetalle(${suc[i].idSucursal})" title="Editar Sucursal" class="p-2 border-2 border-green-600 rounded-xl hover:border-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600 hover:text-green-800" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313l-4.5 1.125 1.125-4.5L16.862 3.487z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
`;
        }

    }

    document.getElementById('sucursales').innerHTML = contenido;
}

async function eliminarSucursal(idSucursal) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción dará de baja al usuario y no podrá iniciar sesión.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, dar de baja',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      let url = "http://localhost:8080/bionika_web/api/sucursal/delete";

      let formData = new URLSearchParams();
      formData.append("idSucursal", idSucursal);

      let resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      let data = await resp.json();

      if (resp.ok && !data.error) {
        Swal.fire('Sucursal dada de baja', data.result || 'Operación exitosa', 'success');
        getAllSucursales();
        cargarListaSucursales();
      } else {
        Swal.fire('Error', data.error || 'No se pudo dar de baja la sucursal', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      console.error(error);
    }
  }
}

async function verDetalle(idSucursal) {
    mostrarFormularioSucursal();
  setTimeout(() => {
    const s = suc.find(s => s.idSucursal === idSucursal);
    if (!s) {
      console.error("Sucursal no encontrada con ID:", idSucursal);
      return;
    }

    // Llenar los campos del formulario con los datos de la sucursal
    document.getElementById("txtIdSucursal").value = s.idSucursal;
    document.getElementById("txtNombreSuc").value = s.nombreSuc;
    document.getElementById("txtNumExt").value = s.numExt;
    document.getElementById("txtTelefono").value = s.telefono;
    document.getElementById("txtLatitud").value = s.latitud;
    document.getElementById("txtLongitud").value = s.longitud;
    document.getElementById("txtCodPos").value = s.codPos;
    document.getElementById("txtColonia").value = s.colonia;
    document.getElementById("txtCalle").value = s.calle;

    console.log("Formulario cargado con los datos de la sucursal:", s);
  }, 300);
}


export async function cargarListaSucursales() {
    console.log("se cargo la lista");
    let url = "http://localhost:8080/bionika_web/api/sucursal/getAll";

    try {
        let resp = await fetch(url);
        let datos = await resp.json();
        let contenido = '';

        if (datos.error != null) {
            Swal.fire('Error al consultar las sucursales.', datos.error, 'error');
        } else {
            const suc = datos;
            console.log(suc);

            for (let i = 0; i < suc.length; i++) {
                contenido += `
  <div class="max-w-full mx-auto p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-bold text-black border-b border-purple-200 pb-1">
        ${suc[i].nombreSuc}
      </h3>
      <p class="text-gray-800 text-sm"><strong>Dirección:</strong> ${suc[i].colonia}, ${suc[i].calle}, ${suc[i].numExt}</p>
      <p class="text-gray-800 text-sm"><strong>Teléfono:</strong> ${suc[i].telefono}</p>
      
      <a href="https://www.google.com/maps/search/?api=1&query=${suc[i].latitud},${suc[i].longitud}" 
         target="_blank"
         class="text-sm text-purple-600 underline hover:text-purple-800 transition inline-flex items-center gap-1 mt-1">
         <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                 d="M17.657 16.657L13.414 12.414A2 2 0 0012 12H5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-1.586a2 2 0 00-.586-1.414z" />
         </svg>
         Ver en Google Maps
      </a>
    </div>
  </div>
`;
            }
        }

        document.getElementById('listaSucursales').innerHTML = contenido;

    } catch (error) {
        console.error('Error al cargar las sucursales:', error);
        Swal.fire('Error', 'No se pudieron cargar las sucursales.', 'error');
    }
}

export async function recargarComboBoxUsuarios()
{
    let url = "http://localhost:8080/bionika_web/api/sucursal/getAllUsuario";
    let resp = await fetch(url);
    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('Error al consultar tipos de usuario.', datos.error, 'error');
    } else
    {
        usuarios = datos;

        for (let i = 0; i < usuarios.length; i++)
        {
            contenido += '<option value="' + usuarios[i].id + '">' +
                    usuarios[i].usuario +
                    '</option>';
        }
    }

    document.getElementById('cmbUsuario').innerHTML = contenido;
}

export async function reporteVentas() {
    cm = null;
    console.log("cargando vista reportes...");
    let urlDef = "http://localhost:8080/bionika_web/modules/reporteVentas/reporteVentas.html";
    let respDef = await fetch(urlDef);
    let contenidoDef = await respDef.text();
    document.getElementById('content').innerHTML = contenidoDef;
    cm = await import(`http://localhost:8080/bionika_web/modules/reporteVentas/js/reporteVentas.js`);
    cm.inicializar();

    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
}

export function mostrarFormularioSucursal() {
    limpiarFormulario();
    document.getElementById('FormularioRegistro').classList.remove('hidden');
    document.getElementById('seccionSucursales').classList.add('hidden');
}

async function ocultarFormularioSucursal() {
    await getAllSucursales();
    await cargarListaSucursales();
    document.getElementById('FormularioRegistro').classList.add('hidden');
    document.getElementById('seccionSucursales').classList.remove('hidden');
}

export function limpiarFormulario() {
    document.getElementById("txtIdSucursal").value = '';
    document.getElementById("txtNombreSuc").value = '';
    document.getElementById("txtNumExt").value = '';
    document.getElementById("txtTelefono").value = '';
    document.getElementById("txtLatitud").value = '';
    document.getElementById("txtLongitud").value = '';
    document.getElementById("txtCodPos").value = '';
    document.getElementById("txtColonia").value = '';
    document.getElementById("txtCalle").value = '';
}

window.verDetalle = verDetalle;
