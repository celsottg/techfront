import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface ?? '#f9fafb'};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.03);
    border-color: ${({ theme }) => theme.colors.dark.border};
  }
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const RoleBadge = styled.span<{ $role: 'PROFESSOR' | 'ALUNO' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ theme, $role }) =>
    $role === 'PROFESSOR' ? theme.colors.primaryLight : '#d1fae5'};
  color: ${({ theme, $role }) =>
    $role === 'PROFESSOR' ? theme.colors.primary : theme.colors.success ?? '#065f46'};
`;

function Header() {
  const location = useLocation();
  const { isAuthenticated, role, usuario, logout } = useAuth();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname === '/admin';

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo to={isAuthenticated ? '/' : '/login'}>TechFront</Logo>
          {isAuthenticated && (
            <Nav aria-label="Navegação principal">
              <NavLinkStyled to="/" $active={isHome}>
                Posts
              </NavLinkStyled>
              {role === 'PROFESSOR' && (
                <NavLinkStyled to="/admin" $active={isAdmin}>
                  Área administrativa
                </NavLinkStyled>
              )}
            </Nav>
          )}
        </LeftSection>

        <RightSection>
          {!isAuthenticated ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">
                Entrar
              </Button>
            </Link>
          ) : (
            <>
              {usuario && role && (
                <UserInfo aria-label={`Usuário logado: ${usuario.nome}, perfil ${role}`}>
                  <UserName>{usuario.nome}</UserName>
                  <RoleBadge $role={role} aria-hidden="true">
                    {role === 'PROFESSOR' ? 'Professor' : 'Aluno'}
                  </RoleBadge>
                </UserInfo>
              )}
              <Button variant="secondary" size="sm" onClick={logout} aria-label="Sair da conta">
                Sair
              </Button>
            </>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
