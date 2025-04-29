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

async function inicio(){
    console.log("cargando inicio");
   let url="http://localhost:8080/bionika_web/modules/inicio/inicio.html";
   let resp = await fetch(url);
   let contenido = await resp.text();
   document.getElementById('content').innerHTML = contenido;
   cm = await import("http://localhost:8080/bionika_web/modules/inicio/js/inicio.js");
   cm.inicializar();
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
    if (loginContainer) {
        loginContainer.classList.remove('hidden');
    }
    console.log("se hizo la validacion");
}

