// Respuestas correctas: cámbialas si lo necesitas
const CORRECTAS = { p1: "b", p2: "c", p3: "b" };
const HOJA = "Respuestas";

function hojaRespuestas_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA) || ss.insertSheet(HOJA);
  if (sh.getLastRow() === 0) sh.appendRow(["Fecha", "P1", "P2", "P3"]);
  return sh;
}

// Recibe las respuestas del formulario
function doPost(e) {
  const p = e.parameter;
  hojaRespuestas_().appendRow([new Date(), p.p1, p.p2, p.p3]);
  return ContentService.createTextOutput("ok");
}

// Entrega los conteos a la página de resultados
function doGet() {
  const sh = hojaRespuestas_();
  const n = sh.getLastRow() - 1;
  const out = { total: Math.max(n, 0), p1: {}, p2: {}, p3: {} };
  if (n > 0) {
    sh.getRange(2, 2, n, 3).getValues().forEach(fila => {
      ["p1", "p2", "p3"].forEach((q, i) => {
        const v = fila[i];
        out[q][v] = (out[q][v] || 0) + 1;
      });
    });
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ejecuta esta función UNA VEZ para crear la hoja "Resumen" con las sumas
function crearResumen() {
  hojaRespuestas_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let r = ss.getSheetByName("Resumen") || ss.insertSheet("Resumen");
  r.clear();
  r.appendRow(["Pregunta", "Opción a", "Opción b", "Opción c", "Correcta", "Acertaron", "No acertaron"]);
  ["B", "C", "D"].forEach((col, i) => {
    const fila = i + 2;
    r.getRange(fila, 1, 1, 7).setFormulas([[
      "P" + (i + 1),
      `=COUNTIF(Respuestas!${col}:${col},"a")`,
      `=COUNTIF(Respuestas!${col}:${col},"b")`,
      `=COUNTIF(Respuestas!${col}:${col},"c")`,
      CORRECTAS["p" + (i + 1)],
      `=COUNTIF(Respuestas!${col}:${col},E${fila})`,
      `=COUNTA(Respuestas!${col}2:${col})-F${fila}`
    ]]);
  });
  r.getRange(1, 1, 1, 7).setFontWeight("bold");
}
