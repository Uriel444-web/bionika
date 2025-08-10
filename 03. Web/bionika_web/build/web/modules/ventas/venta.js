
// Arreglo global de detalles de venta
window.ventaDetalles = [];
document.getElementById("buscarProducto").addEventListener('click', buscarProductoPorClave);
document.getElementById("agregarVenta").addEventListener('click', agregarProductoAVenta);
document.getElementById("registrarVenta").addEventListener('click', registrarVenta);

export async function buscarProductoPorClave() {
    console.log('Buscando producto...');
    let clave = document.getElementById("txtClaveInterna").value.trim();
    let idSucursal = localStorage.getItem("idSucursal");

    if (!clave) {
        Swal.fire("Advertencia", "Ingresa una clave interna", "warning");
        return;
    }

    if (!idSucursal) {
        Swal.fire("Error", "No se ha definido la sucursal del usuario", "error");
        return;
    }

    let url = `http://localhost:8080/bionika_web/api/venta/getByClave/${encodeURIComponent(clave)}/${idSucursal}`;

    try {
        let resp = await fetch(url);
        let producto = await resp.json();

        if (!producto || producto.idProducto === 0 || producto.error) {
            Swal.fire("No encontrado", "No se encontró un producto con esa clave", "error");
            return;
        }

        document.getElementById("txtNombreProducto").value = producto.nombre;
        document.getElementById("txtPrecio").value = `$${producto.precio.toFixed(2)}`;
        document.getElementById("txtUnidadProducto").value = producto.detalles[0]?.nombreUnidad || "";

        let cmbTalla = document.getElementById("cmbTalla");
        cmbTalla.innerHTML = "";
        producto.detalles.forEach((d) => {
            let option = document.createElement("option");
            option.value = d.idTalla;
            option.text = d.nombreTalla;
            cmbTalla.appendChild(option);
        });

        window.productoSeleccionado = producto;
        document.getElementById("formProducto").classList.remove("hidden");

    } catch (err) {
        console.error("Error:", err);
        Swal.fire("Error", "Ocurrió un error al buscar el producto", "error");
    }
}

