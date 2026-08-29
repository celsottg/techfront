import { useState, useEffect, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { apiProfessor } from '../../api';
import type { Post } from '../../types';
import Button from '../../components/Button/Button';
import Loading from '../../components/Loading/Loading';

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.dark.border};
    color: ${({ theme }) => theme.colors.dark.text};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const FormCard = styled.form`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.surface};
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textHighlight};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const baseInputStyles = `
  width: 100%;
  padding: 14px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  background: #fff;
  color: #6b6375;
  transition: all 0.2s;
  resize: vertical;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #aa3bff;
    box-shadow: 0 0 0 3px rgba(170, 59, 255, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: #1f2028;
    color: #9ca3af;
    border-color: #2e303a;

    &::placeholder {
      color: #6b7280;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledInput = styled.input<{ $error?: boolean }>`
  ${baseInputStyles}
  border-color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.dark.border)};
  }
`;

const StyledTextarea = styled.textarea<{ $error?: boolean }>`
  ${baseInputStyles}
  min-height: 280px;
  border-color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.dark.border)};
  }
`;

const FieldError = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CharCounter = styled.span<{ $limit?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme, $limit }) => ($limit ? theme.colors.warning : theme.colors.secondary)};
  align-self: flex-end;
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-left: 4px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ErrorTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const InfoBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textHighlight};
`;

const MetadataRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.6;

  strong {
    color: ${({ theme }) => theme.colors.textHighlight};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }

  @media (prefers-color-scheme: dark) {
    background: #23252f;
    color: ${({ theme }) => theme.colors.dark.text};

    strong {
      color: ${({ theme }) => theme.colors.dark.textHighlight};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: stretch;

    & > * {
      flex: 1;
    }
  }

  @media (prefers-color-scheme: dark) {
    border-top-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  gap: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const NotFoundIcon = styled.div`
  font-size: 80px;
  opacity: 0.6;
`;

const NotFoundTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const NotFoundMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 500px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const FieldLimits = {
  titulo: {
    min: 3,
    max: 255,
  },
  conteudo: {
    min: 10,
    max: 10000,
  },
} as const;

interface UpdatePostPayload {
  titulo: string;
  conteudo: string;
  data_atualizacao: string;
}

interface FormErrors {
  titulo?: string;
  conteudo?: string;
}

const validateForm = (titulo: string, conteudo: string): FormErrors => {
  const errors: FormErrors = {};

  const cleanTitle = titulo.trim();
  if (!cleanTitle) {
    errors.titulo = 'Título é obrigatório';
  } else if (cleanTitle.length < FieldLimits.titulo.min) {
    errors.titulo = `Título deve ter no mínimo ${FieldLimits.titulo.min} caracteres`;
  } else if (cleanTitle.length > FieldLimits.titulo.max) {
    errors.titulo = `Título deve ter no máximo ${FieldLimits.titulo.max} caracteres`;
  }

  const cleanContent = conteudo.trim();
  if (!cleanContent) {
    errors.conteudo = 'Conteúdo é obrigatório';
  } else if (cleanContent.length < FieldLimits.conteudo.min) {
    errors.conteudo = `Conteúdo deve ter no mínimo ${FieldLimits.conteudo.min} caracteres`;
  } else if (cleanContent.length > FieldLimits.conteudo.max) {
    errors.conteudo = `Conteúdo deve ter no máximo ${FieldLimits.conteudo.max} caracteres`;
  }

  return errors;
};

const getErrorMessage = (error: unknown): { title: string; message: string } => {
  const defaultTitle = 'Não foi possível atualizar o post';
  const defaultMessage =
    'Ocorreu um erro inesperado. Verifique a conexão com o servidor e tente novamente.';

  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
        };
      };
    };

    const status = axiosError.response?.status;
    const serverMessage =
      axiosError.response?.data?.message || axiosError.response?.data?.error;

    if (status === 401) {
      return {
        title: 'Autenticação necessária',
        message:
          'Token de autenticação ausente ou inválido. Verifique a configuração do token de professor.',
      };
    }

    if (status === 403) {
      return {
        title: 'Sem permissão para editar posts',
        message:
          'Seu perfil atual é de aluno (leitura apenas). Edição de posts é exclusiva para o perfil de professor. Verifique o token configurado em api.ts.',
      };
    }

    if (status === 404) {
      return {
        title: 'Post não encontrado',
        message:
          'O post que você está tentando editar não existe ou foi removido. Volte para a listagem e recarregue.',
      };
    }

    if (status === 400) {
      return {
        title: 'Dados inválidos',
        message:
          serverMessage ||
          'Os dados enviados são inválidos. Verifique os campos obrigatórios e tente novamente.',
      };
    }

    if (status && status >= 500) {
      return {
        title: 'Erro no servidor',
        message:
          serverMessage ||
          'O servidor apresentou um erro interno. Tente novamente mais tarde.',
      };
    }

    if (serverMessage) {
      return { title: defaultTitle, message: serverMessage };
    }
  }

  return { title: defaultTitle, message: defaultMessage };
};

