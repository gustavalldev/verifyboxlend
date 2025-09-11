import React, { useState } from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sections = [
    { id: 'hero', title: 'Home', icon: 'home', description: 'Dashboard' },
    { id: 'who-we-are', title: 'About Us', icon: 'info', description: 'About our company' },
    { id: 'how-it-works', title: 'How It Works', icon: 'process', description: '3 simple steps' },
    { id: 'channels', title: 'Channels', icon: 'phone', description: 'SMS, calls, messengers' },
    { id: 'benefits', title: 'Benefits', icon: 'star', description: 'What business gets' },
    { id: 'detailed-benefits', title: 'About Module', icon: 'check', description: 'Detailed features' },
    { id: 'demo', title: 'Demo', icon: 'play', description: 'Try it now' },
    { id: 'pricing', title: 'Pricing', icon: 'diamond', description: 'Choose plan' },
    { id: 'contact', title: 'Contact', icon: 'message', description: 'Get in touch' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      star: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      phone: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      diamond: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      message: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      info: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      process: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      target: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      briefcase: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      play: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      ),
      check: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[iconName] || icons.home;
  };

  return (
    <div className={`fixed left-0 top-0 bottom-0 z-10 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    } sm:w-72 sm:left-6 sm:top-10 sm:bottom-10`}>
      <div className="bg-white/80 backdrop-blur-xl rounded-r-2xl sm:rounded-2xl shadow-2xl border border-white/20 h-full flex flex-col">
        {/* Logo */}
        <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="VerifyBox" className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h1 className={`text-base sm:text-lg font-bold text-gray-900 transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            } sm:opacity-100`}>VerifyBox</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2 sm:p-3 pr-1 sm:pr-2 pb-4 sm:pb-5 space-y-3 sm:space-y-4 custom-scrollbar">
          <div className="space-y-1 sm:space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-left transition-all duration-300 group ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-indigo-50 hover:text-gray-900 hover:shadow-md hover:scale-[1.02]'
                }`}
                title={!isExpanded ? section.title : ''}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-cyan-600 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                  {getIcon(section.icon)}
                </div>
                <div className={`flex-1 transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } sm:opacity-100`}>
                  <div className="font-medium text-sm sm:text-base">{section.title}</div>
                  <div className={`text-xs ${
                    activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {section.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 space-y-1.5 sm:space-y-2">
            <button
              onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Registration'}
              className={`w-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                !isExpanded ? 'hidden' : ''
              } sm:block`}
            >
              Contact Us
            </button>
            
            {/* Mobile expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:hidden bg-gray-100 text-gray-600 py-1.5 px-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm flex items-center justify-center space-x-2"
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className={isExpanded ? 'opacity-100' : 'opacity-0'}>Collapse</span>
            </button>
          </div>

          {/* Version Info */}
          <div className={`pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          } sm:opacity-100`}>
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
              <div className="text-xs text-gray-500 mb-1">Landing Version</div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg px-2 sm:px-3 py-1 inline-block">
                v1.0
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
