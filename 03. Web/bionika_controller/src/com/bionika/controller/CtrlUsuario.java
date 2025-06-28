package com.bionika.controller;

import com.bionika.db.ConexionMySQL;
import com.bionika.model.Empleado;
import com.bionika.model.Rol;
import com.bionika.model.Sucursal;
import com.bionika.model.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.CallableStatement;

public class CtrlUsuario {

    public int insert(Usuario us) throws Exception {
        String sql = "{CALL insertarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try {
            ConexionMySQL connMySQL = new ConexionMySQL();
            Connection conn = connMySQL.open();

            CallableStatement cstmt = conn.prepareCall(sql);

            // Datos del empleado
            cstmt.setString(1, us.getEmpleado().getNombre());
            cstmt.setString(2, us.getEmpleado().getApellidoP());
            cstmt.setString(3, us.getEmpleado().getApellidoM());
            cstmt.setString(4, us.getEmpleado().getCorreo());
            cstmt.setString(5, us.getEmpleado().getTelefono());

            // Datos del usuario
            cstmt.setString(6, us.getUsuario());
            cstmt.setString(7, us.getContrasena());
            cstmt.setInt(8, us.getRol().getIdRol());
            cstmt.setInt(9, us.getSucursal().getIdSucursal()); // NUEVO: sucursal

            // Salidas
            cstmt.registerOutParameter(10, java.sql.Types.INTEGER); // idEmpleado
            cstmt.registerOutParameter(11, java.sql.Types.INTEGER); // idUsuario

            cstmt.executeUpdate();

            us.getEmpleado().setIdEmpleado(cstmt.getInt(10));
            us.setIdUsuario(cstmt.getInt(11));

            cstmt.close();
            connMySQL.close();

            return us.getIdUsuario();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return 0;
    }

    public void update(Usuario us) throws Exception {
        String sql = "{CALL actualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        java.sql.CallableStatement cstmt = conn.prepareCall(sql);

        cstmt.setString(1, us.getEmpleado().getNombre());
        cstmt.setString(2, us.getEmpleado().getApellidoP());
        cstmt.setString(3, us.getEmpleado().getApellidoM());
        cstmt.setString(4, us.getEmpleado().getCorreo());
        cstmt.setString(5, us.getEmpleado().getTelefono());
        cstmt.setString(6, us.getUsuario());
        cstmt.setString(7, us.getContrasena());
        cstmt.setInt(8, us.getRol().getIdRol());
        cstmt.setInt(9, us.getSucursal().getIdSucursal());
        cstmt.setInt(10, us.getEmpleado().getIdEmpleado());
        cstmt.setInt(11, us.getIdUsuario());

        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(int id) throws Exception {
        // Se define la consulta SQL:
        String sql = "UPDATE usuario SET activo=0 WHERE idUsuario=?";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);

        // Llenamos los datos del PreparedStatement:
        pstmt.setInt(1, id);

        // Ejecutamos la consulta:
        pstmt.executeUpdate();

        // Cerramos los objetos de conexion:
        pstmt.close();
        connMySQL.close();
    }

    public List<Usuario> getAll(String filtro) throws Exception {
        List<Usuario> us = new ArrayList<>();
        // Se define la consulta SQL:
        String sql = "SELECT * FROM v_usuario WHERE activo=1";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Usuario usuario = null;

        // Recorremos cada registro devuelto por la consulta:
        while (rs.next()) {
            usuario = fill(rs);
            us.add(usuario);
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return us;
    }

    private Usuario fill(ResultSet rs) throws Exception {
        Rol r = new Rol();
        Usuario u = new Usuario();
        Empleado e = new Empleado();

        u.setEmpleado(e);
        u.setRol(r);

        u.setIdUsuario(rs.getInt("idUsuario"));
        u.setUsuario(rs.getString("usuario"));
        u.setContrasena(rs.getString("contrasena"));
        u.setActivo(rs.getInt("activo"));

        e.setIdEmpleado(rs.getInt("idEmpleado"));
        e.setNombre(rs.getString("nombre"));
        e.setApellidoP(rs.getString("ApellidoP"));
        e.setApellidoM(rs.getString("ApellidoM"));
        e.setCorreo(rs.getString("correo"));
        e.setTelefono(rs.getString("telefono"));

        r.setTipoRol(rs.getString("tipoRol"));
        r.setIdRol(rs.getInt("idRol"));

        return u;
    }

    public List<Rol> getAllRol(String filtro) throws Exception {
        List<Rol> r = new ArrayList<>();
        // Se define la consulta SQL:
        String sql = "SELECT * FROM rol";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Rol rol = null;

        // Recorremos cada registro devuelto por la consulta:
        while (rs.next()) {
            rol = fillRol(rs);
            r.add(rol);
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return r;
    }

    private Rol fillRol(ResultSet rs) throws Exception {
        Rol r = new Rol();
        // Establecemos los valores de cada atributo de
        // los objetos relacionados, extraidos de cada
        // campo del ResultSet:     
        r.setTipoRol(rs.getString("tipoRol"));
        r.setIdRol(rs.getInt("idRol"));

        return r;
    }
    
    public List<Sucursal> getAllSucursal() throws Exception {
        List<Sucursal> suc = new ArrayList<>();
        // Se define la consulta SQL:
        String sql = "SELECT * FROM sucursal";

        // Abrimos la conexion con la BD:
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        Sucursal sucursal = null;

        // Recorremos cada registro devuelto por la consulta:
        while (rs.next()) {
            sucursal = fillSucursal(rs);
            suc.add(sucursal);
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return suc;
    }
    
    private Sucursal fillSucursal(ResultSet rs) throws Exception {
        Sucursal s = new Sucursal();
        s.setIdSucursal(rs.getInt("idSucursal"));
        s.setNombreSuc(rs.getString("nombreSuc"));
        s.setColonia(rs.getString("colonia"));
        s.setCalle(rs.getString("calle"));
        s.setCodPos(rs.getString("codPos"));
        s.setLatitud(rs.getString("latitud"));
        s.setLongitud(rs.getString("longitud"));
        s.setNumExt(rs.getString("numExt"));
        s.setTelefono(rs.getString("telefono"));
        s.setActivo(rs.getInt("activo"));
        
        return s;
    }
}
