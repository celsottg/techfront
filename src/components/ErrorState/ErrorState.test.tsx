import { describe, it, expect, vi } from 'vitest';
import { render, userEvent, screen } from '../../test/test-utils';
import ErrorState from './ErrorState';

describe('<ErrorState />', () => {
  it('deve exibir título fixo "Ops! Algo deu errado" e mensagem padrão', () => {
    render(<ErrorState />);

    expect(
      screen.getByRole('heading', { name: /ops! algo deu errado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ocorreu um erro ao carregar os dados\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/⚠️/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem customizada quando passada', () => {
    render(<ErrorState message="Não foi possível carregar a lista." />);
    expect(
      screen.getByText(/não foi possível carregar a lista\./i),
    ).toBeInTheDocument();
  });

  it('deve renderizar botão "Tentar novamente" apenas quando onRetry for passado', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorState message="Erro" onRetry={onRetry} />);

    const btn = screen.getByRole('button', { name: /tentar novamente/i });
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('NÃO renderiza botão de retry quando onRetry não é informado', () => {
    render(<ErrorState message="Erro fatal" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
