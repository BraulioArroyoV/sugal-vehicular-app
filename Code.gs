// ============================================================
// SUGAL — Control Vehicular | Google Apps Script Backend
// Despliega como Web App: Ejecutar como "Yo", Acceso "Cualquiera"
// ============================================================

const SHEET_NAME = "REGISTROS";
const HEADERS = [
  "N° ASIGNADO", "PATENTE", "CHOFER", "EMPRESA",
  "FECHA INGRESO", "HORA INGRESO", "FECHA SALIDA", "HORA SALIDA",
  "MOTIVO", "ESTADO", "ID_INTERNO"
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws = ss.getSheetByName(SHEET_NAME);
  if (!ws) {
    ws = ss.insertSheet(SHEET_NAME);
    // Escribir headers con estilo
    const headerRange = ws.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setBackground("#1B3A6B");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    ws.setFrozenRows(1);
    ws.setColumnWidths(1, HEADERS.length, 130);
    ws.getRange(1, 1).setColumnWidth(90);   // N°
    ws.getRange(1, 2).setColumnWidth(100);  // PATENTE
    ws.getRange(1, 3).setColumnWidth(180);  // CHOFER
    ws.getRange(1, 4).setColumnWidth(180);  // EMPRESA
  }
  return ws;
}

function padZ(n) { return String(n).padStart(2, "0"); }

function tsToDate(ts) {
  const d = new Date(ts);
  return padZ(d.getDate()) + "/" + padZ(d.getMonth() + 1) + "/" + d.getFullYear();
}

function tsToTime(ts) {
  const d = new Date(ts);
  return padZ(d.getHours()) + ":" + padZ(d.getMinutes());
}

// CORS headers helper
function corsResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ---- ROUTER ----
function doGet(e) {
  const action = e.parameter.action || "listar";
  let result;
  try {
    if (action === "listar")        result = listar();
    else if (action === "ping")     result = { ok: true, ts: Date.now() };
    else result = { error: "Acción desconocida" };
  } catch (err) {
    result = { error: err.message };
  }
  return corsResponse(result);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch(err) { return corsResponse({ error: "JSON inválido" }); }

  const action = body.action;
  let result;
  try {
    if (action === "entrada")       result = registrarEntrada(body);
    else if (action === "salida")   result = registrarSalida(body);
    else if (action === "importar") result = importarLote(body);
    else result = { error: "Acción desconocida" };
  } catch (err) {
    result = { error: err.message };
  }
  return corsResponse(result);
}

// ---- LISTAR todos los registros ----
function listar() {
  const ws = getSheet();
  const lastRow = ws.getLastRow();
  if (lastRow < 2) return { registros: [] };

  const data = ws.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const registros = data
    .filter(row => row[10]) // tiene ID_INTERNO
    .map(row => ({
      num:      row[0],
      placa:    row[1],
      chofer:   row[2],
      empresa:  row[3],
      fechaIngreso: row[4],
      horaIngreso:  row[5],
      fechaSalida:  row[6] || "",
      horaSalida:   row[7] || "",
      motivo:   row[8] || "",
      estado:   row[9],
      id:       row[10]
    }));
  return { registros };
}

// ---- REGISTRAR ENTRADA ----
function registrarEntrada(body) {
  const ws = getSheet();
  const { placa, chofer, empresa, motivo, entrada, id } = body;

  // Verificar duplicado activo
  const lastRow = ws.getLastRow();
  if (lastRow >= 2) {
    const data = ws.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    const dup = data.find(row => row[1] === placa && row[9] === "EN PLANTA");
    if (dup) return { error: "La patente " + placa + " ya está en planta (N°" + dup[0] + ")" };
  }

  // Calcular número correlativo
  let maxNum = 0;
  if (lastRow >= 2) {
    const nums = ws.getRange(2, 1, lastRow - 1, 1).getValues();
    nums.forEach(row => { if (row[0] > maxNum) maxNum = row[0]; });
  }
  const num = maxNum + 1;

  const ts = entrada || Date.now();
  const newRow = [
    num,
    placa,
    chofer,
    empresa || "",
    tsToDate(ts),
    tsToTime(ts),
    "",             // Fecha Salida
    "",             // Hora Salida
    motivo || "",
    "EN PLANTA",
    id
  ];

  const insertRow = lastRow + 1;
  ws.getRange(insertRow, 1, 1, HEADERS.length).setValues([newRow]);

  // Estilo fila nueva — verde suave
  ws.getRange(insertRow, 1, 1, HEADERS.length).setBackground("#f0fdf4");
  ws.getRange(insertRow, 10).setFontColor("#15803d").setFontWeight("bold");

  return { ok: true, num, id };
}

// ---- REGISTRAR SALIDA ----
function registrarSalida(body) {
  const ws = getSheet();
  const { id, salida } = body;
  const lastRow = ws.getLastRow();
  if (lastRow < 2) return { error: "Sin registros" };

  const data = ws.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const rowIdx = data.findIndex(row => row[10] === id);
  if (rowIdx === -1) return { error: "Registro no encontrado: " + id };

  const sheetRow = rowIdx + 2;
  const ts = salida || Date.now();

  ws.getRange(sheetRow, 7).setValue(tsToDate(ts)); // Fecha Salida
  ws.getRange(sheetRow, 8).setValue(tsToTime(ts)); // Hora Salida
  ws.getRange(sheetRow, 10).setValue("SALIÓ");

  // Estilo fila salida — gris
  ws.getRange(sheetRow, 1, 1, HEADERS.length).setBackground("#f8fafc");
  ws.getRange(sheetRow, 10).setFontColor("#64748b").setFontWeight("normal");

  return { ok: true, id };
}

// ---- IMPORTAR LOTE (desde localStorage al abrir la app) ----
function importarLote(body) {
  const { registros } = body;
  if (!registros || !registros.length) return { ok: true, importados: 0 };

  const ws = getSheet();
  const lastRow = ws.getLastRow();
  let existingIds = new Set();

  if (lastRow >= 2) {
    const ids = ws.getRange(2, 1, lastRow - 1, 11).getValues().map(r => r[10]);
    ids.forEach(id => existingIds.add(id));
  }

  let maxNum = 0;
  if (lastRow >= 2) {
    ws.getRange(2, 1, lastRow - 1, 1).getValues().forEach(r => { if (r[0] > maxNum) maxNum = r[0]; });
  }

  let importados = 0;
  const nuevas = [];

  registros.forEach(r => {
    if (existingIds.has(r.id)) return;
    const num = r.num || ++maxNum;
    nuevas.push([
      num, r.placa, r.chofer, r.empresa || "",
      r.fechaIngreso || tsToDate(r.entrada || Date.now()),
      r.horaIngreso  || tsToTime(r.entrada || Date.now()),
      r.fechaSalida  || (r.salida ? tsToDate(r.salida) : ""),
      r.horaSalida   || (r.salida ? tsToTime(r.salida) : ""),
      r.motivo || "",
      r.salida ? "SALIÓ" : "EN PLANTA",
      r.id
    ]);
    importados++;
  });

  if (nuevas.length > 0) {
    ws.getRange(lastRow + 1, 1, nuevas.length, HEADERS.length).setValues(nuevas);
  }

  return { ok: true, importados };
}
