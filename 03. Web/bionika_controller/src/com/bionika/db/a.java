/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package com.bionika.db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 *
 * @author USUARIO HP
 */
public class a {
    
public static void main(String[] args) throws Exception {
 
  try{
            
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        System.out.println("conexion establecida");
        connMySQL.close();
}   catch(SQLException e){
            
        e.printStackTrace(); }  
    
}}
