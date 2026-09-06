import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { apiProfessor, apiAluno } from '../../api';
import type { Post, PostsListResponse } from '../../types';
import Button from '../../components/Button/Button';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.div`
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

const ListHeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ResultCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const PostListContainer = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background: transparent;
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const PostListItem = styled.li<{ $isLast?: boolean; $destructive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: ${({ theme, $isLast }) =>
    $isLast ? 'none' : `1px solid ${theme.colors.border}`};
  background: ${({ theme }) => theme.colors.background};
  transition: background 0.2s;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme, $destructive }) =>
      $destructive ? 'rgba(239, 68, 68, 0.06)' : theme.colors.dark.surface};
    border-bottom-color: ${({ theme, $isLast }) =>
      $isLast ? 'transparent' : theme.colors.dark.border};
  }
`;

const PostTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const PostTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textHighlight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const PostIdBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    background: #23252f;
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const SuccessBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-left: 4px solid #22c55e;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
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

const CloseBannerButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  opacity: 0.7;
  line-height: 1;
  padding: 0 ${({ theme }) => theme.spacing.xs};

  &:hover {
    opacity: 1;
  }
`;

const getDeleteErrorMessage = (error: unknown): { title: string; message: string } => {
  const defaultTitle = 'Não foi possível excluir o post';
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
        title: 'Sem permissão para excluir posts',
        message:
          'Seu perfil atual é de aluno (leitura apenas). Exclusão de posts é exclusiva para o perfil de professor. Verifique o token configurado em api.ts.',
      };
    }

    if (status === 404) {
      return {
        title: 'Post não encontrado',
        message:
          'O post que você está tentando excluir não existe ou já foi removido. A lista foi atualizada.',
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

function AdminArea() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | string | null>(null);

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allPosts: Post[] = [];
      const limit = 50;
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await apiAluno.get<PostsListResponse>(
          `/posts?page=${page}&limit=${limit}`,
        );
        const data = response.data;
        allPosts.push(...data.posts);

        if (!data.total || allPosts.length >= data.total) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      setPosts(allPosts);
    } catch (err) {
      console.error('[AdminArea] Erro ao carregar lista de posts:', err);
      setError(
        'Não foi possível carregar a lista de posts. Verifique a conexão com o servidor e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleDeleteClick = useCallback((post: Post) => {
    setOperationError(null);
    setSuccessMessage(null);
    setConfirmDeleteId(post.id);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  const handleConfirmDelete = useCallback(
    async (post: Post) => {
      if (!post.id) return;

      setDeletingId(post.id);
      setOperationError(null);
      setSuccessMessage(null);

      try {
        await apiProfessor.delete(`/posts/${post.id}`);

        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setSuccessMessage(`Post "${post.titulo}" foi removido com sucesso.`);
        setConfirmDeleteId(null);
      } catch (err) {
        console.error('[AdminArea] Erro ao excluir post:', err);
        const errInfo = getDeleteErrorMessage(err);
        setOperationError(errInfo);

        if (errInfo.title === 'Post não encontrado') {
          setPosts((prev) => prev.filter((p) => p.id !== post.id));
        }
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  if (loading) {
    return (
      <PageWrapper>
        <Loading message="Carregando posts para administração..." />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorState
          message={`Erro ao carregar a área administrativa: ${error}`}
          onRetry={fetchAllPosts}
        />
      </PageWrapper>
    );
  }

  const isEmpty = posts.length === 0;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Área administrativa</PageTitle>
        <PageSubtitle>
          Gerencie todos os posts publicados no blog. Você pode editar ou remover cada post
          individualmente.
        </PageSubtitle>
      </PageHeader>

      {successMessage && (
        <SuccessBanner role="status" aria-live="polite">
          <span>✅ {successMessage}</span>
          <CloseBannerButton
            onClick={() => setSuccessMessage(null)}
            aria-label="Fechar mensagem de sucesso"
          >
            ×
          </CloseBannerButton>
        </SuccessBanner>
      )}

      {operationError && (
        <ErrorBanner role="alert">
          <ErrorTitle>⚠️ {operationError.title}</ErrorTitle>
          <ErrorMessage>{operationError.message}</ErrorMessage>
        </ErrorBanner>
      )}

      {isEmpty ? (
        <EmptyState
          title="Nenhum post encontrado"
          message="Ainda não existem posts publicados no blog. Clique em Novo Post para criar o primeiro conteúdo."
        />
      ) : (
        <>
          <ListHeaderActions>
            <ResultCount>{posts.length} post{posts.length === 1 ? '' : 's'} no total</ResultCount>
            <Link to="/posts/create" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">
                + Novo Post
              </Button>
            </Link>
          </ListHeaderActions>

          <PostListContainer>
            {posts.map((post, index) => {
              const isLast = index === posts.length - 1;
              const isConfirmingDelete = confirmDeleteId === post.id;
              const isDeletingThis = deletingId === post.id;

              return (
                <PostListItem
                  key={post.id}
                  $isLast={isLast}
                  $destructive={isConfirmingDelete}
                >
                  <PostTitleWrapper>
                    <PostIdBadge>#{post.id}</PostIdBadge>
                    <Link
                      to={`/posts/${post.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        minWidth: 0,
                        flex: 1,
                        overflow: 'hidden',
                      }}
                      aria-label={`Abrir detalhe do post: ${post.titulo}`}
                    >
                      <PostTitle title={post.titulo}>{post.titulo}</PostTitle>
                    </Link>
                  </PostTitleWrapper>

                  <ItemActions>
                    {isConfirmingDelete ? (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={handleCancelDelete}
                          disabled={isDeletingThis}
                          aria-label={`Cancelar exclusão do post ${post.titulo}`}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          type="button"
                          onClick={() => handleConfirmDelete(post)}
                          loading={isDeletingThis}
                          disabled={isDeletingThis}
                          style={
                            {
                              // Destructivo visual via style por simplicidade (botão danger inline)
                              background: isDeletingThis ? undefined : '#ef4444',
                              borderColor: isDeletingThis ? undefined : '#ef4444',
                            } as React.CSSProperties
                          }
                          aria-label={`Confirmar exclusão do post ${post.titulo}`}
                        >
                          {isDeletingThis ? 'Removendo...' : 'Confirmar Exclusão'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/posts/${post.id}/edit`}
                          style={{ textDecoration: 'none' }}
                          aria-label={`Editar post ${post.titulo}`}
                        >
                          <Button variant="secondary" size="sm">
                            ✏️ Editar
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={() => handleDeleteClick(post)}
                          aria-label={`Remover post ${post.titulo}`}
                        >
                          🗑️ Remover
                        </Button>
                      </>
                    )}
                  </ItemActions>
                </PostListItem>
              );
            })}
          </PostListContainer>
        </>
      )}
    </PageWrapper>
  );
}

export default AdminArea;
