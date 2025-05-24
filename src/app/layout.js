import './globals.css'

export const metadata = {
  title: 'GitAds Open-Source Spotlight Contest',
  description: 'Submit your most impactful open-source project. Gain recognition, win rewards, and join the future of ethical monetization with GitAds.',
  icons: {
    icon: '/gitAds_20250305_232426_0000.png',
    apple: '/gitAds_20250305_232426_0000.png',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}