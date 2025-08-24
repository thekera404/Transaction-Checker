import './globals.css'

export const metadata = {
  title: 'Base Transaction Tracker - Live Base Mainnet Monitoring',
  description: 'Track live transactions on Base mainnet. Monitor specific wallets, view transaction details, and get real-time updates.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
