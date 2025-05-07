
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
    
    // ✅ Mostrar el contenedor oculto
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer)
        loginContainer.classList.remove('hidden');
       
    //hace invisible el footer   
    const footer = document.getElementById('foter');
    if (footer) footer.style.display = 'none';
  
    console.log("se hizo la validacion");
}

    async function productos() {
       console.log("cargando productos...");
    //let url="http://localhost:8080/bionika_web/modules/usuario/productos/inicio.html";
    let url = "http://localhost:8080/bionika_web/modules/administrador/productos/inicio.html";
    let resp = await fetch(url);
    let contenido = await resp.text();
    
    document.getElementById('content').innerHTML = contenido;
    
    cm = await import("http://localhost:8080/bionika_web/modules/administrador/productos/js/inicio.js");
    cm.inicializar();
    
    //hace visible el footer
    const footer = document.getElementById('foter');
    if (footer) footer.style.display = 'block'; 
}


