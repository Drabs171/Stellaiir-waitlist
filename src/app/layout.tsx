import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import fs from 'fs';
import path from 'path';

// Read critical CSS for inlining
const getCriticalCSS = () => {
  try {
    const criticalPath = path.join(process.cwd(), 'src/styles/critical.css')
    return fs.readFileSync(criticalPath, 'utf8')
  } catch {
    return ''
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stellaiir - AI-Powered Genetic Analysis Platform",
    template: "%s | Stellaiir"
  },
  description: "Revolutionary AI technology for genetic analysis and personalized medicine. Join our waitlist to be among the first to access cutting-edge genomic insights with 99.9% accuracy.",
  keywords: ["AI", "genetics", "genomics", "personalized medicine", "genetic analysis", "DNA", "HIPAA compliant", "precision medicine", "genetic testing"],
  authors: [{ name: "Stellaiir Team", url: "https://stellaiir.com" }],
  creator: "Stellaiir",
  publisher: "Stellaiir",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stellaiir.com'),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Stellaiir - AI-Powered Genetic Analysis Platform",
    description: "Revolutionary AI technology for genetic analysis and personalized medicine. Join our waitlist to be among the first to access cutting-edge genomic insights.",
    url: 'https://stellaiir.com',
    siteName: 'Stellaiir',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Stellaiir - AI-Powered Genetic Analysis Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stellaiir - AI-Powered Genetic Analysis Platform',
    description: 'Revolutionary AI technology for genetic analysis and personalized medicine. Join our waitlist today.',
    images: ['/og-image.jpg'],
    creator: '@Stellaiir',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stellaiir",
    "description": "Revolutionary AI technology for genetic analysis and personalized medicine",
    "url": "https://stellaiir.com",
    "logo": "https://stellaiir.com/logo.png",
    "foundingDate": "2024",
    "industry": "Biotechnology",
    "slogan": "Unlock Your Genetic Potential with AI",
    "knowsAbout": [
      "Artificial Intelligence",
      "Genetic Analysis", 
      "Genomics",
      "Personalized Medicine",
      "DNA Sequencing",
      "Precision Medicine"
    ],
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Stellaiir Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI-Powered Genetic Analysis",
            "description": "Advanced algorithms identify genetic mutations and health risks with 99.9% accuracy"
          }
        }
      ]
    }
  }

  const criticalCSS = getCriticalCSS()

  return (
    <html lang="en" className="no-js">
      <head>
        {/* Enable JavaScript detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');`
          }}
        />
        
        {/* Critical CSS - inline for instant rendering */}
        {criticalCSS && (
          <style
            dangerouslySetInnerHTML={{ __html: criticalCSS }}
          />
        )}
        
        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Stellaiir" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        
        {/* Resource hints */}
        <link rel="dns-prefetch" href="//hcaptcha.com" />
        <link rel="preconnect" href="https://hcaptcha.com" crossOrigin="anonymous" />
        <link rel="preload" href="/offline.html" as="document" />
        
        {/* Viewport and compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark light" />
        
        {/* Performance hints */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .catch(() => console.log('Service worker registration failed'));
                });
              }
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* No-script fallback message */}
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#1f2937',
            color: 'white',
            padding: '12px',
            textAlign: 'center',
            fontSize: '14px',
            zIndex: 9999,
            borderBottom: '1px solid #374151'
          }}>
            ⚡ Enhanced features require JavaScript. Basic functionality is available.
          </div>
        </noscript>
        
        {children}
        

        
        {/* Load non-critical CSS asynchronously */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Load non-critical CSS after page load
              window.addEventListener('load', () => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/_next/static/css/non-critical.css';
                document.head.appendChild(link);
              });
            `
          }}
        />
      </body>
    </html>
  );
}
