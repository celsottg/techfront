import styled from 'styled-components';

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const EmptyMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 400px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
}

function EmptyState({
  icon = '📝',
  title = 'Nenhum post encontrado',
  message = 'Ainda não há posts publicados. Volte mais tarde!',
}: EmptyStateProps) {
  return (
    <EmptyWrapper>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyMessage>{message}</EmptyMessage>
    </EmptyWrapper>
  );
}

export default EmptyState;
