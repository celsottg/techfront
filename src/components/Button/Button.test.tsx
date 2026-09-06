import { describe, it, expect, vi } from 'vitest';
import { render, userEvent, screen } from '../../test/test-utils';
import Button from './Button';

describe('<Button />', () => {
  it('deve renderizar o children (texto) corretamente', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado (não loading nem disabled)', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Salvar</Button>);

    await user.click(screen.getByRole('button', { name: /salvar/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('NÃO deve chamar onClick quando disabled=true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Salvar
      </Button>,
    );

    const btn = screen.getByRole('button', { name: /salvar/i });
    expect(btn).toBeDisabled();

    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve ficar disabled e adicionar spinner quando loading=true', () => {
    const { container } = render(<Button loading>Salvar Alterações</Button>);
    const btn = screen.getByRole('button', { name: /salvar alterações/i });
    expect(btn).toBeDisabled();

    const anySpinner = container.querySelector('span[aria-hidden="true"]');
    expect(anySpinner).toBeInTheDocument();
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('deve repassar type="submit" para formulários', () => {
    render(<Button type="submit">Gravar Post</Button>);
    expect(screen.getByRole('button', { name: /gravar post/i })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('deve respeitar a propriedade aria-label (acessibilidade)', () => {
    render(
      <Button variant="secondary" size="sm" aria-label="Editar post">
        ✏️ Editar
      </Button>,
    );
    expect(
      screen.getByRole('button', { name: /editar post/i }),
    ).toBeInTheDocument();
  });
});
