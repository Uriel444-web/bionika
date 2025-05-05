/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.db;
import java.sql.Connection;
import java.sql.DriverManager;

public class ConexionMySQL {
     private Connection conn;
    
    public Connection open() throws Exception {
        String ruta = "jdbc:mysql://127.0.0.1:3307/bionika";
        String usuario = "root";
        String password = "root";
        
        Class.forName("com.mysql.cj.jdbc.Driver");
        conn = DriverManager.getConnection(ruta, usuario, password);
        return conn;
        
    }
    
    public void close() throws Exception {
        if (conn != null) {
            conn.close();
        }
    }
}
