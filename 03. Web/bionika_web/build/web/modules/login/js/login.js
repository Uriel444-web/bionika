/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

 export function ingresar()
{
    let u = document.getElementById("txtUsuario").value;
    let c = document.getElementById("txtPassword").value;
    
    let usuario = {usuario: u, contrasena: c};
    let parametros = {usuario: JSON.stringify(usuario)};
    let ruta = "http://localhost:8080/bionika_web/api/acceso/login";
    
    fetch(ruta,
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: new URLSearchParams(parametros)
            }
    ).then(response => response.json())
            .then(response => {
                if (response.idUsuario != 0 && response.idUsuario != null)
                {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("usuario", response.usuario);
                    localStorage.setItem("id", response.idUsuario);
                    localStorage.setItem("idSucursal", response.sucursal.idSucursal);
                    Swal.fire({
                        icon: "success",
                        title: "Bienvenido "+localStorage.getItem("usuario"),
                        text: "Datos de acceso correctos"
                    });
                    cargarNombre();
                    mostrarCerrarSesion();
                    validar();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Datos de acceso incorrectos, vuelve a intentarlo"
                    });
                    document.getElementById("txtUsuario").value = "";
                    document.getElementById("txtPassword").value = "";
                }
            });
}

  export async function cargarNombre()
{
    document.getElementById("btnLogin").innerHTML = 
            localStorage.getItem("usuario");

}
async function validar(){
    let id = localStorage.getItem("id");
    if (id === null) {
        inicio();
        return;
    }
    // Llamar a la función para validar rol
    await validarRol(id);
}
async function inicio() {
       console.log("cargando inicio");

    let url = "http://localhost:8080/bionika_web/modules/inicio/inicio.html";
    let resp = await fetch(url);
    let contenido = await resp.text();
    
    document.getElementById('content').innerHTML = contenido;
    
    cm = await import("http://localhost:8080/bionika_web/modules/inicio/js/inicio.js");
    cm.inicializar();
    
    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer) footer.style.display = 'block'; 
}

async function validarRol(idUsuario) {
    let url = 'http://localhost:8080/bionika_web/api/acceso/validarRol';
    let datos = new URLSearchParams({idUsuario});
    try {
        let resp = await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: datos
        });

        if (!resp.ok)
            throw new Error(`HTTP error! status: ${resp.status}`);

        let data = await resp.json();
        switch (data.idRol) {
            case 1:
                await inicio();
                mostrarBotonUsuarios();
                break;
            case 2:
                inicio();
                break;
            case 3:
                inicio();
                break;
            default:

                throw new Error("Rol no reconocido.");
        }

    } catch (error) {
        console.error("Error en validarRol:", error);
        Swal.fire('Error al validar rol.', error.message, 'error');
        return null;
    }
}

function mostrarBotonUsuarios() {
    const btnUsuarios = document.getElementById("btnUsuario");
    btnUsuarios.classList.remove("hidden");
}

function mostrarCerrarSesion() {
    const cerrarSesionEscritorio = document.getElementById("btnCerrarSesion");
    const cerrarSesionMovil = document.getElementById("btnCerrarSesionMovil");

    cerrarSesionEscritorio.classList.remove("hidden");
    cerrarSesionMovil.classList.remove("hidden");
}
