/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
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
    }