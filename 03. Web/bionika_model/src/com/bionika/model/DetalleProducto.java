package com.bionika.model;

public class DetalleProducto {
    private int idDetalle;
    private int idTalla;
    private String nombreTalla;
    private int idColor;
    private String nombreColor;
    private int stock;

    public DetalleProducto() {
    }

    public DetalleProducto(int idDetalle, int idTalla, String nombreTalla, int idColor, String nombreColor, int stock) {
        this.idDetalle = idDetalle;
        this.idTalla = idTalla;
        this.nombreTalla = nombreTalla;
        this.idColor = idColor;
        this.nombreColor = nombreColor;
        this.stock = stock;
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

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    @Override
    public String toString() {
        return "DetalleProducto{" + "idDetalle=" + idDetalle + ", idTalla=" + idTalla + ", nombreTalla=" + nombreTalla + ", idColor=" + idColor + ", nombreColor=" + nombreColor + ", stock=" + stock + '}';
    }
}
