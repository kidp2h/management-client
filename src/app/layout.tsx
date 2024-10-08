import './globals.css';
import 'dayjs/locale/vi';

import { ClerkProvider } from '@clerk/nextjs';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { LoadingProvider } from '@/providers/loading-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'App',
};

dayjs.locale('vi');
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            `${geistSans.variable} ${geistMono.variable} relative min-h-screen antialiased`,
          )}
        >
          {/* <StoreProvider> */}
          <GlobalStoreProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <LoadingProvider>
                {children}

                <Toaster />
              </LoadingProvider>
            </ThemeProvider>
          </GlobalStoreProvider>
          {/* </StoreProvider> */}

          <Script src="https://www.google.com/recaptcha/api.js" />
        </body>
      </html>
    </ClerkProvider>
  );
}
