import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeRegistry from "./ThemeRegistry";
import AuthProvider from "@/context/AuthContext";
import Providers from "./Providers";
import { Box, GlobalStyles } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EHR Sample1",
  description: "Manage your business1",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "EHR Sample",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className} suppressHydrationWarning>
      <body className="antialiased">
        <GlobalStyles
          styles={{
            "html, body": {
              margin: 0,
              padding: 0,
              height: "100%",
              width: "100vw",
              overflow: "hidden", // Locks the root to prevent double-scrolling
              overscrollBehavior: "none",
            },
          }}
        />

        <AuthProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme
          >
            <ThemeRegistry>
              <Providers>
                {/* Structural Shell */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: "100vw",
                    bgcolor: "background.paper",
                  }}
                >
                  {children}
                </Box>
              </Providers>
            </ThemeRegistry>
          </NextThemesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}