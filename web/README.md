# ServicePulse Web

Interface web do gerenciador de chamados internos ServicePulse. Consome a API do projeto para consultar, buscar, criar, editar e excluir tickets e atividades. A aplicação não possui autenticação.

## Tecnologias

| Tecnologia     | Responsabilidade                                |
| -------------- | ----------------------------------------------- |
| React 19       | Componentes, formulários e estados da interface |
| TypeScript 6   | Tipagem dos componentes e das respostas da API  |
| Vite 8         | Servidor de desenvolvimento e build             |
| React Router 8 | Navegação entre lista, detalhe e formulários    |
| Tailwind CSS 4 | Estilos e layout responsivo                     |
| Fetch API      | Requisições HTTP sem biblioteca adicional       |

As versões instaladas estão registradas em `package-lock.json`.

## Requisitos

- Node.js 20 ou superior e npm.
- API do ServicePulse em execução e acessível pelo navegador.
- Banco SQLite preparado com as migrations da API.

## Funcionalidades

- Listagem paginada de chamados
- Busca por texto
- Filtros por status, categoria e prioridade
- Criação, consulta, edição e exclusão de chamados
- Listagem paginada de atividades por chamado
- Filtros de atividades por tipo e autor
- Criação, edição e exclusão de atividades
- Validação dos formulários antes do envio
- Estados de carregamento, lista vazia e erro
- Confirmação antes de exclusões

As telas consultam a API real. Os dados exibidos não vêm de arquivos de mock.

## Rotas da interface

| Caminho                                          | Tela                             |
| ------------------------------------------------ | -------------------------------- |
| `/`                                              | Lista de chamados                |
| `/tickets/new`                                   | Criação de chamado               |
| `/tickets/:idticket`                             | Detalhes e atividades do chamado |
| `/tickets/:idticket/edit`                        | Edição do chamado                |
| `/tickets/:idticket/activities/new`              | Criação de atividade             |
| `/tickets/:idticket/activities/:idactivity/edit` | Edição de atividade              |

Na lista, **Novo** abre o formulário de ticket e selecionar um card abre seu detalhe. No detalhe, **Editar** abre o formulário do ticket, **Nova atividade** abre o formulário de atividade e os ícones da linha do tempo permitem editar ou excluir uma atividade. As exclusões exigem confirmação em um modal.

## Integração com a API

O helper `src/helpers/api.ts` centraliza as requisições com `fetch`. Ele combina `VITE_API_URL` com o caminho recebido, envia JSON quando existe body, trata respostas `204` sem tentar ler JSON e converte falhas HTTP em mensagens para a interface. Por exemplo, `api('/tickets')` consulta `http://localhost:3333/tickets` com a configuração de exemplo.

| Operação na interface            | Requisição                           |
| -------------------------------- | ------------------------------------ |
| Listar tickets                   | `GET /tickets`                       |
| Criar ticket                     | `POST /tickets`                      |
| Abrir detalhe ou carregar edição | `GET /tickets/:idticket`             |
| Salvar edição do ticket          | `PUT /tickets/:idticket`             |
| Confirmar exclusão do ticket     | `DELETE /tickets/:idticket`          |
| Listar atividades                | `GET /tickets/:idticket/activities`  |
| Criar atividade                  | `POST /tickets/:idticket/activities` |
| Carregar edição de atividade     | `GET /activities/:idactivity`        |
| Salvar edição da atividade       | `PUT /activities/:idactivity`        |
| Confirmar exclusão da atividade  | `DELETE /activities/:idactivity`     |

### Busca, filtros e paginação

A lista de tickets envia `q`, `status`, `categoria`, `prioridade`, `_page` e `_limit`. A lista de atividades envia `tipo`, `autor`, `_page` e `_limit`. O filtro de autor usa o nome exato, conforme a API. Ambas começam na página 1 e mostram até 10 registros por página. Busca e mudança de filtro reiniciam a paginação.

As listagens consomem o formato paginado da API:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "total": 0
}
```

`items` contém os registros da página atual; `total` conta todos os registros encontrados antes da paginação. Os cards de ticket mostram `activitiesCount`, calculado pela API.

### Formulários e dados do servidor

O ticket exige título com pelo menos 5 caracteres e descrição com pelo menos 20. A partir de `in_progress`, o formulário exibe e exige responsável. Em `resolved` e `closed`, exige tipo e resumo da resolução; o resumo precisa ter pelo menos 10 caracteres.

A atividade exige descrição com pelo menos 10 caracteres e autor com pelo menos 2. O tempo é opcional e, quando preenchido, deve ser um inteiro entre 0 e 1440 minutos. Um campo de tempo vazio é omitido da requisição.

`resolvedAt` e `closedAt` aparecem como somente leitura. A interface não envia essas datas: a API as gera conforme o status. UUIDs, `createdAt` e `updatedAt` também são gerados no servidor. A validação da API é a verificação final dos dados.

Enums trafegam em inglês, como `in_progress`, `Access`, `high` e `comment`. Os rótulos apresentados ao usuário ficam em português, como “Em andamento”, “Acesso”, “Alta” e “Comentário”.

### Estados da interface

As telas mostram carregamento durante a consulta, estado vazio quando não há registros e erro com opção de tentar novamente. Erros de validação aparecem no formulário. O modal permanece aberto se uma exclusão falhar.

## Ambiente

| Variável       | Exemplo                 | Uso                                           |
| -------------- | ----------------------- | --------------------------------------------- |
| `VITE_API_URL` | `http://localhost:3333` | Endereço base da API acessível pelo navegador |

