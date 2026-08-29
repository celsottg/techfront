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
- ✅ Estados completos (loading, erro, vazio, 404, validação, 401/403)
- ✅ Navegação SPA entre listagem, detalhe, criação e edição de posts

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
│   │   └── PostEdit/                  # Formulário de edição de post existente
│   │       └── PostEdit.tsx
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
| **Estrutural** | `components/Header`, `components/MainContent`, `components/Footer` | Layout base da aplicação (esqueleto visual). Header inclui o botão "Novo Post"; PostDetail inclui o botão "Editar" |
| **Feature** | `pages/PostList`, `pages/PostDetail`, `pages/PostCreate`, `pages/PostEdit` | Lógica de negócio: listagem (fetch, busca, paginação), detalhe (fetch por id + botão editar), criação (formulário, validações, datas automáticas) e edição (pré-carregamento por id, atualiza apenas data_atualizacao, submit com PUT) |
| **UI** | `components/PostCard`, `components/Button`, `Loading`, `ErrorState`, `EmptyState` | Componentes de apresentação reutilizáveis (Button: primary/secondary/sm/md/lg/loading/fullWidth) |
| **Raiz** | [App.tsx](src/App.tsx) | Orquestrador: une layout estrutural + rotas do React Router (4 rotas com ordem correta de precedência) |

### Fluxo de Dados (Data Flow)

