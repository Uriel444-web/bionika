/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

let usu = [];
let Roles = [];

export async function saludar(){
    
}

export async function saveUsuario(){
    let url = 'http://localhost:8080/bionika_web/api/usuario/save';
    let usuario =  {
        
                         empleado :  {
                                        idEmpleado      :0,
                                        nombre          : document.getElementById("txtNombre").value,
                                        apellidoP       : document.getElementById("txtApellidoP").value,
                                        apellidoM       : document.getElementById("txtApellidoM").value,
                                        correo          : document.getElementById("txtCorreo").value,
                                        telefono        : document.getElementById("txtTelefono").value
                                    },
                                        usuario         : document.getElementById("txtUsuario").value,
                                        contrasenia      : document.getElementById("txtContrasena").value,
                         rol : {
                                            
                                        idRol         : parseInt(document.getElementById("cmbCategoria").value)
                                        }, 
                        id : 0
                    };
                    
    let datos = null;
    
    let params = null;
    
    let opciones = null;
    
    let resp = null;
    
    let data = null;
    
    datos = {datosUsuario : JSON.stringify(usuario)};
    params = new URLSearchParams(datos);
   
   
    opciones =  {
                    method  : "POST",
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body    : params
                };
    
    resp = await fetch(url, opciones);
    data = await resp.json();
    
    alert(data);
    if (data.error != null)
    {
       
    }
    else
    {
        Swal.fire('Datos de alimento guardados con exito.', '', 'success');
    }
}

export async function recargarTablaUsuario()
{
    // Definimos la URL del servicio:
    let url = "http://localhost:8080/bionika_web/api/usuario/getAll";
    
    // Invocamos el servicio:
    let resp = await fetch(url);
    
    // Convertimos la respuesta del servicio en un documento JSON:
    let datos = await resp.json();
    
    // Aqui se guardara el contenido HTML de la tabla, con los datos
    // de los alimentos que devolvio el servicio:
    let contenido = '';
    
    // Verificamos si hubo al gun error:
    if (datos.error != null)
    {
        Swal.fire('Error al consultar alimentos.', datos.error, 'error');
    }
    else
    {
        // Se guarda el arreglo de alimentos en una variable global del modulo:
        usu = datos;
        
        console.log(usu);
        // Se recorre el arreglo de alimentos:
        for (let i = 0; i < usu.length; i++)
        {
            // Por cada alimento, se genera un renglon de tabla, con cada una
            // de sus columnas:
            contenido +=    '<tr class="cursor-pointer hover:bg-gray-100">' +
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].id+'</td>'+
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].usuario+'</td>'+
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].empleado.nombre+'</td>'+
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].empleado.apellidoP+'</td>'+
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].empleado.apellidoM+'</td>'+
                                '<td class="text-gray-900 font-semibold transition p-2 pl-4 h-8 border-b-2 border-stone-200">'+usu[i].rol.tipoRol+'</td>'+
                            '</tr>';
                    
        }
    }
    
    document.getElementById('tbodyAlimentos').innerHTML = contenido;
    
    agregarEventosFilas();
}

export async function recargarComboBoxCategorias()
{
    // Definimos la URL del servicio:
    let url = "http://localhost:8080/bionika_web/api/usuario/getAllRol";
    
    // Invocamos el servicio:
    let resp = await fetch(url);
    
    // Convertimos la respuesta del servicio en un documento JSON:
    let datos = await resp.json();
    
    // Aqui se guardara el contenido HTML de la tabla, con los datos
    // de los alimentos que devolvio el servicio:
    let contenido = '';
    
    // Verificamos si hubo al gun error:
    if (datos.error != null)
    {
        Swal.fire('Error al consultar categorias de alimentos.', datos.error, 'error');        
    }
    else
    {
        // Se guarda el arreglo de categorias en una variable global del modulo:
        Roles = datos;
        
        // Se recorre el arreglo de alimentos:
        for (let i = 0; i < Roles.length; i++)
        {
            // Por cada alimento, se genera una opcion para el ComboBox:
            contenido +=    '<option value="' + Roles[i].idRol + '">' +
                                Roles[i].tipoRol + 
                            '</option>';
        }
    }
    
    // Una vez que se termino de recorrer el arreglo de categorias, se coloca
    // el contenido de la tabla dentro del <select> correspondiente:
    document.getElementById('cmbCategoria').innerHTML = contenido;
}

export async function agregarEventosFilas(){
    
    
    const filas = document.querySelectorAll("#tbodyAlimentos tr");
    
    filas.forEach(fila => {
    fila.addEventListener("click", function() {
         
      const idUsuario = this.cells[0].textContent;
      
      console.log(idUsuario);
      // Buscar el registro completo en nuestros datos almacenados
      const usuarioCompleto = usu.find(user => user.id == idUsuario);
            
      if (usuarioCompleto) {
                // Llenamos el formulario con los datos completos
                llenarFormulario(usuarioCompleto);
            }
    });
  });
}

export async function llenarFormulario(usuario) {
   
   console.log(usuario);
    // Datos del empleado
    if (usuario.empleado) {
        document.getElementById('txtNombre').value = usuario.empleado.nombre || '';
        document.getElementById('txtApellidoP').value = usuario.empleado.apellidoP || '';
        document.getElementById('txtApellidoM').value = usuario.empleado.apellidoM || '';
        document.getElementById('txtCorreo').value = usuario.empleado.correo || '';
        document.getElementById('txtTelefono').value = usuario.empleado.telefono || '';
      }
  
    const form = document.getElementById('fUsuario');
    console.log(form);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.readOnly = true;
        // Opcional: cambiar estilo visual
        input.classList.add('bg-gray-100', 'cursor-not-allowed');
    });
    
    // Habilitar botón de editar
    document.getElementById('btnEditar').disabled = false;
}