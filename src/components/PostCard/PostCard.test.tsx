import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import PostCard from './PostCard';
import type { Post } from '../../types';

const basePost: Post = {
  id: 42,
  titulo: 'Introdução ao React 19',
  conteudo:
    'O React 19 trouxe várias novidades legais, incluindo hooks otimizados, melhor uso do server components e performance aprimorada em listas grandes. Vale muito a pena conferir as novidades!',
  data_publicacao: '2026-01-15T10:30:00.000Z',
  data_atualizacao: '2026-01-15T10:30:00.000Z',
};

const postAtualizado: Post = {
  ...basePost,
  data_atualizacao: '2026-01-16T14:00:00.000Z',
};

describe('<PostCard />', () => {
  it('deve renderizar título, conteúdo (preview) e data do post', () => {
    render(<PostCard post={basePost} />);

    expect(
      screen.getByRole('heading', { name: /introdução ao react 19/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/o react 19 trouxe várias novidades/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/publicado em/i)).toBeInTheDocument();
  });

  it('deve envolver todo o card em um Link para /posts/:id', () => {
    render(<PostCard post={basePost} />);

    const linkCard = screen.getByRole('link', {
      name: /introdução ao react 19/i,
    });
    expect(linkCard).toHaveAttribute('href', '/posts/42');
  });

  it('deve exibir badge "Atualizado em" quando data_atualizacao for diferente de data_publicacao', () => {
    render(<PostCard post={postAtualizado} />);

    expect(screen.getByText(/atualizado em/i)).toBeInTheDocument();
  });

  it('NÃO deve exibir badge "Atualizado" quando datas forem iguais (post nunca editado)', () => {
    render(<PostCard post={basePost} />);

    expect(screen.queryByText(/atualizado em/i)).not.toBeInTheDocument();
  });

  it('deve exibir a chamada "Ler mais" no final do preview', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(/ler mais/i)).toBeInTheDocument();
  });
});
