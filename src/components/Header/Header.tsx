import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

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

function Header() {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">TechFront</Logo>
        <Nav>
          <NavLinkStyled to="/" $active={location.pathname === '/'}>
            Posts
          </NavLinkStyled>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
