# TechFront

Aplicação front-end para o TechFront, desenvolvida com React + TypeScript + Vite, seguindo boas práticas de arquitetura, estilização e integração com API REST.

---

## 📋 Visão Geral

O TechFront é uma interface de blog que consome uma API REST (Fastify + PostgreSQL) rodando na porta 3000 do localhost. A aplicação foi desenvolvida seguindo os princípios de **Feature-Sliced Design (FSD) simplificado**, com separação clara de responsabilidades entre camadas.

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
│   │   ├── Loading/                   # Estado de carregamento (spinner)
│   │   │   └── Loading.tsx
│   │   ├── ErrorState/                # Estado de erro com botão de retry
│   │   │   └── ErrorState.tsx
│   │   └── EmptyState/                # Estado vazio (sem dados/resultados)
│   │       └── EmptyState.tsx
│   │
│   ├── pages/                         # Páginas/Features (container components)
│   │   └── PostList/                  # Listagem completa de posts
│   │       └── PostList.tsx
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
├── docs/                              # Documentação técnica
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
| **API** | [api.ts](src/api.ts) | Instância Axios com `baseURL`, timeout e header de autenticação Bearer |
| **Estado** | [postReducer.ts](src/reducers/postReducer.ts) | Lógica pura de transformação de estado: `SET_POSTS`, `ADD_POST`, `UPDATE_POST`, `REMOVE_POST` |
| **Tema** | [theme.ts](src/styles/theme.ts) | Design System completo (cores, tipografia, espaçamentos, breakpoints) + `GlobalStyles` |
| **Estrutural** | `components/Header`, `components/MainContent`, `components/Footer` | Layout base da aplicação (esqueleto visual) |
| **Feature** | `pages/PostList` | Lógica de negócio da listagem (fetch, busca, paginação, estados) |
| **UI** | `components/PostCard`, `Loading`, `ErrorState`, `EmptyState` | Componentes de apresentação reutilizáveis |
| **Raiz** | [App.tsx](src/App.tsx) | Orquestrador: une layout estrutural + rotas do React Router |

### Fluxo de Dados (Data Flow)

```
main.tsx
  ├── ThemeProvider (styled-components)   ← tema + GlobalStyles
  ├── BrowserRouter (react-router-dom)    ← roteamento SPA
  └── App.tsx
        ├── Header (nav com Links)
        ├── MainContent
        │     └── Routes
        │           └── "/" → PostList (page)
        │                 ├── useState: posts, loading, error, search, page
        │                 ├── useEffect → api.get('/posts') ou '/posts/search'
        │                 ├── axios → proxy vite → backend localhost:3000
        │                 └── renderiza:
        │                       ├── Loading (spinner)
        │                       ├── ErrorState (retry)
        │                       ├── EmptyState
        │                       └── PostsGrid com PostCard[] + Paginação
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

### Desenvolvimento React
- ✅ **Componentes Funcionais** exclusivos (sem classes)
- ✅ **React Hooks** nativos: `useState`, `useEffect`, `useCallback`, `useReducer` (preparado)
- ✅ **Modularização atômica**: componentes pequenos, focados e reutilizáveis
- ✅ **TypeScript strict mode**: tipagem forte em todo o projeto

### Estilização e Responsividade
- ✅ **Styled Components** com tema tipado (Design System completo)
- ✅ **Mobile-first**: breakpoints `480px` / `768px` / `1024px` / `1280px`
- ✅ **Dark mode** automático via `@media (prefers-color-scheme: dark)`
- ✅ **Grid flexível e layouts fluidos** com CSS moderno

### Integração com Back-End
- ✅ **CRUD preparado** (atualmente implementado: GET listagem + busca)
- ✅ **Estados visuais completos**: loading, sucesso, erro (com retry), empty
- ✅ **Paginação** no servidor (10 itens por página)
- ✅ **Busca com debounce** (400ms) via endpoint `/posts/search`
- ✅ **Axios configurado** com proxy Vite (evita CORS em desenvolvimento)
- ✅ **Autenticação Bearer token** (perfil aluno para leitura)

### Gerenciamento de Estado
- ✅ **Estado local** (`useState`) para controle de UI (busca, página)
- ✅ **Reducer** (`postReducer`) preparado para estado global (useReducer / Context API)

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
git clone <url-do-repositorio>
cd techfront
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar e iniciar o Backend (obrigatório)

```bash
# Na pasta do backend (ou neste mesmo projeto se estiver configurado)
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

Todos os scripts são definidos em [package.json](package.json#L6-L12):

| Script | Comando | Descrição |
|---|---|---|
| `npm run dev` | `vite` | Inicia servidor de desenvolvimento com **HMR** (Hot Module Replacement) em `http://localhost:5173` |
| `npm run build` | `tsc --noEmit && vite build` | Executa type-check TypeScript + gera build de produção na pasta `dist/` |
| `npm run type-check` | `tsc --noEmit` | Verifica tipos TypeScript **sem gerar arquivos** |
| `npm run lint` | `eslint .` | Analisa código em busca de problemas de estilo e qualidade |
| `npm run preview` | `vite preview` | Serve o build de produção localmente para validação |

### Detalhe do Proxy de API

Configurado em [vite.config.ts](vite.config.ts#L13-L20):

```
Requisição frontend:  GET /api/posts?page=1
          ↓ (proxy vite)
Requisição ao backend: GET http://localhost:3000/posts?page=1
```

Isso evita problemas de **CORS** durante o desenvolvimento.

---

## 🖥️ Guia de Uso

### Navegação

A aplicação atualmente possui **1 rota ativa**:

| Rota | Caminho | Componente | Descrição |
|---|---|---|---|
| **Home / Posts** | `/` | [PostList](src/pages/PostList/PostList.tsx) | Listagem paginada de todos os posts com busca |

A navegação ocorre pelo cabeçalho fixo ([Header](src/components/Header/Header.tsx)) com o link ativo destacado visualmente.

### Funcionalidade Principal: Listagem de Posts

1. **Carregamento inicial**: Ao abrir a página, a aplicação faz `GET /posts?page=1&limit=10` automaticamente
2. **Busca**: Digite no campo de busca para pesquisar por **título ou conteúdo** com debounce de 400ms → `GET /posts/search?search=termo`
3. **Paginação**: Use os botões no rodapé da lista para navegar entre as páginas (mostra 1ª, última e vizinhas com `...`)
4. **Estados visuais**:
   - 🌀 **Carregando**: Spinner animado
   - ⚠️ **Erro**: Mensagem explicativa + botão "Tentar novamente"
   - 📝 **Vazio**: Ícone + mensagem amigável
   - 🔍 **Busca sem resultados**: Mensagem específica

### Fluxo de Autenticação

A API backend exige autenticação via header:
```
Authorization: Bearer <access_token>
```

Atualmente a aplicação usa o **token de aluno** configurado em [api.ts](src/api.ts#L3):
- `aluno-dev-token-change-me` → permissões de **leitura** (GET /posts, GET /posts/:id, GET /posts/search)

Para operações de escrita (POST, PUT, DELETE), será necessário implementar seleção de perfil e usar o token de professor:
- `professor-dev-token-change-me` → permissões de **leitura + escrita**

> ⚠️ **Aviso**: Tokens hardcoded são aceitáveis nesta fase de aprendizado. Para produção, implemente fluxo de login real (OAuth/JWT) e armazene tokens de forma segura (HttpOnly cookies ou localStorage com medidas anti-XSS).

---

## 🔮 Estou utilizando IA para a geração da documentação.

