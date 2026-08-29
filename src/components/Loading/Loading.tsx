import styled from 'styled-components';

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.primaryLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

interface LoadingProps {
  message?: string;
}

function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <LoadingWrapper>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingWrapper>
  );
}

export default Loading;
