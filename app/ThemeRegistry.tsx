// app/ThemeRegistry.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes'; // Replaced useMediaQuery

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // DEBUG LAYOUT
  const themeDev = false; 

  const { resolvedTheme } = useTheme(); // Pull the theme from next-themes
  const [mounted, setMounted] = useState(false);

  // Wait until mounted on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we should show dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  // --- EMOTION CACHE SETUP STAYS EXACTLY THE SAME ---
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });
  // --------------------------------------------------

  // Create the new harmonious theme palette
  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: isDarkMode ? 'dark' : 'light', // Use our new boolean here
            primary: themeDev 
              ? { main: '#FF0000', light: '#FF6666', dark: '#CC0000' }
              : {
                  main: isDarkMode ? '#38bdf8' : '#0284c7',
                  light: isDarkMode ? '#7dd3fc' : '#0ea5e9',
                  dark: isDarkMode ? '#0284c7' : '#0369a1',
                },
            secondary: themeDev 
              ? { main: '#0044FF', light: '#6699FF', dark: '#0022CC' }
              : {
                  main: isDarkMode ? '#34d399' : '#059669',
                  light: isDarkMode ? '#6ee7b7' : '#10b981',
                  dark: isDarkMode ? '#059669' : '#047857',
                },
            background: themeDev 
              ? { 
                  default: '#001f3f',
                  paper: '#85144b'
                }
              : {
                  default: isDarkMode ? '#0f172a' : '#f8fafc',
                  paper: isDarkMode ? '#1e293b' : '#ffffff',
                },
            text: themeDev 
              ? { 
                  primary: '#FFFFFF',
                  secondary: '#FFDC00'
                }
              : {
                  primary: isDarkMode ? '#f1f5f9' : '#0f172a',
                  secondary: isDarkMode ? '#94a3b8' : '#64748b',
                },
            divider: themeDev ? '#00FFFF' : (isDarkMode ? '#334155' : '#e2e8f0'),
          },
          typography: {
            fontFamily: 'inherit',
            button: { textTransform: 'none', fontWeight: 600 },
          },
          shape: {
            borderRadius: 12,
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  borderRadius: '8px',
                  boxShadow: 'none',
                  border: themeDev ? '1px solid #00FFFF' : 'none',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  },
                },
              },
            },
            MuiCard: {
              styleOverrides: {
                root: {
                  backgroundImage: 'none',
                  boxShadow: isDarkMode
                    ? '0 4px 6px -1px rgb(0 0 0 / 0.5)'
                    : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  border: themeDev 
                    ? '2px solid #00FFFF' 
                    : `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                },
              },
            },
            MuiPaper: {
              styleOverrides: {
                root: {
                  backgroundImage: 'none',
                  border: themeDev ? '1px solid #00FFFF' : 'none',
                },
              },
            },
            MuiAppBar: {
              styleOverrides: {
                root: {
                  backgroundColor: themeDev 
                    ? '#FF4136'
                    : (isDarkMode ? '#0f172a' : '#ffffff'),
                  color: themeDev 
                    ? '#FFFFFF' 
                    : (isDarkMode ? '#f1f5f9' : '#0f172a'),
                  backgroundImage: 'none',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  borderBottom: themeDev 
                    ? '2px solid #00FFFF' 
                    : `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                },
              },
            },
          },
        })
      ),
    [isDarkMode, themeDev] // Updated dependency array
  );

  // Note: To prevent a flash of unstyled content during SSR, we render the children immediately,
  // but the MUI theme will update once the client mounts.
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}