import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#aa3bff',
    primaryLight: 'rgba(170, 59, 255, 0.1)',
    primaryBorder: 'rgba(170, 59, 255, 0.5)',
    secondary: '#6b6375',
    text: '#6b6375',
    textHighlight: '#08060d',
    background: '#ffffff',
    surface: '#f4f3ec',
    border: '#e5e4e7',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    dark: {
      text: '#9ca3af',
      textHighlight: '#f3f4f6',
      background: '#16171d',
      surface: '#1f2028',
      border: '#2e303a',
    },
  },
  typography: {
    fontFamily: {
      sans: "system-ui, 'Segoe UI', Roboto, sans-serif",
      heading: "system-ui, 'Segoe UI', Roboto, sans-serif",
      mono: 'ui-monospace, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },
};

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    color-scheme: light dark;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    width: 100%;
    min-height: 100vh;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
    letter-spacing: 0.18px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background 0.3s, color 0.3s;

    @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.textHighlight};
    line-height: 1.2;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
    letter-spacing: -1.68px;
    margin: ${({ theme }) => theme.spacing.xl} 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
      font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
      margin: ${({ theme }) => theme.spacing.lg} 0;
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    line-height: 1.18;
    letter-spacing: -0.24px;
    margin: 0 0 ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
  }

  p {
    margin: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryBorder};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background: ${({ theme }) => theme.colors.dark.background};
      color: ${({ theme }) => theme.colors.dark.text};
    }

    h1, h2, h3, h4, h5, h6 {
      color: ${({ theme }) => theme.colors.dark.textHighlight};
    }
  }
`;

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryBorder: string;
      secondary: string;
      text: string;
      textHighlight: string;
      background: string;
      surface: string;
      border: string;
      error: string;
      success: string;
      warning: string;
      dark: {
        text: string;
        textHighlight: string;
        background: string;
        surface: string;
        border: string;
      };
    };
    typography: {
      fontFamily: {
        sans: string;
        heading: string;
        mono: string;
      };
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
      };
      fontWeight: {
        light: number;
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      laptop: string;
      desktop: string;
    };
  }
}
