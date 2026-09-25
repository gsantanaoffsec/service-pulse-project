# ServicePulse Mobile

Aplicativo mobile do gerenciador de chamados internos, feito com Expo e React Native, consumindo a mesma API Fastify usada pelo `web/`.

## Stack

- **Expo** ~57.0.24
- **React Native** 0.86.3
- **React** 19.2.3
- **Expo Router** ~57.0.22 (roteamento baseado em arquivos)
- **TypeScript** ~6.0.3 (`strict: true`)
- `expo-constants`, `expo-linking`, `expo-status-bar`, `react-native-safe-area-context`, `react-native-screens`, `@expo/vector-icons`

Sem autenticação, sem biblioteca adicional de formulário, dados ou state management — `useState`/`useEffect` cobrem toda a aplicação.

## Estrutura de pastas

| Local | Responsabilidade |
| --- | --- |
| `src/app/` | Rotas do Expo Router; cada arquivo repassa os parâmetros de URL à página correspondente. |
| `src/pages/TicketList/` | Lista, busca, três filtros, contador, paginação, pull-to-refresh e estados de carregamento/erro/vazio. |
| `src/pages/TicketDetails/` | Dados de um chamado, linha do tempo de atividades, filtro e paginação de atividades, exclusão de atividade. |
| `src/pages/TicketForm/` | Criação, edição, validação e exclusão de chamado. |
| `src/pages/ActivityForm/` | Criação e edição de atividade, com validação. |
| `src/components/` | `AppHeader`, `TicketCard`, `ActivityItem`, `StatusBadge`, `SelectField`, `FormField`, `ConfirmModal`. |
| `src/models/ticket.ts` | Tipos das entidades e das respostas paginadas — não executa requisição nenhuma. |
| `src/helpers/api.ts` | Helper único de `fetch`: URL base, cabeçalhos, tratamento de erro HTTP, JSON/204. |
| `src/helpers/formatters.ts` | Formatação de código curto, data relativa/completa e rótulos de exibição. |
| `src/theme/colors.ts` | Cores usadas nas telas e componentes. |

Fluxo geral: tela → interação → estado/handler → `api()` → endpoint → resposta → estado atualizado → nova renderização.

## Rotas

| Rota | Página | Ação e retorno |
| --- | --- | --- |
| `/` | `TicketList` | Toque no cartão abre o detalhe; "Novo" abre criação. |
| `/tickets/new` | `TicketForm` (`mode="create"`) | Salvar/cancelar volta à lista. |
| `/tickets/[idticket]` | `TicketDetails` | Volta à lista; abre edição do chamado, criação ou edição de atividade. |
| `/tickets/[idticket]/edit` | `TicketForm` (`mode="edit"`) | Salvar/cancelar volta ao detalhe; excluir volta à lista. |
| `/tickets/[idticket]/activities/new` | `ActivityForm` (`mode="create"`) | Salvar/cancelar volta ao detalhe. |
| `/tickets/[idticket]/activities/[idactivity]/edit` | `ActivityForm` (`mode="edit"`) | Salvar/cancelar volta ao detalhe. |

`_layout.tsx` configura o `Stack` sem cabeçalho padrão. `router.push` avança, `router.replace` retorna após salvar/cancelar/excluir. `useLocalSearchParams` lê `idticket`/`idactivity` das rotas dinâmicas.

## Comunicação com a API

`api<T>(path, options)` lê `EXPO_PUBLIC_API_URL`, monta a URL, faz o `fetch`, trata `Content-Type: application/json` quando há corpo, e devolve JSON tipado (ou `undefined` em respostas `204`). Erros de rede, 400, 404, 409 e demais falhas viram mensagens em português exibidas nas páginas. `T` só tipa o retorno esperado para o TypeScript — não valida o JSON em runtime; a validação efetiva é a da API (Zod).

### Mapa de requisições

| Ação | Função/página | Requisição |
| --- | --- | --- |
| Listar/filtrar chamados | `loadTickets`, `TicketList` | `GET /tickets?q=&status=&categoria=&prioridade=&_page=&_limit=` |
| Abrir detalhe | `loadTicket`, `TicketDetails` | `GET /tickets/:idticket` |
| Ver/filtrar linha do tempo | `loadActivities`, `TicketDetails` | `GET /tickets/:idticket/activities?tipo=&autor=&_page=&_limit=` |
| Abrir edição do chamado | `loadTicket`, `TicketForm` | `GET /tickets/:idticket` |
| Salvar novo chamado | `handleSaveTicket`, `TicketForm` | `POST /tickets` |
| Salvar edição do chamado | `handleSaveTicket`, `TicketForm` | `PUT /tickets/:idticket` |
| Excluir chamado | `handleDeleteTicket`, `TicketForm` | `DELETE /tickets/:idticket` |
| Abrir formulário de atividade | `loadActivityForm`, `ActivityForm` | `GET /tickets/:idticket` |
| Abrir edição de atividade | `loadActivityForm`, `ActivityForm` | `GET /activities/:idactivity` |
| Criar atividade | `handleSaveActivity`, `ActivityForm` | `POST /tickets/:idticket/activities` |
| Editar atividade | `handleSaveActivity`, `ActivityForm` | `PUT /activities/:idactivity` |
| Excluir atividade | `handleDeleteActivity`, `TicketDetails` | `DELETE /activities/:idactivity` |

