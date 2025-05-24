import React from "react";
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableRow, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function PagoDetalle({ open, onClose, pago, getNombre }) {
  if (!pago) return null;

  const detalles = [
    { label: "Modelo", value: getNombre ? getNombre(pago.modelo_id) : pago.modelo_id },
    { label: "Tokens", value: pago.tokens },
    { label: "Fecha", value: pago.fecha },
    { label: "Total USD", value: pago.totalUSD },
    { label: "Pago modelo (COP)", value: pago.pago_modelo },
    { label: "Monto enviado", value: pago.monto_enviado },
    {
      label: "Diferencia",
      value: pago.diferencia,
      sx: {
        color: pago.diferencia < 0 ? "#d32f2f" : "#388e3c",
        fontWeight: "bold"
      }
    }
  ];

  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Detalle del Pago", 105, 18, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: detalles.map(item => [item.label, item.value]),
      styles: {
        fontSize: 12,
        cellPadding: 4,
        valign: "middle"
      },
      headStyles: {
        fillColor: [34, 34, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      bodyStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230]
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", textColor: [33, 150, 243] },
        1: { cellWidth: 100 }
      }
    });

    doc.save("detalle_pago.pdf");
  };

  const handleDescargarExcel = () => {
    const wsData = [
      ["Campo", "Valor"],
      ...detalles.map(item => [item.label, item.value])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DetallePago");
    XLSX.writeFile(wb, "detalle_pago.xlsx");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: "#222", color: "#fff", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Detalle del Pago
        <Box>
          <IconButton color="success" onClick={handleDescargarExcel} title="Descargar Excel">
            <TableViewIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDescargarPDF} title="Descargar PDF">
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onClose} title="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ background: "#181818" }}>
        <Table
          sx={{
            border: "1px solid #444",
            borderRadius: 2,
            overflow: "hidden",
            background: "#222"
          }}
        >
          <TableBody>
            {detalles.map((item, idx) => (
              <TableRow key={idx} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ color: "#90caf9", fontWeight: "bold", borderBottom: "1px solid #333" }}>
                  <Typography variant="subtitle2">{item.label}</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    borderBottom: "1px solid #333",
                    ...(item.sx || {})
                  }}
                >
                  <Typography>{item.value}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default PagoDetalle;