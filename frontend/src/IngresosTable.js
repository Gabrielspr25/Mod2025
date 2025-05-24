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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function IngresosTable() {
  const [ingresos, setIngresos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({
    proveedor_id: "",
    tokens: "",
    fecha: "",
    monto_usd: "",
    notas: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const { data: ingresosData } = await supabase.from("ingresos").select("*").order("id", { ascending: true });
    const { data: proveedoresData } = await supabase.from("proveedores").select("*");
    setIngresos(ingresosData || []);
    setProveedores(proveedoresData || []);
  }

  // Crear nuevo ingreso
  async function handleAdd() {
    if (!newRow.proveedor_id || !newRow.tokens || !newRow.fecha || !newRow.monto_usd) return;
    await supabase.from("ingresos").insert([newRow]);
    setNewRow({ proveedor_id: "", tokens: "", fecha: "", monto_usd: "", notas: "" });
    fetchAll();
  }

  // Editar ingreso
  function handleEdit(row) {
    setEditingId(row.id);
    setEditRow({
      proveedor_id: row.proveedor_id,
      tokens: row.tokens,
      fecha: row.fecha,
      monto_usd: row.monto_usd,
      notas: row.notas,
    });
  }

  // Guardar edición
  async function handleSave(id) {
    await supabase.from("ingresos").update(editRow).eq("id", id);
    setEditingId(null);
    setEditRow({});
    fetchAll();
  }

  // Cancelar edición
  function handleCancel() {
    setEditingId(null);
    setEditRow({});
  }

  // Eliminar ingreso
  async function handleDelete(id) {
    if (window.confirm("¿Seguro que deseas eliminar este ingreso?")) {
      await supabase.from("ingresos").delete().eq("id", id);
      fetchAll();
    }
  }

  // Helper para mostrar nombre del proveedor
  function getProveedorNombre(id) {
    const prov = proveedores.find(p => p.id === id);
    return prov ? prov.nombre : id;
  }

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Ingresos
      </Typography>
      {/* Formulario para agregar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Select
          value={newRow.proveedor_id}
          onChange={e => setNewRow({ ...newRow, proveedor_id: e.target.value })}
          displayEmpty
          size="small"
          sx={{ mr: 2, minWidth: 120 }}
        >
          <MenuItem value="">Proveedor</MenuItem>
          {proveedores.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Tokens"
          value={newRow.tokens}
          onChange={e => setNewRow({ ...newRow, tokens: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 90 }}
        />
        <TextField
          label="Fecha"
          type="date"
          value={newRow.fecha}
          onChange={e => setNewRow({ ...newRow, fecha: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 140 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Monto USD"
          value={newRow.monto_usd}
          onChange={e => setNewRow({ ...newRow, monto_usd: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 110 }}
        />
        <TextField
          label="Notas"
          value={newRow.notas}
          onChange={e => setNewRow({ ...newRow, notas: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Agregar
        </Button>
      </Paper>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proveedor</TableCell>
              <TableCell>Tokens</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto USD</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingresos.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editingId === fila.id ? (
                    <Select
                      value={editRow.proveedor_id}
                      onChange={e => setEditRow({ ...editRow, proveedor_id: e.target.value })}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {proveedores.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    getProveedorNombre(fila.proveedor_id)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.tokens}
                      onChange={e => setEditRow({ ...editRow, tokens: e.target.value })}
                      size="small"
                      sx={{ width: 90 }}
                    />
                  ) : (
                    fila.tokens
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      type="date"
                      value={editRow.fecha}
                      onChange={e => setEditRow({ ...editRow, fecha: e.target.value })}
                      size="small"
                      sx={{ width: 140 }}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    fila.fecha
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.monto_usd}
                      onChange={e => setEditRow({ ...editRow, monto_usd: e.target.value })}
                      size="small"
                      sx={{ width: 110 }}
                    />
                  ) : (
                    fila.monto_usd
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

export default IngresosTable;