`_page`/`_limit` sempre são enviados nas listagens; os demais filtros só entram na URL quando têm valor.

## Regras de negócio replicadas no formulário

| Status | Campos exigidos |
| --- | --- |
| `open` / `triage` | Campos básicos; sem responsável nem resolução. |
| `in_progress` | Campos básicos + responsável. |
| `resolved` / `closed` | Campos básicos + responsável + tipo de resolução + resumo de resolução (mín. 10 caracteres). |

`resolvedAt`/`closedAt` aparecem no formulário como somente leitura (`editable={false}`) e **nunca** entram no body — são gerados pela API no momento da transição de status.

Título ≥ 5 caracteres, descrição ≥ 20, atividade: descrição ≥ 10, autor ≥ 2, `tempoGastoMinutos` opcional (inteiro 0–1440; texto vazio = campo omitido do body, `0` é valor válido).

## Idioma

Rótulos na tela em português (`statusLabels`, `priorityLabels`, `categoryLabels`, `activityLabels`, `resolutionLabels`, em `formatters.ts`); valores enviados/persistidos na API seguem os enums em inglês do contrato — a tradução é só de apresentação.

## Rede — Android físico vs emulador

- **Android físico na mesma rede Wi-Fi:** `EXPO_PUBLIC_API_URL` deve apontar para o **IP local do computador** rodando a API (não `localhost`).
- **Emulador Android:** use `10.0.2.2` no lugar de `localhost` — é o endereço que o emulador usa pra alcançar o host.
- A API precisa estar rodando e aceitando conexões nesse endereço/porta antes de abrir o app.

## Como executar

### Pré-requisitos

- Node.js 20+
- Expo CLI (via `npx`, não precisa instalar global)
- Android Studio com um emulador configurado, **ou** um Android físico com Expo Go/dev client
- A API (`api/`) rodando localmente antes de abrir o app

### Passo a passo

```bash
cd mobile
npm install
```

Configure o `.env` a partir do `.env.example`, apontando `EXPO_PUBLIC_API_URL` para o endereço correto (IP local ou `10.0.2.2`, conforme a seção acima).

**Gerar os projetos nativos** (necessário antes do primeiro build/rodar em dispositivo Android):
```bash
npx expo prebuild
```

**Rodar em modo de desenvolvimento no Android:**
```bash
npx expo run:android
```

Isso builda e instala o app no emulador/dispositivo conectado.

**Se precisar só do servidor de desenvolvimento** (com o app já instalado):
```bash
npx expo start --dev-client
```

**Verificar tipos:**
```bash
npm run typecheck
```

Não há scripts de lint ou teste automatizado configurados neste projeto — a validação de fluxo é manual (checklist abaixo).

## Checklist de verificação manual antes da apresentação

1. Inicie a API e confirme `EXPO_PUBLIC_API_URL` correto no `.env`.
2. Rode `npx expo run:android` com o dispositivo/emulador conectado.
3. Confira lista, busca e os três filtros.
4. Abra um chamado, confira detalhe e linha do tempo.
5. Crie, edite e exclua uma atividade.
6. Crie, edite e exclua um chamado.
7. Confirme que a navegação volta pra tela certa depois de cada ação.
8. Confirme os estados de loading/erro/vazio (desligar a API momentaneamente pra ver o erro aparecer).

## Diagnóstico rápido de falha durante a demonstração

| Sintoma | Causa provável |
| --- | --- |
| Lista mostra erro de conexão | API não está rodando, ou `EXPO_PUBLIC_API_URL` errado. No Android físico, `localhost` aponta pro próprio celular, não pro Mac. |
| Funciona no navegador do Mac mas não no Android | IP configurado não é acessível pelo Android, ou estão em redes diferentes. No emulador, use `10.0.2.2`. |
| GET funciona mas salvar falha | Confira a mensagem na tela e compare o body montado com o schema Zod da API. |
| Lista mostra menos cartões que o contador | Comportamento esperado — `total` conta todos os registros filtrados, `items` só os da página atual. |
| Atividade não aparece após criar/editar | Confira se os filtros `tipo`/`autor` ativos não estão escondendo o item. |
| Data de resolução não aparece ao marcar "Resolvido" antes de salvar | Esperado — a API gera a data só ao processar; salve e reabra o detalhe. |

## Limitações conhecidas

- Não há scripts de lint/teste automatizado configurados no `package.json` do mobile.
- A verificação de fluxo completo (editar/excluir ticket e atividade, testados contra a API real) precisa ser confirmada manualmente antes da apresentação — a validação até aqui cobriu typecheck, build Android e conferência visual (lista, detalhe, formulário preenchido), mas não executou manualmente todos os botões e operações de escrita.
