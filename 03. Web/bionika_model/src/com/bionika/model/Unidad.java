/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.model;

/**
 *
 * @author casa
 */
public class Unidad {
    private int IdUnidad;
    private String unidad;

    public Unidad() {
    }

    public Unidad(int IdUnidad, String unidad) {
        this.IdUnidad = IdUnidad;
        this.unidad = unidad;
    }

    public int getIdUnidad() {
        return IdUnidad;
    }

    public void setIdUnidad(int IdUnidad) {
        this.IdUnidad = IdUnidad;
    }

    public String getUnidad() {
        return unidad;
    }

    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }

    @Override
    public String toString() {
        return "Unidad{" + "IdUnidad=" + IdUnidad + ", unidad=" + unidad + '}';
    }
}
