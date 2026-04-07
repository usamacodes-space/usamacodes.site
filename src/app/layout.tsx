import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
import { SITE_EMAIL, SITE_HOST, SITE_URL } from '@/lib/site';
import { Providers } from './providers';
import './globals.css';

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Usama Shafique | AI & Backend Software Engineer | usamacodes.space',
    template: '%s | Usama Shafique',
  },
  description:
    'Official portfolio of Usama Shafique — Backend & AI-integrated software engineer in Stoke-on-Trent, UK. NestJS, PostgreSQL, LangChain, RAG, and full-stack projects. Hire Usama for remote or hybrid roles.',
  keywords: [
    'Usama Shafique',
    'Usama',
    'usamacodes',
    SITE_HOST,
    'Backend engineer UK',
    'AI software engineer',
    'NestJS developer',
    'LangChain developer',
    'portfolio',
    'Stoke-on-Trent developer',
    'Keele University MSc AI',
  ],
  authors: [{ name: 'Usama Shafique', url: siteUrl }],
  creator: 'Usama Shafique',
  publisher: 'Usama Shafique',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: 'Usama Shafique — Portfolio',
    title: 'Usama Shafique | AI-Integrated Software Engineer',
    description:
      'Backend & AI engineer. Explore projects, stack, and experience — or ask the on-site AI assistant.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Usama Shafique portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Usama Shafique | AI-Integrated Software Engineer',
    description: `Backend & AI engineer — portfolio and AI assistant at ${SITE_HOST}`,
    images: ['/og-image.svg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteUrl },
  category: 'technology',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Usama Shafique',
  jobTitle: 'Backend & AI-Integrated Software Engineer',
  url: siteUrl,
  email: SITE_EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Stoke-on-Trent', addressCountry: 'UK' },
  sameAs: [
    'https://linkedin.com/in/usamacodes-space',
    'https://github.com/usamacodes-space',
    'https://twitter.com/usama_codes',
  ],
  knowsAbout: ['NestJS', 'PostgreSQL', 'Docker', 'LangChain', 'FastAPI', 'React', 'Next.js', 'TypeScript'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body className={`${jetbrainsMono.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
