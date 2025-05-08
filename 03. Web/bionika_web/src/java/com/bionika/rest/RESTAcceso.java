package com.bionika.rest;

import com.bionika.controller.CtrlLogin;
import com.bionika.model.Usuario;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import java.sql.SQLException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("acceso")
public class RESTAcceso {

    @Path("login")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response logIn(@FormParam("usuario") @DefaultValue("") String usuario) {

        Gson objGS = new Gson();
        Usuario u = objGS.fromJson(usuario, Usuario.class);
        String out = "";
        CtrlLogin objAC = new CtrlLogin();

        try {

            objAC.validarAcceso(u);

            if (u.getId() > 0) {

                u.setToken();
                objAC.almacenarToken(u);
                out = objGS.toJson(u);

            } else {
                out = """
                        {"error":"Credencial Inválida"}
                        """;
            }

        } catch (SQLException ex) {

            ex.printStackTrace();
            out = """
                    {"error":"Error interno de BD, comunícate con el administrador del sistema"}
                  """;

        } catch (Exception ex) {

            ex.printStackTrace();
            out = """
                    {"error":"Error interno de BD, comunícate con el administrador del sistema"}
                  """;
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("logout")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response logOut(@FormParam("t") @DefaultValue("") String t) {

        String out = "";
        CtrlLogin objAC = new CtrlLogin();

        try {
            
            objAC.eliminarToken(t);
            out = """
                    {"result":"Ok"}
                  """;
            
        } catch (SQLException ex) {
            
            out = """
                    {"error":"Problemas con la BD, contacta al administrador del sistema"}
                  """;
            
        } catch (Exception ex) {
            
            out = """
                    {"error":"Problemas con la BD, contacta al administrador del sistema"}
                  """;
        }
        
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("validarRol")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
        public Response validarRol(@FormParam("idUsuario") int idUsuario) {
        String out;
        CtrlLogin objCL = new CtrlLogin();
    
            try {
                int idRol = objCL.obtenerIdRol(idUsuario); // Nuevo método que devuelve el ID del rol
                out = """
                    {"idRol": %d}
                    """.formatted(idRol);
            } catch (Exception ex) {
                out = """
                    {"error": "Error al validar el rol, contacta al administrador"}
                    """;
             ex.printStackTrace();
            }

        return Response.status(Response.Status.OK).entity(out).build();
    }

}
