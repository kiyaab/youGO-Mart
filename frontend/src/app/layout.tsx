import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { LanguageProvider } from '@/lib/language-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://yougo-mart.et'),
  title: 'youGO-mart — Commission-Free Classifieds Marketplace in Ethiopia',
  description: 'Find it. Love it. Make it yours. Discover great products near you in Addis Ababa, Hawassa, Adama, and across Ethiopia. 100% commission-free direct buying and selling.',
  keywords: 'classifieds Ethiopia, buy sell Addis Ababa, phones Ethiopia, cars Addis Ababa, youGO-mart, Endegena Abebe, free ads Ethiopia',
  openGraph: {
    title: 'youGO-mart — Commission-Free Classifieds Marketplace',
    description: 'Find it. Love it. Make it yours. Direct buyer-seller connections across Ethiopia with 0% commission.',
    url: 'https://yougo-mart.et',
    siteName: 'youGO-mart',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'youGO-mart logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="d-flex flex-column min-vh-100">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow-1">{children}</main>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
