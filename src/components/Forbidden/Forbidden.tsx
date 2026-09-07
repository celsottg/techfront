import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';

const Wrapper = styled.div`
  width: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Code = styled.div`
  font-size: 5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.error};
  line-height: 1;
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textHighlight};
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.textHighlight};
  }
`;

const Message = styled.p`
  max-width: 520px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.6;
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.colors.dark.text};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

function Forbidden() {
  return (
    <Wrapper role="alert" aria-labelledby="forbidden-title">
      <Code aria-hidden="true">403</Code>
      <Title id="forbidden-title">Acesso negado</Title>
      <Message>
        Você está autenticado, mas não tem permissão para acessar esta área. Somente usuários com
        perfil de <strong>Professor</strong> podem gerenciar posts (criar, editar ou remover).
        Volte para a listagem ou faça login com outra conta.
      </Message>
      <Actions>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Ir para listagem de posts</Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Fazer login com outra conta</Button>
        </Link>
      </Actions>
    </Wrapper>
  );
}

export default Forbidden;
