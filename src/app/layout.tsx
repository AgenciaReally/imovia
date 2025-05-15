import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Imovia - Encontre seu imóvel ideal",
  description: "Plataforma inteligente para encontrar o imóvel perfeito para você",
  icons: [
    { rel: 'icon', url: '/favicon.png' },
    { rel: 'apple-touch-icon', url: '/favicon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico', type: 'image/x-icon' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
        >
          {children}
          <Toaster position="top-right" richColors closeButton />  
        </ThemeProvider>
      </body>
    </html>
  );
}
