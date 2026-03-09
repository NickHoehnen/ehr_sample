"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          ...(prefersDarkMode
            ? {
                background: {
                  default: "#111827",
                  paper: "#1f2937",
                },
                primary: { main: "#60a5fa" },
                secondary: { main: "#2dd4bf" },
                error: { main: "#f87171" },
                warning: { main: "#fbbf24" },
                info: { main: "#38bdf8" },
                success: { main: "#4ade80" },
              }
            : {
                background: {
                  default: "#f9fafb",
                  paper: "#ffffff",
                },
                primary: { main: "#1976d2" },
                secondary: { main: "#00bcd4" },
                error: { main: "#d32f2f" },
                warning: { main: "#f57c00" },
                info: { main: "#0288d1" },
                success: { main: "#388e3c" },
              }),
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: prefersDarkMode ? "#374151" : "#e5e7eb",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: prefersDarkMode ? "#4b5563" : "#d1d5db",
                },
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
