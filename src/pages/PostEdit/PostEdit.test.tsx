import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderPage, userEvent, screen, waitFor } from '../../test/test-utils';
import PostEdit from './PostEdit';

const mockGet = vi.fn();
const mockPut = vi.fn();

vi.mock('../../api', () => ({
  default: { get: vi.fn() },
  apiAluno: { get: vi.fn() },
  apiProfessor: {
    get: (...args: unknown[]) => mockGet(...args),
    put: (...args: unknown[]) => mockPut(...args),
  },
}));

describe('<PostEdit />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const postOriginal = {
    id: 77,
    titulo: 'Título original do post',
    conteudo: 'Conteúdo original do post com mais de 10 caracteres aqui.',
    data_publicacao: '2026-01-10T00:00:00.000Z',
    data_atualizacao: '2026-01-11T00:00:00.000Z',
  };

  it('deve fazer preload GET /posts/:id e popular TÍTULO e CONTEÚDO automaticamente', async () => {
    mockGet.mockResolvedValueOnce({ data: postOriginal });

    renderPage('/posts/:id/edit', <PostEdit />, {
      initialEntries: ['/posts/77/edit'],
    });

    const campoTitulo = (await screen.findByPlaceholderText(
      /digite o título do seu post/i,
    )) as HTMLInputElement;
    const campoConteudo = screen.getByPlaceholderText(
      /escreva o conteúdo completo do seu post/i,
    ) as HTMLTextAreaElement;

    expect(campoTitulo.value).toBe('Título original do post');
    expect(campoConteudo.value).toBe(
      'Conteúdo original do post com mais de 10 caracteres aqui.',
    );
  });

  it('REGRA CRÍTICA: payload PUT deve enviar APENAS data_atualizacao (NÃO envia data_publicacao)', async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({ data: postOriginal });
    mockPut.mockResolvedValueOnce({
      data: { ...postOriginal, titulo: 'Título editado' },
    });

    renderPage('/posts/:id/edit', <PostEdit />, {
      initialEntries: ['/posts/77/edit'],
    });

    const campoTitulo = await screen.findByPlaceholderText(
      /digite o título do seu post/i,
    );
    await user.clear(campoTitulo);
    await user.type(campoTitulo, 'Título editado');

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() => expect(mockPut).toHaveBeenCalledTimes(1));
    const [url, payload] = mockPut.mock.calls[0];

    expect(url).toBe('/posts/77');
    expect(payload.titulo).toBe('Título editado');
    expect(payload).toHaveProperty('data_atualizacao');
    expect(payload.data_atualizacao).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    // REGRA MAIS IMPORTANTE: NÃO pode ter data_publicacao no payload
    expect(payload).not.toHaveProperty('data_publicacao');
  });
});
