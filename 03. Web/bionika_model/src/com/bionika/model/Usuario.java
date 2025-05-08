
package com.bionika.model;

import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;

public class Usuario {
    
    private int id;
    private String usuario;
    private String contrasenia;
    private String token;
    private Rol rol;
    private Empleado empleado;
    private int activo;

    public Usuario() {
    }

    public Usuario(int id, String usuario, String contrasenia, String token, Rol rol, Empleado empleado, int activo) {
        this.id = id;
        this.usuario = usuario;
        this.contrasenia = contrasenia;
        this.token = token;
        this.rol = rol;
        this.empleado = empleado;
        this.activo = activo;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
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


