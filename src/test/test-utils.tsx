import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

interface WrapperProvidersProps {
  children: React.ReactNode;
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialIndex?: MemoryRouterProps['initialIndex'];
}

function WrapperProviders({
  children,
  initialEntries,
  initialIndex,
}: WrapperProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter
        initialEntries={initialEntries || ['/']}
        initialIndex={initialIndex ?? 0}
      >
        {children}
      </MemoryRouter>
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: MemoryRouterProps['initialEntries'];
    initialIndex?: MemoryRouterProps['initialIndex'];
  },
) => {
  const { initialEntries, initialIndex, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: (props) => (
      <WrapperProviders
        {...props}
        initialEntries={initialEntries}
        initialIndex={initialIndex}
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
  },
) => {
  const { initialEntries, ...renderOptions } = options || {};
  return render(
    <Routes>
      <Route path={path} element={pageElement} />
    </Routes>,
    {
      wrapper: (props) => (
        <WrapperProviders {...props} initialEntries={initialEntries} />
      ),
      ...renderOptions,
    },
  );
};

export * from '@testing-library/react';
export { customRender as render, renderPage };
export { default as userEvent } from '@testing-library/user-event';
