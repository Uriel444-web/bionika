/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global Swal */

let usu = [];
let Roles = [];
let Sucursales = [];

export async function inicializar() {
    recargarTablaUsuario();
    recargarComboBoxCategorias();
    recargarComboBoxSucursales();
    
    document.getElementById("btnAgregar").addEventListener('click', mostrarFormulario);
    document.getElementById("btnRegistrarU").addEventListener('click', saveUsuario);
    document.getElementById("btnMostrarU").addEventListener('click', ocultarFormulario);
}

async function mostrarFormulario(){
    limpiarFormularioUsuario();
    document.getElementById("form").classList.remove("hidden");
    document.getElementById("cardsSeccion").classList.add("hidden");
}

async function ocultarFormulario() {
    await recargarTablaUsuario();
    document.getElementById("form").classList.add("hidden");
    document.getElementById("cardsSeccion").classList.remove("hidden");
}

export async function saveUsuario() {
    let url = 'http://localhost:8080/bionika_web/api/usuario/save';
    
    let usuario = {
        empleado: {
            idEmpleado: parseInt(document.getElementById("txtIdEmpleado").value) || 0,
            nombre: document.getElementById("txtNombre").value,
            apellidoP: document.getElementById("txtApellidoP").value,
            apellidoM: document.getElementById("txtApellidoM").value,
            correo: document.getElementById("txtCorreo").value,
            telefono: document.getElementById("txtTelefono").value
        },
        usuario: document.getElementById("txtUsuario").value,
        contrasena: document.getElementById("txtContrasena").value,
        rol: {
            idRol: parseInt(document.getElementById("cmbCategoria").value)
        },
        sucursal: {
        idSucursal: parseInt(document.getElementById("cmbSucursal").value) || 0
        },
        idUsuario: parseInt(document.getElementById("txtId").value) || 0
    };
    console.log(usuario);
    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;

    if (document.getElementById("txtId").value.trim() != '') {
        usuario.idUsuario = parseInt(document.getElementById("txtId").value.trim());
    }

    datos = {datosUsuario: JSON.stringify(usuario)};
    params = new URLSearchParams(datos);

    opciones = {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: params
    };

    resp = await fetch(url, opciones);
    data = await resp.json();

    if (!data.error) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario agregado/Actualizado con éxito'
        });
        limpiarFormularioUsuario();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error
        });
    }
}


export async function _delete()
{
    let url = "http://localhost:8080/bionika_web/api/usuario/delete";

    let idUsuario = 0;
    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;

    if (document.getElementById("txtId").value.trim() != '')
    {
        idUsuario = parseInt(document.getElementById("txtId").value.trim());
    } else
    {
        Swal.fire('Seleccione un usuario para eliminarlo.', '', 'warning');
        return;
    }

    datos = {idUsuario: idUsuario};
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

export async function recargarTablaUsuario() {
    let url = "http://localhost:8080/bionika_web/api/usuario/getAll";

    let resp = await fetch(url);
    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null) {
        Swal.fire('Error al consultar los usuarios.', datos.error, 'error');
    } else {
        usu = datos;

        for (let i = 0; i < usu.length; i++) {
            contenido += `
  <div class="bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex items-start space-x-2 hover:shadow-md transition duration-200">
    <div class="flex-shrink-0 bg-purple-900 text-white rounded-full p-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.216.804 5.879 2.137M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <div class="flex-1 space-y-0.5">
      <h2 class="text-sm font-semibold text-black">${usu[i].empleado.nombre} ${usu[i].empleado.apellidoP} ${usu[i].empleado.apellidoM}</h2>
      <p class="text-xs text-gray-600">${usu[i].rol.tipoRol}</p>
      <p class="text-xs text-gray-600 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 5a2 2 0 012-2h3l2 5-2 1c.5 1 1.5 2.5 3 3l1-2 5 2v3a2 2 0 01-2 2h-1C9.716 19 5 14.284 5 8V7a2 2 0 00-2-2z" />
        </svg>
        ${usu[i].empleado.telefono}
      </p>
      <p class="text-xs text-gray-600 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zM8 4l4 4 4-4" />
        </svg>
        ${usu[i].empleado.correo}
      </p>
    </div>
    <div class="flex items-center gap-1">
      <button onclick="verDetalleUsuario(${usu[i].idUsuario})" class="text-purple-800 hover:text-purple-900 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536M9 11l6 6m2-10a2.828 2.828 0 010 4l-7.5 7.5H3v-7.5l7.5-7.5a2.828 2.828 0 014 0z" />
        </svg>
      </button>
      <button onclick="eliminarUsuario(${usu[i].idUsuario})" class="text-red-600 hover:text-red-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
        </svg>
      </button>
    </div>
  </div>
`;
        }
    }

    // Carga el contenido en cards, ya no en tabla
    document.getElementById('contenedorUsuarios').innerHTML = contenido;
}

