
package com.bionika.model;

import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;

public class Usuario {
    
    private int idUsuario;
    private String usuario;
    private String contrasena;
    private String token;
    private int activo;
    private Empleado empleado;
    private Rol rol;
    private Sucursal sucursal;
    
    public Usuario() {
    }

    public Usuario(int idUsuario, String usuario, String contrasena, String token, int activo, Empleado empleado, Rol rol, Sucursal sucursal) {
        this.idUsuario = idUsuario;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.token = token;
        this.activo = activo;
        this.empleado = empleado;
        this.rol = rol;
        this.sucursal = sucursal;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
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

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
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

    @Override
    public String toString() {
        return "Usuario{" + "idUsuario=" + idUsuario + ", usuario=" + usuario + ", contrasena=" + contrasena + ", token=" + token + ", activo=" + activo + ", empleado=" + empleado.toString() + ", rol=" + rol.toString() + ", sucursal=" + sucursal.toString() + '}';
    }
}