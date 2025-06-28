/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.rest;

import com.bionika.controller.ControllerProductos;
import com.bionika.controller.ControllerVentas;
import com.bionika.model.Producto;
import com.bionika.model.Venta;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *
 * @author casa
 */
@Path("venta")
public class RESTVenta {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosVenta") @DefaultValue("") String datosVenta) {
        String out;
        Gson gson = new Gson();
        Venta v = null;
        System.out.println("datos venta: "+datosVenta);
        try {
            v = gson.fromJson(datosVenta, Venta.class);
            ControllerVentas cv = new ControllerVentas();
            int id = cv.insert(v);
            v.setIdVenta(id);
            out = gson.toJson(v);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"error":"Error al registrar la venta. Contacta al área de sistemas."}
                  """;
        }

        return Response.ok(out).build();
    }

    @GET
    @Path("getByClave/{codigoInterno}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarPorClave(@PathParam("codigoInterno") String clave) {
        String out = "";
        Gson gson = new Gson();
        ControllerProductos ctrl = new ControllerProductos();

        try {
            Producto p = ctrl.getByClave(clave);

            if (p != null) {
                out = gson.toJson(p);
            } else {
                out = "{}";
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"error":"Error interno al buscar producto."}
              """;
        }

        return Response.ok(out).build();
    }

}
