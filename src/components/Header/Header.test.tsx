import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Header from './Header';

const authAluno = {
  token: 'aluno-token',
  role: 'ALUNO' as const,
  usuario: { id: 2, nome: 'Ana Beatriz Silva', email: 'ana.beatriz@aluno.fiap.br' },
};

const authProfessor = {
  token: 'prof-token',
  role: 'PROFESSOR' as const,
  usuario: { id: 1, nome: 'Dr. Carlos Mendes', email: 'carlos.mendes@professor.fiap.br' },
};

describe('<Header />', () => {
  describe('Quando NÃO autenticado', () => {
    it('logo TechFront deve ser link para /login', () => {
      render(<Header />);
      const logoLink = screen.getByRole('link', { name: /techfront/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/login');
    });

    it('não deve exibir navegação interna (Posts ou Área administrativa)', () => {
      render(<Header />);
      expect(screen.queryByRole('link', { name: /^posts$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /área administrativa/i })).not.toBeInTheDocument();
    });

    it('deve exibir botão Entrar (link para /login) e não botão Sair', () => {
      render(<Header />);
      const entrar = screen.getByRole('button', { name: /^entrar$/i });
      expect(entrar).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^sair$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /novo post/i })).not.toBeInTheDocument();
    });
  });

  describe('Quando autenticado como ALUNO', () => {
    it('logo deve ser link para /; mostra Posts; NÃO mostra Área administrativa', () => {
      render(<Header />, { auth: authAluno, initialEntries: ['/'] });

      const logoLink = screen.getByRole('link', { name: /techfront/i });
      expect(logoLink).toHaveAttribute('href', '/');

      const postsLink = screen.getByRole('link', { name: /^posts$/i });
      expect(postsLink).toBeInTheDocument();
      expect(postsLink).toHaveAttribute('href', '/');

      expect(screen.queryByRole('link', { name: /área administrativa/i })).not.toBeInTheDocument();
    });

    it('mostra nome do usuário, badge Aluno e botão Sair', () => {
      render(<Header />, { auth: authAluno });
      expect(screen.getByText(/ana beatriz silva/i)).toBeInTheDocument();
      expect(screen.getByText(/^aluno$/i)).toBeInTheDocument();
      const sair = screen.getByRole('button', { name: /sair/i });
      expect(sair).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /entrar/i })).not.toBeInTheDocument();
    });
  });

  describe('Quando autenticado como PROFESSOR', () => {
    it('exibe navegação completa: Posts e Área administrativa', () => {
      render(<Header />, { auth: authProfessor, initialEntries: ['/admin'] });

      expect(screen.getByRole('link', { name: /^posts$/i })).toHaveAttribute('href', '/');
      const admin = screen.getByRole('link', { name: /área administrativa/i });
      expect(admin).toBeInTheDocument();
      expect(admin).toHaveAttribute('href', '/admin');
    });

    it('mostra badge Professor e botão Sair; NUNCA mostra botão Novo Post no Header (gestão em /admin)', () => {
      render(<Header />, { auth: authProfessor });
      expect(screen.getByText(/^professor$/i)).toBeInTheDocument();
      expect(screen.getByText(/dr\. carlos mendes/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: /novo post/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /criar novo post/i })).not.toBeInTheDocument();
    });
  });
});
