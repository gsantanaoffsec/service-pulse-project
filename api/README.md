# ServicePulse API

API REST de um gerenciador de chamados internos, sem autenticação, com tickets, atividades, busca, filtros, paginação e persistência em SQLite.

## Stack utilizada

| Tecnologia     | Versão | Responsabilidade                                        |
| -------------- | -----: | ------------------------------------------------------- |
| Node.js        |    20+ | Ambiente de execução exigido pela avaliação             |
| TypeScript     |  7.0.2 | Tipagem e compilação da aplicação                       |
| Fastify        | 5.12.5 | Servidor HTTP e registro das rotas                      |
| Knex           |  3.3.0 | Query builder, migrations e seeds                       |
| better-sqlite3 | 13.0.3 | Driver do banco SQLite                                  |
| Zod            |  4.6.5 | Validação de ambiente, params, queries e bodies         |
| Vitest         | 4.1.11 | Testes unitários e E2E                                  |
| Supertest      |  7.2.2 | Requisições HTTP nos testes E2E                         |
| @fastify/cors  | 11.3.0 | Liberação do consumo da API por aplicações web e mobile |

Os UUIDs são gerados no servidor com `randomUUID` do módulo nativo `node:crypto`.

## Estrutura de pastas

```text
src/
├── @types/
│   └── knex.d.ts
├── env/
│   └── index.ts
├── http/
│   ├── controllers/
│   │   ├── activities/
│   │   │   ├── create.ts
│   │   │   ├── delete.ts
│   │   │   ├── details.ts
│   │   │   ├── list.ts
│   │   │   ├── routes.ts
│   │   │   └── update.ts
│   │   └── tickets/
│   │       ├── create.ts
│   │       ├── delete.ts
│   │       ├── details.ts
│   │       ├── list.ts
│   │       ├── routes.ts
│   │       └── update.ts
│   └── schemas/
│       ├── activity-schema.ts
│       ├── params-schema.ts
│       ├── query-schema.ts
│       └── ticket-schema.ts
├── models/
│   ├── ticket-activity.ts
│   └── ticket.ts
├── repositories/
│   ├── in-memory/
│   │   ├── in-memory-ticket-activities-repository.ts
│   │   └── in-memory-tickets-repository.ts
│   ├── knex/
│   │   ├── knex-ticket-activities-repository.ts
│   │   └── knex-tickets-repository.ts
│   ├── ticket-activities-repository.ts
│   └── tickets-repository.ts
├── use-cases/
│   ├── errors/
│   ├── factories/
│   ├── create-ticket-activity.ts
│   ├── create-ticket.ts
│   ├── delete-ticket-activity.ts
│   ├── delete-ticket.ts
│   ├── get-ticket-activity.ts
│   ├── get-ticket.ts
│   ├── list-ticket-activities.ts
│   ├── list-tickets.ts
│   ├── update-ticket-activity.ts
│   └── update-ticket.ts
├── app.ts
├── database-config.ts
├── database.ts
└── server.ts
```

- `@types`: relaciona as tabelas do Knex aos models TypeScript.
- `env`: valida as variáveis de ambiente antes da inicialização.
- `http/controllers`: recebe requisições, valida entradas e chama os use cases.
- `http/schemas`: concentra os schemas Zod de body, params e query.
- `models`: define o formato persistido de `Ticket` e `TicketActivity`.
- `repositories`: contém os contratos e suas implementações com Knex e em memória.
- `use-cases`: coordena as ações da aplicação e as regras de recurso existente.
- `use-cases/errors`: contém os erros de ticket e atividade não encontrados.
- `use-cases/factories`: conecta os use cases às implementações Knex.
- `app.ts`: registra CORS, rotas e tratamento global de erros.
- `database-config.ts`: configura SQLite, migrations e seeds no Knex.
- `database.ts`: cria a conexão usada pelos repositories.
- `server.ts`: inicia o servidor HTTP na porta configurada.

## Modelo de dados

### Ticket

Tabela: `tickets`.

