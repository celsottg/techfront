import styled, { css } from 'styled-components';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $loading?: boolean;
  $fullWidth?: boolean;
  $disabled?: boolean;
}

const baseStyles = css<ButtonBaseProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.4;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid transparent;
  cursor: ${({ $loading, $disabled }) => ($loading || $disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading, $disabled }) => ($loading || $disabled ? 0.6 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? 'none' : 'auto')};
  transition: all 0.2s ease;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ${({ $size, theme }) =>
    $size === 'sm' &&
    css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
    `}

  ${({ $size, theme }) =>
    $size === 'md' &&
    css`
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.base};
    `}

  ${({ $size, theme }) =>
    $size === 'lg' &&
    css`
      padding: ${theme.spacing.md} ${theme.spacing.xl};
      font-size: ${theme.typography.fontSize.lg};
    `}
`;

const variantStyles = {
  primary: css<ButtonBaseProps>`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryBorder};
      border-color: ${({ theme }) => theme.colors.primaryBorder};
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css<ButtonBaseProps>`
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.textHighlight};
      border-color: ${({ theme }) => theme.colors.primaryBorder};
    }

    @media (prefers-color-scheme: dark) {
      background: ${({ theme }) => theme.colors.dark.surface};
      color: ${({ theme }) => theme.colors.dark.text};
      border-color: ${({ theme }) => theme.colors.dark.border};

      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.dark.background};
        color: ${({ theme }) => theme.colors.dark.textHighlight};
      }
    }
  `,
};

const StyledButton = styled.button<ButtonBaseProps>`
  ${baseStyles};
  ${({ $variant }) => variantStyles[$variant]};
`;

const Spinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: buttonSpin 0.7s linear infinite;

  @keyframes buttonSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={loading}
      $fullWidth={fullWidth}
      $disabled={disabled}
      disabled={disabled || loading}
      type={type}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      {loading ? (
        <span aria-hidden="false">{children}</span>
      ) : (
        children
      )}
    </StyledButton>
  );
}

export default Button;