export function agregarProductoAVenta() {
    const producto = window.productoSeleccionado;
    const cantidad = parseInt(document.getElementById("txtCantidad").value);
    const idTalla = parseInt(document.getElementById("cmbTalla").value);
    const aplicarDescuento = document.getElementById("checkDescuento").checked;
    const descuentoPorcentaje = aplicarDescuento
            ? parseFloat(document.getElementById("txtDescuento").value)
            : 0;

    if (!producto || isNaN(cantidad) || cantidad <= 0 || isNaN(idTalla)) {
        Swal.fire("Error", "Verifica la información ingresada", "warning");
        return;
    }

    if (aplicarDescuento && (isNaN(descuentoPorcentaje) || descuentoPorcentaje < 0 || descuentoPorcentaje > 100)) {
        Swal.fire("Error", "Porcentaje de descuento inválido", "warning");
        return;
    }

    const detalle = producto.detalles.find(d => d.idTalla === idTalla);
    if (!detalle) {
        Swal.fire("Error", "Talla no encontrada para este producto", "error");
        return;
    }

    const precioUnitario = producto.precio;
    const totalBruto = precioUnitario * cantidad;

    // Calcular descuento (basado en total bruto)
    const descuento = totalBruto * (descuentoPorcentaje / 100);
    const totalConDescuento = totalBruto - descuento;

    // IVA sobre total con descuento (para que cliente pague el IVA del precio ya rebajado)
    const iva = 0.16 * totalConDescuento;

    const detalleVenta = {
        idProducto: producto.idProducto,
        nombreProducto: producto.nombre,
        idTalla: detalle.idTalla,
        nombreTalla: detalle.nombreTalla,
        idUnidad: detalle.idUnidad,
        nombreUnidad: detalle.nombreUnidad,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        descuento: descuento, // monto, no %
        total: totalConDescuento,
        subtotal: totalBruto,
        iva: iva
    };

    window.ventaDetalles.push(detalleVenta);

    const tbody = document.getElementById("tablaProductos");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="border px-4 py-2">${detalleVenta.nombreProducto}</td>
        <td class="border px-4 py-2">${detalleVenta.nombreTalla}</td>
        <td class="border px-4 py-2">${detalleVenta.cantidad}</td>
        <td class="border px-4 py-2">${detalleVenta.nombreUnidad}</td>
        <td class="border px-4 py-2">$${precioUnitario.toFixed(2)}</td>
        <td class="border px-4 py-2">${descuentoPorcentaje ? descuentoPorcentaje + "%" : "-"}</td>
        <td class="border px-4 py-2">$${totalBruto.toFixed(2)}</td> <!-- Mostrar total sin descuento -->
        <td class="border px-4 py-2 text-center">
            <button onclick="eliminarProductoDeVenta(this)" class="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </td>
    `;
    tbody.appendChild(row);

    actualizarTotales();

    // Reset campos
    document.getElementById("txtClaveInterna").value = "";
    document.getElementById("formProducto").classList.add("hidden");
}

function actualizarTotales() {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    let descuentoTotal = 0;

    for (const detalle of window.ventaDetalles) {
        subtotal += detalle.subtotal;
        iva += detalle.iva;
        total += detalle.total;
        descuentoTotal += detalle.descuento;
    }

    document.getElementById("subtotalVenta").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("ivaVenta").innerText = `$${iva.toFixed(2)}`;
    document.getElementById("totalAcumulado").innerText = `$${total.toFixed(2)}`;
    document.getElementById("descuentoVenta").innerText = `$${descuentoTotal.toFixed(2)}`;
}




export function eliminarProductoDeVenta(boton) {
    const fila = boton.closest("tr");
    const indice = Array.from(fila.parentNode.children).indexOf(fila);

    // Elimina del arreglo
    window.ventaDetalles.splice(indice, 1);

    // Elimina visualmente la fila
    fila.remove();

    // Recalcular total
    const totalActual = window.ventaDetalles.reduce((acc, item) => acc + item.total, 0);
    document.getElementById("totalAcumulado").textContent = `$${totalActual.toFixed(2)}`;
    limpiarFormularioVenta();
}

export async function registrarVenta() {
    const cliente = document.getElementById("txtCliente").value.trim();

    if (cliente === "" || window.ventaDetalles.length === 0) {
        Swal.fire("Error", "Debes ingresar el nombre del cliente y al menos un producto", "error");
        return;
    }

    // Calcular total
    const total = window.ventaDetalles.reduce((sum, d) => sum + d.total, 0);

    // Obtener usuario y sucursal desde localStorage (ajusta si usas otra fuente)
    const usuario = JSON.parse(localStorage.getItem("id"));
    const sucursal = JSON.parse(localStorage.getItem("idSucursal"));
    let venta = {
        cliente: cliente,
        total: total,
        usuario: {idUsuario: usuario},
        sucursal: {idSucursal: sucursal},
        detalles: window.ventaDetalles
    };

    const url = "http://localhost:8080/bionika_web/api/venta/save";
    const datos = {datosVenta: JSON.stringify(venta)};
    const params = new URLSearchParams(datos);

    try {
        const resp = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
            body: params
        });
        // en esta variable voy a copiar la estructra original de venta para no modificar el modelo pq q hueva jeje
        const ventaCopiada = structuredClone(venta);
        console.log(ventaCopiada);
        const result = await resp.json();

        if (result.error) {
            Swal.fire("Error", result.error, "error");
            return;
        }

        // ahora sustituimos los detalles en la respuesta por los de la variable donde copiamos el original
        result.detalles = ventaCopiada.detalles;
        // Venta registrada correctamente
        Swal.fire({
            icon: "success",
            title: "Venta registrada",
            text: "Generando nota de venta...",
            timer: 2000,
            showConfirmButton: false
        });

        // Ahora sí, generar el PDF
        await generarNotaVentaPDF(result);

        limpiarFormularioVenta();
        window.ventaDetalles = [];
    } catch (error) {
        console.error("Error al registrar venta:", error);
        Swal.fire("Error", "Hubo un problema al registrar la venta", "error");
    }
}

async function generarNotaVentaPDF(venta) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
    });

    const margen = 4;
    let y = 10;

    // Logo
    const logoWidth = 40;
    const logoHeight = 12;
    const centerX = (80 - logoWidth) / 2;
    const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAYAAACrHtS+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUY0QzRDNTRCNDZBMTFFN0E0MTFFNjA4MzY3MDk1REUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUY0QzRDNTVCNDZBMTFFN0E0MTFFNjA4MzY3MDk1REUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBRjRDNEM1MkI0NkExMUU3QTQxMUU2MDgzNjcwOTVERSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBRjRDNEM1M0I0NkExMUU3QTQxMUU2MDgzNjcwOTVERSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlSgeOcAAB6uSURBVHja7J0HXFTH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";
    doc.addImage(logoBase64, 'PNG', centerX, y, logoWidth, logoHeight);
    y += logoHeight + 3;

    // Empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('BIONIKA', 40, y, {align: 'center'});
    y += 5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('5 de nayo 725 Col. Obregon Leon, Guanajuato, Mexico', 40, y, {align: 'center'});
    y += 3;
    doc.text('Tel: +52 (477) 713 1452', 40, y, {align: 'center'});
    y += 5;

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Fecha y Folio
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Folio: ${venta.idVenta}`, margen, y);
    doc.text(`Fecha: ${fechaFormateada}`, 80 - margen, y, {align: 'right'});
    y += 4;

    doc.setLineWidth(0.3);
    doc.line(margen, y, 80 - margen, y);
    y += 4;

    // Cliente
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${venta.cliente}`, margen, y);
    y += 4;

    doc.line(margen, y, 80 - margen, y);
    y += 4;

    // Detalle productos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('Producto', margen, y);
    doc.text('Cant', 35, y);
    doc.text('Precio', 50, y);
    doc.text('Subtotal', 75, y, {align: 'right'});
    y += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    venta.detalles.forEach(detalle => {
        const producto = detalle.nombreProducto;
        const cantidad = detalle.cantidad;
        const precio = detalle.precioUnitario.toFixed(2);
        const subtotal = detalle.subtotal.toFixed(2);

        let nombreProducto = producto.length > 22 ? producto.substring(0, 22) + '…' : producto;

        doc.text(nombreProducto, margen, y);
        doc.text(`${cantidad}`, 35, y);
        doc.text(`$${precio}`, 50, y);
        doc.text(`$${subtotal}`, 75, y, {align: 'right'});
        y += 4;
    });

    doc.line(margen, y, 80 - margen, y);
    y += 4;

    // Totales
    const total = venta.detalles.reduce((acc, d) => acc + d.subtotal, 0);
    const totalDescuento = venta.detalles.reduce((acc, d) => acc + d.total, 0);
    const iva = venta.detalles.reduce((acc, d) => acc + d.iva, 0);
    const descuento = venta.detalles.reduce((acc, d) => acc + d.descuento, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Subtotal:`, 48, y);
    doc.text(`$${total.toFixed(2)}`, 80 - margen, y, {align: 'right'});
    y += 4;

    doc.text(`Descuento:`, 48, y);
    doc.text(`$${descuento.toFixed(2)}`, 80 - margen, y, {align: 'right'});
    y += 4;

    doc.text(`Subtotal:`, 48, y);
    doc.text(`$${totalDescuento.toFixed(2)}`, 80 - margen, y, {align: 'right'});
    y += 4;

    doc.text(`IVA:`, 48, y);
    doc.text(`$${iva.toFixed(2)}`, 80 - margen, y, {align: 'right'});
    y += 4;

    doc.text(`Total:`, 48, y);
    doc.text(`$${venta.total.toFixed(2)}`, 80 - margen, y, {align: 'right'});
    y += 6;

    // Mensaje final
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Gracias por su compra.', 40, y, {align: 'center'});
    y += 4;
    doc.text('Bionika - Productos ortopédicos', 40, y, {align: 'center'});

    doc.save(`NotaVenta_${venta.idVenta}.pdf`);
}



