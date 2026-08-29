import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import Button from '../Button/Button';

const HeaderContainer = styled.header`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.colors.dark.background};
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const HeaderContent = styled.div`
  max-width: 1126px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryBorder};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavLinkStyled = styled(Link)<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.dark.text)};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const MobileButtonText = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobilePlusIcon = styled.span`
  @media (min-width: calc(768px + 1px)) {
    display: none;
  }
`;

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo to="/">TechFront</Logo>
          <Nav>
            <NavLinkStyled to="/" $active={isHome}>
              Posts
            </NavLinkStyled>
          </Nav>
        </LeftSection>
        <RightSection>
          <Link to="/posts/create" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" aria-label="Criar novo post">
              <MobilePlusIcon aria-hidden="true">+</MobilePlusIcon>
              <MobileButtonText>Novo Post</MobileButtonText>
            </Button>
          </Link>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
