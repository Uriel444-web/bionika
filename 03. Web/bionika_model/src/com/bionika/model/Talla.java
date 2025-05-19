/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.model;

public class Talla {
    private int idTalla;
    private String nombre;

    public Talla() {
    }

    public Talla(int idTalla, String nombre) {
        this.idTalla = idTalla;
        this.nombre = nombre;
    }

    public int getIdTalla() {
        return idTalla;
    }

    public void setIdTalla(int idTalla) {
        this.idTalla = idTalla;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Talla{" + "idTalla=" + idTalla + ", nombre=" + nombre + '}';
    }
}
