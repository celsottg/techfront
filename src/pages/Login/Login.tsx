import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button/Button';
import type { LoginRequest, LoginValidationError } from '../../types';

const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 240px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['3xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.12);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.surface};
    border-color: ${({ theme }) => theme.colors.dark.border};
    box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.5);
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
    background: ${({ theme }) => theme.colors.dark.background};
    border-color: ${({ theme }) => theme.colors.dark.border};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
    }
  }
`;

const FieldError = styled.small`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
  line-height: 1.4;
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => `rgba(${parseInt(theme.colors.error.slice(1,3),16)}, ${parseInt(theme.colors.error.slice(3,5),16)}, ${parseInt(theme.colors.error.slice(5,7),16)}, 0.4)`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => `rgba(${parseInt(theme.colors.error.slice(1,3),16)}, ${parseInt(theme.colors.error.slice(3,5),16)}, ${parseInt(theme.colors.error.slice(5,7),16)}, 0.08)`};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
`;

const CredentialsCard = styled.aside`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface ?? '#f9fafb'};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.6;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const CredentialItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CredentialLabel = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  min-width: 74px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const RoleBadge = styled.span<{ $role: 'PROFESSOR' | 'ALUNO' }>`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ theme, $role }) => ($role === 'PROFESSOR' ? theme.colors.primaryLight : '#d1fae5')};
  color: ${({ theme, $role }) => ($role === 'PROFESSOR' ? theme.colors.primary : theme.colors.success ?? '#065f46')};
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

type FieldErrors = Partial<Record<keyof LoginRequest, string[]>>;

function extractFieldErrors(err: unknown): { error: string | null; fields: FieldErrors } {
  if (!axios.isAxiosError(err)) {
    return { error: err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.', fields: {} };
  }

  const status = err.response?.status;
  const data = err.response?.data as LoginValidationError | undefined;

  if (status === 401) {
    return { error: 'E-mail ou senha inválidos. Verifique suas credenciais e tente novamente.', fields: {} };
  }
  if (status === 400 && data?.errors) {
    return {
      error: data?.message ?? 'Por favor, revise os campos destacados abaixo.',
      fields: data.errors,
    };
  }
  return {
    error: data?.message ?? 'Não foi possível entrar. Por favor, tente novamente em instantes.',
    fields: {},
  };
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const from: string =
    (location.state as { from?: string } | null)?.from ??
    new URLSearchParams(location.search).get('redirect') ??
    '/';

  function changeField<K extends keyof LoginRequest>(field: K, setter: (v: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setFieldErrors((cur: FieldErrors) => {
        if (!cur[field]) return cur;
        const next = { ...cur };
        delete next[field];
        return next;
      });
      if (globalError) setGlobalError(null);
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setGlobalError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login({ email: email.trim(), senha });
      navigate(from, { replace: true });
    } catch (err) {
      const parsed = extractFieldErrors(err);
      setGlobalError(parsed.error);
      setFieldErrors(parsed.fields);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <LoginCard>
        <Header>
          <Title>Acesse sua conta</Title>
        </Header>

        {globalError && (
          <ErrorBanner role="alert" aria-live="assertive">
            {globalError}
          </ErrorBanner>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <Label htmlFor="email">
              E-mail
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Digite seu e-mail cadastrado"
              value={email}
              onChange={changeField('email', setEmail)}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && (
              <FieldError role="alert">{fieldErrors.email[0]}</FieldError>
            )}
          </Field>

          <Field>
            <Label htmlFor="senha">
              Senha
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={changeField('senha', setSenha)}
              aria-invalid={Boolean(fieldErrors.senha)}
              required
            />
            {fieldErrors.senha && (
              <FieldError role="alert">{fieldErrors.senha[0]}</FieldError>
            )}
          </Field>

          <Actions>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Actions>
        </Form>

        <CredentialsCard aria-label="Credenciais de exemplo para teste">
          <strong>Credenciais de exemplo (ambiente de aprendizado):</strong>

          <CredentialItem>
            <RoleBadge $role="PROFESSOR" aria-hidden="true">Professor</RoleBadge>
          </CredentialItem>
          <CredentialItem>
            <CredentialLabel>E-mail</CredentialLabel>
            <span>carlos.mendes@professor.fiap.br</span>
          </CredentialItem>
          <CredentialItem>
            <CredentialLabel>Senha</CredentialLabel>
            <span>senha-professor-123</span>
          </CredentialItem>

          <div style={{ marginTop: 8 }} />

          <CredentialItem>
            <RoleBadge $role="ALUNO" aria-hidden="true">Aluno</RoleBadge>
          </CredentialItem>
          <CredentialItem>
            <CredentialLabel>E-mail</CredentialLabel>
            <span>ana.beatriz@aluno.fiap.br</span>
          </CredentialItem>
          <CredentialItem>
            <CredentialLabel>Senha</CredentialLabel>
            <span>senha-aluno-456</span>
          </CredentialItem>
        </CredentialsCard>
      </LoginCard>
    </PageWrapper>
  );
}

export default LoginPage;
