/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
let cm = null;
export async function inicializar(){
const texto = "Productos Destacados";
    const maquina = document.getElementById('maquina');

    function escribirTexto() {
        maquina.textContent = ""; // Limpiar antes de escribir
        let i = 0;
        const intervalo = setInterval(() => {
            if (i < texto.length) {
                maquina.textContent += texto.charAt(i);
                i++;
            } else {
                clearInterval(intervalo);
            }
        }, 100); // velocidad de escritura (100 ms por letra)
    }

    // Escribir inmediatamente al cargar
    escribirTexto();

    // Repetir cada 1 minuto (60000 ms)
    setInterval(escribirTexto, 20000);
    
    document.getElementById("btnMas").addEventListener('click', (event) => {
            event.preventDefault();
            productos();
        });
    }
    
        
        async function productos() {
           console.log("cargando productos...");
           let id = localStorage.getItem("id");
            if (id === null) {
               productosDef();
                return;
            }
           // Llamar a la función para validar rol
          await validarRol(id);
        const footer = document.getElementById('foter');
        if (footer) footer.style.display = 'block'; 
    }
    
    // ESTA ES LA FUNCION QUE SE EJECUTARA ANTES DE CARGAR LOS PRODUCTOS PARA 
    // MOSTRAR SU RESPECTIVA VISTA A CADA TIPO DE ROL
    async function validarRol(idUsuario) {
        let url = 'http://localhost:8080/bionika_web/api/acceso/validarRol';
        let datos = new URLSearchParams({ idUsuario });
        try {
            let resp = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: datos
            });

            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

            let data = await resp.json();
            switch (data.idRol) {
                case 1:
                    administrador();
                    break;
                case 2:
                    // aqui vamos a poner su html y el js cuando lo creemos xd
                    console.log("empleado");
                    break;
                case 3:
                    productosDef();
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
    
    async function productosDef(){
        cm = null;
        console.log("usuario no autenticado");
        let urlDef="http://localhost:8080/bionika_web/modules/usuario/productos/inicio.html";
        let respDef = await fetch(urlDef);
        let contenidoDef = await respDef.text();
        document.getElementById('content').innerHTML = contenidoDef;
        cm = await import(`http://localhost:8080/bionika_web/modules/usuario/productos/js/inicio.js?update=${Date.now()}`);
        cm.inicializar();
    }
    
    async function administrador(){
        cm = null;
        console.log("usuario Administrador");
        let urlAdmin="http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
        let respAdmin = await fetch(urlAdmin);
        let contenidoAdmin = await respAdmin.text();
        document.getElementById('content').innerHTML = contenidoAdmin;
        cm = await import(`http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js?update=${Date.now()}`);
        cm.inicializar();
    }