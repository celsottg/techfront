import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, userEvent, screen, waitFor } from '../../test/test-utils';
import AdminArea from './AdminArea';
import type { Post, PostsListResponse } from '../../types';

const mockGet = vi.fn();
const mockDelete = vi.fn();

vi.mock('../../api', () => ({
  default: { get: vi.fn() },
  apiAluno: {
    get: (...args: unknown[]) => mockGet(...args),
  },
  apiProfessor: {
    get: vi.fn(),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

const postsPagina1: PostsListResponse = {
  posts: [
    {
      id: 1,
      titulo: 'Primeiro post do admin',
      conteudo: 'A',
      data_publicacao: '2026-01-01T00:00:00.000Z',
      data_atualizacao: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      titulo: 'Segundo post do admin',
      conteudo: 'B',
      data_publicacao: '2026-01-02T00:00:00.000Z',
      data_atualizacao: '2026-01-03T00:00:00.000Z',
    },
  ] as Post[],
  total: 2,
  page: 1,
  limit: 50,
};

describe('<AdminArea />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue({ data: postsPagina1 });
  });

  it('deve exibir botão "+ Novo Post" no topo (criação centralizada em /admin)', async () => {
    render(<AdminArea />, { initialEntries: ['/admin'] });
    expect(
      await screen.findByRole('link', { name: /novo post/i }),
    ).toBeInTheDocument();
  });

  it('deve listar cada post com: Badge ID, Título clicável (→ detalhe), botão Editar e botão Remover', async () => {
    render(<AdminArea />, { initialEntries: ['/admin'] });

    await screen.findByText(/primeiro post do admin/i);

    // Filtra apenas links de DETALHE (ex: /posts/1, /posts/2) — ignora /posts/create e /posts/:id/edit
    const isDetailLink = (href: string | null) =>
      href !== null && /^\/posts\/\d+$/.test(href);

    const linksTitulo = screen
      .getAllByRole('link')
      .filter((a) => isDetailLink(a.getAttribute('href')));

    expect(linksTitulo).toHaveLength(2);
    expect(linksTitulo[0]).toHaveAttribute('href', '/posts/1');
    expect(linksTitulo[1]).toHaveAttribute('href', '/posts/2');

    expect(screen.getByText(/#1/i)).toBeInTheDocument();
    expect(screen.getByText(/#2/i)).toBeInTheDocument();

    const botoesEditar = screen.getAllByRole('link', { name: /editar post/i });
    expect(botoesEditar).toHaveLength(2);
    expect(botoesEditar[0]).toHaveAttribute('href', '/posts/1/edit');

    const botoesRemover = screen.getAllByRole('button', {
      name: /remover post/i,
    });
    expect(botoesRemover).toHaveLength(2);
  });

  it('deve mostrar contador "2 posts no total"', async () => {
    render(<AdminArea />, { initialEntries: ['/admin'] });
    expect(await screen.findByText(/2 posts no total/i)).toBeInTheDocument();
  });

  it('DELETE fluxo 2-passos: Remover → Confirmar Exclusão → DELETE /posts/:id', async () => {
    const user = userEvent.setup();
    mockDelete.mockResolvedValueOnce({ status: 204 });

    render(<AdminArea />, { initialEntries: ['/admin'] });
    await screen.findByText(/primeiro post do admin/i);

    const botoesRemoverInicial = screen.getAllByRole('button', {
      name: /remover post/i,
    });
    expect(botoesRemoverInicial).toHaveLength(2);

    // Passo 1: clique em Remover (primeiro item)
    await user.click(botoesRemoverInicial[0]);

    // Agora deve aparecer botões específicos de Cancelar e Confirmar exclusão
    const btnConfirmar = await screen.findByRole('button', {
      name: /confirmar exclusão/i,
    });
    const btnCancelar = screen.getByRole('button', {
      name: /cancelar exclusão/i,
    });
    expect(btnConfirmar).toBeInTheDocument();
    expect(btnCancelar).toBeInTheDocument();

    // Passo 2: confirmar a exclusão
    await user.click(btnConfirmar);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/posts/1');
    });
    expect(mockDelete).toHaveBeenCalledTimes(1);

    // Validação final: O Link com o título do PRIMEIRO post não deve mais existir na lista
    // (o texto "Primeiro post do admin" ainda pode aparecer no banner de sucesso!)
    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: /primeiro post do admin/i }),
      ).not.toBeInTheDocument();
    });
    // O link do SEGUNDO post deve continuar visível (filtra por DETALHE /posts/ID numérico)
    const isDetailLink = (href: string | null) =>
      href !== null && /^\/posts\/\d+$/.test(href);

    const linksTituloRestantes = screen
      .getAllByRole('link')
      .filter((a) => isDetailLink(a.getAttribute('href')));

    expect(linksTituloRestantes).toHaveLength(1);
    expect(linksTituloRestantes[0]).toHaveAttribute('href', '/posts/2');
    expect(linksTituloRestantes[0]).toHaveTextContent(/segundo post do admin/i);

    expect(screen.getByText(/1 post no total/i)).toBeInTheDocument();
  });
});
