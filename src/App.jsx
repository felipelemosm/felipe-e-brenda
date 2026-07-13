import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import FloralBackdrop from './components/FloralBackdrop.jsx'
import Home from './pages/Home.jsx'
import Cerimonia from './pages/Cerimonia.jsx'
import Recepcao from './pages/Recepcao.jsx'
import Historia from './pages/Historia.jsx'
import Informacoes from './pages/Informacoes.jsx'
import Indicacoes from './pages/Indicacoes.jsx'
import Mensagens from './pages/Mensagens.jsx'
import Presentes from './pages/Presentes.jsx'
import Presenca from './pages/Presenca.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <>
      <FloralBackdrop />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cerimonia" element={<Cerimonia />} />
          <Route path="/recepcao" element={<Recepcao />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/informacoes" element={<Informacoes />} />
          <Route path="/indicacoes" element={<Indicacoes />} />
          <Route path="/mensagens" element={<Mensagens />} />
          <Route path="/presentes" element={<Presentes />} />
          <Route path="/presenca" element={<Presenca />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