const formatDatePt = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<{ title: string; message: string } | null>(null);

  const [postOriginal, setPostOriginal] = useState<Post | null>(null);

  const [titulo, setTitulo] = useState<string>('');
  const [conteudo, setConteudo] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ titulo: boolean; conteudo: boolean }>({
    titulo: false,
    conteudo: false,
  });

  const fetchPost = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoadingFetch(false);
      return;
    }

    setLoadingFetch(true);
    setFetchError(null);
    setNotFound(false);
    try {
      const response = await apiProfessor.get<Post>(`/posts/${id}`);
      const data = response.data;
      setPostOriginal(data);
      setTitulo(data.titulo);
      setConteudo(data.conteudo);
      setErrors({});
      setTouched({ titulo: false, conteudo: false });
    } catch (err) {
      console.error('[PostEdit] Erro ao carregar post para edição:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          setNotFound(true);
        } else {
          setFetchError(
            'Não foi possível carregar os dados do post. Verifique a conexão com o servidor e tente novamente.',
          );
        }
      } else {
        setFetchError(
          'Não foi possível carregar os dados do post. Verifique a conexão com o servidor.',
        );
      }
    } finally {
      setLoadingFetch(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleTituloChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitulo(value);
      if (touched.titulo) {
        setErrors((prev) => {
          const valid = validateForm(value, conteudo);
          return { ...prev, titulo: valid.titulo };
        });
      }
    },
    [conteudo, touched.titulo],
  );

  const handleConteudoChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setConteudo(value);
      if (touched.conteudo) {
        setErrors((prev) => {
          const valid = validateForm(titulo, value);
          return { ...prev, conteudo: valid.conteudo };
        });
      }
    },
    [titulo, touched.conteudo],
  );

  const handleBlurTitulo = useCallback(() => {
    setTouched((prev) => ({ ...prev, titulo: true }));
    setErrors((prev) => {
      const valid = validateForm(titulo, conteudo);
      return { ...prev, titulo: valid.titulo };
    });
  }, [titulo, conteudo]);

  const handleBlurConteudo = useCallback(() => {
    setTouched((prev) => ({ ...prev, conteudo: true }));
    setErrors((prev) => {
      const valid = validateForm(titulo, conteudo);
      return { ...prev, conteudo: valid.conteudo };
    });
  }, [titulo, conteudo]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!id || !postOriginal) return;

      setSubmitError(null);
      setTouched({ titulo: true, conteudo: true });
      const validationErrors = validateForm(titulo, conteudo);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      const payload: UpdatePostPayload = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        data_atualizacao: new Date().toISOString(),
      };

      setLoadingSubmit(true);
      try {
        await apiProfessor.put<Post>(`/posts/${id}`, payload);
        navigate(`/posts/${id}`, {
          state: { fromEdit: true, justUpdated: true },
          replace: false,
        });
      } catch (err) {
        console.error('[PostEdit] Erro ao atualizar post:', err);
        setSubmitError(getErrorMessage(err));
      } finally {
        setLoadingSubmit(false);
      }
    },
    [titulo, conteudo, id, postOriginal, navigate],
  );

  if (loadingFetch) {
    return (
      <PageWrapper>
        <BackButton to={id ? `/posts/${id}` : '/'}>← Voltar para o post</BackButton>
        <Loading message="Carregando dados do post para edição..." />
      </PageWrapper>
    );
  }

  if (notFound) {
    return (
      <PageWrapper>
        <BackButton to="/">← Voltar para posts</BackButton>
        <NotFoundWrapper>
          <NotFoundIcon>🔍</NotFoundIcon>
          <NotFoundTitle>Post não encontrado para edição</NotFoundTitle>
          <NotFoundMessage>
            O post que você está tentando editar não existe ou foi removido.
            Verifique o endereço, volte para a listagem e selecione um post existente.
          </NotFoundMessage>
          <Button as={Link} to="/" variant="primary">
            Ir para listagem de posts
          </Button>
        </NotFoundWrapper>
      </PageWrapper>
    );
  }

  if (fetchError) {
    return (
      <PageWrapper>
        <BackButton to={id ? `/posts/${id}` : '/'}>← Voltar para o post</BackButton>
        <ErrorBanner role="alert">
          <ErrorTitle>⚠️ Erro ao carregar post</ErrorTitle>
          <ErrorMessage>{fetchError}</ErrorMessage>
        </ErrorBanner>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="primary" onClick={fetchPost}>
            Tentar carregar novamente
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const showTitleError = touched.titulo && Boolean(errors.titulo);
  const showContentError = touched.conteudo && Boolean(errors.conteudo);
  const tituloCount = titulo.length;
  const conteudoCount = conteudo.length;

  return (
    <PageWrapper>
      <BackButton to={id ? `/posts/${id}` : '/'}>← Voltar para o post</BackButton>

      <PageHeader>
        <PageTitle>Editar Post</PageTitle>
        <PageSubtitle>
          Altere o título e o conteúdo do post abaixo. Apenas a data de atualização será
          modificada na gravação.
        </PageSubtitle>
      </PageHeader>

      {submitError && (
        <ErrorBanner role="alert">
          <ErrorTitle>⚠️ {submitError.title}</ErrorTitle>
          <ErrorMessage>{submitError.message}</ErrorMessage>
        </ErrorBanner>
      )}

      {postOriginal && (
        <InfoBanner role="note" aria-label="Metadados do post em edição">
          <InfoTitle>ℹ️ Dados originais do post</InfoTitle>
          <MetadataRow>
            <div>
              <strong>ID:</strong> #{postOriginal.id}
            </div>
            <div>
              <strong>Data de publicação:</strong>{' '}
              {formatDatePt(postOriginal.data_publicacao)}
            </div>
            <div>
              <strong>Última atualização:</strong>{' '}
              {formatDatePt(postOriginal.data_atualizacao)}
            </div>
          </MetadataRow>
        </InfoBanner>
      )}

      <FormCard onSubmit={handleSubmit} noValidate>
        <FormSection>
          <InputWrapper>
            <Label htmlFor="edit-post-title">
              Título<RequiredMark aria-hidden="true">*</RequiredMark>
            </Label>
            <StyledInput
              id="edit-post-title"
              type="text"
              name="titulo"
              value={titulo}
              onChange={handleTituloChange}
              onBlur={handleBlurTitulo}
              $error={showTitleError}
              placeholder="Digite o título do seu post aqui"
              required
              maxLength={FieldLimits.titulo.max + 1}
              autoComplete="off"
              aria-required="true"
              aria-invalid={showTitleError || undefined}
              aria-describedby={showTitleError ? 'edit-error-titulo' : undefined}
              disabled={loadingSubmit}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {showTitleError ? (
                <FieldError id="edit-error-titulo" role="alert">
                  {errors.titulo}
                </FieldError>
              ) : (
                <HelpText>
                  Mínimo {FieldLimits.titulo.min} caracteres · máximo {FieldLimits.titulo.max}
                </HelpText>
              )}
              <CharCounter
                $limit={tituloCount > FieldLimits.titulo.max * 0.9}
                aria-label={`${tituloCount} de ${FieldLimits.titulo.max} caracteres`}
              >
                {tituloCount}/{FieldLimits.titulo.max}
              </CharCounter>
            </div>
          </InputWrapper>
        </FormSection>

        <FormSection>
          <InputWrapper>
            <Label htmlFor="edit-post-content">
              Conteúdo<RequiredMark aria-hidden="true">*</RequiredMark>
            </Label>
            <StyledTextarea
              id="edit-post-content"
              name="conteudo"
              value={conteudo}
              onChange={handleConteudoChange}
              onBlur={handleBlurConteudo}
              $error={showContentError}
              placeholder="Escreva o conteúdo completo do seu post. Você pode usar quebras de linha para separar parágrafos."
              required
              maxLength={FieldLimits.conteudo.max + 1}
              aria-required="true"
              aria-invalid={showContentError || undefined}
              aria-describedby={showContentError ? 'edit-error-conteudo' : undefined}
              disabled={loadingSubmit}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {showContentError ? (
                <FieldError id="edit-error-conteudo" role="alert">
                  {errors.conteudo}
                </FieldError>
              ) : (
                <HelpText>
                  Mínimo {FieldLimits.conteudo.min} caracteres · máximo {FieldLimits.conteudo.max}
                </HelpText>
              )}
              <CharCounter
                $limit={conteudoCount > FieldLimits.conteudo.max * 0.9}
                aria-label={`${conteudoCount} de ${FieldLimits.conteudo.max} caracteres`}
              >
                {conteudoCount}/{FieldLimits.conteudo.max}
              </CharCounter>
            </div>
          </InputWrapper>
        </FormSection>

        <Actions>
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate(id ? `/posts/${id}` : '/')}
            disabled={loadingSubmit}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="lg"
            loading={loadingSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Actions>
      </FormCard>
    </PageWrapper>
  );
}

export default PostEdit;
