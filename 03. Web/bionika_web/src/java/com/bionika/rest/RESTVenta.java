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
import java.util.ArrayList;

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
        System.out.println("datos venta: " + datosVenta);
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
    @Path("getByClave/{codigoInterno}/{idSucursal}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarPorClave(
            @PathParam("codigoInterno") String clave,
            @PathParam("idSucursal") int idSucursal
    ) {
        String out;
        Gson gson = new Gson();
        ControllerProductos ctrl = new ControllerProductos();

        try {
            Producto p = ctrl.getByClave(clave, idSucursal);

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

    @GET
    @Path("porSucursal/{idSucursal}/{fechaInicio}/{fechaFin}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getVentasPorSucursal(
            @PathParam("idSucursal") int idSucursal,
            @PathParam("fechaInicio") String fechaInicio,
            @PathParam("fechaFin") String fechaFin
    ) {
        String out = "";
        Gson gson = new Gson();
        ControllerVentas ctrl = new ControllerVentas();

        try {
            ArrayList<Venta> ventas = ctrl.getVentasPorSucursalYFechas(idSucursal, fechaInicio, fechaFin);
            out = gson.toJson(ventas);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al consultar ventas.\"}";
        }

        return Response.ok(out).build();
    }
    
    
    @GET
    @Path("{id}/imagen")
    @Produces(MediaType.TEXT_PLAIN)
    public Response obtenerImagenBase64(@PathParam("id") int id) {
        String base64 = "";
        try {
            ControllerProductos ctrl = new ControllerProductos();
            base64 = ctrl.obtenerImagenBase64PorId(id);

            if (base64 == null || base64.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            return Response.ok(base64).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener la imagen en base64").build();
        }
    }

}
