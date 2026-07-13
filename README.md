# Site de Casamento — Felipe & Brenda · 10.10.2026

Site em React (Vite) com a identidade visual do convite: brasão dourado (#C1A76B),
fontes Snell Roundhand/Great Vibes e Forum.

## Rodar localmente

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `casamento`) e envie este projeto:

   ```bash
   git init
   git add .
   git commit -m "Site do casamento"
   git branch -M main
   git remote add origin git@github.com:<seu-usuario>/casamento.git
   git push -u origin main
   ```

2. No repositório, vá em **Settings → Pages** e em *Build and deployment*
   selecione **Source: GitHub Actions**.

3. Pronto — o workflow em `.github/workflows/deploy.yml` publica o site a cada
   push na `main`, em `https://<seu-usuario>.github.io/casamento/`.

## Estrutura

- `src/pages/` — Início, Cerimônia, Recepção, Nossa História, Informações Importantes
  e Confirmação de Presença
- `src/components/` — navegação, contagem regressiva, previsão do tempo, cartão de
  local com mapa
- `src/assets/` — foto de capa e brasões oficiais (completo e monograma)

## Previsão do tempo

A faixa de clima mostra a **semana da festa** (07 a 13/10/2026, casamento no centro),
com o veredito CHUVA: SIM/NÃO (limiar de 45% no dia 10/10). Enquanto a data está longe,
usa a média histórica dos últimos 10 anos (Open-Meteo Archive); quando faltarem ~2
semanas, passa sozinha para a previsão oficial.

## Fotos da timeline

Salve as fotos em `src/assets/historia/` com o nome do capítulo
(ex.: `2015-colegio-militar.jpg`) — a lista completa está em
`src/assets/historia/LEIA-ME.txt`. A foto aparece automaticamente no capítulo.

## Confirmações de presença (RSVP)

O formulário grava as respostas em uma Planilha Google via Apps Script.
Siga o passo a passo em `backend/README.md` e cole a URL gerada em `src/config.js`.
