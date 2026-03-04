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

// layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.className} bg-gray-200`}> 
      {/* Adding it to html helps with the 'top' overscroll area */}
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-200"> 
        <AuthProvider>
          <ThemeRegistry>
            <Providers>
              {/* Removed the extra div wrapper's background to avoid double-nesting issues */}
              <div className="min-h-screen p-1">
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