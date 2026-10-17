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
| [UI](styling-and-ui.md) | Contratos vigentes de componentes, Header, voz e acessibilidade |
| [shadcn/Base UI](shadcn-ui.md) | Configuração, instalação e preservação das personalizações |
| [Design system](design-system.md) | Catálogo de tokens, receitas, aliases e manutenção visual |
| [Execução](build-and-run.md) | Comandos e verificação |
| [Histórico](changelog.md) | Adaptação da referência |

Produto e decisões: [índice local](../README.md), [contrato STT](../../../docs/stt/STT-API.md), [decisões do MVP](../../../docs/DECISIONS.md#dec-eqt-012).

## Onde registrar cada informação

Este diretório é a referência de manutenção do código atual. [Specs](../specs/README.md) definem entregas e preservam sua evidência; não copiar contratos técnicos completos para elas. Origem e decisões do produto permanecem na documentação central. Ao mudar um componente, atualizar seu guia e vincular a spec da entrega quando pertinente.
