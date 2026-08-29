import styled from 'styled-components';
import type { ReactNode } from 'react';

const MainContainer = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1126px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return <MainContainer>{children}</MainContainer>;
}

export default MainContent;
