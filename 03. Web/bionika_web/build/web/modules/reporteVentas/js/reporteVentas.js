
let sucursales = [];
let vent = [];
document.getElementById("btnBuscarVentas").addEventListener("click", buscarVentas);
document.getElementById("btnGenerarPDF").addEventListener("click", generarPDFReporteVentas);
document.getElementById("btnVentasHoy").addEventListener('click', buscarVentasHoy);

export async function inicializar() {
    cargarSucursales();
    document.getElementById("btnRegresarReporte").addEventListener('click', ocultarDetalle);
}
// Archivo: reporteVentas.js

// Llenar comboBox de sucursales
export async function cargarSucursales() {
    const url = "http://localhost:8080/bionika_web/api/sucursal/getAll";
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        sucursales = data;

        const combo = document.getElementById("selectSucursal");
        combo.innerHTML = '<option value="">Seleccione una sucursal</option>';

        sucursales.forEach(suc => {
            const option = document.createElement("option");
            option.value = suc.idSucursal;
            option.textContent = suc.nombreSuc;
            combo.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar sucursales:", error);
        Swal.fire("Error", "No se pudieron cargar las sucursales.", "error");
    }
}

// Buscar ventas por sucursal y fechas
export async function buscarVentas() {
    const idSucursal = document.getElementById("selectSucursal").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    console.log(fechaInicio);
    if (!idSucursal) {
        Swal.fire("Advertencia", "Seleccione una sucursal.", "warning");
        return;
    }

    if (!fechaInicio || !fechaFin) {
        Swal.fire("Advertencia", "Seleccione un rango de fechas completo.", "warning");
        return;
    }

    const url = `http://localhost:8080/bionika_web/api/venta/porSucursal/${idSucursal}/${fechaInicio}/${fechaFin}`;

    try {
        const resp = await fetch(url);
        const ventas = await resp.json();

        if (ventas.error) {
            Swal.fire("Error", ventas.error, "error");
        } else {
            vent = ventas;
            llenarTablaVentas(ventas);
        }
    } catch (error) {
        console.error("Error al consultar ventas:", error);
        Swal.fire("Error", "No se pudieron obtener las ventas.", "error");
    }
}

// funcion para buscar las ventas solo de ese dia
export async function buscarVentasHoy() {
    const idSucursal = document.getElementById("selectSucursal").value;

    if (!idSucursal) {
        Swal.fire("Advertencia", "Seleccione una sucursal.", "warning");
        return;
    }

    const hoy = new Date();
    const hoyLocal = hoy.toLocaleDateString('en-CA'); 
    console.log(hoyLocal);
    const url = `http://localhost:8080/bionika_web/api/venta/porSucursal/${idSucursal}/${hoyLocal}/${hoyLocal}`;

    try {
        const resp = await fetch(url);
        const ventas = await resp.json();
        console.log(ventas);
        if (ventas.error) {
            Swal.fire("Error", ventas.error, "error");
        } else {
            vent = ventas;
            llenarTablaVentas(ventas);
        }
    } catch (error) {
        console.error("Error al consultar ventas de hoy:", error);
        Swal.fire("Error", "No se pudieron obtener las ventas de hoy.", "error");
    }
}


// Llenar la tabla con resultados
function llenarTablaVentas(ventas) {
    console.log(ventas);
    const tabla = document.getElementById("tablaVentas");
    tabla.innerHTML = "";

    if (ventas.length === 0) {
        tabla.innerHTML = `<tr><td colspan='6' class='text-center py-4'>No hay ventas registradas para esta sucursal.</td></tr>`;
        return;
    }

    ventas.forEach(v => {
        tabla.innerHTML += `
            <tr class="border-b border-gray-200 dark:border-zinc-700">
                <td class="px-6 py-3">${v.idVenta}</td>
                <td class="px-6 py-3">${new Date(v.fecha).toLocaleString()}</td>
                <td class="px-6 py-3">${v.cliente}</td>
                <td class="px-6 py-3">${v.usuario.usuario}</td>
                <td class="px-6 py-3">$${v.total.toFixed(2)}</td>
                <td class="px-6 py-3">
                    <button class="text-sm text-blue-600 hover:underline" onclick="verDetalle(${v.idVenta})">Ver detalles</button>
                </td>
            </tr>`;
    });
}

function verDetalle(idVenta) {
    mostrarDetalle();

    setTimeout(() => {
        const d = vent.find(d => d.idVenta === idVenta);
        if (!d) {
            console.error("Venta no encontrada con ID:", idVenta);
            return;
        }

        // Cargar datos generales
        document.getElementById("detalleFolio").textContent = d.idVenta;
        document.getElementById("detalleFecha").textContent = new Date(d.fecha).toLocaleString();
        document.getElementById("detalleCliente").textContent = d.cliente;
        document.getElementById("detalleEmpleado").textContent = d.usuario.usuario;
        document.getElementById("detalleSucursal").textContent = d.sucursal.nombreSuc;
        document.getElementById("detalleTotal").textContent = d.total.toFixed(2);

        // Limpiar cards
        const contenedor = document.getElementById("contenedorCardsDetalle");
        contenedor.innerHTML = "";

        // Crear cards
        d.detalles.forEach(async de => {
            const card = document.createElement("div");
            card.className = "bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 space-y-4 flex flex-col";

            const imagenSrc = await obtenerImagenBase64(de.idProducto);

            card.innerHTML = `
    <img src="${imagenSrc}" alt="${de.nombreProducto}" class="w-full h-48 object-cover rounded-md shadow" />
    <div class="flex flex-col gap-1 text-zinc-700 dark:text-white">
      <h3 class="text-lg font-bold text-purple-700 dark:text-purple-300">${de.nombreProducto}</h3>
      <p><span class="font-semibold">Código:</span> ${de.codigoInterno}</p>
      <p><span class="font-semibold">Talla:</span> ${de.nombreTalla}</p>
      <p><span class="font-semibold">Cantidad:</span> ${de.cantidad} ${de.nombreUnidad}</p>
      <p><span class="font-semibold">Precio Unitario:</span> $${de.precioUnitario.toFixed(2)}</p>
      <p><span class="font-semibold">Subtotal:</span> $${(de.precioUnitario * de.cantidad).toFixed(2)}</p>
    </div>
  `;

            contenedor.appendChild(card);
        });

        console.log("Formulario cargado con los datos de la venta:", d);
    }, 300);
}

// Función auxiliar para obtener imagen base64 desde el backend
async function obtenerImagenBase64(idProducto) {
    try {
        const response = await fetch(`http://localhost:8080/bionika_web/api/venta/${idProducto}/imagen`);
        if (!response.ok) {
            throw new Error("Imagen no encontrada");
        }

        const base64 = await response.text();
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error(`Error al cargar la imagen del producto ${idProducto}:`, error);
        // devolvemos una imagen por defecto en caso de que falle para que no truene lo demas
        return "img/default.png";
    }
}

async function generarPDFReporteVentas() {
    if (!vent || vent.length === 0) {
        Swal.fire("Advertencia", "No hay ventas para exportar.", "info");
        return;
    }

    const idSucursal = document.getElementById("selectSucursal").value;
    const fechaInicio = document.getElementById("fechaInicio").value || new Date().toLocaleDateString('en-CA');
    const fechaFin = document.getElementById("fechaFin").value || new Date().toLocaleDateString('en-CA');

    const sucursalNombre = document.querySelector(`#selectSucursal option[value="${idSucursal}"]`).textContent;

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reporte de Ventas", 14, 20);
    doc.setFontSize(12);
    doc.text(`Sucursal: ${sucursalNombre}`, 14, 30);
    doc.text(`Rango: ${fechaInicio} a ${fechaFin}`, 14, 37);

    const tableHead = [["No. Nota", "Cliente", "Empleado", "Fecha", "Total"]];
    const tableBody = vent.map(venta => [
            venta.idVenta,
            venta.cliente,
            venta.usuario?.usuario || "—",
            new Date(venta.fecha).toLocaleString(),
            `$${venta.total.toFixed(2)}`
        ]);

    doc.autoTable({
        startY: 45,
        head: tableHead,
        body: tableBody,
        styles: {fontSize: 10},
        headStyles: {fillColor: [199, 210, 254], textColor: 40},
        margin: {left: 14, right: 14},
        theme: "grid"
    });

    doc.save(`ReporteVentas_${sucursalNombre}_${fechaInicio}_a_${fechaFin}.pdf`);
}


async function mostrarDetalle() {
    document.getElementById("reporte-ventas").classList.add("hidden");
    document.getElementById("verDetalle").classList.remove("hidden");
}

async function ocultarDetalle() {
    document.getElementById("verDetalle").classList.add("hidden");
    document.getElementById("reporte-ventas").classList.remove("hidden");
}

window.verDetalle = verDetalle;



