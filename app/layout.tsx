import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from './AuthProvider'
import { NavBar } from './NavBar'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InnoSpace - Room Reservation System',
  description: 'Book innovative meeting spaces for your team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Script src="https://static.line-scdn.net/liff/edge/2/sdk.js" />
        <Script id="liff-init">
          {`
            function initializeLiff() {
              liff.init({
                liffId: "${process.env.NEXT_PUBLIC_LIFF_ID}"
              }).then(() => {
                if (!liff.isLoggedIn()) {
                  liff.login();
                } else {
                  liff.getProfile().then(profile => {
                    localStorage.setItem('lineUserId', profile.userId);
                  });
                }
              }).catch((err) => {
                console.error('LIFF initialization failed', err);
              });
            }

            if (typeof liff !== 'undefined') {
              initializeLiff();
            } else {
              document.addEventListener('DOMContentLoaded', initializeLiff);
            }
          `}
        </Script>
        <AuthProvider>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 InnoSpace. All rights reserved.</p>
              <div className="mt-4 flex justify-center space-x-4">
                <a href="#" className="hover:text-purple-400 transition duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-purple-400 transition duration-300">Terms of Service</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}

