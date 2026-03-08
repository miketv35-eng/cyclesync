import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'CycleSync', template: '%s · CycleSync' },
  description: 'Plan routes, track rides, and connect with cyclists worldwide.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'CycleSync',
    description: 'The modern cycling platform',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-900 text-slate-100 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#0ea5e9', secondary: '#0f172a' } },
          }}
        />
      </body>
    </html>
  )
}
