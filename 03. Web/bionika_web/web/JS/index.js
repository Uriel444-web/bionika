let cm = null;
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none'; // evita errores si no existe
         // llama la animación una vez se carga
    }, 2000);
});
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

async function inicio(){
    console.log("cargando inicio");
    
    const hoverTrigger = document.querySelector('.login-hover-trigger');
    const navbar = document.getElementById('navbar');
     if (hoverTrigger && navbar) {
        hoverTrigger.onmouseenter = null; // Eliminar listener
        navbar.onmouseleave = null;
    }
    
   let url="http://localhost:8080/bionika_web/modules/inicio/inicio.html";
   let resp = await fetch(url);
   let contenido = await resp.text();
   document.getElementById('content').innerHTML = contenido;
   cm = await import("http://localhost:8080/bionika_web/modules/inicio/js/inicio.js");
   cm.inicializar();
   
   navbar.classList.remove('navbar-hidden');
    navbar.classList.add('navbar-visible');
    hoverTrigger?.classList.add('hidden');
}

async function login(){
    console.log("Cargando Login...");
   let url="http://localhost:8080/bionika_web/modules/login/login.html";
   let resp = await fetch(url);
   let contenido = await resp.text();
   document.getElementById('content').innerHTML = contenido;
   cm = await import("http://localhost:8080/bionika_web/modules/login/js/login.js");
   
   // ✅ Mostrar el contenedor oculto
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) loginContainer.classList.remove('hidden');
        
        const navbar = document.getElementById('navbar');
        const hoverTrigger = document.querySelector('.login-hover-trigger');
    
         if(navbar && hoverTrigger) {
        navbar.classList.add('navbar-hidden');
        hoverTrigger.classList.remove('hidden');
        
        // Control de hover
        hoverTrigger.addEventListener('mouseenter', () => {
            navbar.classList.remove('navbar-hidden');
        });
        
        navbar.addEventListener('mouseleave', () => {
                navbar.classList.add('navbar-hidden');
                });       
        
    }    
    console.log("se hizo la validacion");
}

async function productos(){
    console.log("cargando productos...");
   //let url="http://localhost:8080/bionika_web/modules/usuario/productos/inicio.html";
   let url="http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
   let resp = await fetch(url);
   let contenido = await resp.text();
   document.getElementById('content').innerHTML = contenido;
   cm = await import("http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js");
   cm.inicializar();
}


