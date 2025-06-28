/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.DetalleVenta;
import com.bionika.model.Venta;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.Gson;
/**
 *
 * @author casa
 */
public class ControllerVentas {

    public int insert(Venta venta) throws Exception {
        String sql = "{CALL registrarVenta(?, ?, ?, ?, ?, ?)}";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cstmt = conn.prepareCall(sql);

        // Convertir la lista de detalles a JSON compatible con MySQL
        JsonArray detallesArray = new JsonArray();
        for (DetalleVenta d : venta.getDetalles()) {
            JsonObject detalle = new JsonObject();
            detalle.addProperty("idProducto", d.getIdProducto());
            detalle.addProperty("cantidad", d.getCantidad());
            detalle.addProperty("idTalla", d.getIdTalla());
            detalle.addProperty("idUnidad", d.getIdUnidad());
            detalle.addProperty("precioUnitario", d.getPrecioUnitario());
            detalle.addProperty("total", d.getTotal());
            detallesArray.add(detalle);
        }

        Gson gson = new Gson();
        String detallesJson = gson.toJson(detallesArray);

        // Parámetros de entrada
        cstmt.setString(1, venta.getCliente());
        cstmt.setDouble(2, venta.getTotal());
        cstmt.setInt(3, venta.getUsuario().getIdUsuario());
        cstmt.setInt(4, venta.getSucursal().getIdSucursal());
        cstmt.setString(5, detallesJson);

        // Parámetro de salida
        cstmt.registerOutParameter(6, java.sql.Types.INTEGER);

        // Ejecutar SP
        cstmt.executeUpdate();

        // Obtener el ID generado
        int idVentaGenerada = cstmt.getInt(6);
        venta.setIdVenta(idVentaGenerada);

        // Cerrar conexiones
        cstmt.close();
        conn.close();

        return idVentaGenerada;
    }
}
