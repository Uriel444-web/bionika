package com.bionika.model;

public class DetalleProducto {
    private int idDetalle;
    private int idTalla;
    private String nombreTalla;
    private int idColor;
    private String nombreColor;
    private int idUnidad;
    private String nombreUnidad;
    private int stock;
    private int idSucursal;

    public DetalleProducto() {
    }

    public DetalleProducto(int idDetalle, int idTalla, String nombreTalla, int idColor, String nombreColor, int idUnidad, String nombreUnidad, int stock, int idSucursal) {
        this.idDetalle = idDetalle;
        this.idTalla = idTalla;
        this.nombreTalla = nombreTalla;
        this.idColor = idColor;
        this.nombreColor = nombreColor;
        this.idUnidad = idUnidad;
        this.nombreUnidad = nombreUnidad;
        this.stock = stock;
        this.idSucursal = idSucursal;
    }

    public int getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(int idDetalle) {
        this.idDetalle = idDetalle;
    }

    public int getIdTalla() {
        return idTalla;
    }

    public void setIdTalla(int idTalla) {
        this.idTalla = idTalla;
    }

    public String getNombreTalla() {
        return nombreTalla;
    }

    public void setNombreTalla(String nombreTalla) {
        this.nombreTalla = nombreTalla;
    }

    public int getIdColor() {
        return idColor;
    }

    public void setIdColor(int idColor) {
        this.idColor = idColor;
    }

    public String getNombreColor() {
        return nombreColor;
    }

    public void setNombreColor(String nombreColor) {
        this.nombreColor = nombreColor;
    }

    public int getIdUnidad() {
        return idUnidad;
    }

    public void setIdUnidad(int idUnidad) {
        this.idUnidad = idUnidad;
    }

    public String getNombreUnidad() {
        return nombreUnidad;
    }

    public void setNombreUnidad(String nombreUnidad) {
        this.nombreUnidad = nombreUnidad;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    @Override
    public String toString() {
        return "DetalleProducto{" + "idDetalle=" + idDetalle + ", idTalla=" + idTalla + ", nombreTalla=" + nombreTalla + ", idColor=" + idColor + ", nombreColor=" + nombreColor + ", idUnidad=" + idUnidad + ", nombreUnidad=" + nombreUnidad + ", stock=" + stock + ", idSucursal=" + idSucursal + '}';
    }
    
    
}
