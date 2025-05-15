import { useTheme } from "@/context/useTheme";

export default function Footer() {

  const theme = useTheme();
  const darkMode = theme === 'dark';

  return (
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
  )
}