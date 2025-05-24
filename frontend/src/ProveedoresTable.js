import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

function ProveedoresTable() {
  const [proveedores, setProveedores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({ nombre: "", notas: "" });

  useEffect(() => {
    fetchProveedores();
  }, []);

  async function fetchProveedores() {
    const { data } = await supabase.from("proveedores").select("*").order("id", { ascending: true });
    setProveedores(data || []);
  }

  // Crear nuevo proveedor
  async function handleAdd() {
    if (!newRow.nombre) return;
    await supabase.from("proveedores").insert([newRow]);
    setNewRow({ nombre: "", notas: "" });
    fetchProveedores();
  }

  // Editar proveedor
  function handleEdit(row) {
    setEditingId(row.id);
    setEditRow({ nombre: row.nombre, notas: row.notas });
  }

  // Guardar edición
  async function handleSave(id) {
    await supabase.from("proveedores").update(editRow).eq("id", id);
    setEditingId(null);
    setEditRow({});
    fetchProveedores();
  }

  // Cancelar edición
  function handleCancel() {
    setEditingId(null);
    setEditRow({});
  }

  // Eliminar proveedor
  async function handleDelete(id) {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      await supabase.from("proveedores").delete().eq("id", id);
      fetchProveedores();
    }
  }

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Proveedores
      </Typography>
      {/* Formulario para agregar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Nombre"
          value={newRow.nombre}
          onChange={e => setNewRow({ ...newRow, nombre: e.target.value })}
          size="small"
          sx={{ mr: 2 }}
        />
        <TextField
          label="Notas"
          value={newRow.notas}
          onChange={e => setNewRow({ ...newRow, notas: e.target.value })}
          size="small"
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Agregar
        </Button>
      </Paper>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.nombre}
                      onChange={e => setEditRow({ ...editRow, nombre: e.target.value })}
                      size="small"
                    />
                  ) : (
                    fila.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.notas}
                      onChange={e => setEditRow({ ...editRow, notas: e.target.value })}
                      size="small"
                    />
                  ) : (
                    fila.notas
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === fila.id ? (
                    <>
                      <IconButton color="success" onClick={() => handleSave(fila.id)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="inherit" onClick={handleCancel}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton color="primary" onClick={() => handleEdit(fila)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(fila.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ProveedoresTable;