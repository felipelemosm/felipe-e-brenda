// ---------- Back-end (Google Apps Script) ----------
// URL do App da Web que recebe confirmações de presença e mensagens aos noivos.
// Siga o passo a passo em backend/README.md e cole aqui a URL gerada
// (termina em /exec). Enquanto estiver vazia, as páginas de confirmação e
// mensagens exibem um aviso de "em breve".
export const BACKEND_ENDPOINT = 'https://script.google.com/macros/s/AKfycbybC6c9D1RjAci0Fz0JGmzzjU8HKQr2oF4q-trkIEN33NX1GkiEy06-pOy-BddInP3T/exec'

// ---------- Presentes ----------
// Chave PIX dos noivos (aparece na janela de presente, com botão de copiar).
export const PIX_KEY = 'felipemlemosm@icloud.com'

// Link de pagamento por cartão (Nubank Cobrar / Mercado Pago / Banco Inter).
// Cole aqui o link da sua "maquininha virtual"; enquanto vazio, o botão de
// cartão fica desabilitado.
export const CARD_PAYMENT_LINK = ''

// ---------- Lista de presentes UNIFICADA (compartilhada entre os dois sites) ----------
// Os dois sites (civil e religioso) usam ESTE MESMO endpoint para a lista de
// presentes, para que "já comprado" apareça igual nos dois. É o Apps Script do
// site religioso (mesma planilha, aba "Presentes"). Não troque sem trocar no
// outro site também.
export const GIFT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbybC6c9D1RjAci0Fz0JGmzzjU8HKQr2oF4q-trkIEN33NX1GkiEy06-pOy-BddInP3T/exec'


// ---------- Mensagens UNIFICADAS (compartilhadas entre os dois sites) ----------
// Como os presentes, o mural de mensagens é único: os dois sites gravam e leem
// as mensagens deste mesmo endpoint (Apps Script do site religioso, aba
// "Mensagens"), para que o mural seja o mesmo nos dois.
export const MESSAGES_ENDPOINT = 'https://script.google.com/macros/s/AKfycbybC6c9D1RjAci0Fz0JGmzzjU8HKQr2oF4q-trkIEN33NX1GkiEy06-pOy-BddInP3T/exec'


// ---------- Links de pagamento por CARTÃO de crédito (Mercado Pago) ----------
// Um link por valor de referência (R$). O botão "Cartão" de cada presente abre
// o link do valor correspondente. No cartão incidem taxas para os dois lados —
// por isso o site sempre sugere o PIX primeiro.
export const CARD_LINKS = {
  55: 'https://mpago.la/1M5VsBY',
  65: 'https://mpago.la/2WUUA3t',
  75: 'https://mpago.la/1S4TVZo',
  80: 'https://mpago.la/2b36EgG',
  90: 'https://mpago.la/2AiUmYx',
  100: 'https://mpago.la/12wsEPt',
  120: 'https://mpago.la/1QVKE4z',
  140: 'https://mpago.la/1fqerF1',
  160: 'https://mpago.la/2qq2hDw',
  180: 'https://mpago.la/1RkHdmo',
  200: 'https://mpago.la/2SWgC2m',
  220: 'https://mpago.la/1YKzGU7',
  250: 'https://mpago.la/2u7V6jo',
  300: 'https://mpago.la/25Psi2P',
  350: 'https://mpago.la/2LDc48B',
  450: 'https://mpago.la/2QKa4GA',
  600: 'https://mpago.la/1Jv6QPw',
  1000: 'https://mpago.la/14SBony',
  2000: 'https://mpago.la/2ooE4o3',
  2800: 'https://mpago.la/17eonAn',
}
