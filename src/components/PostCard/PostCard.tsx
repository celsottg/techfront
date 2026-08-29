import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';

const CardLink = styled(Link)`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: inherit;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    color: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.surface};
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const CardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;
  line-height: 1.3;
  transition: color 0.2s;

  ${CardLink}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const CardMeta = styled.div`
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

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const ReadMore = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
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

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const updated = isUpdated(post.data_publicacao, post.data_atualizacao);

  return (
    <CardLink to={`/posts/${post.id}`} aria-label={`Ler mais sobre ${post.titulo}`}>
      <CardHeader>
        <CardTitle>{post.titulo}</CardTitle>
        <CardMeta>
          <MetaItem>📅 Publicado em {formatDate(post.data_publicacao)}</MetaItem>
          {updated && (
            <UpdatedBadge>✏️ Atualizado em {formatDate(post.data_atualizacao)}</UpdatedBadge>
          )}
        </CardMeta>
      </CardHeader>
      <CardContent>
        <p>{post.conteudo}</p>
      </CardContent>
      <ReadMore>
        Ler mais →
      </ReadMore>
    </CardLink>
  );
}

export default PostCard;
