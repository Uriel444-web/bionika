
let cm = null;

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none'; // evita errores si no existe
        // llama la animación una vez se carga
    }, 2000);
});

tailwind.config = {
    darkMode: 'class'
}

if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

// BOTÓN DE CAMBIO DE TEMA
const toggleBtn = document.getElementById('toggleDark');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');


menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

document.getElementById("btnLogin").addEventListener('click', (event) => {
    event.preventDefault();
    login();
});

document.getElementById("btnLoginMovil").addEventListener('click', (event) => {
    event.preventDefault();
    login();
});

document.getElementById("btnHome").addEventListener('click', (event) => {
    event.preventDefault();
    inicio();
});

document.getElementById("btnProductos").addEventListener('click', (event) => {
    event.preventDefault();
    productos();
});

document.getElementById("btnUsuario").addEventListener('click', (event) => {
    event.preventDefault();
    usuarios();
});

async function inicio() {
    console.log("cargando inicio");
    let url = "http://localhost:8080/bionika_web/modules/inicio/inicio.html";
    let resp = await fetch(url);
    let contenido = await resp.text();
    document.getElementById('content').innerHTML = contenido;
    cm = await import("http://localhost:8080/bionika_web/modules/inicio/js/inicio.js");
    cm.inicializar();
    cm = null;

    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
}

async function login() {
    console.log("Cargando Login...");
    let url = "http://localhost:8080/bionika_web/modules/login/login.html";
    let resp = await fetch(url);
    let contenido = await resp.text();
    document.getElementById('content').innerHTML = contenido;
    cm = await import("http://localhost:8080/bionika_web/modules/login/js/login.js");
    document.getElementById("btn-log").addEventListener("click", (event) => {
        event.preventDefault();
        cm.ingresar();
    });
    //  Mostrar el contenedor oculto
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer)
        loginContainer.classList.remove('hidden');
    //hace invisible el footer   
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'none';
    console.log("se hizo la validacion");
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
    // let url = "http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
    //cm = await import("http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js");
    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
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

    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
}

async function usuarios() {
    console.log("cargando usuarios...");

    let url = "http://localhost:8080/bionika_web/modules/usuario/crud/registro.html";
    // let url = "http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
    let resp = await fetch(url);
    let contenido = await resp.text();

    document.getElementById('content').innerHTML = contenido;


    //cm = await import("http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js");
    cm = await import("http://localhost:8080/bionika_web/modules/usuario/crud/js.js");
    cm.recargarComboBoxCategorias();

    document.getElementById("registrarU").addEventListener("click", (event) => {
        console.log(cm);
        cm.saveUsuario();
    });

    document.getElementById("mostrarU").addEventListener("click", (event) => {
        event.preventDefault();
        mostrarU();
    });

    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';
}

async function mostrarU() {

    let url = "http://localhost:8080/bionika_web/modules/usuario/crud/getAll.html";
    let resp = await fetch(url);
    let contenido = await resp.text();

    document.getElementById('content').innerHTML = contenido;

    cm = await import("http://localhost:8080/bionika_web/modules/usuario/crud/js.js");
    cm.recargarTablaUsuario();
    cm.recargarComboBoxCategorias();
    cm.inhabilitarTextos();
    
    document.getElementById("btnE").addEventListener("click", (event) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                cm._delete();
            }
        });

    });

    document.getElementById("btnHabilitarC").addEventListener("click", (event) => {
    cm.habilitarDatos();
    });
    
    document.getElementById("actualizarUs").addEventListener("click", (event) => {
    cm.saveUsuario();
    });

    const footer = document.getElementById('foter');
    if (footer)
        footer.style.display = 'block';

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

