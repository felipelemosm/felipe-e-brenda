import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import monograma from '../assets/brasao-monograma.png'

const INFO_ROUTES = [
  { to: '/cerimonia', label: 'Cerimônia' },
  { to: '/recepcao', label: 'Recepção' },
  { to: '/informacoes', label: 'Informações Importantes' },
  { to: '/indicacoes', label: 'Indicações' },
]

const MOBILE_ROUTES = [
  { to: '/', label: 'Início', end: true },
  { to: '/historia', label: 'Nossa História' },
  ...INFO_ROUTES,
  { to: '/mensagens', label: 'Mensagens' },
  { to: '/presentes', label: 'Presentes' },
]

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const dropdownRef = useRef(null)

  const infoActive = INFO_ROUTES.some(({ to }) => pathname === to)

  useEffect(() => {
    setDropdownOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('pointerdown', onClickOutside)
    return () => document.removeEventListener('pointerdown', onClickOutside)
  }, [])

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Início">
          <img src={monograma} alt="Monograma Felipe e Brenda" className="nav-crest" />
        </Link>

        {/* navegação de telas largas */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Início
          </NavLink>
          <NavLink to="/historia" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Nossa História
          </NavLink>

          <div className="nav-dropdown" ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button type="button"
              className={`nav-dropdown-toggle${infoActive ? ' active' : ''}`}
              aria-expanded={dropdownOpen} aria-haspopup="menu"
              onClick={() => setDropdownOpen((value) => !value)}>
              Informações <span className="nav-caret" aria-hidden="true">▾</span>
            </button>
            {dropdownOpen && (
              <div className="nav-menu" role="menu">
                {INFO_ROUTES.map(({ to, label }) => (
                  <NavLink key={to} to={to} role="menuitem"
                    className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/mensagens" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Mensagens
          </NavLink>
          <NavLink to="/presentes" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Presentes
          </NavLink>
          <NavLink to="/presenca" className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`}>
            Confirmar Presença
          </NavLink>
        </div>

        {/* botão hambúrguer (só aparece no mobile) */}
        <button type="button" className="nav-toggle" aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? '×' : '☰'}
        </button>
      </div>

      {/* menu mobile em painel */}
      {menuOpen && (
        <div className="nav-mobile">
          {MOBILE_ROUTES.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/presenca" className="nav-mobile-cta">
            Confirmar Presença
          </NavLink>
        </div>
      )}
    </nav>
  )
}
