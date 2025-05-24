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

function ModelosTable() {
  const [modelos, setModelos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({
    nickname: "",
    nombre: "",
    cedula: "",
    direccion: "",
    notas: "",
    porcentaje: "",
  });

  useEffect(() => {
    fetchModelos();
  }, []);

  async function fetchModelos() {
    const { data } = await supabase.from("modelos").select("*").order("id", { ascending: true });
    setModelos(data || []);
  }

  // Crear nuevo modelo
  async function handleAdd() {
    if (!newRow.nickname || !newRow.nombre) return;
    await supabase.from("modelos").insert([newRow]);
    setNewRow({
      nickname: "",
      nombre: "",
      cedula: "",
      direccion: "",
      notas: "",
      porcentaje: "",
    });
    fetchModelos();
  }

  // Editar modelo
  function handleEdit(row) {
    setEditingId(row.id);
    setEditRow({
      nickname: row.nickname,
      nombre: row.nombre,
      cedula: row.cedula,
      direccion: row.direccion,
      notas: row.notas,
      porcentaje: row.porcentaje,
    });
  }

  // Guardar edición
  async function handleSave(id) {
    await supabase.from("modelos").update(editRow).eq("id", id);
    setEditingId(null);
    setEditRow({});
    fetchModelos();
  }

  // Cancelar edición
  function handleCancel() {
    setEditingId(null);
    setEditRow({});
  }

  // Eliminar modelo
  async function handleDelete(id) {
    if (window.confirm("¿Seguro que deseas eliminar este modelo?")) {
      await supabase.from("modelos").delete().eq("id", id);
      fetchModelos();
    }
  }

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Modelos
      </Typography>
      {/* Formulario para agregar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Nickname"
          value={newRow.nickname}
          onChange={e => setNewRow({ ...newRow, nickname: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <TextField
          label="Nombre"
          value={newRow.nombre}
          onChange={e => setNewRow({ ...newRow, nombre: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <TextField
          label="Cédula"
          value={newRow.cedula}
          onChange={e => setNewRow({ ...newRow, cedula: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 100 }}
        />
        <TextField
          label="Dirección"
          value={newRow.direccion}
          onChange={e => setNewRow({ ...newRow, direccion: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 140 }}
        />
        <TextField
          label="Notas"
          value={newRow.notas}
          onChange={e => setNewRow({ ...newRow, notas: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <TextField
          label="Porcentaje (%)"
          value={newRow.porcentaje}
          onChange={e => setNewRow({ ...newRow, porcentaje: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 90 }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Agregar
        </Button>
      </Paper>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nickname</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Porcentaje (%)</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modelos.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.nickname}
                      onChange={e => setEditRow({ ...editRow, nickname: e.target.value })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  ) : (
                    fila.nickname
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.nombre}
                      onChange={e => setEditRow({ ...editRow, nombre: e.target.value })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  ) : (
                    fila.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.cedula}
                      onChange={e => setEditRow({ ...editRow, cedula: e.target.value })}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  ) : (
                    fila.cedula
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.direccion}
                      onChange={e => setEditRow({ ...editRow, direccion: e.target.value })}
                      size="small"
                      sx={{ width: 140 }}
                    />
                  ) : (
                    fila.direccion
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.notas}
                      onChange={e => setEditRow({ ...editRow, notas: e.target.value })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  ) : (
                    fila.notas
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.porcentaje}
                      onChange={e => setEditRow({ ...editRow, porcentaje: e.target.value })}
                      size="small"
                      sx={{ width: 90 }}
                    />
                  ) : (
                    fila.porcentaje
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

export default ModelosTable;