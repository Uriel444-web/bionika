
package bionika_model;

import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;

public class Usuario {
    
    private int id;
    private String usuario;
    private String contrasenia;
    private String token;
    private int activo;

    public Usuario() {
    }

    public Usuario(int id, String usuario, String contrasenia, String token, int activo) {
        this.id = id;
        this.usuario = usuario;
        this.contrasenia = contrasenia;
        this.token = token;
        this.activo = activo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Bionika_model{");
        sb.append("id=").append(id);
        sb.append(", usuario=").append(usuario);
        sb.append(", contrasenia=").append(contrasenia);
        sb.append(", token=").append(token);
        sb.append(", activo=").append(activo);
        sb.append('}');
        return sb.toString();
    }

    public void setToken() {

        String p1 = this.usuario;
        String p2 = "akinoib";
        Date fecha = new Date();
        String p3 = fecha.toString();
        String cadena = p1 + ":" + p2 + ":" + p3;
        String t = DigestUtils.md5Hex(cadena);
        this.token = t;
        
    }
}


