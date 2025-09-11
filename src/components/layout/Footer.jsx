import React from 'react';

const Footer = ({ onLegalPageNavigation }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto px-6 lg:px-10 mb-6">
      <div className="p-6 sm:p-8 lg:p-10 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Логотип и описание */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.svg" alt="VerifyBox" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">VerifyBox</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Reliable platform for user verification.<br />
              Simple integrations, quick setup, quality service.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/verifybox" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>


          {/* Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://t.me/verifybox" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onLegalPageNavigation?.('privacy')}
                  className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalPageNavigation?.('terms')}
                  className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalPageNavigation?.('cookies')}
                  className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-gray-200 mt-6 lg:mt-8 pt-6 lg:pt-8">
          <div className="flex justify-center">
            <div className="text-sm text-gray-500">
              &copy; {currentYear} VerifyBox. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