| Campo             | Tipo no model    | Obrigatório no registro | Observação                               |
| ----------------- | ---------------- | ----------------------: | ---------------------------------------- |
| `idticket`        | `string`         |                     Sim | UUID gerado no servidor e chave primária |
| `titulo`          | `string`         |                     Sim | Título do chamado                        |
| `descricao`       | `string`         |                     Sim | Descrição do problema                    |
| `categoria`       | `string`         |                     Sim | Categoria validada por enum              |
| `prioridade`      | `string`         |                     Sim | Prioridade validada por enum             |
| `status`          | `string`         |                     Sim | Possui padrão `open` na criação          |
| `solicitante`     | `string`         |                     Sim | Pessoa que abriu o chamado               |
| `responsavel`     | `string \| null` |                     Não | Obrigatório conforme o status            |
| `tipoResolucao`   | `string \| null` |                     Não | Obrigatório em `resolved` e `closed`     |
| `resumoResolucao` | `string \| null` |                     Não | Obrigatório em `resolved` e `closed`     |
| `resolvedAt`      | `string \| null` |                     Não | Data ISO da resolução                    |
| `closedAt`        | `string \| null` |                     Não | Data ISO do fechamento                   |
| `createdAt`       | `string`         |                     Sim | Gerado no servidor                       |
| `updatedAt`       | `string`         |                     Sim | Atualizado no servidor                   |

A listagem acrescenta `activitiesCount`, um campo calculado com a quantidade de atividades relacionadas. Esse campo não pertence à tabela `tickets`.

### TicketActivity

Tabela: `ticket_activities`.

| Campo               | Tipo no model    | Obrigatório no registro | Observação                                |
| ------------------- | ---------------- | ----------------------: | ----------------------------------------- |
| `idactivity`        | `string`         |                     Sim | UUID gerado no servidor e chave primária  |
| `idticket`          | `string`         |                     Sim | Chave estrangeira para `tickets.idticket` |
| `tipo`              | `string`         |                     Sim | Tipo validado por enum                    |
| `descricao`         | `string`         |                     Sim | Descrição da atividade                    |
| `autor`             | `string`         |                     Sim | Autor da atividade                        |
| `tempoGastoMinutos` | `number \| null` |                     Não | Tempo inteiro entre 0 e 1440 minutos      |
| `createdAt`         | `string`         |                     Sim | Gerado no servidor                        |
| `updatedAt`         | `string`         |                     Sim | Atualizado no servidor                    |

A foreign key usa `ON DELETE CASCADE`: excluir um ticket também exclui suas atividades.

## Regras de validação

### Ticket

- `titulo`: mínimo de 5 caracteres.
- `descricao`: mínimo de 20 caracteres.
- `categoria`: `Access`, `Hardware`, `Software`, `Network`, `Security` ou `Other`.
- `prioridade`: `low`, `medium`, `high` ou `critical`.
- `status`: `open`, `triage`, `in_progress`, `resolved` ou `closed`.
- `status` assume `open` quando não é enviado na criação.
- `solicitante`: string obrigatória.
- `responsavel`: quando enviado, precisa ter pelo menos 1 caractere.
- `responsavel` é obrigatório em `in_progress`, `resolved` e `closed`.
- `tipoResolucao`: `fixed`, `workaround`, `no_issue`, `duplicate` ou `cancelled`.
- `tipoResolucao`, `resumoResolucao` e `resolvedAt` são obrigatórios em `resolved` e `closed`.
- `resumoResolucao`: mínimo de 10 caracteres quando preenchido.
- `resolvedAt` e `closedAt`: strings no formato datetime ISO.
- `closedAt` é obrigatório em `closed`.
- Em `closed`, `closedAt` precisa ser igual ou posterior a `resolvedAt`.

### TicketActivity

- O ticket informado precisa existir para a criação da atividade.
- `tipo`: `comment`, `diagnosis` ou `action`.
- `descricao`: mínimo de 10 caracteres.
- `autor`: mínimo de 2 caracteres.
- `tempoGastoMinutos`: opcional, inteiro entre 0 e 1440.

### Params e paginação

- `idticket` e `idactivity` precisam ser UUIDs válidos.
- `_page`: inteiro a partir de 1, com padrão 1.
- `_limit`: inteiro entre 1 e 100, com padrão 10.

## Endpoints da API

Base URL local: `http://localhost:3333`.

