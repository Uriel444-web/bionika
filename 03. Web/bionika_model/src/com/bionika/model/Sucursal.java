
package com.bionika.model;

public class Sucursal {
   private int idSucursal;
   private String nombre; 
   private String colonia;
   private String calle;
   private String codPos;
   private String latitud;
   private String longitud;
   private String numExt;
   private String telefono;
   private int activo;
   private Usuario usuario;

    public Sucursal() {
    }

    public Sucursal(int idSucursal, String nombre, String colonia, String calle, String codPos, String latitud, String longitud, String numExt, String telefono, int activo, Usuario usuario) {
        this.idSucursal = idSucursal;
        this.nombre = nombre;
        this.colonia = colonia;
        this.calle = calle;
        this.codPos = codPos;
        this.latitud = latitud;
        this.longitud = longitud;
        this.numExt = numExt;
        this.telefono = telefono;
        this.activo = activo;
        this.usuario = usuario;
    }

    public String getCodPos() {
        return codPos;
    }

    public void setCodPos(String codPos) {
        this.codPos = codPos;
    }

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongitud() {
        return longitud;
    }

    public void setLongitud(String longitud) {
        this.longitud = longitud;
    }

 

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getNumExt() {
        return numExt;
    }

    public void setNumExt(String numExt) {
        this.numExt = numExt;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
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
        sb.append("Sucursal{");
        sb.append("idSucursal=").append(idSucursal);
        sb.append(", nombre=").append(nombre);
        sb.append(", colonia=").append(colonia);
        sb.append(", calle=").append(calle);
        sb.append(", codPos=").append(codPos);
        sb.append(", latitud=").append(latitud);
        sb.append(", longitud=").append(longitud);
        sb.append(", numExt=").append(numExt);
        sb.append(", telefono=").append(telefono);
        sb.append(", activo=").append(activo);
        sb.append(", usuario=").append(usuario);
        sb.append('}');
        return sb.toString();
    }

    
   
    
}
