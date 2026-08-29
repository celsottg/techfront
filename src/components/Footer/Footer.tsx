import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.background};
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const FooterContent = styled.div`
  max-width: 1126px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          &copy; {new Date().getFullYear()} TechFront. Desenvolvido com React + Vite.
        </FooterText>
        <FooterText>
          Projeto de aprendizado em <FooterLink href="https://www.fiap.com.br/">FIAP</FooterLink>
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
