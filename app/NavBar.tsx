'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { signOut } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function NavBar() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            InnoSpace
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex flex-row space-x-6 items-center">
              <li>
                <Link href="/" className="text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              </li>
              {!loading && (
                user ? (
                  <>
                    <li>
                      <Link href="/reservations" className="text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>My Reservations</Link>
                    </li>
                    <li className="text-gray-600">
                      {user.email}
                    </li>
                    <li>
                      <Button onClick={handleLogout} variant="ghost">Log Out</Button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/login" className="text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg z-50 overflow-y-auto"
            >
              <div className="p-4">
                <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)} className="mb-4">
                  <X />
                </Button>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="block py-2 text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  </li>
                  {!loading && (
                    user ? (
                      <>
                        <li>
                          <Link href="/reservations" className="block py-2 text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>My Reservations</Link>
                        </li>
                        <li className="text-gray-600 py-2">
                          {user.email}
                        </li>
                        <li>
                          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">Log Out</Button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link href="/login" className="block py-2 text-gray-600 hover:text-purple-600 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