```
main.tsx
  ├── ThemeProvider (styled-components)   ← tema + GlobalStyles
  ├── BrowserRouter (react-router-dom)    ← roteamento SPA
  └── App.tsx
        ├── Header (sticky top)
        │     ├── Left: Logo + Nav (Link para /)
        │     └── Right: Link "/posts/create" → Button "+ Novo Post"
        │                                     (desktop: "Novo Post" texto, mobile: só ícone +)
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
        │                 ├── Botão "✏️ Editar" no PostHeader (canto superior direito do post)
        │                 │     └── Link para `/posts/${id}/edit`
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
- ✅ **CRUD iniciado** (implementado: GET listagem, busca, detalhe por id, **POST /posts** criação e **PUT /posts/:id** edição)
- ✅ **Dois perfis de autenticação separados**: `apiAluno` (leitura) e `apiProfessor` (escrita, permissão POST/PUT/DELETE na API)
- ✅ **Datas automáticas no envio** (transparente para o usuário):
  - **Criação (POST)**: `data_publicacao` e `data_atualizacao` são ambas geradas como `new Date().toISOString()` no momento do submit
  - **Edição (PUT)**: **APENAS `data_atualizacao`** é enviada no payload (gerada automaticamente no submit); o campo `data_publicacao` **NÃO é enviado** (preservado 100% no backend)
- ✅ **Estados visuais completos**: loading, sucesso, erro (com retry), empty, **404**, **validação cliente side**, **401 (auth)** e **403 (perfil sem permissão)** com mensagens contextuais
- ✅ **Paginação** no servidor (10 itens por página)
- ✅ **Busca com debounce** (400ms) via endpoint `/posts/search`
- ✅ **Detalhe por ID** via endpoint `/posts/:id` com tratamento de 404 e botão "✏️ Editar" no cabeçalho
- ✅ **Criação via POST /posts** usando token de professor, payload com `titulo`, `conteudo` + datas automáticas, e redirect para `/posts/:id` do post recém-criado no sucesso
- ✅ **Edição via PUT /posts/:id** usando token de professor, pré-carregamento do post, payload com `titulo`, `conteudo` + apenas `data_atualizacao`, e redirect para detalhe no sucesso
- ✅ **Axios configurado** com proxy Vite (evita CORS em desenvolvimento)
- ✅ **Autenticação Bearer token** (perfil aluno para leitura, perfil professor para escrita)
- ✅ **Navegação SPA** via React Router DOM (listagem ↔ detalhe ↔ criação ↔ edição, sem recarregar página)
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

A aplicação atualmente possui **4 rotas ativas**:

| Rota | Caminho | Componente | Descrição |
|---|---|---|---|
| **Home / Posts** | `/` | [PostList](src/pages/PostList/PostList.tsx) | Listagem paginada de todos os posts com busca e preview truncado |
| **Criar Post** | `/posts/create` | [PostCreate](src/pages/PostCreate/PostCreate.tsx) | Formulário de criação de novo post (acessível pelo botão "Novo Post" no cabeçalho) |
| **Editar Post** | `/posts/:id/edit` | [PostEdit](src/pages/PostEdit/PostEdit.tsx) | Formulário de edição de post existente com dados pré-carregados (acessível pelo botão "✏️ Editar" na página de detalhe) |
| **Detalhe do Post** | `/posts/:id` | [PostDetail](src/pages/PostDetail/PostDetail.tsx) | Visualização expandida do conteúdo completo com navegação de volta e botão de editar |

> ⚠️ **Ordem das rotas no roteador**: Em [App.tsx](src/App.tsx) as rotas literais `/posts/create` e `/posts/:id/edit` são **sempre declaradas antes** da rota curinga `/posts/:id`, para evitar que as palavras literais `create` e `edit` sejam interpretadas como IDs dinâmicos. A ordem correta é: 1. `/` → 2. `/posts/create` → 3. `/posts/:id/edit` → 4. `/posts/:id`.

A navegação ocorre pelo cabeçalho fixo ([Header](src/components/Header/Header.tsx)) com link ativo destacado, botão **"+ Novo Post"** (acessa a tela de criação), clicando nos cards da listagem (abre detalhe), e também pelo botão **"✏️ Editar"** no cabeçalho do post detalhado (abre tela de edição).

### Funcionalidade Principal: Listagem de Posts

1. **Carregamento inicial**: Ao abrir a página, a aplicação faz `GET /posts?page=1&limit=10` automaticamente
2. **Busca**: Digite no campo de busca para pesquisar por **título ou conteúdo** com debounce de 400ms → `GET /posts/search?search=termo`
3. **Paginação**: Use os botões no rodapé da lista para navegar entre as páginas (mostra 1ª, última e vizinhas com `...`)
4. **Abrir detalhe**: Clique em qualquer card da lista para navegar até `/posts/:id` e visualizar o conteúdo completo
5. **Criar novo post**: Clique no botão **"+" / "Novo Post"** no canto superior direito do cabeçalho para abrir `/posts/create`
6. **Editar post existente**: Ao visualizar o detalhe do post, use o botão **"✏️ Editar"** no canto superior direito do cabeçalho do próprio post
7. **Estados visuais**:
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
| ✅ **Sucesso (200 OK)** | Post encontrado | Título grande (5xl → 3xl responsivo) + **botão "✏️ Editar"** no canto superior direito do cabeçalho + data de publicação + badge de atualizado (quando houver) + conteúdo completo (font-size lg, line-height 1.8) + dois CTAs de voltar |
| 🔍 **Não encontrado (404)** | Backend retorna status 404 | Tela dedicada: ícone, título "Post não encontrado", mensagem explicativa + dois CTAs de retorno |
| ⚠️ **Erro genérico** | Falha de rede ou servidor | `ErrorState` com explicação e botão de retry |

**Botão "✏️ Editar" (cabeçalho do post)**:
- Posição: canto superior direito do cabeçalho do post, lado do título
- Estilo: botão `secondary` tamanho `sm` (subtil, não compete com o conteúdo)
- Comportamento: ao clicar, navega para a rota `/posts/:id/edit` abrindo a tela de edição com os dados já pré-carregados do post
- Acessibilidade: `aria-label` dinâmico com o título do post para leitores de tela

**Navegação de volta (dupla camada)**:
- Botão compacto no topo: "← Voltar para posts" (usa `useNavigate('/')`)
- Link maior no rodapé da página de sucesso: "← Voltar para a listagem de posts" (usa `Link` do React Router)
- Também disponível no topo das telas de erro e 404

> 💡 O conteúdo no card da listagem é limitado a **4 linhas** (CSS `-webkit-line-clamp: 4`) e exibe o indicativo "Ler mais →", orientando o usuário a clicar para expandir o post completo.

### Funcionalidade: Criação de Posts (Novo Post)

A página de criação permite que um usuário com **perfil de professor** publique novos conteúdos no blog.

#### Acesso
- Botão **"+ Novo Post"** fixo no canto superior direito do cabeçalho ([Header.tsx](src/components/Header/Header.tsx#L122-L127))
  - Desktop (≥769px): Exibe o texto completo `"Novo Post"`
  - Mobile/tablet (≤768px): Exibe apenas o ícone `+` (compacto, sem texto)
- Atalho direto via URL `/posts/create`

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
- Botão **"✏️ Editar"** no canto superior direito do cabeçalho do post, dentro da página de detalhe ([PostDetail.tsx](src/pages/PostDetail/PostDetail.tsx#L338-L362))
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

### Fluxo de Autenticação

A API backend exige autenticação via header:
```
Authorization: Bearer <access_token>
```

Atualmente a aplicação usa **dois tokens separados** configurados em [api.ts](src/api.ts#L3-L25), exportados como duas instâncias independentes do Axios:

| Export no `api.ts` | Token hardcoded | Perfil | Permissões | Uso atual no código |
|---|---|---|---|---|
| `apiAluno` (default `api`) | `aluno-dev-token-change-me` | **Aluno** | Apenas **leitura**: GET `/posts`, `/posts/:id`, `/posts/search` | Listagem (`PostList`) e Detalhe (`PostDetail`) |
| `apiProfessor` (export nomeado) | `professor-dev-token-change-me` | **Professor** | **Leitura + escrita**: GET + **POST** `/posts` + **PUT** `/posts/:id` + DELETE `/posts/:id` | Criação (`PostCreate`) + **Edição** (`PostEdit` para o `PUT /posts/:id` e também o `GET /posts/:id` de pré-carregamento) |

> ⚠️ **Aviso**: Tokens hardcoded são aceitáveis nesta fase de aprendizado. Para produção, implemente fluxo de login real (OAuth/JWT) e armazene tokens de forma segura (HttpOnly cookies ou localStorage com medidas anti-XSS). Em caso de **403 Forbidden** ao criar ou editar post, confira se o token de professor em [api.ts](src/api.ts#L4) corresponde ao `PROFESSOR_ACCESS_TOKEN` do backend `.env`.

---

## 🔮 Estou utilizando IA para a geração da documentação.

