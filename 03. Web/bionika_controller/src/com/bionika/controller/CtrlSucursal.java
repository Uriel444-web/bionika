
package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Sucursal;
import com.bionika.model.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CtrlSucursal {
    
    public int insert(Sucursal su) throws Exception
    { 
        String sql = "{CALL insertarSucursal( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
    
        try{
            
        ConexionMySQL connMySQL = new ConexionMySQL();
        System.out.println("conexion 1");
        Connection conn = connMySQL.open();
        System.out.println("conexion 2");
        
        java.sql.CallableStatement cstmt = conn.prepareCall(sql);    
        
        cstmt.setString(1, su.getNombre());
        cstmt.setString(2, su.getColonia());
        cstmt.setString(3, su.getCalle());
        cstmt.setString(4, su.getCodPos());
        cstmt.setString(5, su.getLatitud());
        cstmt.setString(6, su.getLongitud());
        cstmt.setString(7, su.getNumExt());
        cstmt.setString(8, su.getTelefono());
        cstmt.setInt(9, su.getUsuario().getId());
        
        cstmt.registerOutParameter(10, java.sql.Types.INTEGER); 

        cstmt.executeUpdate();
        
        su.setIdSucursal(cstmt.getInt(10));
          
        cstmt.close();
        connMySQL.close();
        
         return su.getIdSucursal();
        
        }catch(SQLException e){
            
        e.printStackTrace(); }    
         return 0;
    }
    
      public void delete(int id) throws Exception
    {
        // Se define la consulta SQL:
        String sql = "UPDATE sucursal SET activo=0 WHERE idSucursal=?";
        
        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        // Llenamos los datos del PreparedStatement:
        pstmt.setInt(1, id);
        
        // Ejecutamos la consulta:
        pstmt.executeUpdate();
        
        // Cerramos los objetos de conexion:
        pstmt.close();
        connMySQL.close();
    }
    
     public List<Sucursal> getAll(String filtro) throws Exception
    {
        List<Sucursal> us = new ArrayList<>();
      
        String sql = "SELECT * FROM v_sucursal WHERE activo=1";
       
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        Sucursal sucursal = null;
        
        // Recorremos cada registro devuelto por la consulta:
        while(rs.next())
        {
            sucursal = fill(rs);
            us.add(sucursal);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        return us;
    }
    
      private Sucursal fill(ResultSet rs) throws Exception
    {
        Usuario u = new Usuario();
        Sucursal  s = new Sucursal();
        
        s.setUsuario(u);
      
        s.setIdSucursal(rs.getInt("idSucursal"));
        s.setNombre(rs.getString("nombreSuc"));
        s.setColonia(rs.getString("colonia"));
        s.setCalle(rs.getString("calle"));
        s.setCodPos(rs.getString("codPos"));
        s.setLatitud(rs.getString("latitud"));
        s.setLongitud(rs.getString("longitud"));
        s.setNumExt(rs.getString("numExt"));
        s.setTelefono(rs.getString("telefono"));
        s.setActivo(rs.getInt("activo"));
        
        u.setId(rs.getInt("idUsuario"));
        u.setUsuario(rs.getString("usuario"));
        
        return s;
    }
      
       public List<Usuario> getAllUsuario(String filtro) throws Exception
    {
        List<Usuario> u = new ArrayList<>();
        
        String sql = "SELECT * FROM usuario where activo=1";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        Usuario usuario = null;
        
        // Recorremos cada registro devuelto por la consulta:
        while(rs.next())
        {
            usuario = fillUsuario(rs);
            u.add(usuario);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        return u;
    }
    
     private Usuario fillUsuario(ResultSet rs) throws Exception
    {
        Usuario u = new Usuario();       
            
        u.setUsuario(rs.getString("usuario"));
        u.setId(rs.getInt("idUsuario"));
        u.setActivo(rs.getInt("activo"));
  
        return u;
    }
}
