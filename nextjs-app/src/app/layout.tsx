import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGNAL_LOSS // Solana Darkpool',
  description: 'Decentralized AI-intent execution protocol. Encrypted intents. AI listen nodes. Darkpool competition. Atomic settlement.',
  keywords: ['Solana', 'darkpool', 'MEV', 'ZK', 'AI', 'execution'],
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="sl-scanlines antialiased">
        {children}
      </body>
    </html>
  );
}
