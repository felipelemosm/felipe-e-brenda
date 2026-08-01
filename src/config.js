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
