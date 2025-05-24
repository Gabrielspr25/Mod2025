# Proyecto Pagos - Frontend

## Resumen
Aplicación React para gestión de pagos de modelos, con exportación a Excel y PDF.

## Estructura relevante
- `src/App.js`: Lógica principal y enrutamiento de módulos.
- `src/PagosTable.js`: Tabla de pagos, exportación histórica a Excel.
- `src/PagoDetalle.js`: Modal de detalle de pago, exportación individual a Excel y PDF.

## Exportación
- **Botón "EXPORTAR A EXCEL" (arriba de la tabla):** Descarga todas las transacciones históricas en Excel (`pagos_historico.xlsx`).
- **Botón Excel en el modal:** Descarga solo el detalle del pago seleccionado.
- **Botón PDF en el modal:** Descarga solo el detalle del pago seleccionado en PDF.

## Dependencias
- `xlsx` para exportar a Excel
- `jspdf` y `jspdf-autotable` para exportar a PDF

## Mejoras futuras / Escalabilidad
- Permitir exportar por rango de fechas o filtros avanzados.
- Mejorar formato de los archivos exportados.
- Agregar exportación masiva de PDFs.
- Internacionalización de textos.
- Soporte para más columnas o datos adicionales.

---

**Notas:**  
- Si agregas nuevas columnas o cambias la estructura, recuerda actualizar la función `exportarExcel` en `PagosTable.js` y en `PagoDetalle.js`.
- Si cambias la lógica de negocio, documenta aquí los cambios.