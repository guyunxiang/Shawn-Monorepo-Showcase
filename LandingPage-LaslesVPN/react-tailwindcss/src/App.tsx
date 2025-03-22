import { useState, useEffect } from 'react'
import './App.css'

// Default Dark Mode
const DEFAULTMODE = localStorage.getItem('darkMode') === 'true' || false;

function App() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [darkMode, setDarkMode] = useState(DEFAULTMODE);

  // 初始化主题模式 - 根据 localStorage 或浏览器偏好设置
  useEffect(() => {
    // 优先检查 localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    } else {
      // 检查浏览器偏好设置
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // 监听深色模式变化，更新文档和 localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // 切换深色模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Scroll function
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show button when page is scrolled beyond first screen
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowScrollTop(scrollY > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Features = () => {
    const featuresData = [
      {
        title: 'Free Plan',
        image: './images/Free.png',
        price: 'Free',
        features: ['Unlimited Bandwitch', 'Encrypted Connection', 'No Traffic Logs', 'Works on All Devices']
      },
      {
        title: 'Standard Plan',
        image: './images/Standard.png',
        price: '$9',
        period: '/ mo',
        features: ['Unlimited Bandwitch', 'Encrypted Connection', 'Yes Traffic Logs', 'Works on All Devices', 'Connect Anyware']
      },
      {
        title: 'Premium Plan',
        image: './images/Premium.png',
        price: '$12',
        period: '/ mo',
        features: ['Unlimited Bandwitch', 'Encrypted Connection', 'Yes Traffic Logs', 'Works on All Devices', 'Connect Anyware', 'Get New Features']
      }
    ];

    return featuresData.map((plan, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col h-full hover:border-[#F53838] transition-colors">
        <div className="pt-8 pb-6 px-8 flex-grow flex flex-col items-center">
          <div className="w-32 h-32 mb-6">
            <img src={plan.image} alt={plan.title} className="w-full" />
          </div>
          <h3 className="text-lg text-[#0B132A] dark:text-white font-medium my-8 transition-colors duration-300">{plan.title}</h3>
          <ul className="space-y-4 text-left w-full mb-8 pl-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4">
                {/* <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F53838] flex items-center justify-center text-white">✓</span> */}
                <img src="./images/Group 1223.png" className='w-6' alt="Success Icon"></img>
                <p className="text-sm dark:text-gray-300 transition-colors duration-300">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-8 text-center">
          <h3 className="text-lg text-[#0B132A] dark:text-white font-medium mb-4 transition-colors duration-300">
            {plan.price} {plan.period && <span className="font-normal dark:text-gray-300">{plan.period}</span>}
          </h3>
          <a href="#" className="inline-block py-3 px-16 border border-[#F53838] text-[#F53838] dark:text-[#F53838] font-bold rounded-full hover:bg-[#F53838] hover:text-white transition-colors">Select</a>
        </div>
      </div>
    ))
  }

  return (
    <>
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
                onClick={toggleDarkMode}
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

              <a href="#" className="font-medium hover:text-[#F53838] dark:text-white">Sign In</a>
              <a href="#" className="inline-block py-2 px-6 border border-[#F53838] text-[#F53838] font-medium rounded-full hover:bg-[#F53838] hover:text-white transition-colors dark:hover:text-white">Sign Up</a>
            </div>

            {/* Mobile menu button and dark mode toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={toggleDarkMode}
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
      <main className="dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <section className="hero dark:bg-gray-900">
          <div id="about" className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-[#0B132A] dark:text-white font-normal leading-tight mb-5 transition-colors">
                Want anything to be easy with <strong className="font-bold">LaslesVPN.</strong>
              </h1>
              <p className="text-base leading-relaxed mb-12 dark:text-gray-300">
                Provide a network for all your needs with ease and fun using LaslesVPN discover interesting features from us.
              </p>
              <div>
                <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="inline-flex items-center justify-center w-full md:w-60 h-12 md:h-16 bg-[#F53838] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  Get Started
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img src="./images/Illustration 1.png" alt="Illustration" className="w-full" />
            </div>
          </div>
        </section>
        <section className="mt-24 md:mt-20 mb-16 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg py-4 md:py-0 transition-colors duration-300">
              <ul className="flex flex-col md:flex-row md:py-8">
                <li className="flex items-center justify-between md:justify-center py-4 px-6 md:py-8 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 md:flex-1 transition-colors duration-300">
                  <div className="flex items-center md:gap-8">
                    <img src="./images/user.png" alt="Icon" className="w-12 h-12" />
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-[#0B132A] dark:text-white transition-colors duration-300">90+</h3>
                      <p className="text-base md:text-lg dark:text-gray-300">Users</p>
                    </div>
                  </div>
                </li>
                <li className="flex items-center justify-between md:justify-center py-4 px-6 md:py-8 md:px-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 md:flex-1 transition-colors duration-300">
                  <div className="flex items-center md:gap-8">
                    <img src="./images/location.png" alt="Icon" className="w-12 h-12" />
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-[#0B132A] dark:text-white transition-colors duration-300">30+</h3>
                      <p className="text-base md:text-lg dark:text-gray-300">Locations</p>
                    </div>
                  </div>
                </li>
                <li className="flex items-center justify-between md:justify-center py-4 px-6 md:py-8 md:px-8 md:flex-1">
                  <div className="flex items-center md:gap-8">
                    <img src="./images/Server.png" alt="Icon" className="w-12 h-12" />
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-[#0B132A] dark:text-white transition-colors duration-300">50+</h3>
                      <p className="text-base md:text-lg dark:text-gray-300">Servers</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 dark:bg-gray-900 transition-colors duration-300">
          <div id="features" className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2">
              <img src="./images/Illustration 2.png" alt="Features" className="w-full max-w-lg mx-auto" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#0B132A] dark:text-white font-medium leading-tight mb-5 transition-colors duration-300">
                We Provide Many<br /> Features You Can Use
              </h2>
              <p className="text-base leading-relaxed mb-6 dark:text-gray-300">
                You can explore the features that we provide with fun and have their own functions each feature.
              </p>
              <ul className="space-y-4">
                {['Powerfull online protection.', 'Internet without borders.', 'Supercharged VPN', 'No specific time limits.'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FAB73] flex items-center justify-center text-white">✓</span>
                    <p className="text-base dark:text-gray-300 transition-colors duration-300">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-[#FBFBFB] dark:bg-gray-800 transition-colors duration-300">
          <div id="pricing" className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#0B132A] dark:text-white font-medium leading-tight mb-5 transition-colors duration-300">
                Choose Your Plan
              </h2>
              <p className="text-base leading-relaxed dark:text-gray-300 transition-colors duration-300">
                Let's choose the package that is best for you and explore it happily and cheerfully.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Features />
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-[#FBFBFB] dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#0B132A] dark:text-white font-medium leading-tight mb-5 max-w-md mx-auto transition-colors duration-300">
              Huge Global Network of Fast VPN
            </h2>
            <p className="text-base leading-relaxed mb-12 md:mb-24 max-w-lg mx-auto dark:text-gray-300 transition-colors duration-300">
              See <strong>LaslesVPN</strong> everywhere to make it easier for you when you move locations.
            </p>

            <div className="mb-12 md:mb-24">
              <img src="./images/Huge Global.png" alt="Global Network" className="w-full max-w-4xl mx-auto" />
            </div>

            <div className="companies">
              <ul className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {['NETFLIX', 'reddit', 'amazon', 'discord', 'spotify'].map((company, index) => (
                  <li key={index}>
                    <img src={`./images/${company}.png`} alt={company} className="h-10 w-auto md:h-12" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="py-12 md:pb-24 bg-[#FBFBFB] dark:bg-gray-800 transition-colors duration-300">
          <div id="testimonials" className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#0B132A] dark:text-white font-medium leading-tight mb-5 max-w-md mx-auto transition-colors duration-300">
              Trusted by Thousands of Happy Customer
            </h2>
            <p className="text-base leading-relaxed mb-12 max-w-lg mx-auto dark:text-gray-300 transition-colors duration-300">
              These are the stories of our customers who have joined us with great pleasure when using this crazy feature.
            </p>

            <div className="flex overflow-x-auto pb-6 gap-8 md:gap-10">
              {[
                {
                  name: 'Viezh Robert',
                  icon: './images/Ellipse 175.png',
                  location: 'Warsaw, Poland',
                  rating: 4.5,
                  comment: '"Wow... I am very happy to use this VPN. It turned out to be more than my expectations and so far there has been no problem. LaslesVPN always the best."'
                },
                {
                  name: 'Yessica Christy',
                  icon: './images/Ellipse 175 (1).png',
                  location: 'Shanxi, China',
                  rating: 4.5,
                  comment: '"I like it because I like to travel far and still can connect with high speed."'
                },
                {
                  name: 'Kim Young Jou',
                  icon: './images/Ellipse 175 (2).png',
                  location: 'Seoul, South Korea',
                  rating: 4.5,
                  comment: '"This is very unusual for my business that currently requires a virtual private network that has high security."'
                }
              ].map((testimonial, index) => (
                <div key={index} className="min-w-[300px] sm:min-w-[350px] max-w-[400px] bg-white dark:bg-gray-700 p-6 border border-gray-200 dark:border-gray-600 rounded-lg flex flex-col hover:border-[#F53838] transition-colors">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <img src={testimonial.icon} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                      <div className="text-left">
                        <h3 className="font-medium text-base text-[#0B132A] dark:text-white transition-colors duration-300">{testimonial.name}</h3>
                        <p className="text-sm dark:text-gray-300">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="dark:text-white">{testimonial.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </div>
                  <p className="text-left dark:text-gray-300">{testimonial.comment}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-10">
              <div className="flex gap-2">
                <span className="w-10 h-3 bg-[#F53838] rounded-full"></span>
                <span className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></span>
              </div>
              <div className="flex gap-4">
                <button className="w-12 h-12 flex items-center justify-center border border-[#F53838] rounded-full">
                  <span className="text-[#F53838]">←</span>
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-[#F53838] border border-[#F53838] rounded-full">
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="relative dark:bg-gray-900">
          <div className="md:container mx-auto md:px-4">
            <div className="relative md:absolute md:container md:w-[calc(100vw-32px)] md:transform-[translateY(-50%)] p-8 bg-white dark:bg-gray-800 md:p-12 shadow-xl md:rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors duration-300">
              <div className="max-w-md">
                <h2 className="text-xl md:text-2xl lg:text-3xl text-[#0B132A] dark:text-white font-medium leading-tight mb-3 transition-colors duration-300">
                  Subscribe Now for Get Special Features!
                </h2>
                <p className="text-base dark:text-gray-300">
                  Let's subscribe with us and find the fun.
                </p>
              </div>
              <div>
                <a href="#" className="inline-block py-3 px-8 md:px-12 bg-[#F53838] text-white font-bold rounded-lg hover:shadow-lg transition-shadow">
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#F8F8F8] dark:bg-gray-800 pt-10 md:pt-48 pb-8 dark:text-white transition-colors duration-300">
        <div id="help" className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <div className="mb-4">
                <img src={darkMode ? "./images/logo_white.png" : "./images/Logo.png"} alt="LaslesVPN" className="w-32" />
              </div>
              <p className="mb-6 max-w-xs">
                <strong>LaslesVPN</strong> is a private virtual network that has unique features and has high security.
              </p>
              <div className="flex gap-4 mb-6">
                {['Facebook', 'Twitter', 'Instagram'].map((social, index) => (
                  <a key={index} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <img src={`./images/${social}.png`} alt={social} />
                  </a>
                ))}
              </div>
              <p className="text-gray-400 text-sm">©2025 LaslesVPN Powerd by Yunxiang Gu</p>
            </div>

            <div className="flex md:flex-1 gap-12 md:justify-end">
              <div className="w-full sm:w-auto md:mr-8">
                <h3 className="font-medium text-lg text-[#0B132A] dark:text-white mb-4">Product</h3>
                <ul className="space-y-3">
                  {['Download', 'Pricing', 'Locations', 'Server', 'Countries', 'Blog'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="hover:underline">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full sm:w-auto md:mr-8">
                <h3 className="font-medium text-lg text-[#0B132A] dark:text-white mb-4">Engage</h3>
                <ul className="space-y-3">
                  {['LaslesVPN', 'FAQ', 'Tutorials', 'About Us', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="hover:underline">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full sm:w-auto">
                <h3 className="font-medium text-lg text-[#0B132A] dark:text-white mb-4">Earn Money</h3>
                <ul className="space-y-3">
                  {['Affiliate', 'Become Partner'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="hover:underline">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed cursor-pointer bottom-6 right-6 bg-[#F53838] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}

export default App
