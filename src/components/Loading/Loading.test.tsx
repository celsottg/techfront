import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Loading from './Loading';

describe('<Loading />', () => {
  it('deve exibir a mensagem padrão quando message não for informada', () => {
    render(<Loading />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve exibir a mensagem customizada quando passada em message', () => {
    render(<Loading message="Buscando posts..." />);
    expect(screen.getByText(/buscando posts\.\.\./i)).toBeInTheDocument();
  });
});
