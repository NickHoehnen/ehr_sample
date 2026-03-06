import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import AuthProvider from "@/context/AuthContext";
import Providers from "./Providers";

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

// New way to handle viewports in Next.js
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents auto-zoom on input fields in iOS
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className} suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ThemeRegistry>
            {/* CssBaseline inside ThemeRegistry will handle 
                the body background color automatically based on mode */}
            <Providers>
              <div className="min-h-screen flex flex-col">
                {children}
              </div>
            </Providers>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}