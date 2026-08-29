import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import api from '../../api';
import type { Post, PostsListResponse, PostsSearchResponse } from '../../types';
import PostCard from '../../components/PostCard/PostCard';
import Loading from '../../components/Loading/Loading';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;

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

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.surface};
    border-color: ${({ theme }) => theme.colors.dark.border};
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ResultCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.text)};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryBorder : theme.colors.primaryBorder};
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primaryBorder : theme.colors.primaryLight};
  }

  &:disabled {
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.dark.surface};
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.dark.border};
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.dark.text)};
  }
`;

const PaginationEllipsis = styled.span`
  color: ${({ theme }) => theme.colors.secondary};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const PaginationPageGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PAGE_LIMIT = 10;

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_LIMIT));

  const fetchPosts = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PostsListResponse>('/posts', {
        params: {
          page,
          limit: PAGE_LIMIT,
        },
      });
      const data = response.data;
      setPosts(data.posts || []);
      setTotalPosts(data.total || 0);
      setCurrentPage(data.page || page);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(
        'Não foi possível carregar os posts. Verifique a conexão com o servidor e se o token de acesso está correto.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPosts = useCallback(async (term: string) => {
    if (!term.trim()) {
      setIsSearching(false);
      fetchPosts(1);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const response = await api.get<PostsSearchResponse>('/posts/search', {
        params: {
          search: term,
        },
      });
      const data = response.data;
      const foundPosts = data.posts || [];
      setPosts(foundPosts);
      setTotalPosts(foundPosts.length);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error searching posts:', err);
      setError(
        'Não foi possível realizar a busca. Verifique a conexão com o servidor.',
      );
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        searchPosts(searchTerm);
      }, 400);
      return () => clearTimeout(debounceTimer);
    } else {
      searchPosts('');
    }
  }, [searchTerm, searchPosts]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isSearching) return;
    fetchPosts(page);
  };

  if (loading) {
    return (
      <>
        <PageHeader>
          <PageTitle>Posts</PageTitle>
          <PageSubtitle>Últimas publicações do blog</PageSubtitle>
        </PageHeader>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="🔍 Buscar posts por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <Loading message="Carregando posts..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader>
          <PageTitle>Posts</PageTitle>
          <PageSubtitle>Últimas publicações do blog</PageSubtitle>
        </PageHeader>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="🔍 Buscar posts por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <ErrorState message={error} onRetry={() => searchPosts(searchTerm)} />
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Posts</PageTitle>
        <PageSubtitle>Últimas publicações do blog</PageSubtitle>
      </PageHeader>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="🔍 Buscar posts por título ou conteúdo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {posts.length > 0 ? (
        <>
          <ResultCount>
            {isSearching
              ? `Encontrados ${posts.length} ${posts.length === 1 ? 'post' : 'posts'} para "${searchTerm}"`
              : `Exibindo ${posts.length} ${totalPosts === 1 ? 'post' : 'posts'} de ${totalPosts} no total ${currentPage > 1 ? `(página ${currentPage} de ${totalPages})` : ''}`}
          </ResultCount>
          <PostsGrid>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </PostsGrid>

          {!isSearching && totalPages > 1 && (
            <Pagination aria-label="Paginação de posts">
              <PageButton
                $disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Página anterior"
              >
                ← Anterior
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1),
                )
                .map((page, index, arr) => (
                  <PaginationPageGroup key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <PaginationEllipsis>...</PaginationEllipsis>
                    )}
                    <PageButton
                      $active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Ir para página ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </PageButton>
                  </PaginationPageGroup>
                ))}
              <PageButton
                $disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Próxima página"
              >
                Próxima →
              </PageButton>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyState
          icon={isSearching ? '🔍' : '📝'}
          title={isSearching ? 'Nenhum post encontrado na busca' : 'Nenhum post encontrado'}
          message={
            isSearching
              ? `Nenhum post corresponde à busca por "${searchTerm}". Tente outros termos.`
              : 'Ainda não há posts publicados no blog. Volte mais tarde!'
          }
        />
      )}
    </>
  );
}

export default PostList;
