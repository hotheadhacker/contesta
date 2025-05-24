import './globals.css'

export const metadata = {
  title: 'GitAds Open-Source Spotlight Contest',
  description: 'Submit your most impactful open-source project. Gain recognition, win rewards, and join the future of ethical monetization with GitAds.',
  icons: {
    icon: '/gitAds_20250305_232426_0000.png',
    apple: '/gitAds_20250305_232426_0000.png',
  },
  openGraph: {
    title: 'GitAds Open-Source Spotlight Contest',
    description: 'Submit your most impactful open-source project. Gain recognition, win rewards, and join the future of ethical monetization with GitAds.',
    url: 'https://contest.gitads.dev',
    siteName: 'GitAds Contest',
    images: [
      {
        url: 'https://raw.githubusercontent.com/hotheadhacker/contesta/refs/heads/main/public/social-card-2.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitAds Open-Source Spotlight Contest',
    description: 'Submit your most impactful open-source project. Gain recognition, win rewards, and join the future of ethical monetization with GitAds.',
    creator: '@git_ads',
    images: ['https://raw.githubusercontent.com/hotheadhacker/contesta/refs/heads/main/public/social-card-2.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}