| Método   | Caminho                         | Entrada                            | Resposta de sucesso            | Possíveis erros            |
| -------- | ------------------------------- | ---------------------------------- | ------------------------------ | -------------------------- |
| `GET`    | `/tickets`                      | Query de tickets                   | `200` com listagem paginada    | `400`, `500`               |
| `POST`   | `/tickets`                      | Body de ticket                     | `201` com `{ ticket }`         | `400`, `409`, `500`        |
| `GET`    | `/tickets/:idticket`            | UUID no path                       | `200` com `{ ticket }`         | `400`, `404`, `500`        |
| `PUT`    | `/tickets/:idticket`            | UUID no path e body completo       | `200` com `{ ticket }`         | `400`, `404`, `409`, `500` |
| `DELETE` | `/tickets/:idticket`            | UUID no path                       | `204` sem body                 | `400`, `404`, `409`, `500` |
| `GET`    | `/tickets/:idticket/activities` | UUID no path e query de atividades | `200` com listagem paginada    | `400`, `500`               |
| `POST`   | `/tickets/:idticket/activities` | UUID no path e body de atividade   | `201` com `{ ticketActivity }` | `400`, `404`, `409`, `500` |
| `GET`    | `/activities/:idactivity`       | UUID no path                       | `200` com `{ ticketActivity }` | `400`, `404`, `500`        |
| `PUT`    | `/activities/:idactivity`       | UUID no path e body completo       | `200` com `{ ticketActivity }` | `400`, `404`, `409`, `500` |
| `DELETE` | `/activities/:idactivity`       | UUID no path                       | `204` sem body                 | `400`, `404`, `409`, `500` |

### Query params de tickets

| Parâmetro    | Tipo     | Comportamento                                                                                             |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------- |
| `q`          | `string` | Busca sem diferença entre maiúsculas e minúsculas em `titulo`, `descricao`, `solicitante` e `responsavel` |
| `status`     | enum     | Filtra por status exato                                                                                   |
| `categoria`  | enum     | Filtra por categoria exata                                                                                |
| `prioridade` | enum     | Filtra por prioridade exata                                                                               |
| `_page`      | `number` | Página solicitada, padrão 1                                                                               |
| `_limit`     | `number` | Itens por página, padrão 10 e máximo 100                                                                  |

Exemplo:

```http
GET /tickets?q=sistema&status=open&categoria=Access&prioridade=high&_page=1&_limit=10
```

### Query params de atividades

| Parâmetro | Tipo     | Comportamento                                 |
| --------- | -------- | --------------------------------------------- |
| `tipo`    | enum     | Filtra por `comment`, `diagnosis` ou `action` |
| `autor`   | `string` | Filtra pelo autor exato                       |
| `_page`   | `number` | Página solicitada, padrão 1                   |
| `_limit`  | `number` | Itens por página, padrão 10 e máximo 100      |

Exemplo:

```http
GET /tickets/7c23c900-5332-48cf-b484-32d08922ed21/activities?tipo=comment&autor=Gabriel&_page=1&_limit=10
```

### Body para criar ticket

`status` pode ser omitido e assume `open`.

```json
{
  "titulo": "Falha no acesso ao sistema",
  "descricao": "O usuário não consegue acessar o sistema interno da empresa.",
  "categoria": "Access",
  "prioridade": "high",
  "solicitante": "Gabriel Santana"
}
```

### Body para atualizar ticket

O `PUT` espera os campos editáveis completos. Os campos de resolução dependem do status.

```json
{
  "titulo": "Falha no acesso ao sistema",
  "descricao": "O usuário não consegue acessar o sistema interno da empresa.",
  "categoria": "Access",
  "prioridade": "high",
  "status": "in_progress",
  "solicitante": "Gabriel Santana",
  "responsavel": "Analista de suporte",
  "tipoResolucao": null,
  "resumoResolucao": null,
  "resolvedAt": null,
  "closedAt": null
}
```

### Body para criar ou atualizar atividade

Na criação, `idticket` vem do path. Na atualização, o vínculo com o ticket não é alterado.

```json
{
  "tipo": "comment",
  "descricao": "O usuário confirmou novos detalhes sobre o problema.",
  "autor": "Gabriel Santana",
  "tempoGastoMinutos": 10
}
```

### Status de erro

| Status | Significado na API                                 |
| -----: | -------------------------------------------------- |
|  `400` | Body, path param ou query param reprovado pelo Zod |
|  `404` | Ticket ou atividade não encontrado pelo use case   |
|  `409` | Violação de constraint detectada pelo SQLite       |
|  `500` | Erro inesperado tratado pelo error handler global  |

Erros de validação retornam `message` e `issues`:

```json
{
  "message": "Validation error.",
  "issues": []
}
```

Os demais erros retornam:

```json
{
  "message": "Ticket not found!"
}
```

## Formato de resposta paginada

As duas listagens retornam o mesmo envelope:

