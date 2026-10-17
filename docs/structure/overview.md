# Estrutura do Digitaliza Aí

Este diretório descreve o código executável de `mvp`, em Next.js com App Router, React, TypeScript, Tailwind CSS, Zod e Bun. Este projeto reúne frontend e API do MVP Digitaliza Aí; áudio para texto com Groq é a primeira capacidade funcional. A jornada de segunda via oferece orientação, consulta e prática local demonstrativa; os outros três serviços permanecem como placeholders. O canal e o procedimento oficiais ainda precisam ser confirmados.

Os documentos importados do Zappoint foram adaptados em 16/10/2026. Reaproveitamos separação de responsabilidades, validação de contratos e feedback acessível. Vite, TanStack, Better Auth, Stripe, organizações e agendamentos não pertencem à arquitetura deste MVP.

| Guia | Conteúdo |
| --- | --- |
| [Arquitetura](architecture.md) | Fronteiras client, servidor e provedor |
| [Pastas e convenções](src-structure-and-conventions.md) | Mapa do código e regras de dependência |
| [Rotas](routing.md) | Páginas e Route Handler |
| [HTTP e estado](http-and-queries.md) | Envio, cancelamento, validação e ausência de cache |
| [Acesso e segurança da API](auth-and-api.md) | Proteções implementadas e limites da demonstração |
| [Configuração](configs.md) | Ambiente e ferramentas reais |
| [UI](styling-and-ui.md) | Componentes e estados de interação |
| [Design system](design-system.md) | Tokens existentes do Digitaliza Aí |
| [Execução](build-and-run.md) | Comandos e verificação |
| [Histórico](changelog.md) | Adaptação da referência |

Produto e decisões: [índice local](../README.md), [contrato STT](../../../docs/stt/STT-API.md), [decisões do MVP](../../../docs/DECISIONS.md#dec-eqt-012).
