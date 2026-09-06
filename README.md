# TechFront - Blog

Aplicação front-end para o blog TechFront, desenvolvida com React + TypeScript + Vite, seguindo boas práticas de arquitetura, estilização e integração com API REST.

---

## 📋 Visão Geral

O TechFront é uma interface de blog que consome uma API REST (Fastify + PostgreSQL) rodando na porta 3000 do localhost. A aplicação foi desenvolvida seguindo os princípios de **Feature-Sliced Design (FSD) simplificado**, com separação clara de responsabilidades entre camadas.

Funcionalidades ativas:
- ✅ Listagem paginada de posts
- ✅ Busca de posts por palavra-chave (título/conteúdo)
- ✅ Visualização detalhada de post (conteúdo expandido)
- ✅ Criação de novos posts por perfil de professor
- ✅ Edição de posts existentes (atualiza apenas `data_atualizacao`)
- ✅ **Área administrativa** com lista completa de posts (só título) para gerenciar conteúdo
- ✅ **Exclusão de posts** (DELETE `/posts/:id`) com confirmação, apenas por perfil professor
- ✅ Estados completos (loading, erro, vazio, 404, validação, 401/403)
- ✅ Navegação SPA entre listagem, detalhe, criação, edição e área administrativa

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
techfront/
├── src/                               # Código-fonte da aplicação
│   ├── assets/                        # Arquivos estáticos (imagens, ícones)
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/                    # Componentes de UI reutilizáveis (presentational)
│   │   ├── Header/                    # Cabeçalho fixo com navegação
│   │   │   └── Header.tsx
│   │   ├── MainContent/               # Container principal centralizado
│   │   │   └── MainContent.tsx
│   │   ├── Footer/                    # Rodapé da aplicação
│   │   │   └── Footer.tsx
│   │   ├── PostCard/                  # Card individual de exibição de post
│   │   │   └── PostCard.tsx
│   │   ├── Button/                    # Botão reutilizável (primary/secondary + loading)
│   │   │   └── Button.tsx
│   │   ├── Loading/                   # Estado de carregamento (spinner)
│   │   │   └── Loading.tsx
│   │   ├── ErrorState/                # Estado de erro com botão de retry
│   │   │   └── ErrorState.tsx
│   │   └── EmptyState/                # Estado vazio (sem dados/resultados)
│   │       └── EmptyState.tsx
│   │
│   ├── pages/                         # Páginas/Features (container components)
│   │   ├── PostList/                  # Listagem completa de posts
│   │   │   └── PostList.tsx
│   │   ├── PostDetail/                # Visualização detalhada de um post
│   │   │   └── PostDetail.tsx
│   │   ├── PostCreate/                # Formulário de criação de novo post
│   │   │   └── PostCreate.tsx
│   │   ├── PostEdit/                  # Formulário de edição de post existente
│   │   │   └── PostEdit.tsx
│   │   └── AdminArea/                 # Área administrativa: lista todos os posts (só título) com editar/remover
│   │       └── AdminArea.tsx
│   │
│   ├── reducers/                      # Funções puras (useReducer pattern)
│   │   └── postReducer.ts             # Redutor para operações CRUD de posts
│   │
│   ├── styles/                        # Tema e estilos globais
│   │   └── theme.ts                   # Design System + GlobalStyles (Styled Components)
│   │
│   ├── api.ts                         # Camada de API (instância Axios configurada)
│   ├── types.ts                       # Definições de tipos TypeScript globais
│   ├── App.tsx                        # Componente raiz (roteamento + layout)
│   ├── main.tsx                       # Ponto de entrada (providers)
│   └── vite-env.d.ts                  # Tipos do Vite
│
├── public/                            # Arquivos públicos (favicon, ícones)
├── index.html                         # HTML de entrada
├── package.json
├── tsconfig.json                      # Configuração TypeScript
├── vite.config.ts                     # Configuração Vite (proxy, alias)
└── eslint.config.js                   # Regras ESLint
```

### Camadas e Responsabilidades

| Camada | Arquivo(s) | Responsabilidade |
|--------|-----------|-----------------|
| **Tipos** | [types.ts](src/types.ts) | Definições de interfaces `Post`, respostas paginadas, ações do reducer |
| **API** | [api.ts](src/api.ts) | Duas instâncias Axios: `apiAluno` (leitura, token aluno) e `apiProfessor` (escrita, token professor), com `baseURL` via proxy e timeout |
| **Estado** | [postReducer.ts](src/reducers/postReducer.ts) | Lógica pura de transformação de estado: `SET_POSTS`, `ADD_POST`, `UPDATE_POST`, `REMOVE_POST` |
| **Tema** | [theme.ts](src/styles/theme.ts) | Design System completo (cores, tipografia, espaçamentos, breakpoints) + `GlobalStyles` |
| **Estrutural** | `components/Header`, `components/MainContent`, `components/Footer` | Layout base da aplicação (esqueleto visual). Header contém **apenas os links de navegação** ("Posts" + "Área administrativa") — nenhum botão de ação de escrita no Header; PostDetail é tela de leitura pura **sem botão de editar**. Toda gestão (Criar, Editar, Remover) está **centralizada exclusivamente na página `/admin`** |
| **Feature** | `pages/PostList`, `pages/PostDetail`, `pages/PostCreate`, `pages/PostEdit`, `pages/AdminArea` | Lógica de negócio: listagem (fetch, busca, paginação), **detalhe (fetch por id, tela de leitura pura — botão editar NÃO existe aqui)**, criação (formulário, validações, datas automáticas), **edição (acessível SOMENTE na área administrativa, pré-carregamento por id, atualiza apenas data_atualizacao, submit com PUT)** e **administrativo** (lista todos posts só com título + editar + remover DELETE com confirmação — ponto ÚNICO de entrada para edição) |
| **UI** | `components/PostCard`, `components/Button`, `Loading`, `ErrorState`, `EmptyState` | Componentes de apresentação reutilizáveis (Button: primary/secondary/sm/md/lg/loading/fullWidth) |
| **Raiz** | [App.tsx](src/App.tsx) | Orquestrador: une layout estrutural + rotas do React Router (5 rotas com ordem correta de precedência) |

### Fluxo de Dados (Data Flow)

```
main.tsx
  ├── ThemeProvider (styled-components)   ← tema + GlobalStyles
  ├── BrowserRouter (react-router-dom)    ← roteamento SPA
  └── App.tsx
        ├── Header (sticky top)
        │     └── Left: Logo + Nav
        │           ├── Link "/" → "Posts" (ativo quando /)
        │           └── Link "/admin" → "Área administrativa" (ativo quando /admin)
        │     Obs: Header contém APENAS navegação (sem botões de ação).
        │          Toda gestão (Criar / Editar / Remover posts) está centralizada em /admin.
        ├── MainContent
        │     └── Routes
        │           ├── "/" → PostList (page)
        │           │     ├── useState: posts, loading, error, search, page
        │           │     ├── useEffect → apiAluno.get('/posts') ou '/posts/search'
        │           │     ├── axios → proxy vite → backend localhost:3000
        │           │     └── renderiza:
        │           │           ├── Loading (spinner)
        │           │           ├── ErrorState (retry)
        │           │           ├── EmptyState
        │           │           └── PostsGrid com PostCard[] (Links para /posts/:id) + Paginação
        │           │
        │           ├── "/admin" → AdminArea (page)
        │           │     ├── useState: posts[], loading, error, successMessage, operationError
        │           │     ├── useState: deletingId (loading por item) + confirmDeleteId (2-step confirmação)
        │           │     ├── useCallback fetchAllPosts → apiAluno.get('/posts?page=X&limit=50') paginado até obter TODOS
        │           │     ├── useEffect → executa fetchAllPosts no mount
        │           │     ├── Botão Editar por item → Link "/posts/${id}/edit"
        │           │     ├── Botão Remover por item:
        │           │     │     ├── Click 1: mostra estado "Confirmar Exclusão" (destructive) + Cancelar
        │           │     │     ├── Click 2 Confirmar → apiProfessor.delete(`/posts/${id}`)
        │           │     │     │     ├── retorno 204 No Content → remove item da lista local + banner sucesso
        │           │     │     │     └── erros: 401/403/404/5xx tratados em ErrorBanner contextualizado
        │           │     │     └── Loading inline no botão ("Removendo...")
        │           │     └── renderiza:
        │           │           ├── PageHeader "Área administrativa" + subtítulo
        │           │           ├── SuccessBanner (toast inline: "Post X foi removido com sucesso.")
        │           │           ├── ErrorBanner (operacao DELETE 401/403/404/5xx)
        │           │           ├── EmptyState (0 posts)
        │           │           └── PostListContainer (UL/LI lista simples):
        │           │                 └── Por item: [Badge #ID] [Título clicável → detalhe] [Ações: ✏️ Editar | 🗑️ Remover]
        │           │
        │           ├── "/posts/create" → PostCreate (page)  ← rota ANTES de /posts/:id
        │           │     ├── useState: titulo, conteudo, errors, touched, loading, submitError
        │           │     ├── validateForm(): titulo [3..255] + conteudo [10..10.000] chars
        │           │     ├── handleSubmit:
        │           │     │     ├── nowISO = new Date().toISOString()  ← datas AUTOMÁTICAS
        │           │     │     ├── payload: { titulo, conteudo, data_publicacao, data_atualizacao }
        │           │     │     ├── apiProfessor.post('/posts', payload)  ← token PROFESSOR (403 tratado)
        │           │     │     └── SUCESSO → navigate(`/posts/${created.id}`, state: { justCreated })
        │           │     └── renderiza:
        │           │           ├── BackButton (voltar /)
        │           │           ├── Loading submit ("Criando post...")
        │           │           ├── ErrorBanner (401/403/400/5xx com mensagens contextuais)
        │           │           ├── FormCard:
        │           │           │     ├── Título: input obrigatório + contador + borda erro + helper
        │           │           │     └── Conteúdo: textarea 280px + contador + borda erro + helper
        │           │           └── Actions: [Cancelar (secondary)] + [Gravar Post (primary LG, loading)]
        │           │
        │           ├── "/posts/:id/edit" → PostEdit (page)  ← rota ANTES de /posts/:id
        │           │     ├── useParams<{ id }> (extrai :id da URL)
        │           │     ├── loadingFetch + loadingSubmit separados
        │           │     ├── useCallback + useEffect → apiProfessor.get(`/posts/${id}`)
        │           │     │     └── SUCESSO: popula titulo + conteudo nos campos (valores originais)
        │           │     ├── validateForm(): idêntico ao de criação
        │           │     ├── handleSubmit:
        │           │     │     ├── data_atualizacao ← new Date().toISOString()  ← SÓ ESSA DATA É ALTERADA
        │           │     │     ├── data_publicacao NÃO é enviada (mantida preservada no backend)
        │           │     │     ├── payload: { titulo, conteudo, data_atualizacao }
        │           │     │     ├── apiProfessor.put(`/posts/${id}`, payload)  ← token PROFESSOR
        │           │     │     └── SUCESSO → navigate(`/posts/${id}`, state: { justUpdated })
        │           │     └── renderiza:
        │           │           ├── BackButton (voltar para /posts/:id)
        │           │           ├── Loading fetch inicial ("Carregando dados do post...")
        │           │           ├── Loading submit ("Salvando...")
        │           │           ├── InfoBanner: ID + Dt.Publicação + Última Atualização + explicação
        │           │           ├── ErrorBanner (401/403/400/404/5xx com mensagens contextuais)
        │           │           ├── 404: tela dedicada "Post não encontrado para edição"
        │           │           ├── FormCard: mesmos inputs de criação (valores preenchidos)
        │           │           └── Actions: [Cancelar (secondary)] + [Salvar Alterações (primary LG, loading)]
        │           │
        │           └── "/posts/:id" → PostDetail (page)
        │                 ├── useParams<{ id }> (extrai :id da URL)
        │                 ├── useNavigate (voltar para listagem)
        │                 ├── useState: post, loading, error, notFound
        │                 ├── useCallback + useEffect → apiAluno.get(`/posts/${id}`)
        │                 ├── axios → proxy vite → backend localhost:3000
        │                 └── renderiza:
        │                       ├── BackButton (botão voltar)
        │                       ├── Loading (spinner)
        │                       ├── ErrorState (retry)
        │                       ├── PostNotFound (404)
        │                       └── Detalhe completo: Título grande + Metadados + Conteúdo full + BackToList
        └── Footer
```

---

## 🧩 Pilha Tecnológica

| Tecnologia | Versão | Papel na Aplicação |
|---|---|---|
| **React** | 19.x | Biblioteca principal para construção de UI com componentes funcionais |
| **TypeScript** | 7.x | Tipagem estática estrita (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) |
| **Vite** | 8.x | Build tool e servidor de desenvolvimento com HMR e proxy de API |
| **Styled Components** | 6.x | CSS-in-JS com escopo isolado, tema tipado (`DefaultTheme`) e `GlobalStyles` |
| **React Router DOM** | 7.x | Navegação SPA com `BrowserRouter`, `Routes`, `Link`, `useLocation` |
| **Axios** | 1.x | Cliente HTTP baseado em Promises com interceptors e timeout configurado |
| **ESLint** | 10.x | Padronização de código com plugins `react-hooks` e `react-refresh` |

---

## ✅ Padrões e Boas Práticas Adotados

### Integração com Back-End
- ✅ **CRUD COMPLETO implementado**: GET (listagem / busca / detalhe), **POST /posts** (criação), **PUT /posts/:id** (edição) e **DELETE /posts/:id** (exclusão, retorno 204 No Content)
- ✅ **Dois perfis de autenticação separados**: `apiAluno` (leitura apenas: GETs) e `apiProfessor` (leitura + escrita completa: POST/PUT/DELETE)
- ✅ **Datas automáticas no envio** (transparente para o usuário):
  - **Criação (POST)**: `data_publicacao` e `data_atualizacao` são ambas geradas como `new Date().toISOString()` no momento do submit
  - **Edição (PUT)**: **APENAS `data_atualizacao`** é enviada no payload (gerada automaticamente no submit); o campo `data_publicacao` **NÃO é enviado** (preservado 100% no backend)
  - **Exclusão (DELETE)**: sem payload; retorno esperado `204 No Content`
- ✅ **Estados visuais completos**: loading, sucesso, erro (com retry), empty, **404**, **validação cliente side**, **401 (auth)** e **403 (perfil sem permissão)** com mensagens contextuais. Na exclusão: **banner de sucesso** após DELETE concluído e **confirmação em 2 passos** (clicar Remover → confirmar exclusão)
- ✅ **Paginação** no servidor (10 itens por página na listagem pública; AdminArea usa paginação 50 em loop até obter todos os posts)
- ✅ **Busca com debounce** (400ms) via endpoint `/posts/search`
- ✅ **Detalhe por ID** via endpoint `/posts/:id` com tratamento de 404 (**tela de leitura pura, sem ações de edição** — edição disponível apenas na área administrativa)
- ✅ **Criação via POST /posts** usando token de professor, payload com `titulo`, `conteudo` + datas automáticas, e redirect para `/posts/:id` do post recém-criado no sucesso
- ✅ **Edição via PUT /posts/:id** usando token de professor, pré-carregamento do post, payload com `titulo`, `conteudo` + apenas `data_atualizacao`, e redirect para detalhe no sucesso
- ✅ **Exclusão via DELETE /posts/:id** (AdminArea ou ações individuais) usando token de professor, com confirmação de 2 passos, estados loading por item (evita duplo clique), tratamento 401/403/404/5xx contextualizado e remoção imediata do item da lista após 204
- ✅ **Área administrativa** (`/admin`): lista completa todos os posts em formato linha-a-linha (só título + ID badge) com ações diretas Editar / Remover; acessível pelo link "Área administrativa" no Header
- ✅ **Axios configurado** com proxy Vite (evita CORS em desenvolvimento)
- ✅ **Autenticação Bearer token** (perfil aluno para leitura, perfil professor para escrita)
- ✅ **Navegação SPA** via React Router DOM (listagem ↔ detalhe ↔ criação ↔ edição ↔ área administrativa, sem recarregar página)
- ✅ **Preview truncado no card** (4 linhas) com indicativo "Ler mais →"
- ✅ **Botão reutilizável**: `components/Button` com variantes `primary/secondary`, tamanhos `sm/md/lg`, estado `loading` com spinner inline e suporte a `fullWidth`

### Desenvolvimento React
- ✅ **Componentes Funcionais** exclusivos (sem classes)
- ✅ **React Hooks** nativos: `useState`, `useEffect`, `useCallback`, `useParams`, `useNavigate`, `useLocation`, `useReducer` (preparado), `FormEvent`, `ChangeEvent` (formulários)
- ✅ **Modularização atômica**: componentes pequenos, focados e reutilizáveis
- ✅ **TypeScript strict mode**: tipagem forte em todo o projeto (formulários, styled-components `$props` transientes, payloads, responses)
- ✅ **Formulários controlados** com validação cliente: campos obrigatórios, tamanhos mín/máx, validação no blur + validação completa no submit, contadores de caracteres em tempo real

### Estilização e Responsividade
- ✅ **Styled Components** com tema tipado (Design System completo)
- ✅ **Mobile-first**: breakpoints `480px` / `768px` / `1024px` / `1280px`
- ✅ **Dark mode** automático via `@media (prefers-color-scheme: dark)`
- ✅ **Grid flexível e layouts fluidos** com CSS moderno

### Gerenciamento de Estado
- ✅ **Estado local** (`useState`) para controle de UI (busca, página)
- ✅ **Reducer** (`postReducer`) preparado para estado global (useReducer / Context API)

### Testes Unitários
- ✅ **Stack Vitest + Testing Library** (padrão moderno React + Vite, 100% compatível Jest API)
- ✅ **Ambiente jsdom** para DOM simulado (Styled Components, React Router)
- ✅ **Mocks de API determinísticos** (`vi.mock('../../api')` + `vi.fn()` — testes NÃO dependem do backend rodando)
- ✅ **42 testes cobrindo Componentes + Páginas**: 7 componentes UI + 4 páginas core (Detalhe, Criar, Editar, AdminArea)
- ✅ **Regras de negócio como testes**: PUT payload NÃO envia data_publicacao; POST envia AMBAS datas; Header sem botão gestão; Detalhe sem editar; DELETE 2-passos
- ✅ **Helper customizado**: `render()` com ThemeProvider + MemoryRouter + `renderPage()` para telas com `useParams()`

---

## 📋 Pré-requisitos

| Ferramenta | Versão mínima | Descrição |
|---|---|---|
| **Node.js** | 22.x ou superior | Runtime JavaScript (compatível com o backend) |
| **npm** | 10.x (incluso no Node.js) | Gerenciador de pacotes |
| **Backend API** | Em execução | Servidor Fastify + PostgreSQL na porta 3000 |

### Variáveis de Ambiente

> **Nota**: No momento, o token de autenticação e a URL da API estão configurados diretamente no código-fonte ([api.ts](src/api.ts) e [vite.config.ts](vite.config.ts)). Para produção, recomenda-se mover para variáveis de ambiente.

Crie um arquivo `.env` na raiz do projeto (para uso futuro):

```env
# .env.example
VITE_API_BASE_URL=http://localhost:3000
VITE_ALUNO_TOKEN=aluno-dev-token-change-me
VITE_PROFESSOR_TOKEN=professor-dev-token-change-me
```

---

## 🚀 Configuração e Instalação

### Passo 1: Clonar o repositório

```bash
git clone <https://github.com/celsottg/techfront>
cd techfront
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar e iniciar o Backend (obrigatório)

```bash
# Na pasta do backend
git clone <https://github.com/celsottg/techchallenge>
cd techchallenge
cp .env.example .env
npm install
docker compose up -d      # Sobe o PostgreSQL
npm run start:dev         # Inicia a API na porta 3000
```

Verifique se a API está respondendo:
```bash
curl -H "Authorization: Bearer aluno-dev-token-change-me" http://localhost:3000/posts
```

### Passo 4: Iniciar o Frontend

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

---

## 📜 Scripts Disponíveis

Todos os scripts são definidos em [package.json](package.json#L6-L15):

| Script | Comando | Descrição |
|---|---|---|
| `npm run dev` | `vite` | Inicia servidor de desenvolvimento com **HMR** (Hot Module Replacement) em `http://localhost:5173` |
| `npm run build` | `tsc --noEmit && vite build` | Executa type-check TypeScript + gera build de produção na pasta `dist/` |
| `npm run type-check` | `tsc --noEmit` | Verifica tipos TypeScript **sem gerar arquivos** |
| `npm run lint` | `eslint .` | Analisa código em busca de problemas de estilo e qualidade |
| `npm run preview` | `vite preview` | Serve o build de produção localmente para validação |
| `npm run test` | `vitest run` | **Executa toda a suíte de testes unitários uma única vez** (terminal, sem watch) |
| `npm run test:watch` | `vitest` | Modo interativo — reexecuta testes automaticamente ao salvar arquivos |
| `npm run test:coverage` | `vitest run --coverage` | Executa testes + gera **relatório de cobertura** em `coverage/index.html` |

### Detalhe do Proxy de API

Configurado em [vite.config.ts](vite.config.ts#L13-L20):

```
Requisição frontend:  GET /api/posts?page=1
          ↓ (proxy vite)
Requisição ao backend: GET http://localhost:3000/posts?page=1
```

Isso evita problemas de **CORS** durante o desenvolvimento.

---

## 🧪 Testes Unitários

Os testes unitários são implementados com o ecossistema **Vitest** (completamente integrado ao Vite, rápido e compatível 100% com Jest) + **Testing Library**, seguindo as boas práticas de testar o componente do ponto de vista do usuário, não detalhes de implementação.

### Stack de testes adotada
| Ferramenta | Versão | Finalidade |
|---|---|---|
| **Vitest** | ^5 | Executor de testes nativo do ecossistema Vite (API compatível com Jest) |
| **jsdom** | latest | Browser DOM simulado para testes de componentes React |
| **@testing-library/react** | latest | `render()`, queries (`getByRole`, `findByText`, `getAllBy...`) e utilitários |
| **@testing-library/jest-dom** | latest | Matchers extras (`.toBeInTheDocument()`, `.toHaveAttribute()`, etc) |
| **@testing-library/user-event** | latest | Simula eventos de usuário real (digitação, cliques, blur, clear) |
| **@vitest/coverage-v8** | latest | Relatórios de cobertura (formato `text` + `html` + `lcov`) |

### Estrutura de arquivos de teste

Os testes ficam localizados **ao lado** dos arquivos testados com a extensão `*.test.tsx` (padrão Testing Library):

```
src/
├── api.ts                             ← MOCKADO (vi.mock) nos testes de páginas
├── test/                              ← Setup global e helpers
│   ├── setup.ts                       ← jest-dom + mocks de matchMedia / IntersectionObserver
│   └── test-utils.tsx                 ← render() customizado + renderPage() + userEvent
├── components/
│   ├── Button/Button.test.tsx         ← 6 testes: variantes, loading, disabled, onClick, submit, a11y
│   ├── Footer/Footer.test.tsx         ← 3 testes: mensagem fixa 2026, 1 linha, sem links
│   ├── Header/Header.test.tsx         ← 5 testes: logo, links Posts + Área admin, SEM botão Novo Post
│   ├── Loading/Loading.test.tsx       ← 2 testes: mensagem padrão e mensagem customizada
│   ├── EmptyState/EmptyState.test.tsx ← 3 testes: defaults, props customizadas, s/ botão
│   ├── ErrorState/ErrorState.test.tsx ← 4 testes: título padrão, msg customizada, onRetry e s/ retry
│   └── PostCard/PostCard.test.tsx     ← 5 testes: título, Link /posts/:id, badge Atualizado
└── pages/
    ├── PostDetail/PostDetail.test.tsx ← 5 testes: loading, sucesso, GET :id, 404, SEM botão Editar
    ├── PostCreate/PostCreate.test.tsx ← 3 testes: campos, validação vazio, POST payload AMBAS datas
    ├── PostEdit/PostEdit.test.tsx     ← 2 testes: preload popula campos, PUT SÓ data_atualizacao ⭐
    └── AdminArea/AdminArea.test.tsx   ← 4 testes: Novo Post, listagem IDs/actions, contador, DELETE 2-passos
```

#### Destaques dos testes de regras de negócio (CRÍTICOS):
| Teste | Local | O que valida |
|---|---|---|
| **POST payload tem AS DUAS datas automáticas** | `PostCreate.test.tsx` | `data_publicacao` + `data_atualizacao` enviadas no body do POST |
| **PUT payload NÃO envia `data_publicacao`** ⭐ | `PostEdit.test.tsx` | PUT `/posts/:id` contém `data_atualizacao` mas **NÃO tem `data_publicacao`** (preservado backend) |
| **Tela detalhe SEM botão Editar** | `PostDetail.test.tsx` | Assegura isolamento de edição apenas via Área administrativa |
| **Header SEM botão Novo Post** | `Header.test.tsx` | Assegura gestão centralizada em `/admin` (Criar/Editar/Remover só lá) |
| **DELETE 2 passos no AdminArea** | `AdminArea.test.tsx` | Remover → Cancelar/Confirmar → DELETE 204 → item removido + contador atualizado |

### Como executar

```bash
# 1. Rodar todos os testes UMA VEZ (saída final com resumo: 42/42 passed)
npm run test

# 2. Modo interativo WATCH (reexecuta ao salvar arquivos alterados)
npm run test:watch

# 3. Rodar + gerar relatório COBERTURA em HTML (abrir coverage/index.html no browser)
npm run test:coverage
```

> 💡 **Os testes de páginas usam `vi.mock('../../api')`** para simular as chamadas Axios — portanto **NÃO dependem** do backend/postgres estar rodando. Tudo é mockado de forma isolada e determinística (conforme recomendado pela documentação da FIAP no README_backend).

---

## 🖥️ Guia de Uso

### Navegação

A aplicação atualmente possui **5 rotas ativas**:

| Rota | Caminho | Componente | Descrição |
|---|---|---|---|
| **Home / Posts** | `/` | [PostList](src/pages/PostList/PostList.tsx) | Listagem paginada de todos os posts com busca e preview truncado |
| **Área Administrativa** | `/admin` | [AdminArea](src/pages/AdminArea/AdminArea.tsx) | Lista completa de todos os posts (só título + ID badge) com ações de Editar e Remover. Acessível pelo link "Área administrativa" no cabeçalho. **É o PONTO ÚNICO de acesso à edição de posts** |
| **Criar Post** | `/posts/create` | [PostCreate](src/pages/PostCreate/PostCreate.tsx) | Formulário de criação de novo post (acessível **pelo botão "+ Novo Post" DENTRO da Área administrativa** — não existe mais no cabeçalho) |
| **Editar Post** | `/posts/:id/edit` | [PostEdit](src/pages/PostEdit/PostEdit.tsx) | Formulário de edição de post existente com dados pré-carregados (acessível **SOMENTE** pelo botão "✏️ Editar" da área administrativa — não existe no detalhe do post) |
| **Detalhe do Post** | `/posts/:id` | [PostDetail](src/pages/PostDetail/PostDetail.tsx) | Visualização expandida do conteúdo completo (leitura pura) com navegação de volta. **Não possui botão de editar** |

> ⚠️ **Ordem das rotas no roteador**: Em [App.tsx](src/App.tsx) a rota `/admin` e as rotas literais `/posts/create` e `/posts/:id/edit` são **sempre declaradas antes** da rota curinga `/posts/:id`, para evitar que as palavras sejam interpretadas como IDs dinâmicos. A ordem correta é: 1. `/` → 2. `/admin` → 3. `/posts/create` → 4. `/posts/:id/edit` → 5. `/posts/:id`.

A navegação ocorre pelo cabeçalho fixo ([Header](src/components/Header/Header.tsx)) contendo **apenas 2 links de navegação** ativos destacados: **"Posts"** (listagem pública, leitura) e **"Área administrativa"** (gestão). O Header **não contém mais nenhum botão de ação de escrita** — **toda gestão (Criar, Editar, Remover posts)** está **100% centralizada na página `/admin`**:
- **Criar post**: botão "+ Novo Post" no topo da Área administrativa
- **Editar post**: botão "✏️ Editar" em cada linha da Área administrativa
- **Remover post**: botão "🗑️ Remover" em cada linha da Área administrativa
- **Abrir detalhe**: clicando nos cards da listagem ou clicando no título na área administrativa (leitura pura)

### Funcionalidade Principal: Listagem de Posts

1. **Carregamento inicial**: Ao abrir a página, a aplicação faz `GET /posts?page=1&limit=10` automaticamente
2. **Busca**: Digite no campo de busca para pesquisar por **título ou conteúdo** com debounce de 400ms → `GET /posts/search?search=termo`
3. **Paginação**: Use os botões no rodapé da lista para navegar entre as páginas (mostra 1ª, última e vizinhas com `...`)
4. **Abrir detalhe**: Clique em qualquer card da lista para navegar até `/posts/:id` e visualizar o conteúdo completo
5. **Área administrativa (ponto único de gestão)**: Clique no link **"Área administrativa"** no menu do cabeçalho para acessar `/admin` e executar **todas as operações de escrita**:
   - ✅ **Criar novo post**: botão **"+ Novo Post"** no topo da lista
   - ✅ **Editar post existente**: botão **"✏️ Editar"** na linha do post (único ponto de entrada para edição)
   - ✅ **Remover post**: botão **"🗑️ Remover"** na linha do post (confirmação em 2 passos)
6. **Estados visuais**:
   - 🌀 **Carregando**: Spinner animado
   - ⚠️ **Erro**: Mensagem explicativa + botão "Tentar novamente"
   - 📝 **Vazio**: Ícone + mensagem amigável
   - 🔍 **Busca sem resultados**: Mensagem específica

### Funcionalidade: Detalhe do Post (Visualização Expandida)

A página de detalhe exibe o conteúdo completo de um post selecionado a partir da listagem.

**Fluxo de navegação**:
1. Usuário clica em um card da listagem (ou acessa diretamente a URL `/posts/:id`)
2. React Router extrai o parâmetro `:id` via `useParams`
3. Aplicação executa `GET /posts/:id` com autenticação Bearer do aluno
4. Com base na resposta, um dos estados é exibido:

**Estados tratados na página de detalhe**:

| Estado | Condição | Apresentação |
|---|---|---|
| 🌀 **Carregando** | Requisição em andamento | Spinner + mensagem + botão voltar disponível |
| ✅ **Sucesso (200 OK)** | Post encontrado | Título grande (5xl → 3xl responsivo) + data de publicação + badge de atualizado (quando houver) + conteúdo completo (font-size lg, line-height 1.8) + dois CTAs de voltar. **Tela de leitura pura — não há botão de editar aqui** |
| 🔍 **Não encontrado (404)** | Backend retorna status 404 | Tela dedicada: ícone, título "Post não encontrado", mensagem explicativa + dois CTAs de retorno |
| ⚠️ **Erro genérico** | Falha de rede ou servidor | `ErrorState` com explicação e botão de retry |

**Navegação de volta (dupla camada)**:
- Botão compacto no topo: "← Voltar para posts" (usa `useNavigate('/')`)
- Link maior no rodapé da página de sucesso: "← Voltar para a listagem de posts" (usa `Link` do React Router)
- Também disponível no topo das telas de erro e 404

> ⚠️ **Regra de permissão**: A página de detalhe do post (`/posts/:id`) é **exclusivamente de leitura**. Para **editar** um post, utilize a **Área administrativa** (`/admin`) — ponto único de entrada para a edição.

> 💡 O conteúdo no card da listagem é limitado a **4 linhas** (CSS `-webkit-line-clamp: 4`) e exibe o indicativo "Ler mais →", orientando o usuário a clicar para expandir o post completo.

### Funcionalidade: Criação de Posts (Novo Post)

A página de criação permite que um usuário com **perfil de professor** publique novos conteúdos no blog.

#### Acesso
- **Acesso exclusivo via Área administrativa**: na tela `/admin`, no topo da lista (ao lado de "N posts no total"), clique no botão **"+ Novo Post"** ([AdminArea.tsx](src/pages/AdminArea/AdminArea.tsx#L505-L508))
  - O Header principal **não contém mais o botão "Novo Post"** — toda gestão de conteúdo está centralizada na rota `/admin`
- Atalho direto via URL `/posts/create` (ainda funcional para atalho direto, mas o ponto recomendado de acesso é a Área administrativa)

#### Campos visíveis para o usuário
Apenas **dois campos** são exibidos no formulário, ambos obrigatórios:

| Campo | Tipo | Regras de validação cliente |
|---|---|---|
| **Título** | `<input type="text">` | Obrigatório · mínimo 3 caracteres · máximo 255 caracteres |
| **Conteúdo** | `<textarea>` (280px altura mínima, `resize: vertical`) | Obrigatório · mínimo 10 caracteres · máximo 10.000 caracteres · suporta quebras de linha (`white-space: pre-wrap`) |

> ⚠️ **Campos ocultos (enviados automaticamente)** — **Atenção documentação**:
> As datas **não são exibidas para o usuário** e nem existem como campos de formulário. No momento em que o botão **"Gravar Post"** é clicado, o frontend **gera automaticamente** ambas as datas em formato ISO:
> ```ts
> const nowISO = new Date().toISOString();
> const payload = {
>   titulo: titulo.trim(),
>   conteudo: conteudo.trim(),
>   data_publicacao: nowISO,   // ← gerada automaticamente
>   data_atualizacao: nowISO,  // ← gerada automaticamente (mesmo valor da publicação ao criar)
> };
> ```
> O payload resultante é enviado ao backend via `POST /posts` com **token de professor**.

#### Feedback visual e validação
- **Validação "lazy" (ao sair do campo)**: Mensagens de erro aparecem apenas após o `onBlur`
- **Validação "eager" (no submit)**: Ao clicar em Gravar, todos os campos são validados e marcados como "tocados" em uma única passagem
- **Contadores em tempo real** (canto inferior direito de cada campo) com destaque amarelo quando o texto chega a 90% do limite
- **Borda vermelha + helper de erro** abaixo do campo quando houver violação de regra

#### Ações (rodapé do formulário)
| Botão | Variante | Comportamento |
|---|---|---|
| **Cancelar** | `secondary` | Volta para a listagem (`navigate('/')`) sem salvar nada |
| **Gravar Post** | `primary` (tamanho `lg`) | Valida o formulário, gera datas automáticas, executa `POST /posts` e enquanto aguarda: spinner inline + label muda para "Gravando..." |

#### Estados tratados (submit)

| Estado | Gatilho | Apresentação |
|---|---|---|
| 🌀 **Loading submit** | Requisição em andamento | Toda a página mostra `<Loading>` com mensagem "Criando post..." + botão desabilitado |
| ✅ **Sucesso (201 Created)** | Backend retorna o `Post` criado com ID | Redirecionamento imediato para `/posts/<novo-id>` usando `navigate()` com `state: { justCreated: true }` (permite futuro toast de confirmação) |
| ⚠️ **400 Bad Request** | Backend rejeita payload por validação | Banner de erro destacado em vermelho com a mensagem exata do servidor |
| ⚠️ **401 Unauthorized** | Token ausente/malformado/inválido | Banner explicativo para verificar configuração do token |
| ⚠️ **403 Forbidden** | Token de **aluno** foi usado ao invés de professor | Banner contextualizado: *"Criação de posts é exclusiva para o perfil de professor. Verifique o token configurado em api.ts."* |
| ⚠️ **5xx Servidor** | Erro interno (banco, etc.) | Mensagem amigável para tentar novamente mais tarde |

### Funcionalidade: Edição de Posts (Atualizar Conteúdo)

A página de edição permite que um usuário com **perfil de professor** atualize o título e/ou conteúdo de um post já publicado. A **data de publicação original é preservada em 100%** — apenas a **data de atualização** é automaticamente alterada no submit.

#### Acesso
- **Acesso exclusivo via Área administrativa**: na tela `/admin`, na linha do post que deseja editar, clique no botão **"✏️ Editar"** ([AdminArea.tsx](src/pages/AdminArea/AdminArea.tsx#L540-L545))
  - A página de detalhe do post (`/posts/:id`) é de **leitura pura** e não possui mais o botão de editar (para isolar as operações de escrita na área administrativa)
- Atalho direto via URL `/posts/:id/edit` (requer que o `:id` seja de um post existente)

#### Pré-carregamento automático
Ao abrir a tela, a aplicação executa **imediatamente** um `GET /posts/:id` com token de professor e, quando a resposta retorna com sucesso:
1. O valor original do `titulo` é preenchido automaticamente no `<input>`
2. O valor original do `conteudo` é preenchido automaticamente no `<textarea>`
3. Um banner informativo exibe os metadados originais do post (ID, Data de publicação, Última atualização) para referência do usuário

#### Campos visíveis para o usuário
Apenas **dois campos editáveis**, ambos com as mesmas regras de validação idênticas às da criação:

| Campo | Tipo | Regras de validação cliente |
|---|---|---|
| **Título** | `<input type="text">` (valor pré-preenchido) | Obrigatório · mínimo 3 caracteres · máximo 255 caracteres |
| **Conteúdo** | `<textarea>` (280px altura mínima, valor pré-preenchido) | Obrigatório · mínimo 10 caracteres · máximo 10.000 caracteres · suporta quebras de linha (`white-space: pre-wrap`) |

> ⚠️ **REGRA DE NEGÓCIO IMPORTANTE — Documentação das datas em edição** (enviado automaticamente):
> Ao contrário da criação (que envia duas datas), a **edição envia APENAS `data_atualizacao`** atualizada. O campo `data_publicacao` **NÃO É ENVIADO NO PAYLOAD** de forma alguma, garantindo que permaneça preservado exatamente como no momento da publicação original.
> ```ts
> const payload = {
>   titulo: titulo.trim(),
>   conteudo: conteudo.trim(),
>   data_atualizacao: new Date().toISOString(),  // ← ÚNICO campo de data enviado
>   // data_publicacao: NÃO ENVIA — preservada no backend
> };
> await apiProfessor.put(`/posts/${id}`, payload);
> ```
> O backend, por sua vez, confirma essa regra: ignora completamente qualquer `data_publicacao` caso receba, e apenas atualiza `data_atualizacao` junto com os campos alteráveis.

#### Banner informativo de metadados (não é dica genérica)
No topo do formulário de edição é exibido um banner contextual com os **dados reais do recurso em edição**:
- 🆔 ID do post
- 📅 Data de publicação original (formatada em pt-BR)
- 🔄 Data da última atualização (formatada em pt-BR)
- 📝 Um parágrafo explicativo: *"Os campos título e conteúdo podem ser alterados. A data de publicação não é alterada em edições — apenas a data de atualização é atualizada automaticamente ao clicar em 'Salvar Alterações'."*

#### Ações (rodapé do formulário)
| Botão | Variante | Comportamento |
|---|---|---|
| **Cancelar** | `secondary` | Volta para a página de detalhe **desse mesmo post** (`navigate('/posts/:id')`) sem salvar nenhuma alteração |
| **Salvar Alterações** | `primary` (tamanho `lg`) | Valida o formulário, gera a `data_atualizacao` atual, executa `PUT /posts/:id` e enquanto aguarda: spinner inline + label muda para "Salvando..." |

#### Estados tratados
A página de edição possui **dois loadings independentes** (separados por semântica):

| Estado | Gatilho | Apresentação |
|---|---|---|
| 🌀 **Loading fetch (inicial)** | Carregando dados do post via `GET` | Spinner com mensagem "Carregando dados do post..." + botão de voltar disponível |
| 🌀 **Loading submit (salvar)** | Enviando alterações via `PUT` | Spinner com mensagem "Salvando..." + inputs e botão desabilitados |
| ✅ **Sucesso (200 OK)** | Backend retorna o post atualizado | Redirecionamento imediato para `/posts/<id>` usando `navigate()` com `state: { justUpdated: true, fromEdit: true }` (permite futuro toast "Alterações salvas com sucesso") |
| 🔍 **Não encontrado (404)** no fetch inicial | Post com esse `:id` não existe | Tela dedicada: ícone, título "Post não encontrado para edição", mensagem explicativa + CTAs de retorno (voltar listagem ou tentar outro id) |
| ⚠️ **400 Bad Request** submit | Backend rejeita payload por validação | Banner de erro destacado em vermelho com a mensagem exata do servidor |
| ⚠️ **401 Unauthorized** fetch ou submit | Token ausente/malformado/inválido | Banner explicativo para verificar configuração do token |
| ⚠️ **403 Forbidden** fetch ou submit | Token de **aluno** foi usado ao invés de professor | Banner contextualizado: *"Edição de posts é exclusiva para o perfil de professor. Verifique o token configurado em api.ts."* |
| ⚠️ **5xx Servidor** fetch ou submit | Erro interno (banco, etc.) | Mensagem amigável para tentar novamente mais tarde (no fetch: retry disponível; no submit: erro inline acima do formulário) |

### Funcionalidade: Área Administrativa (Gerenciar Posts)

A página da área administrativa (`/admin`) fornece uma visão consolidada de **todos os posts publicados** em uma lista limpa contendo apenas o título do post, seu ID, e ações diretas de Editar e Remover. Esta página é o local ideal para o perfil de professor gerenciar o conteúdo completo do blog sem precisar navegar por detalhes individuais.

#### Acesso
- Link **"Área administrativa"** no menu do cabeçalho (na barra de navegação à esquerda, ao lado do link "Posts")
  - Nav com estilo `NavLinkStyled` (sublinha com fundo roxo claro quando a rota `/admin` está ativa)
- Atalho direto via URL `/admin`

#### Carregamento dos dados
Ao abrir a tela, a aplicação carrega **TODOS os posts existentes** usando paginação em loop com `limit=50` por página até reunir o total:
1. Inicializa `page=1` e executa `GET /posts?page=1&limit=50`
2. Se a quantidade de itens recebidos for menor que o `total` retornado, incrementa `page += 1` e executa novamente o `GET`
3. Concatena todos os resultados em um único array `posts` sem duplicatas
4. Utiliza `apiAluno` (perfil leitura) para esse carregamento — a exclusão é a única operação que exige `apiProfessor`

#### Layout da lista (por item)
Cada post é exibido em uma **linha única** dentro de uma `<ul>` estilizada com bordas e separadores:
| Elemento | Descrição |
|---|---|
| **Badge #ID** | `#{id}` em um container cinza arredondado no canto esquerdo |
| **Título do post (clicável)** | Texto do título limitado por `text-overflow: ellipsis` (caso seja longo, mostra `title` no hover). Clicar abre o **detalhe** do post em `/posts/{id}` |
| **Ações (lado direito)** | Dois botões lado-a-lado: `✏️ Editar` (secondary sm) e `🗑️ Remover` (secondary sm). No mobile: os botões empilham à direita abaixo do título |

#### Botão "✏️ Editar" (na área administrativa)
- Posicionamento: lado direito da linha
- Comportamento: `<Link>` para `/posts/${id}/edit` (mesma tela de edição já existente com pré-carregamento)
- Experiência idêntica ao botão Editar no PostDetail

#### Botão "🗑️ Remover" (na área administrativa) — Exclusão em 2 passos
A exclusão de um post é uma ação destrutiva e, por isso, exige **confirmação em dois passos** para evitar exclusões acidentais:

| Passo | Ação do usuário | Resultado visual |
|---|---|---|
| **Passo 1 — Clicar "🗑️ Remover"** | Botão secundário normal | A linha do post muda para **estado destrutivo** (fundo vermelho claro em dark mode / efeito visual). Os botões Editar e Remover são **substituídos** por dois novos botões: `Cancelar` (secondary, volta ao estado normal) e `Confirmar Exclusão` (vermelho sólido, danger) |
| **Passo 2 — Clicar "Confirmar Exclusão"** | Botão danger vermelho | Executa `DELETE /posts/${id}` com **token de professor** (`apiProfessor.delete`). Durante a requisição: o botão fica em estado `loading` com texto "Removendo...", os outros botões ficam `disabled`, e o `deletingId` bloqueia interações em outras linhas |

**Resposta esperada do backend (DELETE)**: HTTP **204 No Content** (sem corpo).

Após o **204**:
1. O post é **removido imediatamente** da lista local via `setPosts(prev => prev.filter(p => p.id !== id))` — sem necessidade de refetch completo
2. Um **banner de sucesso** verde aparece no topo da página: *✅ Post "X foi removido com sucesso."* (com botão × para o usuário dispensar a mensagem)
3. O contador "N posts no total" atualiza automaticamente

#### Estados tratados na exclusão (DELETE)

| Estado HTTP | Gatilho | Apresentação |
|---|---|---|
| ✅ **204 No Content** | Sucesso | Item removido da lista local + banner de sucesso com nome do post |
| ⚠️ **400 Bad Request** | Payload inválido (raro em DELETE) | Banner de erro com a mensagem exata do servidor |
| ⚠️ **401 Unauthorized** | Token ausente ou inválido | Banner: *"Autenticação necessária. Verifique token de professor."* |
| ⚠️ **403 Forbidden** | Token de aluno usado | Banner contextualizado: *"Exclusão de posts é exclusiva para o perfil de professor. Verifique o token em api.ts."* |
| ⚠️ **404 Not Found** | Post já havia sido excluído | Aviso: item é removido da lista local + mensagem "Post não encontrado. Lista atualizada." |
| ⚠️ **5xx Servidor** | Erro interno | Banner: *"Erro no servidor. Tente novamente mais tarde."* |

#### Outros estados da página AdminArea
| Estado | Apresentação |
|---|---|
| 🌀 **Carregando** | `<Loading>` com mensagem "Carregando posts para administração..." |
| 📝 **Vazio (0 posts)** | `<EmptyState>` explicando que não existem posts + opção de criar o primeiro (botão Novo Post no topo da lista quando existir itens) |
| ⚠️ **Erro ao carregar** | `<ErrorState>` completo com título, mensagem e botão "Tentar novamente" que refaz o `fetchAllPosts` |
| ✅ **Topo da lista** | Cabeçalho simples: `ResultCount` contagem de posts + botão compacto "+ Novo Post" (acessa `/posts/create`) |

#### Responsividade (mobile)
Em telas com largura ≤ 768px (breakpoint tablet/mobile):
- Cada linha da lista muda de `flex row` → `flex column`
- O título ocupa 100% da largura
- Os botões de ação alinham-se à **direita** abaixo do título, com largura ajustada automaticamente

### Fluxo de Autenticação

A API backend exige autenticação via header:
```
Authorization: Bearer <access_token>
```

Atualmente a aplicação usa **dois tokens separados** configurados em [api.ts](src/api.ts#L3-L25), exportados como duas instâncias independentes do Axios:

| Export no `api.ts` | Token hardcoded | Perfil | Permissões | Uso atual no código |
|---|---|---|---|---|
| `apiAluno` (default `api`) | `aluno-dev-token-change-me` | **Aluno** | Apenas **leitura**: GET `/posts`, `/posts/:id`, `/posts/search`, paginação `/posts?page=X&limit=N` | Listagem (`PostList`), Detalhe (`PostDetail`) e **carregamento da lista na AdminArea** (`fetchAllPosts` paginado até obter todos) |
| `apiProfessor` (export nomeado) | `professor-dev-token-change-me` | **Professor** | **Leitura + escrita completa**: GET + **POST** `/posts` + **PUT** `/posts/:id` + **DELETE** `/posts/:id` | Criação (`PostCreate`) + Edição (`PostEdit` para o `PUT /posts/:id` e também o `GET /posts/:id` de pré-carregamento) + **Exclusão** (`AdminArea` para o `DELETE /posts/:id`) |

> ⚠️ **Aviso**: Tokens hardcoded são aceitáveis nesta fase de aprendizado. Para produção, implemente fluxo de login real (OAuth/JWT) e armazene tokens de forma segura (HttpOnly cookies ou localStorage com medidas anti-XSS). Em caso de **403 Forbidden** ao **criar, editar ou excluir** post, confira se o token de professor em [api.ts](src/api.ts#L4) corresponde ao `PROFESSOR_ACCESS_TOKEN` do backend `.env`.

---

## �️ Próximos Passos

Funcionalidades e melhorias planejadas para as próximas etapas:

1. 🔐 **Autenticação real (login/logout)**: Substituir tokens hardcoded por um fluxo completo de autenticação (OAuth2/JWT) com tela de login, armazenamento seguro de credenciais e refresh token
2. 🔄 **Feedback visual com toasts**: Implementar toasts/notificações para ações bem-sucedidas como "Post criado!", "Alterações salvas!" e "Post excluído com sucesso!" usando `state: { justCreated, justUpdated }` já preparados no navigate e o `successMessage` da AdminArea
3. 🧪 **Testes automatizados**: Cobertura com testes unitários (Vitest) para componentes de UI e testes de integração para os fluxos de listar, detalhar, criar, editar e excluir posts
4. 🎨 **Páginas de perfil e autor**: Exibir informações do autor do post e página dedicada com todos os posts de um mesmo autor
5. 🏷️ **Categorias e tags**: Adicionar sistema de categorização/tags aos posts com filtro na listagem e também na área administrativa
6. ♿ **Acessibilidade (WCAG)**: Revisão completa de ARIA labels, navegação por teclado e contraste para atender aos padrões de acessibilidade
7. 🧰 **Ações em lote na área administrativa**: Checkboxes por item + ações em lote (excluir múltiplos posts, filtrar/ordenar lista por data/título)

---

## �� Estou utilizando IA para a geração da documentação.

