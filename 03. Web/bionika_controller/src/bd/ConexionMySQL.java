
package bd;

import java.sql.Connection;
import java.sql.DriverManager;


public class ConexionMySQL {

    private Connection conn;

    public Connection open() throws Exception {
        // la ruta es la ubicacion de donde se encuantra el servidor de mysql "sakila"
        // es el nombre del proyweto
        String ruta = "jdbc:mysql://127.0.0.1:3307/zarape";
        String usuario = "root";
        String password = "root";
        
        // Registramos el driver de msql para que este disponible
        //y nos podamos conectar con mysql:
        Class.forName("com.mysql.cj.jdbc.Driver");
      
        conn = DriverManager.getConnection(ruta, usuario, password);
       
        // devolvemos la coneccion
        return conn;
    }

    public void close() throws Exception {
        // se intenta cerrar la coneccion 
        if (conn !=null)
            conn.close();
        
    }
}

