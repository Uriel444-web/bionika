    /*
     * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
     * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
     */
    package com.bionika.rest;

    import com.bionika.controller.ControllerProductos;
    import com.bionika.model.Categoria;
    import com.bionika.model.Producto;
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
                      {"error":"Error interno del servidor."}
                      """;
            }
            return Response.ok(out).build();
        }

        @GET
        @Path("getAll")
        @Produces(MediaType.APPLICATION_JSON)
        public Response getAll(){
            String out = "";
            ControllerProductos cp = new ControllerProductos();
            List<Producto> productos = null;
            try {
                productos = cp.getAll();
                out = new Gson().toJson(productos);

            } catch (Exception e) {
                 e.printStackTrace();
                out = """
                      {"error" : "Error interno del Servidor, comunicate al area de Sistemas"}
                      """;
            }
            return Response.ok(out).build();
        }

        @GET
        @Path("getAllCategorias")
        @Produces(MediaType.APPLICATION_JSON)
        public Response getAllCategorias(){
            String out = "";
            ControllerProductos cp = new ControllerProductos();
            List<Categoria> categorias = null;
            try {
                categorias = cp.getAllCategorias();
                out = new Gson().toJson(categorias);

            } catch (Exception e) {
                 e.printStackTrace();
                out = """
                      {"error" : "Error interno del Servidor, comunicate al area de Sistemas"}
                      """;
            }
            return Response.ok(out).build();
        }
        
    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
        public Response validarRol(@FormParam("idProducto") int idProducto) {
        String out = "";
        ControllerProductos cp = new ControllerProductos();
    
            try {
                boolean eliminar = cp.eliminar(idProducto); // Nuevo método que devuelve el ID del rol
                if (eliminar) {
                    out = """
                          {"eliminado" : "ok"}
                          """;
                }
            } catch (Exception ex) {
                out = """
                    {"error": "Error al validar el rol, contacta al administrador"}
                    """;
             ex.printStackTrace();
            }

        return Response.status(Response.Status.OK).entity(out).build();
    }
    }
