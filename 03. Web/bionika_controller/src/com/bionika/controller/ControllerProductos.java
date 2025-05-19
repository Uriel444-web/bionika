/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Producto;
import java.lang.reflect.Type;
import com.bionika.model.Categoria;
import com.bionika.model.Color;
import com.bionika.model.DetalleProducto;
import com.bionika.model.Talla;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerProductos {

    public int insertarProducto(Producto producto) {
        int idProducto = 0;
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        CallableStatement cstmt;
        try {
            conn = connMySQL.open();
            String query = "{CALL insertar_producto_con_detalles(?, ?, ?, ?, ?, ?, ?, ?)}";
            cstmt = conn.prepareCall(query);
            // Convertir detalles a JSON
            JsonArray jsonArray = new JsonArray();
            for (DetalleProducto detalle : producto.getDetalles()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("idTalla", detalle.getIdTalla());
                obj.addProperty("idColor", detalle.getIdColor());
                obj.addProperty("stock", detalle.getStock());
                jsonArray.add(obj);
            }
            Gson gson = new Gson();
            String jsonDetalles = gson.toJson(jsonArray);
            // Asignar parámetros
            cstmt.setString(1, producto.getFoto());
            cstmt.setString(2, producto.getNombre());
            cstmt.setString(3, producto.getDescripcion());
            cstmt.setDouble(4, producto.getPrecio());
            cstmt.setString(5, producto.getCodigoInterno());
            cstmt.setInt(6, producto.getCategoria().getIdCategoria());
            cstmt.setString(7, jsonDetalles);
            cstmt.executeUpdate();
            producto.setIdProducto(cstmt.getInt(8));
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return producto.getIdProducto();
    }

    //public void update(Producto p) throws Exception {
    // Se define la consulta SQL:
    //  String sql = "{CALL actualizarProducto(?, ?, ?, ?, ?, ?, ?, ?)}";
    // Abrimos la conexion con la BD:
    // ConexionMySQL connMySQL = new ConexionMySQL();
    // Connection conn = connMySQL.open();
    // Generamos un CallableStatement para invocar al Stored Procedure:
    // CallableStatement cstmt = conn.prepareCall(sql);
    // Colocamos los valores de los parametros de entrada que requiere
    // el Stored Procedure:
    //cstmt.setInt(1, p.getIdProducto());
    //cstmt.setString(2, p.getFoto());
    //cstmt.setString(3, p.getNombre());
    //cstmt.setString(4, p.getDescripcion());
    //cstmt.setDouble(5, p.getPrecio());
    //cstmt.setString(6, p.getCodigoInterno());
    //cstmt.setInt(7, p.getCategoria().getIdCategoria());
    // Ejecutamos el Stored Procedure:
    //cstmt.executeUpdate();
    //Cerramos los objetos de conexion:
    //cstmt.close();
    //connMySQL.close();
    //}
    // public List<Producto> getAll() throws Exception {
    //   List<Producto> productos = new ArrayList<>();
    // String sql = "SELECT * FROM v_productos";
    // Abrimos la conexion con la BD:
    //ConexionMySQL connMySQL = new ConexionMySQL();
    //Connection conn = connMySQL.open();
    //PreparedStatement pstmt = conn.prepareStatement(sql);
    //ResultSet rs = pstmt.executeQuery();
    // Producto prod = null;
    //while (rs.next()) {
    //  prod = fill(rs);
    //productos.add(prod);
    //}
    //rs.close();
    //pstmt.close();
    //connMySQL.close();
    //return productos;
    //}
    // NUEVO INSERT
    public ArrayList<Producto> getAll() throws Exception {
        ArrayList<Producto> lista = new ArrayList<>();
        String sql = "SELECT * FROM vista_producto_con_detalles";
        ConexionMySQL connMySQL = new ConexionMySQL();
        // Abrimos la conexion con la BD:
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Gson gson = new Gson();
        Type listType = new TypeToken<ArrayList<DetalleProducto>>() {
        }.getType();

        while (rs.next()) {
            Producto p = new Producto();
            p.setIdProducto(rs.getInt("idProducto"));
            p.setFoto(rs.getString("foto"));
            p.setNombre(rs.getString("nombreProducto"));
            p.setDescripcion(rs.getString("descripcion"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCodigoInterno(rs.getString("codigoInterno"));

            Categoria cat = new Categoria();
            cat.setIdCategoria(rs.getInt("idCategoria"));
            cat.setNombre(rs.getString("nombre"));
            p.setCategoria(cat);

            String jsonDetalles = rs.getString("detalles");
            if (jsonDetalles != null) {
                ArrayList<DetalleProducto> detalles = gson.fromJson(jsonDetalles, listType);
                p.setDetalles(detalles);
            }

            lista.add(p);
        }
        return lista;

    }

    // NUEVO UPDATE
    public void update(Producto producto) {
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        CallableStatement cstmt;

        try {
            conn = connMySQL.open();
            String query = "{CALL actualizar_producto_con_detalles(?, ?, ?, ?, ?, ?, ?, ?)}";
            cstmt = conn.prepareCall(query);

            // Convertir detalles a JSON
            JsonArray jsonArray = new JsonArray();
            for (DetalleProducto detalle : producto.getDetalles()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("idTalla", detalle.getIdTalla());
                obj.addProperty("idColor", detalle.getIdColor());
                obj.addProperty("stock", detalle.getStock());
                jsonArray.add(obj);
            }
            Gson gson = new Gson();
            String jsonDetalles = gson.toJson(jsonArray);
            System.out.println(jsonArray);
            // Asignar parámetros
            cstmt.setInt(1, producto.getIdProducto());
            cstmt.setString(2, producto.getFoto());
            cstmt.setString(3, producto.getNombre());
            cstmt.setString(4, producto.getDescripcion());
            cstmt.setDouble(5, producto.getPrecio());
            cstmt.setString(6, producto.getCodigoInterno());
            cstmt.setInt(7, producto.getCategoria().getIdCategoria());
            cstmt.setString(8, jsonDetalles);

            cstmt.executeUpdate();

        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    public boolean eliminar(int idProducto) throws Exception {
        // Se define la consulta SQL:
        String sql = "{CALL eliminarProducto(?)}";

        // Abrimos la conexión con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        // Generamos un CallableStatement para invocar al Stored Procedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        // Colocamos el valor del parámetro de entrada que requiere el Stored Procedure:
        cstmt.setInt(1, idProducto);

        // Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        // Cerramos los objetos de conexión:
        cstmt.close();
        connMySQL.close();

        return true;
    }

    private Producto fill(ResultSet rs) throws SQLException {
        Producto p = new Producto();
        Categoria c = new Categoria();

        p.setCategoria(c);

        p.setIdProducto(rs.getInt("idProducto"));
        p.setFoto(rs.getString("foto"));
        p.setNombre(rs.getString("nombre"));
        p.setDescripcion(rs.getString("descripcion"));
        p.setPrecio(rs.getDouble("precio"));
        p.setCodigoInterno(rs.getString("codigoInterno"));
        c.setIdCategoria(rs.getInt("idCategoria"));
        c.setNombre(rs.getString("nombreCategoria"));

        return p;
    }

    public List<Categoria> getAllCategorias() throws Exception {
        List<Categoria> categorias = new ArrayList<>();
        String sql = "SELECT * FROM categoria";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Categoria cat = null;

        while (rs.next()) {
            cat = fillCat(rs);
            categorias.add(cat);
        }
        rs.close();
        pstmt.close();
        connMySQL.close();

        return categorias;
    }

    public List<Talla> getAllTallas() throws Exception {
        List<Talla> tallas = new ArrayList<>();
        String sql = "SELECT * FROM talla";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Talla tall = null;

        while (rs.next()) {
            tall = fillTall(rs);
            tallas.add(tall);
        }
        rs.close();
        pstmt.close();
        connMySQL.close();

        return tallas;
    }

    private Categoria fillCat(ResultSet rs) throws SQLException {
        Categoria c = new Categoria();
        c.setIdCategoria(rs.getInt("idCategoria"));
        c.setNombre(rs.getString("nombre"));

        return c;
    }

    private Talla fillTall(ResultSet rs) throws SQLException {
        Talla t = new Talla();
        t.setIdTalla(rs.getInt("idTalla"));
        t.setNombre(rs.getString("nombre"));

        return t;
    }

    public List<Color> getAllColores() throws Exception {
        List<Color> colores = new ArrayList<>();
        String sql = "SELECT * FROM color";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Color col = null;

        while (rs.next()) {
            col = fillCol(rs);
            colores.add(col);
        }
        rs.close();
        pstmt.close();
        connMySQL.close();

        return colores;
    }

    private Color fillCol(ResultSet rs) throws SQLException {
        Color c = new Color();
        c.setIdColor(rs.getInt("idColor"));
        c.setNombre(rs.getString("nombre"));

        return c;
    }
}
