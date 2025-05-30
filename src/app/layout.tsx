import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";

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
      {/* Google Tag Manager - Parte do <head> */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WNRBCGZ9');
        `}
      </Script>
      
      <body className={`${inter.variable} font-inter antialiased`}>
        {/* Google Tag Manager - Parte do <body> (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WNRBCGZ9"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
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
