"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // 1. Detect system preference (or you can link this to a state/context toggle)
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // const theme = React.useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode: prefersDarkMode ? "dark" : "light",
  //         ...(prefersDarkMode
  //           ? {
  //               // DARK MODE
  //               mode: 'dark',
  //               background: {
  //                 default: "#111827", // Your deep grey
  //                 paper: "#1f2937",   // Slightly lighter grey for cards
  //               },
  //               primary: { main: "#60a5fa" },   // Lightened blue for better dark-mode legibility
  //               secondary: { main: "#2dd4bf" }, // Brighter teal
  //               error: { main: "#f87171" },
  //               warning: { main: "#fbbf24" },
  //               info: { main: "#38bdf8" },
  //               success: { main: "#4ade80" },
  //             }
  //           : {
  //               // LIGHT MODE
  //               // mode: 'dark',
  //               background: {
  //                 default: "#111827", // Your deep grey
  //                 paper: "#1f2937",   // Slightly lighter grey for cards
  //               },
  //               primary: { main: "#60a5fa" },   // Lightened blue for better dark-mode legibility
  //               secondary: { main: "#2dd4bf" }, // Brighter teal
  //               error: { main: "#f87171" },
  //               warning: { main: "#fbbf24" },
  //               info: { main: "#38bdf8" },
  //               success: { main: "#4ade80" },
  //             }),
  //       },
  //       components: {
  //         MuiOutlinedInput: {
  //           styleOverrides: {
  //             root: {
  //               // This ensures the border matches your dark blue request specifically
  //               "& .MuiOutlinedInput-notchedOutline": {
  //                 borderColor: prefersDarkMode ? "#1e3a8a" : "#e5e7eb",
  //               },
  //               "&:hover .MuiOutlinedInput-notchedOutline": {
  //                 borderColor: "#1976d2", // Primary blue on hover
  //               },
  //             },
  //           },
  //         },
  //       },
  //     }),
  //   [prefersDarkMode]
  // );
  const theme = createTheme({
    palette: {
      background: {
        default: "#0c1528",
        paper: '#bcd2ff'
      },
      primary: { main: "#1976d2" },
      secondary: { main: "#c2c3c7" },
      error: { main: "#da5454" },
      warning: { main: "#ed6c02" },
      info: { main: "#0288d1" },
      success: { main: "#2e7d32" },
    },
  });

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaseline ensures the body background matches the theme instantly */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}