import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BACKEND_ENDPOINT } from '../config.js'

const SLIDE_INTERVAL_MS = 7000

export default function MessagesSlideshow() {
  const [messages, setMessages] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!BACKEND_ENDPOINT) return
    let cancelled = false
    fetch(`${BACKEND_ENDPOINT}?action=mensagens`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.mensagens)) {
          setMessages(data.mensagens.filter((m) => m.mensagem))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (messages.length < 2) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [messages])

  return (
    <div className="messages-slideshow">
      <div className="messages-title">Mensagens aos noivos</div>
      {messages.length === 0 ? (
        <p className="messages-empty">
          Seja a primeira pessoa a deixar um carinho para nós!{' '}
          <Link to="/mensagens">Escrever mensagem 💌</Link>
        </p>
      ) : (
        <>
          <figure className="message-slide" key={index}>
            <blockquote>“{messages[index].mensagem}”</blockquote>
            <figcaption>— {messages[index].nome}</figcaption>
          </figure>
          <div className="message-dots" role="presentation">
            {messages.slice(0, 12).map((_, i) => (
              <span key={i} className={i === index % 12 ? 'dot active' : 'dot'} />
            ))}
          </div>
          <Link className="messages-link" to="/mensagens">Deixe a sua também 💌</Link>
        </>
      )}
    </div>
  )
}
