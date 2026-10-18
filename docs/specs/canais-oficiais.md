# Canais oficiais da Equatorial: mapeamento e simulador

Objetivo: o treino termina reproduzindo o caminho real do atendimento digital, para a
pessoa chegar ao canal oficial sabendo o que fazer. O simulador é guiado por conteúdo
do backend (`channel_simulations` em `back/content/segunda-via.v1.json`,
`GET /api/v1/tracks/{id}/channel-simulations`); o front só desenha os tipos de tela.

## O que foi conferido (17/10/2026)

| Canal | Evidência | Status |
| --- | --- | --- |
| Agência Virtual, página inicial | `agenciavirtual.equatorialenergia.com.br/Login`: “Acesse sem fazer login” com Informar falta de luz, Solicitar nova ligação, Informar risco à vida, **Pagamento Simplificado**, Passar a conta pro seu nome, Fazer reclamação, Geração distribuída, Problemas com o login. Menu “Contas e consumo”: Contas de luz, Emitir código de barras, Solicitar fatura por e-mail, Solicitar Fatura por WhatsApp, Baixar múltiplas faturas. | Visto no navegador |
| Pagamento Simplificado, identificação | Título “Identifique o imóvel”; campos “CPF ou CNPJ”, “Estado”, “Unidade Consumidora ou Conta Contrato”; link “Onde encontro o número da Unidade Consumidora e Conta Contrato?”; botão “Continuar”. | Visto no navegador (nenhum dado digitado) |
| Login da Agência Virtual | “Faça seu login Equatorial”, campo “Identificação” (e-mail), “Cadastre-se aqui”, login com Google, Facebook ou Apple. | Visto no navegador |
| Site do Maranhão | Atalho “Emitir segunda via da conta” leva ao login da Agência Virtual; Clara no WhatsApp +55 98 2055-0116; atendimento 116; app “Equatorial Energia”. | Lido em `ma.equatorialenergia.com.br` |
| WhatsApp da Clara (MA) | Opção “Segunda via da fatura” → CPF ou CNPJ → lista de faturas em aberto → link de pagamento → comprovante. | Notícia de 13/11/2025 (O Imparcial); não testado |

Telas posteriores à identificação (lista de faturas, código de barras, Pix) dependem de
dados reais e **não foram vistas**: no conteúdo estão com `verified: false` e o front
mostra “Etapa ilustrativa”. Números de WhatsApp variam por estado e aparecem na conta.

## Arquitetura

- Conteúdo: `ChannelSimulation` (`id`, `channel`: `agencia_virtual` | `whatsapp`,
  `title`, `description`, `source`, `reviewed_at`, `steps`).
- Passos (`SimulationStep.kind`): `choose` (opções com uma esperada e feedback), `form`
  (campos com valor de exemplo e ajuda; nunca recebe dado real), `chat` (mensagens da
  assistente + respostas rápidas), `result` (linhas com destaque). `verified` por passo.
- Validação no loader: uma opção esperada em `choose`/`chat`, campos em `form`, linhas
  em `result`, IDs únicos.
- Front: `/servicos/segunda-via/simulador` (`ChannelSimulator`), passo no mapa da trilha
  (“Treinar no canal (simulado)”), atalho na página do canal e alvo de voz
  `segunda-via.simulador`. Sem logo nem visual copiado; aviso fixo “Simulação para treino”.

## Backlog: o que você pode mandar para deixar mais realista

1. Prints ou descrição das telas após “Continuar” no Pagamento Simplificado (lista de
   faturas, rótulos dos botões, opções de código de barras/Pix/PDF), com dados ocultos.
2. O menu real da Clara por estado (texto exato das opções e das perguntas).
3. O caminho dentro do app “Equatorial Energia” (rótulos de menu até a fatura).
4. Qual estado será usado no pitch (para fixar número da Clara e textos).

Com isso, basta atualizar `channel_simulations` (e, se a mudança for grande, criar
`segunda-via.v2.json`), trocar `verified` para `true` nas telas conferidas e reiniciar a API.
