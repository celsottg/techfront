import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Footer from './Footer';

describe('<Footer />', () => {
  it('deve renderizar a mensagem padrão exata: © 2026 TechFront - Tech Challenge FIAP - Celso Gonçalves', () => {
    render(<Footer />);

    const texto = screen.getByText(
      /© 2026 TechFront - Tech Challenge FIAP - Celso Gonçalves/i,
    );
    expect(texto).toBeInTheDocument();
  });

  it('deve renderizar apenas 1 parágrafo de texto (linha única)', () => {
    const { container } = render(<Footer />);
    const paragrafos = container.querySelectorAll('p');
    expect(paragrafos).toHaveLength(1);
  });

  it('NÃO deve conter link para FIAP (removido na simplificação)', () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll('a[href]');
    expect(links).toHaveLength(0);
  });
});
