

//////////////////////////////////////////////

// LOGICA
let cm = null;
let animacionIntervalId = null;
let grupoIntervalId = null;

export async function inicializar() {
    // ANIMACIONES

    // LIMPIAR INTERVALOS ANTERIORES
    if (animacionIntervalId)
        clearInterval(animacionIntervalId);
    if (grupoIntervalId)
        clearInterval(grupoIntervalId);

    const grupo1 = document.getElementById('grupo1');
    const grupo2 = document.getElementById('grupo2');

    let mostrandoGrupo1 = true;

    const grupos = [
        ["prod-1", "prod-2", "prod-3"],
        ["prod-4", "prod-5", "prod-6"]
    ];
    let animIndex = 0;

    function animarGrupoVisible() {
        grupos.flat().forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.remove("scale-110", "z-10");
        });

        const grupoActual = mostrandoGrupo1 ? grupos[0] : grupos[1];
        const idActual = grupoActual[animIndex % grupoActual.length];
        const elemento = document.getElementById(idActual);

        if (elemento) {
            elemento.classList.add("scale-110", "z-10");
        }

        animIndex++;
    }

    function alternarGrupos() {
        if (mostrandoGrupo1) {
            grupo1.style.opacity = '0';
            grupo1.style.pointerEvents = 'none';

            grupo2.style.opacity = '1';
            grupo2.style.pointerEvents = 'auto';
        } else {
            grupo2.style.opacity = '0';
            grupo2.style.pointerEvents = 'none';

            grupo1.style.opacity = '1';
            grupo1.style.pointerEvents = 'auto';
        }

        mostrandoGrupo1 = !mostrandoGrupo1;
        animIndex = 0;
    }

    animacionIntervalId = setInterval(animarGrupoVisible, 2000);
    grupoIntervalId = setInterval(alternarGrupos, 8000);
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
    if (footer)
        footer.style.display = 'block';
}

// ESTA ES LA FUNCION QUE SE EJECUTARA ANTES DE CARGAR LOS PRODUCTOS PARA 
// MOSTRAR SU RESPECTIVA VISTA A CADA TIPO DE ROL
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

async function productosDef() {
    cm = null;
    console.log("usuario no autenticado");
    let urlDef = "http://localhost:8080/bionika_web/modules/usuario/productos/inicio.html";
    let respDef = await fetch(urlDef);
    let contenidoDef = await respDef.text();
    document.getElementById('content').innerHTML = contenidoDef;
    cm = await import(`http://localhost:8080/bionika_web/modules/usuario/productos/js/inicio.js?update=${Date.now()}`);
    cm.inicializar();
}

async function administrador() {
    cm = null;
    console.log("usuario Administrador");
    let urlAdmin = "http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
    let respAdmin = await fetch(urlAdmin);
    let contenidoAdmin = await respAdmin.text();
    document.getElementById('content').innerHTML = contenidoAdmin;
    cm = await import(`http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js?update=${Date.now()}`);
    cm.inicializar();
}
    