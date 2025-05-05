/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

 export function ingresar()
{
    let u = document.getElementById("txtUsuario").value;
    let c = document.getElementById("txtPassword").value;
    
    let usuario = {usuario: u, contrasenia: c};
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
                if (response.id != 0 && response.id != null)
                {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("usuario", response.usuario);
                    Swal.fire({
                        icon: "success",
                        title: "Bienvenido "+localStorage.getItem("usuario"),
                        text: "Datos de acceso correctos"
                    });
                    
                    cargarNombre();
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

export function logOut()
{
    let parametros = {t: localStorage.getItem("token")};
    let ruta = "http://localhost:8080/bionika_web/api/acceso/logout";
    
    fetch(ruta, {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: new URLSearchParams(parametros)
    }
    ).then(response => response.json())
            .then(response => {
                if (response.result)
                {
                    localStorage.removeItem("token");
                    window.location.href = "http://localhost:8080/bionika_web/";
                } else if (response.error)
                {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.error
                    });
                }
            });
}

  export function cargarNombre()
{
    document.getElementById("btnLogin").innerHTML = 
            localStorage.getItem("usuario");

}
