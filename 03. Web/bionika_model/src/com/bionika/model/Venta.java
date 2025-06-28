/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.model;

import java.util.Date;
import java.util.List;

/**
 *
 * @author casa
 */
public class Venta {

    private int idVenta;
    private Date fecha;
    private String cliente;
    private double total;
    private Usuario usuario;       // quien realizó la venta
    private Sucursal sucursal;     // sucursal donde se realizó
    private List<DetalleVenta> detalles; // lista de productos vendidos

    public Venta() {
    }

    public Venta(int idVenta, Date fecha, String cliente, double total, Usuario usuario, Sucursal sucursal, List<DetalleVenta> detalles) {
        this.idVenta = idVenta;
        this.fecha = fecha;
        this.cliente = cliente;
        this.total = total;
        this.usuario = usuario;
        this.sucursal = sucursal;
        this.detalles = detalles;
    }

    public int getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(int idVenta) {
        this.idVenta = idVenta;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }

    public List<DetalleVenta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVenta> detalles) {
        this.detalles = detalles;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Venta{");
        sb.append("idVenta=").append(idVenta);
        sb.append(", fecha=").append(fecha);
        sb.append(", cliente=").append(cliente);
        sb.append(", total=").append(total);
        sb.append(", usuario=").append(usuario != null ? usuario.getUsuario() : "null");
        sb.append(", sucursal=").append(sucursal != null ? sucursal.getNombreSuc() : "null");

        sb.append(", detalles=[");

        if (detalles != null && !detalles.isEmpty()) {
            for (DetalleVenta d : detalles) {
                sb.append("\n  ").append(d.toString());
            }
        } else {
            sb.append("Sin detalles");
        }

        sb.append("\n]}");
        return sb.toString();
    }
}
