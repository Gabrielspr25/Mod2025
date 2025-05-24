import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Select, MenuItem, TextField, Typography, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PagoDetalle from "./PagoDetalle";
import * as XLSX from "xlsx";

function PagosTable({
  pagosFiltrados,
  modelos = [],
  getNombre = () => "",
  handleEdit = () => {},
  handleDelete = () => {},
  handleAdd = () => {},
  editingId,
  editRow = {},
  setEditRow = () => {},
  newRow = {},
  setNewRow = () => {},
  calcularTotalUSD = () => 0,
  calcularDiferencia = () => 0,
  totalTokens = 0,
  totalUSD = 0,
  totalPagoModelo = 0,
  totalEnviado = 0,
  totalDiferencia = 0,
  filtroModelo,
  setFiltroModelo = () => {},
  calcularBalance = () => 0,
  handleSave = () => {},
  handleCancel = () => {}
}) {
  const [detallePago, setDetallePago] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  function mostrarDetalle(pago) {
    setDetallePago({
      ...pago,
      totalUSD: calcularTotalUSD(pago.tokens, pago.modelo_id),
      diferencia: calcularDiferencia(pago.pago_modelo, pago.monto_enviado)
    });
    setOpenDetalle(true);
  }

  const exportarExcel = () => {
    const wsData = [
      [
        "Modelo",
        "Tokens",
        "Fecha",
        "Total USD",
        "Pago modelo (COP)",
        "Monto enviado",
        "Diferencia"
      ],
      ...pagosFiltrados.map(p => [
        getNombre(p.modelo_id),
        p.tokens,
        p.fecha,
        p.totalUSD,
        p.pago_modelo,
        p.monto_enviado,
        (Number(p.pago_modelo) || 0) - (Number(p.monto_enviado) || 0)
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    XLSX.writeFile(wb, "pagos_historico.xlsx");
  };

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Pagos
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Select
          value={filtroModelo || ""}
          onChange={e => setFiltroModelo(e.target.value)}
          displayEmpty
          size="small"
          sx={{ mr: 2, minWidth: 180 }}
        >
          <MenuItem value="">Todos los modelos</MenuItem>
          {modelos.map(m => (
            <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
          ))}
        </Select>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Select
          value={newRow.modelo_id || ""}
          onChange={e => setNewRow({ ...newRow, modelo_id: e.target.value })}
          displayEmpty
          size="small"
          sx={{ mr: 2, minWidth: 140 }}
        >
          <MenuItem value="">Selecciona modelo</MenuItem>
          {modelos.map(m => (
            <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Tokens"
          value={newRow.tokens || ""}
          onChange={e => setNewRow({ ...newRow, tokens: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 90 }}
        />
        <TextField
          label="Fecha"
          type="date"
          value={newRow.fecha || ""}
          onChange={e => setNewRow({ ...newRow, fecha: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 140 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Total USD"
          value={calcularTotalUSD(newRow.tokens, newRow.modelo_id)}
          size="small"
          sx={{ mr: 2, width: 100 }}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Pago modelo (COP)"
          value={newRow.pago_modelo || ""}
          onChange={e => setNewRow({ ...newRow, pago_modelo: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <TextField
          label="Monto enviado"
          value={newRow.monto_enviado || ""}
          onChange={e => setNewRow({ ...newRow, monto_enviado: e.target.value })}
          size="small"
          sx={{ mr: 2, width: 120 }}
        />
        <TextField
          label="Diferencia"
          value={calcularDiferencia(newRow.pago_modelo, newRow.monto_enviado)}
          size="small"
          sx={{ mr: 2, width: 100 }}
          InputProps={{ readOnly: true }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Agregar
        </Button>
      </Paper>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={exportarExcel}
      >
        Exportar a Excel
      </Button>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Modelo</TableCell>
              <TableCell>Tokens</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total USD</TableCell>
              <TableCell>Pago modelo (COP)</TableCell>
              <TableCell>Monto enviado</TableCell>
              <TableCell>Diferencia</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagosFiltrados.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editingId === fila.id ? (
                    <Select
                      value={editRow.modelo_id || ""}
                      onChange={e => setEditRow({ ...editRow, modelo_id: e.target.value })}
                      size="small"
                      sx={{ minWidth: 140 }}
                    >
                      {modelos.map(m => (
                        <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    getNombre(fila.modelo_id)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.tokens || ""}
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
                      value={editRow.fecha || ""}
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
                  {calcularTotalUSD(
                    editingId === fila.id ? editRow.tokens : fila.tokens,
                    editingId === fila.id ? editRow.modelo_id : fila.modelo_id
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.pago_modelo || ""}
                      onChange={e => setEditRow({ ...editRow, pago_modelo: e.target.value })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  ) : (
                    fila.pago_modelo
                  )}
                </TableCell>
                <TableCell>
                  {editingId === fila.id ? (
                    <TextField
                      value={editRow.monto_enviado || ""}
                      onChange={e => setEditRow({ ...editRow, monto_enviado: e.target.value })}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  ) : (
                    fila.monto_enviado
                  )}
                </TableCell>
                <TableCell>
                  {calcularDiferencia(
                    editingId === fila.id ? editRow.pago_modelo : fila.pago_modelo,
                    editingId === fila.id ? editRow.monto_enviado : fila.monto_enviado
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
                      <IconButton color="secondary" onClick={() => mostrarDetalle(fila)}>
                        <DescriptionIcon />
                      </IconButton>
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
            <TableRow sx={{ backgroundColor: "#222" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Totales</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{totalTokens}</TableCell>
              <TableCell />
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{totalUSD}</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{totalPagoModelo}</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{totalEnviado}</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{totalDiferencia}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {filtroModelo && (
        <Paper sx={{ p: 2, mb: 2, background: "#222", color: "#fff" }}>
          <Typography>
            Balance acumulado de {getNombre(filtroModelo)}: <b>{calcularBalance(filtroModelo)}</b>
          </Typography>
        </Paper>
      )}
      <PagoDetalle
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        pago={detallePago}
        getNombre={getNombre}
      />
    </>
  );
}

export default PagosTable;