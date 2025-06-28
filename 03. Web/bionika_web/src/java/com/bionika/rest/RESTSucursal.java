
package com.bionika.rest;

import com.bionika.controller.CtrlSucursal;
import com.bionika.controller.CtrlUsuario;
import com.bionika.model.Rol;
import com.bionika.model.Sucursal;
import com.bionika.model.Usuario;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("sucursal")
public class RESTSucursal {
    
    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosSucursal") @DefaultValue("") String datosSucursal) throws Exception
    {
        
        String out = null;
        CtrlSucursal su = new CtrlSucursal();
        Sucursal s = null;
        Gson gson = new Gson();
        System.out.println(datosSucursal);
            try{
        
            s = gson.fromJson(datosSucursal, Sucursal.class);
                    
            if (s.getIdSucursal()< 1)
                su.insert(s);
            else
                //ca.update(a);
            
            out = gson.toJson(s);
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
    
    @POST 
    @Path("delete")
     @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@FormParam("idSucursal") @DefaultValue("0") int idSucursal)
    {
        String out = null;
        CtrlSucursal ca = new CtrlSucursal();        
        try
        {
            ca.delete(idSucursal);
            out = """
                  {"result":"Registro eliminado de forma correcta."}
                  """;
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
    
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)   
    public Response getAll()
    {
        String out = null;
       
        CtrlSucursal su = new CtrlSucursal();
      
        List<Sucursal> sucursal = null;
        
             try
        {
            sucursal = su.getAll(null);
            out = new Gson().toJson(sucursal);
        } 
        catch (Exception e)
        {
            e.printStackTrace();
            out = """
                  {"error" : "Error interno del Servidor, comunicate al area de Sistemas"}
                  """;
        }
        return Response.ok(out).build();
                      
    }
    
    @GET
    @Path("getAllUsuario")
    @Produces(MediaType.APPLICATION_JSON)   
    public Response getAllCategoria()
    {
        String out = null;
       
        CtrlSucursal su = new CtrlSucursal();
      
        List<Usuario> usuario = null;
        
             try
        {
            usuario = su.getAllUsuario(null);
            out = new Gson().toJson(usuario);
        } 
        catch (Exception e)
        {
            e.printStackTrace();
            out = """
                  {"error" : "Error interno del Servidor, comunicate al area de Sistemas"}
                  """;
        }
        return Response.ok(out).build();
                      
    }
}
