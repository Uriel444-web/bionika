package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Empleado;
import com.bionika.model.Rol;
import com.bionika.model.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CtrlUsuario {

      public int insert(Usuario us) throws Exception
    { 
        String sql = "{CALL insertarUsuario( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
    
        try{
            
        ConexionMySQL connMySQL = new ConexionMySQL();
        System.out.println("conexion 1");
        Connection conn = connMySQL.open();
        System.out.println("conexion 2");
        
        java.sql.CallableStatement cstmt = conn.prepareCall(sql);    
        
        cstmt.setString(1, us.getEmpleado().getNombre());
        cstmt.setString(2, us.getEmpleado().getApellidoP());
        cstmt.setString(3, us.getEmpleado().getApellidoM());
        cstmt.setString(4, us.getEmpleado().getCorreo());
        cstmt.setString(5, us.getEmpleado().getTelefono());
        cstmt.setString(6, us.getUsuario());
        cstmt.setString(7, us.getContrasenia());
        cstmt.setInt(8, us.getRol().getIdRol());
        
        cstmt.registerOutParameter(9, java.sql.Types.INTEGER); // idEmpleado
        cstmt.registerOutParameter(10, java.sql.Types.INTEGER); // idUsuario

        cstmt.executeUpdate();
        
        us.getEmpleado().setIdEmpleado(cstmt.getInt(9));
        us.setId(cstmt.getInt(10));
          
        cstmt.close();
        connMySQL.close();
        
         return us.getId();
        
        }catch(SQLException e){
            
        e.printStackTrace(); }    
         return 0;
    }
      
       public void update(Usuario us) throws Exception
    {
        // Se define la consulta SQL:
        String sql = "{CALL actualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        
        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        // Generamos un CallableStatement para invocar al Stored Procedure:
        java.sql.CallableStatement cstmt = conn.prepareCall(sql);
        
        // Colocamos los valores de los parametros de entrada que requiere
        // el Stored Procedure:
        cstmt.setString(1, us.getEmpleado().getNombre());
        cstmt.setString(2, us.getEmpleado().getApellidoP());
        cstmt.setString(3, us.getEmpleado().getApellidoM());
        cstmt.setString(4, us.getEmpleado().getCorreo());
        cstmt.setString(5, us.getEmpleado().getTelefono());
        cstmt.setString(6, us.getUsuario());
        cstmt.setString(7, us.getContrasenia());
        cstmt.setInt(8, us.getRol().getIdRol());
        cstmt.setInt(9, us.getId());
        // Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();
                
        //Cerramos los objetos de conexion:
        cstmt.close();
        connMySQL.close();
    }
       
        public void delete(int id) throws Exception
    {
        // Se define la consulta SQL:
        String sql = "UPDATE usuario SET activo=0 WHERE idUsuario=?";
        
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

      public List<Usuario> getAll(String filtro) throws Exception
    {
        List<Usuario> us = new ArrayList<>();
        // Se define la consulta SQL:
        String sql = "SELECT * FROM v_usuario WHERE activo=1";
        
        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        Usuario usuario = null;
        
        // Recorremos cada registro devuelto por la consulta:
        while(rs.next())
        {
            usuario = fill(rs);
            us.add(usuario);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        return us;
    }
    
     private Usuario fill(ResultSet rs) throws Exception
    {
        Rol r = new Rol();
        Usuario  u = new Usuario();
        Empleado  e = new Empleado();
        
        u.setEmpleado(e);
        u.setRol(r);
        
        // Establecemos los valores de cada atributo de
        // los objetos relacionados, extraidos de cada
        // campo del ResultSet:
        
        u.setId(rs.getInt("idUsuario"));
        u.setUsuario(rs.getString("usuario"));
        u.setContrasenia(rs.getString("contrasena"));
        u.setActivo(rs.getInt("activo"));
        
        e.setIdEmpleado(rs.getInt("idEmpleado"));      
        e.setNombre(rs.getString("nombre"));
        e.setApellidoP(rs.getString("ApellidoP"));
        e.setApellidoM(rs.getString("ApellidoM"));
        e.setCorreo(rs.getString("correo")); 
        e.setTelefono(rs.getString("telefono"));
        
        r.setTipoRol(rs.getString("tipoRol"));
        r.setIdRol(rs.getInt("idRol"));
  
        return u;
    }
     
     public List<Rol> getAllRol(String filtro) throws Exception
    {
        List<Rol> r = new ArrayList<>();
        // Se define la consulta SQL:
        String sql = "SELECT * FROM rol";
        
        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        Rol rol = null;
        
        // Recorremos cada registro devuelto por la consulta:
        while(rs.next())
        {
            rol = fillRol(rs);
            r.add(rol);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        
        return r;
    }
    
     private Rol fillRol(ResultSet rs) throws Exception
    {
        Rol r = new Rol();       
        // Establecemos los valores de cada atributo de
        // los objetos relacionados, extraidos de cada
        // campo del ResultSet:     
        r.setTipoRol(rs.getString("tipoRol"));
        r.setIdRol(rs.getInt("idRol"));
  
        return r;
    }
}