`web/.env.example` contém o valor local. Copie para `web/.env` antes de iniciar o Vite. Variáveis usadas no navegador precisam começar com `VITE_`. Reinicie o Vite após alterar `.env`.

## Como rodar no navegador

Use **dois terminais**, ambos inicialmente na raiz `service-pulse/`.

### 1. Confira Node e npm

```bash
node --version
npm --version
```

### 2. Inicie a API no primeiro terminal

Na primeira execução:

```bash
cd api
npm install
cp .env.example .env
npm run migrate:latest
npm run seed:run
npm run dev
```

**Atenção ao seed:** `npm run seed:run` limpa os tickets e atividades existentes nesse banco antes de inserir os cinco tickets e as doze atividades de exemplo. Use-o apenas se quiser repor esses dados. Nas próximas execuções, com o banco já preparado, basta entrar em `api/` e executar `npm run dev`.

A API deve iniciar na porta 3333. Abrir `http://localhost:3333/tickets` em uma aba retorna JSON; isso confirma que o servidor está acessível.

### 3. Inicie o web no segundo terminal

Partindo novamente da raiz `service-pulse/`, na primeira execução:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Nas próximas execuções, basta entrar em `web/` e rodar `npm run dev`. Mantenha os dois terminais abertos.

### 4. Abra a interface

O Vite mostra a URL local no segundo terminal, normalmente:

```text
http://localhost:5173/
```

Cole essa URL no navegador. A página inicial deve mostrar os tickets do SQLite. Caso a porta 5173 esteja ocupada, use a URL que o Vite anunciar.

### 5. Confira os fluxos principais

1. Abra um card e confira o detalhe e a linha do tempo.
2. Use busca, filtros e paginação na lista.
3. Crie um ticket e confira se ele aparece na lista.
4. Crie uma atividade nesse ticket e confira o contador e o histórico.
5. Edite ticket e atividade e confirme os dados após salvar.
6. Abra os modais de exclusão e confirme somente para registros que pretende remover.

## Scripts

Execute dentro de `web/`:

| Comando                | O que faz                            |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Inicia o Vite para desenvolvimento   |
| `npm run typecheck`    | Verifica os tipos sem gerar arquivos |
| `npm run lint`         | Executa o ESLint                     |
| `npm run format:check` | Verifica a formatação com Prettier   |
| `npm run format`       | Formata os arquivos com Prettier     |
| `npm run build`        | Compila TypeScript e gera `dist/`    |
| `npm run preview`      | Serve localmente o build já gerado   |

Antes da entrega, execute:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Para abrir a versão compilada, rode `npm run build` e depois `npm run preview`; use a URL exibida pelo comando. A API também precisa estar ligada durante o preview.

## Problemas comuns

| Sintoma                                     | O que conferir                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| “Não foi possível conectar à API”           | API ligada, porta em `api/.env` e `VITE_API_URL` apontando para ela                      |
| URL da API abre JSON, mas o web não carrega | `web/.env` na raiz de `web/`, Vite reiniciado após alteração e console/rede do navegador |
| Lista vazia                                 | Banco correto, migrations aplicadas e tickets existentes                                 |
| Erro ao salvar                              | Mensagem do formulário, campos obrigatórios e status selecionado                         |
| Vite não abre em `5173`                     | URL efetivamente anunciada pelo Vite; a porta pode ter mudado                            |

## Estrutura principal

```text
src/
├── components/   componentes reutilizáveis da interface
├── helpers/      requisições HTTP e formatação de dados
├── models/       tipos dos dados recebidos da API
├── pages/        páginas e fluxos da aplicação
├── App.tsx       declaração das rotas
├── index.css     estilos globais e tokens visuais
└── main.tsx      inicialização do React
```

Para as regras completas e preparação do SQLite, consulte `../api/README.md`. O contrato da avaliação está em `../ENUNCIADO.md` e as convenções de código em `../STYLEGUIDE.md`.
