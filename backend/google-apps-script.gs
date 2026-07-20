/**
 * Back-end do site — Google Apps Script.
 * Recebe registros de presentes (aba "Presentes"), confirmações de presença (aba "Confirmações") e mensagens aos noivos
 * (aba "Mensagens"), e devolve as mensagens para o slideshow da home.
 *
 * Instruções completas de instalação: backend/README.md
 */
const RSVP_SHEET = 'Confirmações';
const MESSAGES_SHEET = 'Mensagens';

function getSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;

    if (p.tipo === 'presente') {
      const sheet = getSheet('Presentes',
        ['Data', 'Presente', 'Valor de referência (R$)', 'Nome', 'Dedicatória']);
      sheet.appendRow([
        new Date(),
        p.presente || '',
        Number(p.valor || 0),
        p.nome || '',
        p.dedicatoria || '',
      ]);
    } else if (p.tipo === 'mensagem') {
      const sheet = getSheet(MESSAGES_SHEET, ['Data', 'Nome', 'Mensagem', 'Exibir']);
      // Coluna "Exibir": troque para "Não" na planilha para tirar uma mensagem do site.
      sheet.appendRow([new Date(), p.nome || '', p.mensagem || '', 'Sim']);
    } else {
      const sheet = getSheet(RSVP_SHEET,
        ['Data', 'Nome', 'Contato', 'Presença', 'Pessoas confirmadas', 'Mensagem']);
      sheet.appendRow([
        new Date(),
        p.nome || '',
        p.contato || '',
        p.presenca === 'sim' ? 'Sim' : 'Não',
        p.pessoas || '',
        p.mensagem || '',
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'mensagens') {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(MESSAGES_SHEET);
    const mensagens = [];
    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
      rows.forEach(function (row) {
        if (String(row[3]).toLowerCase() !== 'não' && String(row[3]).toLowerCase() !== 'nao') {
          mensagens.push({ nome: row[1], mensagem: row[2] });
        }
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ mensagens: mensagens }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('Site Felipe & Brenda: back-end no ar ✔');
}
