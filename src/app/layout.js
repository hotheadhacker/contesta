import './globals.css'

export const metadata = {
  title: 'GitAds Open-Source Spotlight Contest',
  description: 'Submit your most impactful open-source project. Gain recognition, win rewards, and join the future of ethical monetization with GitAds.',
  icons: {
    icon: '/favicon.png', // or any other valid image format
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}