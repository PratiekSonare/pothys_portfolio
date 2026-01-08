import { CartProvider } from './cart/CartContext'; // Adjust the path as necessary
import { TransactionProvider } from './cart/TransactionContext';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Pothys Store',
  description: 'Powered by SELTEL',
  icons: {
    icon: 'https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/sksuperlogo_32x32.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <TransactionProvider>
        <html lang="en">
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            style={{ overflowX: "hidden" }}
          >
            <main>{children}</main>
            <Toaster />
          </body>
        </html>
      </TransactionProvider>

    </CartProvider>
  );
}
