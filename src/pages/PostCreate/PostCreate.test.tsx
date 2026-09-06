import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, userEvent, screen, waitFor } from '../../test/test-utils';
import PostCreate from './PostCreate';
import type { Post } from '../../types';

const mockPost = vi.fn();

vi.mock('../../api', () => ({
  default: { get: vi.fn() },
  apiAluno: { get: vi.fn() },
  apiProfessor: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

describe('<PostCreate />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar os dois campos do formulário: Título e Conteúdo', () => {
    render(<PostCreate />, { initialEntries: ['/posts/create'] });

    expect(
      screen.getByPlaceholderText(/digite o título do seu post/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/escreva o conteúdo completo do seu post/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gravar post/i })).toBeInTheDocument();
  });

  it('deve mostrar mensagens de erro de validação quando submete formulário vazio', async () => {
    const user = userEvent.setup();
    render(<PostCreate />, { initialEntries: ['/posts/create'] });

    await user.click(screen.getByRole('button', { name: /gravar post/i }));

    expect(
      await screen.findByText(/título é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/conteúdo é obrigatório/i),
    ).toBeInTheDocument();
  });

  it('deve enviar POST /posts com payload contendo datas automáticas (data_publicacao + data_atualizacao)', async () => {
    const user = userEvent.setup();

    const novoPost: Post = {
      id: 150,
      titulo: 'Meu novo post de teste',
      conteudo: 'Conteúdo válido para o post com pelo menos 10 caracteres obrigatórios.',
      data_publicacao: '2026-09-05T00:00:00.000Z',
      data_atualizacao: '2026-09-05T00:00:00.000Z',
    };
    mockPost.mockResolvedValueOnce({ data: novoPost, status: 201 });

    render(<PostCreate />, { initialEntries: ['/posts/create'] });

    await user.type(
      screen.getByPlaceholderText(/digite o título do seu post/i),
      'Meu novo post de teste',
    );
    await user.type(
      screen.getByPlaceholderText(/escreva o conteúdo completo do seu post/i),
      'Conteúdo válido para o post com pelo menos 10 caracteres obrigatórios.',
    );

    await user.click(screen.getByRole('button', { name: /gravar post/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    const [url, payload] = mockPost.mock.calls[0];
    expect(url).toBe('/posts');

    expect(payload.titulo).toBe('Meu novo post de teste');
    expect(payload.conteudo).toBe(
      'Conteúdo válido para o post com pelo menos 10 caracteres obrigatórios.',
    );
    expect(payload).toHaveProperty('data_publicacao');
    expect(payload).toHaveProperty('data_atualizacao');
    expect(payload.data_publicacao).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(payload.data_atualizacao).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
