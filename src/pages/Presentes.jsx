import { useState } from 'react'
import { BACKEND_ENDPOINT, PIX_KEY, CARD_PAYMENT_LINK } from '../config.js'

// QR Code do PIX: salve a imagem como src/assets/pix-qr.png (ou .jpg)
// e ela aparece automaticamente na janela de presente.
const qrImages = import.meta.glob('../assets/pix-qr.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})
const PIX_QR = Object.values(qrImages)[0] ?? null

const CATEGORIES = [
  {
    title: 'Nosso lar em São Paulo',
    gifts: [
      { emoji: '🍳', name: 'Jogo de panelas premium', price: 1800 },
      { emoji: '🎂', name: 'Batedeira KitchenAid', price: 3200 },
      { emoji: '☕', name: 'Cafeteira de espresso', price: 2400 },
      { emoji: '🫘', name: 'Moedor de café', price: 600 },
      { emoji: '🍟', name: 'Air fryer', price: 900 },
      { emoji: '🤖', name: 'Robô aspirador', price: 2800 },
      { emoji: '🥂', name: 'Jogo de taças de cristal', price: 850 },
      { emoji: '🍴', name: 'Faqueiro inox 42 peças', price: 1200 },
      { emoji: '🔪', name: 'Faca do chef japonesa', price: 950 },
      { emoji: '🛏️', name: 'Jogo de cama de algodão egípcio', price: 1100 },
      { emoji: '🛌', name: 'Edredom king size', price: 700 },
      { emoji: '🛁', name: 'Kit de toalhas felpudas', price: 450 },
      { emoji: '🍷', name: 'Adega climatizada', price: 1900 },
      { emoji: '🥩', name: 'Kit churrasco premium', price: 550 },
      { emoji: '🫕', name: 'Panela de fondue', price: 380 },
      { emoji: '🧀', name: 'Tábua de frios artesanal', price: 320 },
      { emoji: '🥤', name: 'Liquidificador de alta potência', price: 750 },
      { emoji: '🍞', name: 'Forno elétrico de bancada', price: 1300 },
      { emoji: '📺', name: 'Smart TV 65 polegadas', price: 4500 },
      { emoji: '🔊', name: 'Soundbar para noites de cinema', price: 1600 },
      { emoji: '🏠', name: 'Kit casa inteligente', price: 800 },
      { emoji: '💧', name: 'Purificador de água', price: 1000 },
      { emoji: '👔', name: 'Vaporizador de roupas', price: 650 },
      { emoji: '🌀', name: 'Máquina lava e seca', price: 6500 },
      { emoji: '🪴', name: 'Plantas para a varanda', price: 400 },
    ],
  },
  {
    title: 'Experiências a dois em São Paulo',
    gifts: [
      { emoji: '🌆', name: 'Jantar romântico em rooftop paulistano', price: 900 },
      { emoji: '🎭', name: 'Noite no Theatro Municipal com jantar', price: 700 },
      { emoji: '🍇', name: 'Assinatura de vinhos por 6 meses', price: 1200 },
      { emoji: '🥐', name: 'Café da manhã na cama para os noivos', price: 250 },
      { emoji: '🧺', name: 'Piquenique no Ibirapuera', price: 300 },
    ],
  },
  {
    title: 'Lua de Mel — rumo à Itália',
    gifts: [
      { emoji: '✈️', name: 'Cota das passagens para a Itália', price: 2000 },
      { emoji: '💺', name: 'Upgrade de assento no voo', price: 1200 },
      { emoji: '🏛️', name: 'Diária em Roma com vista para a cidade eterna', price: 1500 },
      { emoji: '🏔️', name: 'Diária em refúgio nas Dolomitas', price: 1800 },
      { emoji: '🛡️', name: 'Seguro viagem dos noivos', price: 600 },
      { emoji: '🚉', name: 'Trem panorâmico pela Itália', price: 500 },
    ],
  },
  {
    title: 'Roma, a cidade eterna',
    gifts: [
      { emoji: '🕯️', name: 'Jantar à luz de velas no Trastevere', price: 800 },
      { emoji: '🎨', name: 'Tour guiado no Vaticano e Capela Sistina', price: 700 },
      { emoji: '🍨', name: 'Gelato todos os dias em Roma', price: 200 },
      { emoji: '☕', name: 'Espresso no bar mais antigo de Roma', price: 100 },
      { emoji: '🍝', name: 'Carbonara autêntica em trattoria romana', price: 350 },
      { emoji: '👨‍🍳', name: 'Aula de culinária italiana para o casal', price: 950 },
      { emoji: '🛵', name: 'Passeio de Vespa por Roma', price: 850 },
      { emoji: '⛲', name: 'Moedas na Fontana di Trevi (e um desejo)', price: 80 },
    ],
  },
  {
    title: 'Dolomitas, o teto da lua de mel',
    gifts: [
      { emoji: '🚠', name: 'Teleférico ao topo do Seceda', price: 450 },
      { emoji: '🥾', name: 'Trilha guiada nas Tre Cime di Lavaredo', price: 650 },
      { emoji: '🫕', name: 'Fondue com vista para as montanhas', price: 500 },
      { emoji: '🚗', name: 'Carro pelas estradas alpinas', price: 1600 },
      { emoji: '💆', name: 'Spa alpino para o casal', price: 1100 },
      { emoji: '📸', name: 'Ensaio fotográfico na lua de mel', price: 1500 },
    ],
  },
]

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function PixModal({ gift, onClose }) {
  const [copied, setCopied] = useState(false)
  const [registro, setRegistro] = useState('idle') // idle | form | sending | sent
  const [form, setForm] = useState({ nome: '', dedicatoria: '' })

  async function registrar(event) {
    event.preventDefault()
    setRegistro('sending')
    try {
      await fetch(BACKEND_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          tipo: 'presente',
          presente: gift.name,
          valor: String(gift.price),
          nome: form.nome,
          dedicatoria: form.dedicatoria,
        }),
      })
      setRegistro('sent')
    } catch {
      setRegistro('form')
    }
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // seleção manual continua possível
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true"
      aria-label={`Presentear ${gift.name} via PIX`}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <div className="modal-emoji" aria-hidden="true">{gift.emoji}</div>
        <h3 className="modal-title">{gift.name}</h3>
        <div className="modal-price">{formatPrice(gift.price)}</div>

        {PIX_QR ? (
          <img className="modal-qr" src={PIX_QR} alt="QR Code do PIX dos noivos" />
        ) : (
          <div className="modal-qr placeholder">QR Code em breve</div>
        )}

        <div className="modal-pix-key">
          <span>Chave PIX (e-mail)</span>
          <code>{PIX_KEY}</code>
        </div>
        <button className="btn" onClick={copyKey}>
          {copied ? 'Chave copiada! ✓' : 'Copiar chave PIX'}
        </button>
        <p className="modal-note">
          O valor é uma referência carinhosa — qualquer quantia nos ajuda a realizar
          este sonho. Obrigado! 🤍
        </p>

        {BACKEND_ENDPOINT && (
          <div className="gift-confirm">
            {registro === 'idle' && (
              <button className="btn ghost" onClick={() => setRegistro('form')}>
                Já paguei — registrar meu presente
              </button>
            )}
            {(registro === 'form' || registro === 'sending') && (
              <form className="gift-confirm-form" onSubmit={registrar}>
                <input type="text" placeholder="Seu nome (opcional)" value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                <textarea rows="2" placeholder="Dedicatória aos noivos (opcional)"
                  value={form.dedicatoria} maxLength={300}
                  onChange={(e) => setForm({ ...form, dedicatoria: e.target.value })} />
                <button className="btn" type="submit" disabled={registro === 'sending'}>
                  {registro === 'sending' ? 'Registrando…' : 'Registrar presente'}
                </button>
              </form>
            )}
            {registro === 'sent' && (
              <p className="gift-confirm-thanks">
                Presente registrado — muito obrigado! 🤍
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Presentes() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="section">
      <div className="section-eyebrow">Com carinho</div>
      <h2 className="section-title script">Lista de Presentes</h2>
      <div className="section-intro">
        <p className="section-sub">
          Sua presença é o nosso maior presente. Mas, se quiser nos mimar, escolhemos
          lembranças que vão morar com a gente em São Paulo — e momentos que viveremos
          na lua de mel, entre Roma e as Dolomitas.
        </p>
        <p className="section-sub">Cada item pode ser dado por PIX ou cartão.</p>
      </div>

      {CATEGORIES.map((category) => (
        <div className="gift-category" key={category.title}>
          <h3 className="gift-category-title">{category.title}</h3>
          <div className="gift-grid">
            {category.gifts.map((gift) => (
              <article className="gift-card" key={gift.name}>
                <div className="gift-emoji" aria-hidden="true">{gift.emoji}</div>
                <div className="gift-name">{gift.name}</div>
                <div className="gift-price">{formatPrice(gift.price)}</div>
                <div className="gift-actions">
                  <button className="btn gift-btn" onClick={() => setSelected(gift)}>
                    PIX
                  </button>
                  {CARD_PAYMENT_LINK ? (
                    <a className="btn ghost gift-btn" target="_blank" rel="noopener noreferrer"
                      href={CARD_PAYMENT_LINK}>
                      Cartão
                    </a>
                  ) : (
                    <button className="btn ghost gift-btn" disabled
                      title="Pagamento por cartão em breve">
                      Cartão
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      {selected && <PixModal gift={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
