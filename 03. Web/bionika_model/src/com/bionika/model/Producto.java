
package com.bionika.model;

import java.util.ArrayList;

public class Producto {

    private int idProducto;
    private String foto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String codigoInterno;
    private Categoria categoria;
    private ArrayList<DetalleProducto> detalles;

    public Producto() {
    }

    public Producto(int idProducto, String foto, String nombre, String descripcion, Double precio, String codigoInterno, Categoria categoria, ArrayList<DetalleProducto> detalles) {
        this.idProducto = idProducto;
        this.foto = foto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.codigoInterno = codigoInterno;
        this.categoria = categoria;
        this.detalles = detalles;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getCodigoInterno() {
        return codigoInterno;
    }

    public void setCodigoInterno(String codigoInterno) {
        this.codigoInterno = codigoInterno;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public ArrayList<DetalleProducto> getDetalles() {
        return detalles;
    }

    public void setDetalles(ArrayList<DetalleProducto> detalles) {
        this.detalles = detalles;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Producto{");
        sb.append("idProducto=").append(idProducto);
        sb.append(", foto=").append(foto);
        sb.append(", nombre=").append(nombre);
        sb.append(", descripcion=").append(descripcion);
        sb.append(", precio=").append(precio);
        sb.append(", codigoInterno=").append(codigoInterno);
        sb.append(", categoria=").append(categoria.toString());
        String datosLista = "";
        for (int i = 0; i < detalles.size(); i++) {
            datosLista += detalles.get(i).toString();
        }
        sb.append(", detalles=").append(datosLista);
        sb.append('}');
        return sb.toString();
    }
}
