package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Usuario;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Connection;

public class CtrlLogin {

    public void validarAcceso(Usuario u) throws SQLException, Exception {

        String query = """
                            SELECT idUsuario FROM usuario WHERE usuario= ? and contrasena= ?
                       """;
           
                try {
                ConexionMySQL objConMySQL = new ConexionMySQL();
                Connection objConn = objConMySQL.open();
                
                PreparedStatement stmt = objConn.prepareStatement(query);
               
                    stmt.setString(1, u.getUsuario());       // Primer parámetro (usuario)
                    stmt.setString(2, u.getContrasenia());
                    
                ResultSet rs = stmt.executeQuery();
                                
                while (rs.next()) {

                u.setId(rs.getInt("idUsuario"));
                
                rs.close();
                objConn.close();
            }
                
        } catch (SQLException e) {

            e.getStackTrace();
        }
    }
                

    public void almacenarToken(Usuario u) throws SQLException, Exception {
        
        String query= """
                        UPDATE usuario SET token='%s' WHERE idUsuario=%s;
                      """;
        
                query = String.format(query, u.getToken(),u.getId());
                
                    ConexionMySQL connMySQL = new ConexionMySQL();
                    Connection conn = connMySQL.open();
                    Statement stmt = conn.createStatement();
                    
                stmt.execute(query);
                stmt.close();
                conn.close();
                connMySQL.close();
    }

    public void eliminarToken(String token) throws SQLException, Exception {

        String query="""
                       UPDATE usuario SET token='' WHERE token='%s';
                     """;
 
                    query = String.format(query, token);
                   
                    ConexionMySQL connMySQL = new ConexionMySQL();
                    Connection conn = connMySQL.open();
                    Statement stmt = conn.createStatement();
                    
                stmt.execute(query);
                stmt.close();
                conn.close();
                connMySQL.close();
 }
 
    public boolean validarToken(String token) throws SQLException, Exception {
 
        boolean respuesta = false;

        String query = "SELECT * FROM usuario WHERE token='"+token+"';";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        
        if(rs.next())
        {
        respuesta = true;
        }
        
        rs.close();
        stmt.close();
        conn.close();
        connMySQL.close();

      return respuesta;
    }
    
    public int obtenerIdRol(int idUsuario) throws Exception {
    String query = "SELECT rol FROM usuario WHERE idUsuario = ?";
    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();
    PreparedStatement stmt = conn.prepareStatement(query);
    stmt.setInt(1, idUsuario);
    ResultSet rs = stmt.executeQuery();
        System.out.println(idUsuario);
    if (rs.next()) {
        int idRol = rs.getInt("rol");
        conn.close();
        return idRol;
    } else {
        conn.close();
        throw new SQLException("Usuario no encontrado.");
    }
}

}
