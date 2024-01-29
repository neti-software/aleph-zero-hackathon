import { Viewport } from 'next'
import { PropsWithChildren } from 'react'

import { Analytics } from '@vercel/analytics/react'

import { ToastConfig } from '@/app/toast-config'
import ResponsiveAppBar from '@/components/ui/app-bar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { env } from '@/config/environment'

import './globals.css'
import ClientProviders from './providers'

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

// export const metadata: Metadata = {
//   title: 'ALEPH-ESIM',
//   description: 'Full-Stack DApp Boilerplate for ink! Smart Contracts',
//   metadataBase: new URL(env.url),
//   robots: env.isProduction ? 'all' : 'noindex,nofollow',
//   openGraph: {
//     type: 'website',
//     locale: 'en',
//     url: env.url,
//     siteName: 'ALEPH-ESIM',
//     images: [
//       {
//         url: '/images/inkathon-og-banner.jpg',
//         width: 1280,
//         height: 640,
//       },
//     ],
//   },
//   twitter: {
//     site: '@scio_xyz',
//     creator: '@scio_xyz',
//     card: 'summary_large_image',
//   },
// }

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-[#14202a]">
        <ClientProviders>
          <TooltipProvider>
            <ResponsiveAppBar />
            {children}
          </TooltipProvider>

          <ToastConfig />
        </ClientProviders>

        {!!env.isProduction && <Analytics />}
      </body>
    </html>
  )
}
