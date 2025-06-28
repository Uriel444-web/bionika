
package com.bionika.rest;

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

@Path("usuario")
public class RESTUsuario {
    
    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosUsuario") @DefaultValue("") String datosUsuario) throws Exception
    {
        
        String out = null;
        CtrlUsuario ca = new CtrlUsuario();
        Usuario a = null;
        Gson gson = new Gson();
        
        System.out.println(datosUsuario);
            try{
        
            a = gson.fromJson(datosUsuario, Usuario.class);
            
                
            if (a.getIdUsuario()< 1)
                ca.insert(a);
            else
                ca.update(a);
            
            out = gson.toJson(a);
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
    public Response delete(@FormParam("idUsuario") @DefaultValue("0") int idUsuario)
    {
        String out = null;
        CtrlUsuario ca = new CtrlUsuario();        
        try
        {
            ca.delete(idUsuario);
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
       
        CtrlUsuario ca = new CtrlUsuario();
      
        List<Usuario> usuario = null;
        
             try
        {
            usuario = ca.getAll(null);
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
    
    @GET
    @Path("getAllRol")
    @Produces(MediaType.APPLICATION_JSON)   
    public Response getAllCategoria()
    {
        String out = null;
       
        CtrlUsuario ca = new CtrlUsuario();
      
        List<Rol> rol = null;
        
             try
        {
            rol = ca.getAllRol(null);
            out = new Gson().toJson(rol);
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
    @Path("getAllSucursal")
    @Produces(MediaType.APPLICATION_JSON)   
    public Response getAllSucursales()
    {
        String out = null;
       
        CtrlUsuario ca = new CtrlUsuario();
      
        List<Sucursal> sucursal = null;
        
             try
        {
            sucursal = ca.getAllSucursal();
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
}
