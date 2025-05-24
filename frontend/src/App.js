import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Container from "@mui/material/Container";
import ModelosTable from "./ModelosTable";
import ProveedoresTable from "./ProveedoresTable";
import IngresosTable from "./IngresosTable";
import PagosTable from "./PagosTable";
import { supabase } from "./supabaseClient";

const drawerWidth = 220;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [modulo, setModulo] = useState("modelos");

  // ESTADO REAL PARA PAGOS Y MODELOS
  const [pagos, setPagos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [filtroModelo, setFiltroModelo] = useState("");
  
  // Cargar datos al iniciar
  useEffect(() => {
    fetchPagos();
    fetchModelos();
  }, []);

  async function fetchPagos() {
    let query = supabase.from("pagos").select("*").order("id", { ascending: true });
    if (filtroModelo) query = query.eq("modelo_id", filtroModelo);
    const { data } = await query;
    setPagos(data || []);
  }

  async function fetchModelos() {
    const { data } = await supabase.from("modelos").select("*").order("id", { ascending: true });
    setModelos(data || []);
  }

  // Helpers
  function getNombre(modelo_id) {
    const modelo = modelos.find(m => m.id === modelo_id || m.id === Number(modelo_id));
    return modelo ? modelo.nombre : modelo_id;
  }

  // CRUD PAGOS
  async function handleAdd() {
    if (!newRow.modelo_id || !newRow.tokens || !newRow.fecha) return;
    await supabase.from("pagos").insert([newRow]);
    setNewRow({});
    fetchPagos();
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setEditRow(row);
  }

  async function handleSave(id) {
    await supabase.from("pagos").update(editRow).eq("id", id);
    setEditingId(null);
    setEditRow({});
    fetchPagos();
  }

  function handleCancel() {
    setEditingId(null);
    setEditRow({});
  }

  async function handleDelete(id) {
    if (window.confirm("¿Seguro que deseas eliminar este pago?")) {
      await supabase.from("pagos").delete().eq("id", id);
      fetchPagos();
    }
  }

  // FILTRO
  useEffect(() => {
    fetchPagos();
    // eslint-disable-next-line
  }, [filtroModelo]);

  // Cálculos de totales
  const pagosFiltrados = pagos;
  const totalTokens = pagosFiltrados.reduce((a, b) => a + (Number(b.tokens) || 0), 0);
  const totalUSD = pagosFiltrados.reduce((a, b) => a + (Number(b.totalUSD) || 0), 0);
  const totalPagoModelo = pagosFiltrados.reduce((a, b) => a + (Number(b.pago_modelo) || 0), 0);
  const totalEnviado = pagosFiltrados.reduce((a, b) => a + (Number(b.monto_enviado) || 0), 0);
  const totalDiferencia = pagosFiltrados.reduce((a, b) => a + ((Number(b.pago_modelo) || 0) - (Number(b.monto_enviado) || 0)), 0);

  function calcularTotalUSD(tokens) {
    // Ajusta la lógica según tu negocio
    return tokens ? (Number(tokens) * 0.05).toFixed(2) : 0;
  }

  function calcularDiferencia(pago_modelo, monto_enviado) {
    return (Number(pago_modelo) || 0) - (Number(monto_enviado) || 0);
  }

  function calcularBalance(modelo_id) {
    return pagos
      .filter(p => p.modelo_id === modelo_id)
      .reduce((a, b) => a + ((Number(b.pago_modelo) || 0) - (Number(b.monto_enviado) || 0)), 0);
  }

  // ¡NO pongas ningún alert ni función exportarExcel aquí!

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Menú lateral */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#222",
              color: "#fff",
            },
          }}
        >
          <List>
            <ListItem button selected={modulo === "modelos"} onClick={() => setModulo("modelos")}>
              <ListItemIcon>
                <InventoryIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Modelos" />
            </ListItem>
            <ListItem button selected={modulo === "proveedores"} onClick={() => setModulo("proveedores")}>
              <ListItemIcon>
                <StoreIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Proveedores" />
            </ListItem>
            <ListItem button selected={modulo === "ingresos"} onClick={() => setModulo("ingresos")}>
              <ListItemIcon>
                <MonetizationOnIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Ingresos" />
            </ListItem>
            <ListItem button selected={modulo === "pagos"} onClick={() => setModulo("pagos")}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Pagos" />
            </ListItem>
          </List>
        </Drawer>
        {/* Contenido principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container>
            {modulo === "modelos" && <ModelosTable />}
            {modulo === "proveedores" && <ProveedoresTable />}
            {modulo === "ingresos" && <IngresosTable />}
            {modulo === "pagos" && (
              <PagosTable
                pagosFiltrados={pagosFiltrados}
                modelos={modelos}
                getNombre={getNombre}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
                editingId={editingId}
                editRow={editRow}
                setEditRow={setEditRow}
                newRow={newRow}
                setNewRow={setNewRow}
                calcularTotalUSD={calcularTotalUSD}
                calcularDiferencia={calcularDiferencia}
                totalTokens={totalTokens}
                totalUSD={totalUSD}
                totalPagoModelo={totalPagoModelo}
                totalEnviado={totalEnviado}
                totalDiferencia={totalDiferencia}
                filtroModelo={filtroModelo}
                setFiltroModelo={setFiltroModelo}
                calcularBalance={calcularBalance}
                // exportarExcel eliminado
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;