/**
 * Back-end do site — Google Apps Script (site religioso).
 * É também o REGISTRO DE PRESENTES COMPARTILHADO pelos dois sites (civil e
 * religioso): os dois enviam/leem os presentes daqui, para que "já comprado"
 * apareça igual nos dois. Abas:
 *   - "Confirmações"  → RSVP do site religioso
 *   - "Mensagens"     → mural/slideshow do site religioso
 *   - "Presentes"     → lista de presentes UNIFICADA (civil + religioso)
 *
 * Instruções completas de instalação: backend/README.md
 */
const RSVP_SHEET = 'Confirmações';
const MESSAGES_SHEET = 'Mensagens';
const GIFTS_SHEET = 'Presentes';

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
      const sheet = getSheet(GIFTS_SHEET,
        ['Data', 'Slug', 'Presente', 'Valor de referência (R$)', 'Nome', 'Dedicatória', 'Exibir']);
      // Coluna "Exibir": troque para "Não" numa linha para o item voltar a
      // aparecer como DISPONÍVEL (ex.: se alguém marcou por engano).
      sheet.appendRow([
        new Date(),
        p.slug || '',
        p.presente || '',
        Number(p.valor || 0),
        p.nome || '',
        p.dedicatoria || '',
        'Sim',
      ]);
    } else if (p.tipo === 'mensagem') {
      const sheet = getSheet(MESSAGES_SHEET, ['Data', 'Nome', 'Mensagem', 'Exibir']);
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
  const action = e && e.parameter && e.parameter.action;
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'mensagens') {
    const sheet = spreadsheet.getSheetByName(MESSAGES_SHEET);
    const mensagens = [];
    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
      rows.forEach(function (row) {
        const exibir = String(row[3]).toLowerCase();
        if (exibir !== 'não' && exibir !== 'nao' && row[2]) {
          mensagens.push({ nome: row[1], mensagem: row[2] });
        }
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ mensagens: mensagens }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'comprados') {
    // Slugs dos presentes já escolhidos (aba "Presentes", coluna Slug),
    // ignorando as linhas com Exibir = "Não".
    const sheet = spreadsheet.getSheetByName(GIFTS_SHEET);
    const comprados = {};
    if (sheet && sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
      rows.forEach(function (row) {
        const slug = String(row[1] || '').trim();
        const exibir = String(row[6]).toLowerCase();
        if (slug && exibir !== 'não' && exibir !== 'nao') comprados[slug] = true;
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ comprados: Object.keys(comprados) }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('Site Felipe & Brenda: back-end no ar ✔');
}

// ---------------------------------------------------------------------------
// UTILITÁRIO (rodar UMA vez, à mão): leva as mensagens já deixadas nas
// confirmações de presença (aba "Confirmações") para o mural (aba "Mensagens").
// Não duplica — pode rodar de novo com segurança.
// Como rodar: no editor do Apps Script, selecione a função
// "migrarMensagensDasConfirmacoes" no seletor do topo e clique em ▷ Executar.
// ---------------------------------------------------------------------------
function migrarMensagensDasConfirmacoes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rsvp = ss.getSheetByName(RSVP_SHEET);
  if (!rsvp || rsvp.getLastRow() < 2) {
    Logger.log('Nenhuma confirmação para migrar.');
    return;
  }
  const mural = getSheet(MESSAGES_SHEET, ['Data', 'Nome', 'Mensagem', 'Exibir']);

  // mensagens já no mural, para não duplicar (chave = nome + mensagem)
  const existentes = {};
  if (mural.getLastRow() > 1) {
    mural.getRange(2, 2, mural.getLastRow() - 1, 2).getValues().forEach(function (r) {
      existentes[String(r[0]).trim() + '|' + String(r[1]).trim()] = true;
    });
  }

  // Confirmações: Data(0) Nome(1) Contato(2) Presença(3) Pessoas(4) Mensagem(5)
  const rows = rsvp.getRange(2, 1, rsvp.getLastRow() - 1, 6).getValues();
  let migradas = 0;
  rows.forEach(function (r) {
    const nome = String(r[1] || '').trim();
    const msg = String(r[5] || '').trim();
    if (!msg) return;
    const chave = nome + '|' + msg;
    if (existentes[chave]) return;
    mural.appendRow([r[0] || new Date(), nome, msg, 'Sim']);
    existentes[chave] = true;
    migradas++;
  });
  Logger.log('Mensagens migradas para o mural: ' + migradas);
}
