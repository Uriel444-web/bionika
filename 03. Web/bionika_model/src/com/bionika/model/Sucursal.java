
package com.bionika.model;

public class Sucursal {
   private int idSucursal;
   private String nombreSuc; 
   private String colonia;
   private String calle;
   private String codPos;
   private String latitud;
   private String longitud;
   private String numExt;
   private String telefono;
   private int activo;

    public Sucursal() {
    }

    public Sucursal(int idSucursal, String nombreSuc, String colonia, String calle, String codPos, String latitud, String longitud, String numExt, String telefono, int activo) {
        this.idSucursal = idSucursal;
        this.nombreSuc = nombreSuc;
        this.colonia = colonia;
        this.calle = calle;
        this.codPos = codPos;
        this.latitud = latitud;
        this.longitud = longitud;
        this.numExt = numExt;
        this.telefono = telefono;
        this.activo = activo;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public String getNombreSuc() {
        return nombreSuc;
    }

    public void setNombreSuc(String nombreSuc) {
        this.nombreSuc = nombreSuc;
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
        return "Sucursal{" + "idSucursal=" + idSucursal + ", nombre=" + nombreSuc + ", colonia=" + colonia + ", calle=" + calle + ", codPos=" + codPos + ", latitud=" + latitud + ", longitud=" + longitud + ", numExt=" + numExt + ", telefono=" + telefono + ", activo=" + activo + '}';
    }
    
}
