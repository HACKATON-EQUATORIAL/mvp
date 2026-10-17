# UI e acessibilidade

A interface mantém CSS global e Tailwind v4 já presentes, sem introduzir biblioteca visual. Componentes funcionais:

- `Header`: identidade Equatorial estática compartilhada, sem ação de navegação.
- `ServiceList`: links semânticos do catálogo.
- `ServicePage`: título e retorno das páginas vazias.
- `AudioRecorder` em `app/_components`: apresenta estado e conecta botões ao hook, sem implementar transporte ou acesso à Groq.

O gravador oferece estado inicial, solicitação de microfone, gravação com tempo, envio, sucesso, erro e retry. Desabilitar o início durante permissão/envio e preservar Cancelar. A transcrição usa região viva e erro usa `role=alert`; nunca renderizar resposta como HTML.

Preservar foco visível, navegação por teclado, labels funcionais, idioma pt-BR e link de pular conteúdo. Cor de gravação é acompanhada de texto. Animação respeita `prefers-reduced-motion`. Texto longo usa quebra de palavras e o layout deve funcionar sem rolagem horizontal em 390px.

A mudança estrutural não redesenha as telas nem adiciona conteúdo promocional. Ver [tokens](design-system.md) e [roteiro de verificação](build-and-run.md).
