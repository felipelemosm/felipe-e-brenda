# Back-end do site (confirmações + mensagens aos noivos)

As confirmações de presença e as mensagens aos noivos são gravadas em uma
**Planilha Google** sua, por meio de um Google Apps Script (grátis, sem servidor).
As mensagens também são lidas de volta pelo site para o slideshow da página inicial.
Configuração única, ~5 minutos:

1. Crie uma planilha nova em <https://sheets.new> (ex.: "Confirmações Casamento").
2. Na planilha: **Extensões → Apps Script**.
3. Apague o conteúdo do editor e cole o código de `google-apps-script.gs`.
4. Clique em **Implantar → Nova implantação → Tipo: App da Web** e configure:
   - **Executar como**: você (sua conta)
   - **Quem pode acessar**: *Qualquer pessoa*
5. Autorize quando o Google pedir e copie a **URL do App da Web** (termina em `/exec`).
6. Cole essa URL em `src/config.js`, no valor de `BACKEND_ENDPOINT`:

   ```js
   export const BACKEND_ENDPOINT = 'https://script.google.com/macros/s/SEU_ID/exec'
   ```

7. Faça commit + push — o site publicado passa a gravar tudo na planilha.

A planilha ganha duas abas:

- **Confirmações** — data, nome, contato, presença (Sim/Não), acompanhantes e mensagem.
- **Mensagens** — data, nome, mensagem e a coluna **Exibir**: troque para "Não" em
  qualquer linha para tirar aquela mensagem do slideshow da home (moderação).

Para pausar tudo, desative a implantação no Apps Script; para atualizar o código,
use **Implantar → Gerenciar implantações → Editar → Nova versão**.
