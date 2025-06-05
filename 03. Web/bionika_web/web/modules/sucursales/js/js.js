

/* global L */

let suc = [];

export async function cargarMapa() {

    var map = L.map('mapaSucursales').setView([21.128789, -101.680717], 16);
    var myIcon = L.icon({
        iconUrl: 'resources/bionika-logo.png',
        iconSize: [50, 60],
        iconAnchor: [17, 94],
        popupAnchor: [-3, -76],
        shadowAnchor: [22, 94]
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; Carto & OpenStreetMap contributors'
    }).addTo(map);

    L.marker([21.125959, -101.681357], {icon: myIcon}).addTo(map)
            .bindPopup('¡Bienvenido a Bionika!')
            .openPopup();

    L.marker([21.129860, -101.678320], {icon: myIcon}).addTo(map)
            .bindPopup('¡Bienvenido a Bionika!')
            .openPopup();

}

export async function saveSucursal() {
    let url = 'http://localhost:8080/bionika_web/api/sucursal/save';
    let sucursal = {
        
        nombre: document.getElementById("txtNombreSuc").value,
        colonia: document.getElementById("txtColonia").value,
        calle: document.getElementById("txtCalle").value,
        codPos: document.getElementById("txtCodPos").value,
        latitud: document.getElementById("txtLatitud").value,
        longitud: document.getElementById("txtLongitud").value,
        numExt: document.getElementById("txtNumExt").value,
        telefono: document.getElementById("txtTelefono").value,
        usuario: {
            id: parseInt(document.getElementById("cmbUsuario").value)
        },
        idSucursal: 0
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
    } else
    {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error
        });
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

            contenido +=
                    '<div class="grid grid-cols-6 grid-rows-5 gap-4 mx-8 pb-2 border-b-2 border-gray-100">' +
                    '<div class="col-span-4 row-span-5">' +
                    '<p class="text-xl text-gray-900 font-semibold">' + suc[i].nombre + '</p>' +
                    '<h2 class="text-gray-800 font-semibold">' + "Direccion: " + suc[i].colonia + ", " + suc[i].calle + ", " + suc[i].numExt + '</h2>' +
                    '<h2 class="text-gray-800 font-semibold">' + "Telefono: " + suc[i].telefono + '</h2>' +
                    '<h2 class="text-gray-800 font-semibold">' + "Encargado: " + suc[i].usuario.usuario + '</h2>' +
                    '</div>' +
                    '<div class="col-span-2 row-span-5 col-start-5 py-8 flex">' +
                    
                    '<div class= "mr-2 border-2 border-red-600 rounded-xl hover:border-red-800 flex items-center justify-center">'+
                    '<button id="btnEliminar" type="button" title="Eliminar Sucursal" >'+
                        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class=" m-2 w-8 h-8 text-red-600 hover:text-red-800 cursor-pointer">'+
                           '<path stroke-linecap="round" stroke-linejoin="round" d="M6 7.5V19.5A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5V7.5m-13.5 0h15m-12 0V6A1.5 1.5 0 017.5 4.5h9A1.5 1.5 0 0118 6v1.5" />'+
                             '</svg></button>'+
                    '</div>'+
                    
                    '<div class= "border-2 border-green-600 rounded-xl hover:border-green-800 flex items-center justify-center">'+
                   '<button id="btnEditar" type="button" title="Editar Sucursal">'+             
                       '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="m-2 w-8 h-8 text-green-600 hover:text-green-800 cursor-pointer">'+
                           '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313l-4.5 1.125 1.125-4.5L16.862 3.487z" />'+
                    '</svg></button>'+
                    '</div>'+
                    
                    '<div class= "ml-2 border-2 border-blue-600 rounded-xl hover:border-blue-800 flex items-center justify-center">'+         
                   '<button type="button" title="Ver informe">'+
                       '<svg id="icon-show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="m-2 w-8 h-8 text-blue-600 hover:text-blue-800 cursor-pointer">'+
                            '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />'+
                            '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />'+
                    '</svg></button>'+
                    '</div>'+
                    '</div>' +
                    '</div>';
        }

    }

    document.getElementById('sucursales').innerHTML = contenido;
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
