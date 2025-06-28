/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global Swal */

let usu = [];
let Roles = [];
let Sucursales = [];

export async function saludar() {

}

export async function saveUsuario() {
    let url = 'http://localhost:8080/bionika_web/api/usuario/save';
    
    let usuario = {
        empleado: {
            idEmpleado: 0,
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
            idSucursal: parseInt(document.getElementById("cmbSucursal").value)
        },
        id: 0
    };

    let datos = null;
    let params = null;
    let opciones = null;
    let resp = null;
    let data = null;

    if (document.getElementById("txtId").value.trim() != '') {
        usuario.id = parseInt(document.getElementById("txtId").value.trim());
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

export async function recargarTablaUsuario()
{
    let url = "http://localhost:8080/bionika_web/api/usuario/getAll";


    let resp = await fetch(url);

    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('Error al consultar los usuarios.', datos.error, 'error');
    } else
    {
        usu = datos;

        for (let i = 0; i < usu.length; i++)
        {
            contenido += '<tr class="cursor-pointer hover:bg-gray-100">' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].idUsuario + '</td>' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].usuario + '</td>' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].empleado.nombre + '</td>' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].empleado.apellidoP + '</td>' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].empleado.apellidoM + '</td>' +
                    '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">' + usu[i].rol.tipoRol + '</td>' +
                    '</tr>';

        }
    }

    document.getElementById('tbodyAlimentos').innerHTML = contenido;

    agregarEventosFilas();
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
export async function recargarComboBoxSucursales()
{
    let url = "http://localhost:8080/bionika_web/api/usuario/getAllSucursal";
    let resp = await fetch(url);
    let datos = await resp.json();

    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('Error al consultar sucursales.', datos.error, 'error');
    } else
    {
        Sucursales = datos;

        for (let i = 0; i < Sucursales.length; i++)
        {
            contenido += '<option value="' + Sucursales[i].idSucursal + '">' +
                    Sucursales[i].nombreSuc +
                    '</option>';
        }
    }

    document.getElementById('cmbSucursal').innerHTML = contenido;
}

export async function agregarEventosFilas() {

    const filas = document.querySelectorAll("#tbodyAlimentos tr");

    filas.forEach(fila => {
        fila.addEventListener("click", function () {

            const idUsuario = this.cells[0].textContent;

            const usuarioCompleto = usu.find(user => user.id == idUsuario);

            if (usuarioCompleto) {
                inhabilitarTextos();
                llenarFormulario(usuarioCompleto);
            }
        });
    });
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

export async function inhabilitarTextos() {

    
    const formDP = document.getElementById('FDatosEmpleado');
    const formDU = document.getElementById('FDatosUsuario');

    const inputDP = formDP.querySelectorAll('input, select');
    const inputDU = formDU.querySelectorAll('input, select');


    inputDU.forEach(input => {
        input.readOnly = true;
        input.classList.remove('bg-white', 'cursor-default');
        input.classList.add('bg-gray-100', 'cursor-not-allowed');

    });

    inputDP.forEach(input => {
        input.readOnly = true;
        input.classList.remove('bg-white', 'cursor-default');
        input.classList.add('bg-gray-100', 'cursor-not-allowed');

    });

    document.getElementById("actualizarUs").disabled = true;
}

export async function habilitarDatos() {

 if (document.getElementById("txtId").value.trim() == '')
    {
         Swal.fire('Seleccione un usuario para editarlo.', '', 'warning');
        return;
    }
    
    const formDP = document.getElementById('FDatosEmpleado');
    const formDU = document.getElementById('FDatosUsuario');

    const inputDP = formDP.querySelectorAll('input, select');
    const inputDU = formDU.querySelectorAll('input, select');

    inputDU.forEach(input => {
        input.readOnly = false;
        input.classList.remove('bg-gray-100', 'cursor-not-allowed');
        input.classList.add('bg-white', 'cursor-default');
    });

    inputDP.forEach(input => {
        input.readOnly = false;
        input.classList.remove('bg-gray-100', 'cursor-not-allowed');
        input.classList.add('bg-white', 'cursor-default');
    });

    document.getElementById("actualizarUs").disabled = false;
}