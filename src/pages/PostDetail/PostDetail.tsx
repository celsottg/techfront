import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';
import type { Post } from '../../types';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';

const BackButton = styled.button`
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

const DetailWrapper = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PostHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  line-height: 1.2;
  letter-spacing: -1.68px;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    letter-spacing: -0.8px;
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UpdatedBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PostBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const PostContent = styled.section`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: 0.02em;

  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.7;
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const BackToList = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.surface};
    border-color: ${({ theme }) => theme.colors.dark.border};
    color: ${({ theme }) => theme.colors.dark.text};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
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
  max-width: 450px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const formatDate = (dateString?: string): string => {
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

const isUpdated = (dataPublicacao: string, dataAtualizacao: string): boolean => {
  const pubDate = new Date(dataPublicacao).getTime();
  const updDate = new Date(dataAtualizacao).getTime();
  return updDate - pubDate > 1000;
};

const PostNotFound = () => (
  <>
    <BackButton as={Link} to="/">
      ← Voltar para posts
    </BackButton>
    <NotFoundWrapper>
      <NotFoundIcon>🔍</NotFoundIcon>
      <NotFoundTitle>Post não encontrado</NotFoundTitle>
      <NotFoundMessage>
        O post que você está tentando acessar não existe ou foi removido.
        Verifique o endereço e tente novamente.
      </NotFoundMessage>
      <BackToList to="/">← Voltar para a listagem de posts</BackToList>
    </NotFoundWrapper>
  </>
);

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const fetchPostById = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      setPost(response.data);
    } catch (err: unknown) {
      console.error('Error fetching post:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(
            'Não foi possível carregar o post. Verifique a conexão com o servidor e o token de autenticação.',
          );
        }
      } else {
        setError(
          'Não foi possível carregar o post. Verifique a conexão com o servidor.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostById();
  }, [fetchPostById]);

  if (loading) {
    return (
      <>
        <BackButton onClick={() => navigate('/')}>
          ← Voltar para posts
        </BackButton>
        <Loading message="Carregando post..." />
      </>
    );
  }

  if (notFound) {
    return <PostNotFound />;
  }

  if (error || !post) {
    return (
      <>
        <BackButton onClick={() => navigate('/')}>
          ← Voltar para posts
        </BackButton>
        <ErrorState message={error || 'Ocorreu um erro inesperado.'} onRetry={fetchPostById} />
      </>
    );
  }

  const updated = isUpdated(post.data_publicacao, post.data_atualizacao);

  return (
    <DetailWrapper>
      <BackButton onClick={() => navigate('/')}>
        ← Voltar para posts
      </BackButton>

      <PostHeader>
        <PostTitle>{post.titulo}</PostTitle>
        <PostMeta>
          <MetaItem>📅 Publicado em {formatDate(post.data_publicacao)}</MetaItem>
          {updated && (
            <UpdatedBadge>
              ✏️ Atualizado em {formatDate(post.data_atualizacao)}
            </UpdatedBadge>
          )}
        </PostMeta>
      </PostHeader>

      <PostBody>
        <PostContent>
          <p>{post.conteudo}</p>
        </PostContent>
      </PostBody>

      <BackToList to="/">← Voltar para a listagem de posts</BackToList>
    </DetailWrapper>
  );
}

export default PostDetail;
