import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Header from './Header';

describe('<Header />', () => {
  it('deve renderizar o logo TechFront como link para a home /', () => {
    render(<Header />);

    const logoLink = screen.getByRole('link', { name: /techfront/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('deve renderizar o link de navegação para Posts (/) ativo por padrão', () => {
    render(<Header />, { initialEntries: ['/'] });

    const postsLink = screen.getByRole('link', { name: /^posts$/i });
    expect(postsLink).toBeInTheDocument();
    expect(postsLink).toHaveAttribute('href', '/');
  });

  it('deve renderizar o link para Área administrativa (/admin)', () => {
    render(<Header />);

    const adminLink = screen.getByRole('link', { name: /área administrativa/i });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('NÃO deve renderizar o botão "+ Novo Post" (gestão centralizada em /admin)', () => {
    render(<Header />);

    expect(
      screen.queryByRole('button', { name: /novo post/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /criar novo post/i }),
    ).not.toBeInTheDocument();
  });

  it('NÃO deve renderizar nenhum botão (apenas links de navegação)', () => {
    render(<Header />);
    const botoes = screen.queryAllByRole('button');
    expect(botoes).toHaveLength(0);
  });
});
