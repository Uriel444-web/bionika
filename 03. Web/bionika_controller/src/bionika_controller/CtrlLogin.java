package bionika_controller;

import bd.ConexionMySQL;
import bionika_model.Usuario;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.Connection;

public class CtrlLogin {

    public void validarAcceso(Usuario u) throws SQLException, Exception {

        String query = """
                            SELECT idUsuario FROM usuario WHERE nombre='%s' AND contrasenia='%s';
                       """;

                query = String.format(query, u.getUsuario(), u.getContrasenia());
        
                ConexionMySQL objConMySQL = new ConexionMySQL();
                Connection objConn = objConMySQL.open();
                Statement stmt = objConn.createStatement();
        
                ResultSet rs = stmt.executeQuery(query);
                
                if (rs.next()) {
                    u.setId(rs.getInt("idUsuario"));
                }
                rs.close();
                stmt.close();
                objConn.close();
                objConMySQL.close();
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
 
}
