import { useTheme, useToggleTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { Link } from 'react-router-dom'

export default function Header() {

  const theme = useTheme();
  const darkMode = theme === 'dark';
  console.log(darkMode)
  const toggleTheme = useToggleTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll function
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="py-12 md:py-10 lg:py-12 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="logo">
            <a href="#" className="block">
              <img src={darkMode ? "./images/logo_white.png" : "./images/Logo.png"} alt="LaslesVPN" className="w-32 md:w-36 lg:w-36" />
            </a>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 lg:space-x-8">
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="hover:text-[#F53838] dark:text-white">About</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-[#F53838] dark:text-white">Features</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="hover:text-[#F53838] dark:text-white">Pricing</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }} className="hover:text-[#F53838] dark:text-white">Testimonials</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('help'); }} className="hover:text-[#F53838] dark:text-white">Help</a></li>
          </ul>

          {/* Auth buttons and Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link to="/login" className="font-medium hover:text-[#F53838] dark:text-white">Sign In</Link>
            <Link to="/register" className="inline-block py-2 px-6 border border-[#F53838] text-[#F53838] font-medium rounded-full hover:bg-[#F53838] hover:text-white transition-colors dark:hover:text-white">Sign Up</Link>
          </div>

          {/* Mobile menu button and dark mode toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              className="text-4xl md:hidden dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ≡
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
            <ul className="flex flex-col space-y-4 px-4">
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="block hover:text-[#F53838] dark:text-white">About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="block hover:text-[#F53838] dark:text-white">Features</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="block hover:text-[#F53838] dark:text-white">Pricing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }} className="block hover:text-[#F53838] dark:text-white">Testimonials</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('help'); }} className="block hover:text-[#F53838] dark:text-white">Help</a></li>
              <li><a href="#" className="block font-medium hover:text-[#F53838] dark:text-white">Sign In</a></li>
              <li><a href="#" className="inline-block py-2 px-6 border border-[#F53838] text-[#F53838] font-medium rounded-full hover:bg-[#F53838] hover:text-white transition-colors dark:hover:text-white">Sign Up</a></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}