document.getElementById("checkDescuento").addEventListener("change", () => {
    const input = document.getElementById("txtDescuento");
    input.disabled = !event.target.checked;
    if (!event.target.checked)
        input.value = "";
});

function limpiarFormularioVenta() {
    // Limpiar campos de cliente y clave
    document.getElementById("txtCliente").value = "";
    document.getElementById("txtClaveInterna").value = "";

    // Limpiar formulario del producto
    document.getElementById("txtNombreProducto").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtUnidadProducto").value = "";
    document.getElementById("txtCantidad").value = "";
    document.getElementById("cmbTalla").innerHTML = ""; // Limpiar opciones
    document.getElementById("txtDescuento").value = "";
    document.getElementById("txtDescuento").disabled = true;
    document.getElementById("checkDescuento").checked = false;

    // Ocultar formulario de producto (si lo usas de esa manera)
    document.getElementById("formProducto").classList.add("hidden");

    // Limpiar tabla de productos agregados
    document.getElementById("tablaProductos").innerHTML = "";

    // Reiniciar totales
    document.getElementById("descuentoVenta").textContent = "$0.00";
    document.getElementById("subtotalVenta").textContent = "$0.00";
    document.getElementById("ivaVenta").textContent = "$0.00";
    document.getElementById("totalAcumulado").textContent = "$0.00";
}

window.eliminarProductoDeVenta = eliminarProductoDeVenta;



