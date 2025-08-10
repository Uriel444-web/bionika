/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.DetalleVenta;
import com.bionika.model.Sucursal;
import com.bionika.model.Usuario;
import com.bionika.model.Venta;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;
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
            detalle.addProperty("descuento", d.getDescuento());
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


        public ArrayList<Venta> getVentasPorSucursalYFechas(int idSucursal, String fechaInicio, String fechaFin) throws Exception {
            ArrayList<Venta> ventas = new ArrayList<>();
            String query = """
            SELECT * FROM vista_venta_con_detalles
            WHERE idSucursal = ? AND DATE(fecha) BETWEEN ? AND ?
            ORDER BY fecha DESC
        """;

            ConexionMySQL connMySQL = new ConexionMySQL();
            Connection conn = connMySQL.open();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, idSucursal);
            pstmt.setString(2, fechaInicio);
            pstmt.setString(3, fechaFin);

            ResultSet rs = pstmt.executeQuery();

            Gson gson = new Gson();
            Type listType = new TypeToken<ArrayList<DetalleVenta>>() {
            }.getType();

            while (rs.next()) {
                Venta v = new Venta();
                v.setIdVenta(rs.getInt("idVenta"));
                v.setFecha(rs.getTimestamp("fecha"));
                v.setCliente(rs.getString("cliente"));
                v.setTotal(rs.getDouble("totalVenta"));

                Usuario u = new Usuario();
                u.setIdUsuario(rs.getInt("idUsuario"));
                u.setUsuario(rs.getString("nombreEmpleado"));
                v.setUsuario(u);

                Sucursal s = new Sucursal();
                s.setIdSucursal(rs.getInt("idSucursal"));
                s.setNombreSuc(rs.getString("nombreSucursal"));
                v.setSucursal(s);

                String jsonDetalles = rs.getString("detalles");
                if (jsonDetalles != null) {
                    ArrayList<DetalleVenta> detalles = gson.fromJson(jsonDetalles, listType);
                    v.setDetalles(detalles);
                }

                ventas.add(v);
            }

            rs.close();
            pstmt.close();
            connMySQL.close();

            return ventas;
        }
    }