async function verDetalleUsuario(idUsuario) {
    await mostrarFormulario();

    const u = usu.find(u => u.idUsuario === idUsuario);
    if (!u) {
        console.error("Usuario no encontrado con ID:", idUsuario);
        return;
    }

    // Llenar los campos del formulario con los datos del usuario
    document.getElementById("txtId").value = u.idUsuario;
    document.getElementById("txtIdEmpleado").value = u.empleado.idEmpleado;
    document.getElementById("txtNombre").value = u.empleado.nombre;
    document.getElementById("txtApellidoP").value = u.empleado.apellidoP;
    document.getElementById("txtApellidoM").value = u.empleado.apellidoM;
    document.getElementById("txtCorreo").value = u.empleado.correo;
    document.getElementById("txtTelefono").value = u.empleado.telefono;
    document.getElementById("txtUsuario").value = u.usuario;
    document.getElementById("txtContrasena").value = u.contrasena;
    document.getElementById("txtRola").value = u.contrasena; 

    const cmbCategoria = document.getElementById("cmbCategoria");
    const cmbSucursal = document.getElementById("cmbSucursal");

    if (cmbCategoria) cmbCategoria.value = u.rol?.idRol || "";
    if (cmbSucursal) cmbSucursal.value = u.sucursal?.idSucursal || "";

    console.log("Formulario de usuario cargado con:", u);
}


async function limpiarFormularioUsuario() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtIdEmpleado").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtApellidoP").value = "";
    document.getElementById("txtApellidoM").value = "";
    document.getElementById("txtCorreo").value = "";
    document.getElementById("txtTelefono").value = "";
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtContrasena").value = "";
    document.getElementById("txtRola").value = "";

    const cmbCategoria = document.getElementById("cmbCategoria");
    const cmbSucursal = document.getElementById("cmbSucursal");

    if (cmbCategoria) cmbCategoria.value = "";
    if (cmbSucursal) cmbSucursal.value = "";
}

async function eliminarUsuario(idUsuario) {
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
      let url = "http://localhost:8080/bionika_web/api/usuario/delete";

      let formData = new URLSearchParams();
      formData.append("idUsuario", idUsuario);

      let resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      let data = await resp.json();

      if (resp.ok && !data.error) {
        Swal.fire('Usuario dado de baja', data.result || 'Operación exitosa', 'success');
        recargarTablaUsuario(); 
      } else {
        Swal.fire('Error', data.error || 'No se pudo dar de baja al usuario', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      console.error(error);
    }
  }
}

export async function recargarComboBoxCategorias()
{
    let url = "http://localhost:8080/bionika_web/api/usuario/getAllRol";
    let resp = await fetch(url);
    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('Error al consultar tipos de usuario.', datos.error, 'error');
    } else
    {
        Roles = datos;

        for (let i = 0; i < Roles.length; i++)
        {
            contenido += '<option value="' + Roles[i].idRol + '">' +
                    Roles[i].tipoRol +
                    '</option>';
        }
    }

    document.getElementById('cmbCategoria').innerHTML = contenido;
    recargarComboBoxSucursales();
}

// funcion para cargar el combobox de sucursales
export async function recargarComboBoxSucursales() {
    let url = "http://localhost:8080/bionika_web/api/usuario/getAllSucursal";
    let resp = await fetch(url);
    let datos = await resp.json();

    let contenido = '<option value="">-- Sin sucursal --</option>';

    if (datos.error != null) {
        Swal.fire('Error al consultar sucursales.', datos.error, 'error');
    } else {
        Sucursales = datos;

        for (let i = 0; i < Sucursales.length; i++) {
            contenido += `<option value="${Sucursales[i].idSucursal}">${Sucursales[i].nombreSuc}</option>`;
        }
    }

    document.getElementById('cmbSucursal').innerHTML = contenido;
}

