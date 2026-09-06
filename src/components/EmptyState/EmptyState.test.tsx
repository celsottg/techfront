import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import EmptyState from './EmptyState';

describe('<EmptyState />', () => {
  it('deve exibir valores padrões (icon, title, message) quando nenhuma prop for passada', () => {
    render(<EmptyState />);

    expect(
      screen.getByRole('heading', { name: /nenhum post encontrado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ainda não há posts publicados. volte mais tarde!/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/📝/i)).toBeInTheDocument();
  });

  it('deve exibir icon, title e message customizados via props', () => {
    render(
      <EmptyState
        icon="🔍"
        title="Nada por aqui"
        message="Tente buscar outra coisa."
      />,
    );

    expect(screen.getByText(/🔍/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /nada por aqui/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tente buscar outra coisa\./i),
    ).toBeInTheDocument();
  });

  it('NÃO deve renderizar nenhum botão (componente de apresentação apenas)', () => {
    render(<EmptyState />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
