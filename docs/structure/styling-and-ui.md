# UI e acessibilidade

A interface mantém CSS global e Tailwind v4 já presentes, sem introduzir biblioteca visual. Componentes funcionais:

- `Header`: identidade Equatorial estática compartilhada, sem ação de navegação.
- `AppShell`, `JourneyPage` e `Eyebrow`: alinhamento comum, conteúdo por tela e ações com links semânticos.
- `Button` e `ActionLink`: variantes primary/secondary com a mesma receita visual e semânticas distintas. Por pedido do usuário em 17/10/2026, ambas usam fundo branco e texto azul por padrão; no hover, fundo azul e texto branco. A regra também vale para controles do gravador. “Ajuda por voz” é a exceção solicitada pelo usuário: amarelo com texto e ícone pretos, inclusive no hover.
- `VoiceHelp`: região expansível que monta o gravador somente ao abrir e restaura foco ao fechar.
- `ServicePage`: título, aviso de indisponibilidade e retorno dos três placeholders.
- `AudioRecorder` em `app/_components`: apresenta estado e conecta botões ao hook, sem implementar transporte ou acesso à Groq.

O gravador oferece estado inicial, solicitação de microfone, gravação com tempo, envio, sucesso, erro e retry. Desabilitar o início durante permissão/envio e preservar Cancelar. A transcrição usa região viva e erro usa `role=alert`; nunca renderizar resposta como HTML.

Preservar foco visível, navegação por teclado, labels funcionais, idioma pt-BR e link de pular conteúdo. Cor de gravação é acompanhada de texto. Animação respeita `prefers-reduced-motion`. Texto longo usa quebra de palavras e o layout deve funcionar sem rolagem horizontal em 390px.

A composição da jornada segue as telas provisórias do Figma, usando Inter, coluna fluida de até 648px e tokens existentes. Eyebrow permanece fora do Header. O ícone de voz exportado do Figma está em `public/icons/voice-help.svg`, com 24 × 24px. Ver [tokens](design-system.md) e [roteiro de verificação](build-and-run.md).