function limpiarCampos() {

    document.getElementById('txtNombre').value = '';
    document.getElementById('txtApellidoP').value = '';
    document.getElementById('txtApellidoM').value = '';
    document.getElementById('txtCorreo').value = '';
    document.getElementById('txtTelefono').value = '';

    document.getElementById('txtUsuario').value = '';
    document.getElementById('txtContrasena').value = '';
    document.getElementById('txtId').value = '';


}
export async function llenarFormulario(usuario) {

    if (usuario.empleado) {
        document.getElementById('txtNombre').value = usuario.empleado.nombre || '';
        document.getElementById('txtApellidoP').value = usuario.empleado.apellidoP || '';
        document.getElementById('txtApellidoM').value = usuario.empleado.apellidoM || '';
        document.getElementById('txtCorreo').value = usuario.empleado.correo || '';
        document.getElementById('txtTelefono').value = usuario.empleado.telefono || '';
    }
    
    document.getElementById('txtUsuario').value = usuario.usuario || '';
    document.getElementById('txtContrasena').value = usuario.contrasenia || '';
    document.getElementById('txtId').value = usuario.id || '';


}

// funcion para buscar usuarios
export async function buscarUsuarioPorTexto() {
    let texto = document.getElementById("busquedaUsuario").value.trim(); 

    if (texto === "") {
        recargarTablaUsuario(); 
        return;
    }

    let url = `http://localhost:8080/bionika_web/api/usuario/buscar/${encodeURIComponent(texto)}`;

    try {
        let resp = await fetch(url);
        let usuarios = await resp.json();

        if (!usuarios || usuarios.length === 0 || usuarios.error) {
            document.getElementById("contenedorUsuarios").innerHTML = `
                <div class="col-span-full text-center text-red-500 font-semibold">No se encontraron usuarios.</div>
            `;
            return;
        }

        mostrarUsuarios(usuarios); 
    } catch (e) {
        console.error(e);
        document.getElementById("contenedorUsuarios").innerHTML = `
            <div class="col-span-full text-center text-red-500 font-semibold">Error al buscar usuarios.</div>
        `;
    }
}

export function mostrarUsuarios(lista) {
    let contenido = '';
    for (let i = 0; i < lista.length; i++) {
        contenido += `
  <div class="bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex items-start space-x-2 hover:shadow-md transition duration-200">
    <div class="flex-shrink-0 bg-purple-900 text-white rounded-full p-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.216.804 5.879 2.137M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <div class="flex-1 space-y-0.5">
      <h2 class="text-sm font-semibold text-black">${lista[i].empleado.nombre} ${lista[i].empleado.apellidoP} ${lista[i].empleado.apellidoM}</h2>
      <p class="text-xs text-gray-600">${lista[i].rol.tipoRol}</p>
      <p class="text-xs text-gray-600 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 5a2 2 0 012-2h3l2 5-2 1c.5 1 1.5 2.5 3 3l1-2 5 2v3a2 2 0 01-2 2h-1C9.716 19 5 14.284 5 8V7a2 2 0 00-2-2z" />
        </svg>
        ${lista[i].empleado.telefono}
      </p>
      <p class="text-xs text-gray-600 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zM8 4l4 4 4-4" />
        </svg>
        ${lista[i].empleado.correo}
      </p>
    </div>
    <div class="flex items-center gap-1">
      <button onclick="verDetalle(${lista[i].idUsuario})" class="text-purple-800 hover:text-purple-900 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536M9 11l6 6m2-10a2.828 2.828 0 010 4l-7.5 7.5H3v-7.5l7.5-7.5a2.828 2.828 0 014 0z" />
        </svg>
      </button>
      <button onclick="eliminarUsuario(${lista[i].idUsuario})" class="text-red-600 hover:text-red-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
        </svg>
      </button>
    </div>
  </div>
`;
    }
    document.getElementById('contenedorUsuarios').innerHTML = contenido;
}

window.verDetalleUsuario = verDetalleUsuario;
window.eliminarUsuario = eliminarUsuario;
window.buscarUsuarioPorTexto = buscarUsuarioPorTexto;