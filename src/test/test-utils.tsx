import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { AuthProvider } from '../contexts/AuthContext';
import type { AuthState } from '../types';
import { clearAuthStorage, setAuthStorage } from '../utils/auth-storage';

interface WrapperProvidersProps {
  children: React.ReactNode;
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialIndex?: MemoryRouterProps['initialIndex'];
  auth?: Partial<AuthState> & { usuario?: { id: number; nome: string; email: string }; role?: 'PROFESSOR' | 'ALUNO'; token?: string };
}

function WrapperProviders({
  children,
  initialEntries,
  initialIndex,
  auth,
}: WrapperProvidersProps) {
  if (typeof window !== 'undefined') {
    clearAuthStorage();
    if (auth && auth.token && auth.role && auth.usuario) {
      setAuthStorage({
        token: auth.token,
        role: auth.role,
        usuario: auth.usuario,
      });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter
        initialEntries={initialEntries || ['/']}
        initialIndex={initialIndex ?? 0}
      >
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: MemoryRouterProps['initialEntries'];
    initialIndex?: MemoryRouterProps['initialIndex'];
    auth?: WrapperProvidersProps['auth'];
  },
) => {
  const { initialEntries, initialIndex, auth, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: (props) => (
      <WrapperProviders
        {...props}
        initialEntries={initialEntries}
        initialIndex={initialIndex}
        auth={auth}
      />
    ),
    ...renderOptions,
  });
};

/**
 * Renderiza páginas que usam `useParams()` definindo a Route correspondente
 * para que os path params (ex: /posts/:id/edit) sejam populados.
 */
const renderPage = (
  path: string,
  pageElement: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: MemoryRouterProps['initialEntries'];
    auth?: WrapperProvidersProps['auth'];
  },
) => {
  const { initialEntries, auth, ...renderOptions } = options || {};
  return render(
    <Routes>
      <Route path={path} element={pageElement} />
    </Routes>,
    {
      wrapper: (props) => (
        <WrapperProviders {...props} initialEntries={initialEntries} auth={auth} />
      ),
      ...renderOptions,
    },
  );
};

export * from '@testing-library/react';
export { customRender as render, renderPage };
export { default as userEvent } from '@testing-library/user-event';
