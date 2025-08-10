/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.model;

/**
 *
 * @author casa
 */
public class DetalleVenta {
    
    private int idDetalleVenta;
    private int idProducto;
    private String nombreProducto;
    private String fotoProducto;
    private String codigoInterno;
    
    private int idTalla;
    private String nombreTalla;
    
    private int idUnidad;
    private String nombreUnidad;
    
    private int cantidad;
    private double precioUnitario;
    private double total;
    private int descuento;

    public DetalleVenta() {
    }

    public DetalleVenta(int idDetalleVenta, int idProducto, String nombreProducto, String fotoProducto, String codigoInterno, int idTalla, String nombreTalla, int idUnidad, String nombreUnidad, int cantidad, double precioUnitario, double total, int descuento) {
        this.idDetalleVenta = idDetalleVenta;
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.fotoProducto = fotoProducto;
        this.codigoInterno = codigoInterno;
        this.idTalla = idTalla;
        this.nombreTalla = nombreTalla;
        this.idUnidad = idUnidad;
        this.nombreUnidad = nombreUnidad;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = total;
        this.descuento = descuento;
    }

    public int getIdDetalleVenta() {
        return idDetalleVenta;
    }

    public void setIdDetalleVenta(int idDetalleVenta) {
        this.idDetalleVenta = idDetalleVenta;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getFotoProducto() {
        return fotoProducto;
    }

    public void setFotoProducto(String fotoProducto) {
        this.fotoProducto = fotoProducto;
    }

    public String getCodigoInterno() {
        return codigoInterno;
    }

    public void setCodigoInterno(String codigoInterno) {
        this.codigoInterno = codigoInterno;
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

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getDescuento() {
        return descuento;
    }

    public void setDescuento(int descuento) {
        this.descuento = descuento;
    }

    @Override
    public String toString() {
        return "DetalleVenta{" + "idDetalleVenta=" + idDetalleVenta + ", idProducto=" + idProducto + ", nombreProducto=" + nombreProducto + ", fotoProducto=" + fotoProducto + ", codigoInterno=" + codigoInterno + ", idTalla=" + idTalla + ", nombreTalla=" + nombreTalla + ", idUnidad=" + idUnidad + ", nombreUnidad=" + nombreUnidad + ", cantidad=" + cantidad + ", precioUnitario=" + precioUnitario + ", total=" + total + ", descuento=" + descuento + '}';
    }
    
    
}
