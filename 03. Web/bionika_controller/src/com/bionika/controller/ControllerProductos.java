/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Categoria;
import com.bionika.model.Producto;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerProductos {

    public int insert(Producto p) throws Exception {
        String sql = "{CALL insertarProducto(?, ?, ?, ?, ?, ?, ?)}";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement cstmt = conn.prepareCall(sql);

        // Parámetros de entrada
        cstmt.setString(1, p.getNombre());
        cstmt.setString(2, p.getDescripcion());
        cstmt.setDouble(3, p.getPrecio());
        cstmt.setInt(4, p.getStock());
        cstmt.setString(5, p.getCodigoInterno());
        cstmt.setInt(6, p.getCategoria().getIdCategoria());

        // Ejecutamos
        cstmt.executeUpdate();

        // Obtenemos el ID generado
        p.setIdProducto(cstmt.getInt(7));

        // Cerramos conexiones
        cstmt.close();
        connMySQL.close();

        return p.getIdProducto();
    }

    public void update(Producto p) throws Exception {
        // Se define la consulta SQL:
        String sql = "{CALL actualizarProducto(?, ?, ?, ?, ?, ?, ?)}";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        // Generamos un CallableStatement para invocar al Stored Procedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        // Colocamos los valores de los parametros de entrada que requiere
        // el Stored Procedure:
        cstmt.setInt(1, p.getIdProducto());
        cstmt.setString(2, p.getNombre());
        cstmt.setString(3, p.getDescripcion());
        cstmt.setDouble(4, p.getPrecio());
        cstmt.setInt(5, p.getStock());
        cstmt.setString(6, p.getCodigoInterno());
        cstmt.setInt(7, p.getCategoria().getIdCategoria());

        // Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Cerramos los objetos de conexion:
        cstmt.close();
        connMySQL.close();
    }
    
    public List<Producto> getAll() throws Exception{
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT * FROM v_productos";
        
        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        Producto prod = null;
        
        while(rs.next()){
            prod = fill(rs);
            productos.add(prod);
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        return productos;
    }
    
    private Producto fill (ResultSet rs) throws SQLException{
        Producto p = new Producto();
        Categoria c = new Categoria();
        
        p.setCategoria(c);
        
        p.setIdProducto(rs.getInt("idProducto"));
        p.setNombre(rs.getString("nombre"));
        p.setDescripcion(rs.getString("descripcion"));
        p.setPrecio(rs.getDouble("precio"));
        p.setStock(rs.getInt("stock"));
        p.setCodigoInterno(rs.getString("codigoInterno"));
        c.setIdCategoria(rs.getInt("idCategoria"));
        c.setNombre(rs.getString("nombreCategoria"));
        
        return p;
    }
}
