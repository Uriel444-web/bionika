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
    private int idProducto;       // En lugar de tener Producto completo, solo el ID
    private int idTalla;          // En lugar de tener Talla objeto, solo el ID
    private int idUnidad;         // Igual para Unidad
    private int cantidad;
    private double precioUnitario;
    private double total;

    public DetalleVenta() {
    }

    public DetalleVenta(int idDetalleVenta, int idProducto, int idTalla, int idUnidad, int cantidad, double precioUnitario, double total) {
        this.idDetalleVenta = idDetalleVenta;
        this.idProducto = idProducto;
        this.idTalla = idTalla;
        this.idUnidad = idUnidad;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = total;
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

    public int getIdTalla() {
        return idTalla;
    }

    public void setIdTalla(int idTalla) {
        this.idTalla = idTalla;
    }

    public int getIdUnidad() {
        return idUnidad;
    }

    public void setIdUnidad(int idUnidad) {
        this.idUnidad = idUnidad;
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

    @Override
    public String toString() {
        return "DetalleVenta{" + "idDetalleVenta=" + idDetalleVenta + ", idProducto=" + idProducto + ", idTalla=" + idTalla + ", idUnidad=" + idUnidad + ", cantidad=" + cantidad + ", precioUnitario=" + precioUnitario + ", total=" + total + '}';
    }
}
