import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import AuthProvider from "@/context/AuthContext";
import Providers from "./Providers";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "EHR Sample1",
  description: "Manage your business1",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <body>
        <AuthProvider>
          <ThemeRegistry>
            <Providers>
              <div className="bg-gray-200 min-h-screen p-1">
                {children}
              </div>
            </Providers>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
// ROOT LAYOUT