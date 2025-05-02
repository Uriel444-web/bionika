/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bionika.rest;

import com.bionika.controller.ControllerProductos;
import com.bionika.model.Producto;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *
 * @author casa
 */
@Path("producto")
public class RESTProducto {
    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosProducto") @DefaultValue("") String datosProducto){
        String out = "";
        ControllerProductos cp = new ControllerProductos();
        Producto p = null;
        Gson gson = new Gson();
        System.out.println("producto: "+datosProducto);
        try {
            
            p = gson.fromJson(datosProducto, Producto.class);
            if (p.getIdProducto() <1) {
                cp.insert(p);
            }else{
                cp.update(p);
            }
            out = gson.toJson(p);
        }
        catch(JsonParseException jpe)
        {
            jpe.printStackTrace();
            out = """
                  {"error":"El JSON recibido no es correcto."}
                  """;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            out = """
                  {"error":"Error interno del servidor, comunícate al area de sistemas de El Zarape."}
                  """;
        }
        return Response.ok(out).build();
    }
}
