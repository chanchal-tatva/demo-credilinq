import Footer from '@/components/footer';
import Header from '@/components/header';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import ThemeRegistry from '../../MUITheme/ThemeRegistry';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'SME Health - Get Started',
  description: 'SME HealthCheck - Get Started',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Header />
          {children}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