```json
{
  "items": [
    {
      "idticket": "7c23c900-5332-48cf-b484-32d08922ed21",
      "titulo": "Falha no acesso ao sistema",
      "descricao": "O usuário não consegue acessar o sistema interno da empresa.",
      "categoria": "Access",
      "prioridade": "high",
      "status": "open",
      "solicitante": "Gabriel Santana",
      "responsavel": null,
      "tipoResolucao": null,
      "resumoResolucao": null,
      "resolvedAt": null,
      "closedAt": null,
      "createdAt": "2026-09-24T12:00:00.000Z",
      "updatedAt": "2026-09-24T12:00:00.000Z",
      "activitiesCount": 0
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 1
}
```

- `items`: registros da página atual.
- `page`: página solicitada em `_page`.
- `pageSize`: limite solicitado em `_limit`.
- `total`: total de registros que passaram pelos filtros antes da paginação.

## Seed

O comando `npm run seed:run` limpa `ticket_activities` e `tickets` antes de inserir os dados.

O seed cria:

- 5 tickets, um para cada status: `open`, `triage`, `in_progress`, `resolved` e `closed`.
- 12 atividades no total.
- 4 atividades do tipo `comment`.
- 3 atividades do tipo `diagnosis`.
- 5 atividades do tipo `action`.

Os tickets cobrem as categorias `Access`, `Hardware`, `Software`, `Network` e `Security`.

## Variáveis de ambiente

| Variável       | Obrigatória | Exemplo                     | Responsabilidade                                                       |
| -------------- | ----------: | --------------------------- | ---------------------------------------------------------------------- |
| `NODE_ENV`     |         Não | `development`               | Define `development`, `test` ou `production`; o padrão é `development` |
| `PORT`         |         Não | `3333`                      | Porta HTTP; precisa ser um inteiro positivo e o padrão é 3333          |
| `DATABASE_URL` |         Não | `./db/service-pulse.sqlite` | Caminho do arquivo SQLite; possui esse mesmo valor como padrão         |

Arquivo de exemplo:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="./db/service-pulse.sqlite"
```

## Testes

### Testes unitários

```bash
npm test
```

Executam 10 arquivos de teste dos use cases. Cada teste instancia repositories em memória para verificar criação, consulta, listagem, atualização e exclusão de tickets e atividades sem acessar o SQLite.

### Testes E2E

```bash
npm run test:e2e
```

O lifecycle `pretest:e2e` prepara `db/service-pulse-test.sqlite` e executa as migrations antes do Vitest. A suíte usa Supertest, Fastify, repositories Knex e SQLite para verificar o fluxo HTTP, validações, busca, filtros, paginação, erros, `activitiesCount` e exclusão em cascata.

### Outras verificações

```bash
npm run typecheck
npm run format:check
npm run build
```

## Como executar a API

### 1. Pré-requisitos

- Node.js 20 ou superior, conforme o requisito da avaliação.
- npm disponível no terminal.
- Git para clonar o repositório.

O projeto não possui `.nvmrc` nem campo `engines` no `package.json`. Confirme sua versão instalada:

```bash
node --version
npm --version
```

### 2. Clonar o repositório

Substitua `<URL_DO_REPOSITORIO>` pela URL criada para o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd service-pulse/api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

O conteúdo padrão utiliza a porta 3333 e cria o SQLite em `db/service-pulse.sqlite`.

### 5. Aplicar as migrations

```bash
npm run migrate:latest
```

Esse comando cria as tabelas `tickets` e `ticket_activities`, seus índices e a foreign key com cascade.

### 6. Popular o banco

```bash
npm run seed:run
```

Esse comando limpa as duas tabelas e insere os 5 tickets e as 12 atividades descritos na seção de seed.

### 7. Iniciar o servidor em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3333
```

O modo de desenvolvimento usa `tsx watch` e reinicia o processo quando os arquivos TypeScript são alterados.

### 8. Executar os testes

Em outro terminal, dentro de `api/`:

```bash
npm test
npm run test:e2e
```

O E2E utiliza `db/service-pulse-test.sqlite` e não altera o banco de desenvolvimento.

### 9. Testar manualmente

Com a API em execução, importe no Postman os arquivos localizados na pasta `postman/` da raiz:

```text
postman/ServicePulse.postman_collection.json
postman/ServicePulse-Local.postman_environment.json
```

Selecione o ambiente `ServicePulse Local`, que utiliza `http://localhost:3333` como `baseUrl`, e execute as requisições da coleção.

### 10. Gerar e executar o build

```bash
npm run build
npm run start:prod
```

`npm run build` compila a aplicação em `dist/` e ajusta os imports com alias. `npm run start:prod` executa `dist/server.js`.
