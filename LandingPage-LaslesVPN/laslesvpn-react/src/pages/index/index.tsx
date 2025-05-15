// import { useState, useEffect } from 'react'
import './index.css'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Review from '@/components/home/Reviews';

function HomePage() {

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
      <Header />
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
                <a href="#" className="inline-flex items-center justify-center w-full md:w-60 h-12 md:h-16 bg-[#F53838] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow">
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
            <Review />
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
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default HomePage
