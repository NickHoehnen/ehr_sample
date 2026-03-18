import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeRegistry from "./ThemeRegistry";
import AuthProvider from "@/context/AuthContext";
import Providers from "./Providers";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "EHR App",
  description: "Manage your business",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "EHR",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Tells iOS to ignore safe areas at the root level
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeRegistry>
              <Providers>
                {/* THE APP SHELL
                  This Box maps perfectly to the screen edges. 
                  Login screens, dashboard, everything sits inside this.
                */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.default",
                    color: "text.primary",
                    overflow: "hidden", // Never let this root container scroll
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