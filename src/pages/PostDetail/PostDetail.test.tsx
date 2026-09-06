import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderPage, screen, waitFor } from '../../test/test-utils';
import PostDetail from './PostDetail';
import type { Post } from '../../types';

const mockPost: Post = {
  id: 1,
  titulo: 'Meu primeiro post',
  conteudo: 'Este é o conteúdo completo do meu primeiro post.\nEle tem quebras de linha.',
  data_publicacao: '2026-08-25T12:00:00.000Z',
  data_atualizacao: '2026-08-25T12:00:00.000Z',
};

const mockGet = vi.fn();

vi.mock('../../api', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
  apiAluno: {
    get: (...args: unknown[]) => mockGet(...args),
  },
  apiProfessor: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('<PostDetail />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir loading inicial enquanto carrega o post', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderPage('/posts/:id', <PostDetail />, { initialEntries: ['/posts/1'] });

    expect(screen.getByText(/carregando post\.\.\./i)).toBeInTheDocument();
  });

  it('deve renderizar título, conteúdo completo e data de publicação após sucesso do GET', async () => {
    mockGet.mockResolvedValueOnce({ data: mockPost });

    renderPage('/posts/:id', <PostDetail />, { initialEntries: ['/posts/1'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /meu primeiro post/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/este é o conteúdo completo do meu primeiro post\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/publicado em/i)).toBeInTheDocument();
    expect(screen.getByText(/voltar para posts/i)).toBeInTheDocument();
  });

  it('deve chamar GET /posts/:id corretamente com o ID vindo da rota', async () => {
    mockGet.mockResolvedValueOnce({ data: mockPost });
    renderPage('/posts/:id', <PostDetail />, { initialEntries: ['/posts/1'] });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/posts/1');
    });
  });

  it('deve renderizar tela de "Post não encontrado" quando backend retorna 404', async () => {
    mockGet.mockRejectedValueOnce({ response: { status: 404 } });

    renderPage('/posts/:id', <PostDetail />, { initialEntries: ['/posts/9999'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /post não encontrado/i }),
      ).toBeInTheDocument();
    });
  });

  it('NÃO deve renderizar o botão Editar na tela de detalhe (edição só via /admin)', async () => {
    mockGet.mockResolvedValueOnce({ data: mockPost });

    renderPage('/posts/:id', <PostDetail />, { initialEntries: ['/posts/1'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /meu primeiro post/i }),
      ).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
  });
});
