import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BACKEND_ENDPOINT, MESSAGES_ENDPOINT } from '../config.js'

const INITIAL = {
  nome: '',
  contato: '',
  presenca: 'sim',
  mensagem: '',
}
const EMPTY_PERSON = { nome: '', menor8: false }

export default function Presenca() {
  const [form, setForm] = useState(INITIAL)
  const [pessoas, setPessoas] = useState([{ ...EMPTY_PERSON }])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [nomeManual, setNomeManual] = useState(false) // 1ª pessoa editada à mão?

  // Ao preencher "Seu nome completo", espelha no 1º campo de "Quem vai?"
  // — enquanto ninguém tiver editado esse campo manualmente.
  function updateNome(event) {
    const nome = event.target.value
    setForm((f) => ({ ...f, nome }))
    if (!nomeManual) {
      setPessoas((prev) => prev.map((p, i) => (i === 0 ? { ...p, nome } : p)))
    }
  }

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value })
  }

  function updatePessoa(index, field, value) {
    if (index === 0 && field === 'nome') setNomeManual(true)
    setPessoas(pessoas.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  function addPessoa() {
    setPessoas([...pessoas, { ...EMPTY_PERSON }])
  }

  function removePessoa(index) {
    setPessoas(pessoas.filter((_, i) => i !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!BACKEND_ENDPOINT) return
    setStatus('sending')
    const confirmados = pessoas
      .filter((p) => p.nome.trim())
      .map((p) => `${p.nome.trim()}${p.menor8 ? ' (menor de 8 anos)' : ''}`)
      .join('; ')
    try {
      await fetch(BACKEND_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          tipo: 'rsvp',
          ...form,
          pessoas: form.presenca === 'sim' ? confirmados : '',
        }),
      })
      // A mensagem deixada aqui também alimenta o mural de mensagens.
      if (form.mensagem.trim() && MESSAGES_ENDPOINT) {
        await fetch(MESSAGES_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            tipo: 'mensagem',
            nome: form.nome,
            mensagem: form.mensagem,
          }),
        })
      }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className="section">
        <div className="section-eyebrow">Confirmação recebida</div>
        <h2 className="section-title script">Obrigado!</h2>
        <p className="section-sub">
          {form.presenca === 'sim'
            ? `Que alegria, ${form.nome.split(' ')[0]}! Presença confirmada — nos vemos no dia 10 de outubro de 2026.`
            : 'Sentiremos sua falta, mas agradecemos de coração por nos avisar.'}
        </p>
        <button className="btn" onClick={() => {
          setForm(INITIAL)
          setPessoas([{ ...EMPTY_PERSON }])
          setStatus('idle')
        }}>
          Confirmar outra pessoa
        </button>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-eyebrow">RSVP</div>
      <h2 className="section-title script">Confirme sua Presença</h2>
      <p className="section-sub">
        Sua resposta nos ajuda a preparar cada detalhe com carinho. Por favor, confirme
        até <strong>10 de setembro de 2026</strong>.
      </p>

      <p className="rsvp-reminder">
        💡 Antes de confirmar, não deixe de conferir as{' '}
        <Link to="/informacoes">Informações Importantes</Link> — a celebração será uma
        missa, e lá estão as orientações de traje, comunhão, alimentação e horários.
      </p>

      {!BACKEND_ENDPOINT && (
        <p className="rsvp-soon">
          As confirmações abrirão em breve por aqui. Enquanto isso, fale diretamente com
          os noivos. 💌
        </p>
      )}

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Seu nome completo</span>
          <input type="text" required value={form.nome} onChange={updateNome}
            placeholder="Quem está respondendo" autoComplete="name" />
        </label>

        <label className="field">
          <span>WhatsApp ou e-mail</span>
          <input type="text" required value={form.contato} onChange={update('contato')}
            placeholder="Para falarmos com você se precisar" />
        </label>

        <fieldset className="field radio-group">
          <legend>Você irá ao casamento?</legend>
          <label className="radio">
            <input type="radio" name="presenca" value="sim"
              checked={form.presenca === 'sim'} onChange={update('presenca')} />
            <span>Sim, estarei lá! 🥂</span>
          </label>
          <label className="radio">
            <input type="radio" name="presenca" value="nao"
              checked={form.presenca === 'nao'} onChange={update('presenca')} />
            <span>Infelizmente não poderei ir</span>
          </label>
        </fieldset>

        {form.presenca === 'sim' && (
          <fieldset className="field pessoas-group">
            <legend>Quem vai?</legend>
            <p className="pessoas-hint">
              O primeiro campo já é <strong>você</strong> — preenchido com o nome digitado
              acima. Adicione cada acompanhante em uma nova linha, com o nome completo, e
              marque a caixinha para quem tiver menos de 8 anos.
            </p>
            {pessoas.map((pessoa, index) => (
              <div className="pessoa-row" key={index}>
                <input type="text" required value={pessoa.nome}
                  onChange={(e) => updatePessoa(index, 'nome', e.target.value)}
                  placeholder={index === 0 ? 'Seu nome (preenchido automaticamente)' : `Nome completo do acompanhante ${index}`}
                  aria-label={`Nome completo da pessoa ${index + 1}`} />
                <label className="pessoa-menor">
                  <input type="checkbox" checked={pessoa.menor8}
                    onChange={(e) => updatePessoa(index, 'menor8', e.target.checked)} />
                  <span>Menor de 8 anos</span>
                </label>
                {pessoas.length > 1 && (
                  <button type="button" className="pessoa-remove" onClick={() => removePessoa(index)}
                    aria-label={`Remover pessoa ${index + 1}`}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn ghost pessoa-add" onClick={addPessoa}>
              + Adicionar acompanhante
            </button>
          </fieldset>
        )}

        <label className="field">
          <span>Mensagem aos noivos (opcional)</span>
          <textarea rows="3" value={form.mensagem} onChange={update('mensagem')}
            placeholder="Deixe um recadinho com carinho" />
          <span className="field-note">
            💬 Sua mensagem também aparece no nosso <strong>mural de mensagens</strong>, na
            página inicial. Se preferir que ela não fique pública, é só avisar o Felipe:
            (31) 98323-3101.
          </span>
        </label>

        {status === 'error' && (
          <p className="rsvp-error">
            Não conseguimos enviar sua confirmação. Verifique sua internet e tente de novo.
          </p>
        )}

        <button className="btn rsvp-submit" type="submit"
          disabled={!BACKEND_ENDPOINT || status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar confirmação'}
        </button>
      </form>
    </section>
  )
}
