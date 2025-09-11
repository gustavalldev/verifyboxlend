import React, { useState, useEffect } from 'react';
import Sidebar from './components/landing/Sidebar';
import MobileHeader from './components/landing/MobileHeader';
import Footer from './components/layout/Footer';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import StatsCard from './components/ui/StatsCard';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import './Tariffs.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [demoForm, setDemoForm] = useState({
    name: '',
    phone: ''
  });
  const [isDemoFormValid, setIsDemoFormValid] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState(null);
  const [showCodeNotification, setShowCodeNotification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [modalCodeInput, setModalCodeInput] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const validatePhoneNumber = (phone) => {
    const phoneNumber = phone.replace(/\D/g, '');
    return phoneNumber.length === 10;
  };

  const handleDemoFormChange = (field, value) => {
    let newValue = value;
    
    if (field === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    const newForm = { ...demoForm, [field]: newValue };
    setDemoForm(newForm);
    
    const isBasicValid = newForm.name.trim().length > 0 && validatePhoneNumber(newForm.phone);
    
    const isFullValid = isBasicValid && (isCodeVerified || verificationCode.length === 4);
    setIsDemoFormValid(isFullValid);
  };

  const handleCodeChange = (value) => {
    const code = value.replace(/\D/g, '').slice(0, 4);
    setVerificationCode(code);
    
    const isBasicValid = demoForm.name.trim().length > 0 && validatePhoneNumber(demoForm.phone);
    const isFullValid = isBasicValid && (isCodeVerified || code.length === 4);
    setIsDemoFormValid(isFullValid);
  };

  const handlePhoneCheckmarkClick = () => {
    if (validatePhoneNumber(demoForm.phone)) {
      setShowVerificationModal(true);
    }
  };

  const handleVerificationMethodSelect = (method) => {
    setSelectedVerificationMethod(method);
  };

  const handleSendCode = () => {
    if (selectedVerificationMethod) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      setIsCodeSent(true);
      setShowCodeNotification(true);
      setShowCodeInput(true);
      
      setTimeout(() => {
        setShowCodeNotification(false);
      }, 5000);
    }
  };

  const handleModalCodeChange = (value) => {
    const code = value.replace(/\D/g, '').slice(0, 4);
    setModalCodeInput(code);
    
    if (code.length === 4 && code === generatedCode) {
      setIsCodeVerified(true);
      const isBasicValid = demoForm.name.trim().length > 0 && validatePhoneNumber(demoForm.phone);
      setIsDemoFormValid(isBasicValid);
      
      setTimeout(() => {
        setShowVerificationModal(false);
        setShowCodeInput(false);
        setModalCodeInput('');
        setSelectedVerificationMethod(null);
        setIsCodeSent(false);
      }, 1500);
    }
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (isDemoFormValid) {
      alert(`Demo form submitted!\nName: ${demoForm.name}\nPhone: ${demoForm.phone}\nCode: ${verificationCode}`);
    }
  };

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const handleLegalPageNavigation = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'privacy' ? 'privacy-policy' : page === 'terms' ? 'terms-of-service' : 'cookie-policy'}`);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted') {
      setShowCookieConsent(false);
    }
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/privacy-policy') {
      setCurrentPage('privacy');
    } else if (path === '/terms-of-service') {
      setCurrentPage('terms');
    } else if (path === '/cookie-policy') {
      setCurrentPage('cookies');
    } else {
      setCurrentPage('home');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'who-we-are', 'how-it-works', 'channels', 'benefits', 'detailed-benefits', 'demo', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeSection === 'hero') {
      let currentStep = 0;
      
      const interval = setInterval(() => {
        if (currentStep < 4) {
          setAnimatingIndex(currentStep);
          setIsAnimating(true);
          
          setTimeout(() => {
            setCodeDigits(prev => {
              const newDigits = [...prev];
              newDigits[currentStep] = Math.floor(Math.random() * 10).toString();
              return newDigits;
            });
            
            setTimeout(() => {
              setIsAnimating(false);
              setAnimatingIndex(-1);
              currentStep++;
            }, 200);
          }, 100);
        } else if (currentStep === 4) {
          currentStep++;
        } else if (currentStep === 5) {
          setCodeDigits(['', '', '', '']);
          currentStep = 0;
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [activeSection]);

  const handleSectionChange = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: '⚡',
      title: 'Quick Integration',
      description: 'Set up verification in 5 minutes with our API. Ready-to-use widgets for popular platforms.',
      gradient: 'from-cyan-400 to-indigo-600'
    },
    {
      icon: '🛡️',
      title: 'High Security',
      description: 'Protection against spam and fraud. Suspicious number blocking system and attempt limitations.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: '📊',
      title: 'Detailed Analytics',
      description: 'Track verification statistics, conversion rates, and costs. Export data in various formats.',
      gradient: 'from-cyan-400 to-indigo-600'
    },
    {
      icon: '⚙️',
      title: 'Flexible Settings',
      description: 'Customize widget appearance, message texts, and logic to fit your needs.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: '🎧',
      title: '24/7 Support',
      description: 'Our team is always ready to help with integration and solve any questions.',
      gradient: 'from-cyan-400 to-indigo-600'
    },
    {
      icon: '🌍',
      title: 'International Support',
      description: 'Phone number verification worldwide. Support for various number formats and country codes.',
      gradient: 'from-cyan-400 to-indigo-600'
    }
  ];

  const verificationMethods = [
    {
      icon: '📱',
      title: 'SMS',
      description: 'Verification code via SMS message. The most popular and reliable method.',
      gradient: 'from-cyan-400 to-indigo-600'
    },
    {
      icon: '📞',
      title: 'Voice Call',
      description: 'Automatic call with voice verification code. Alternative to SMS.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      description: 'Code delivery via WhatsApp. Convenient for messenger users.',
      gradient: 'from-green-600 to-green-700'
    },
    {
      icon: '✈️',
      title: 'Telegram',
      description: 'Verification via Telegram bot. Fast and secure.',
      gradient: 'from-cyan-400 to-indigo-600'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '1 project',
        '$5 SMS bonus',
        'API access',
        '7-day analytics',
        'Email support'
      ],
      gradient: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      name: 'Personal',
      price: '$15',
      period: 'per month',
      features: [
        '1 project',
        'Balance top-up',
        'Integrations',
        'Unlimited analytics',
        'Priority support'
      ],
      gradient: 'from-cyan-400 to-indigo-600',
      popular: true
    },
    {
      name: 'Business',
      price: '$45',
      period: 'per month',
      features: [
        '5 projects',
        'All Personal features',
        'Data export',
        'Fast processing',
        'Extended support'
      ],
      gradient: 'from-cyan-400 to-indigo-600',
      popular: false
    },
    {
      name: 'Business+',
      price: '$75',
      period: 'per month',
      features: [
        '10 projects',
        'All Business features',
        'Maximum speed',
        'Personal manager',
        '99.9% SLA'
      ],
      gradient: 'from-cyan-400 to-indigo-600',
      popular: false
    }
  ];

  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
        <PrivacyPolicy />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
        <TermsOfService />
      </div>
    );
  }

  if (currentPage === 'cookies') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
        <CookiePolicy />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="hidden lg:block">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
      
      <div className="lg:hidden">
        <MobileHeader activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
      
      <div className="sm:ml-0 lg:ml-80 pt-4 pb-4 min-h-screen flex flex-col lg:pt-4">
        <section id="hero" className="pt-28 pb-6 px-5 lg:px-10 lg:pt-6">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative overflow-hidden">

            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none">
                <path d="M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z" fill="url(#wave1)" />
                <path d="M0,150 Q250,200 500,150 T1000,150 L1000,300 L0,300 Z" fill="url(#wave2)" />
                <defs>
                  <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:items-center">

                <div className="space-y-6 sm:space-y-8 text-center sm:text-left">

                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full mx-auto sm:mx-0">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Protecting 50+ projects from fraudsters
                  </div>
                  

                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-base text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-medium">SSL</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-medium">Encryption</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Security</span>
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center sm:text-left">
                      Less spam —
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        more sales
                      </span>
                    </h1>
                  </div>
                  
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed max-w-2xl text-center sm:text-left">
                    VerifyBox confirms that applications are sent by real people. 
                    <strong className="text-gray-900 block mt-3">Add spam protection to your website forms.</strong>
                  </p>
                  

                  <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-2">87%</div>
                      <div className="text-base sm:text-lg md:text-xl text-gray-600">Successful verifications</div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 mb-2">2.3 sec</div>
                      <div className="text-base sm:text-lg md:text-xl text-gray-600">Average time</div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-2">99.9%</div>
                      <div className="text-base sm:text-lg md:text-xl text-gray-600">Uptime</div>
                    </div>
                  </div>
                  

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start">
                    <Button
                      onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Registration'}
                      variant="primary"
                      size="xl"
                      className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl md:text-2xl font-semibold w-full sm:w-auto"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Contact Us
                      </div>
                    </Button>
                    <Button
                      onClick={() => handleSectionChange('demo')}
                      variant="modern-outline"
                      size="xl"
                      className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl md:text-2xl font-semibold w-full sm:w-auto"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        View Demo
                      </div>
                    </Button>
                  </div>
                </div>
                

                <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0 mb-8 lg:mb-0">
                  <div className="relative w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] md:w-[28rem] md:h-[28rem] lg:w-[34rem] lg:h-[34rem]">

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">

                        <div className="w-56 h-[20rem] sm:w-72 sm:h-[26rem] md:w-80 md:h-[30rem] lg:w-96 lg:h-[36rem] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-[2.5rem] shadow-2xl transform rotate-[-4deg] scale-90 opacity-40">
                          <div className="absolute inset-4 bg-gradient-to-b from-slate-300 to-slate-400 rounded-[2rem] shadow-inner"></div>
                        </div>
                        

                        <div className="absolute inset-0 w-56 h-[20rem] sm:w-72 sm:h-[26rem] md:w-80 md:h-[30rem] lg:w-96 lg:h-[36rem] bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 rounded-[2.5rem] shadow-2xl transform rotate-[-10deg] scale-95">

                          <div className="absolute inset-2 bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2rem] shadow-inner"></div>
                          

                          <div className="absolute inset-4 bg-gradient-to-b from-white to-gray-50 rounded-[1.5rem] shadow-lg">
                            <div className="h-full p-3 sm:p-4 md:p-6 flex flex-col">

                              <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
                                <div className="text-xs sm:text-sm font-medium text-gray-600">9:41</div>
                                <div className="flex space-x-1">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-600">100%</div>
                              </div>
                              

                              <div className="flex-1 flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 px-1 sm:px-2 md:px-4">

                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                </div>
                                

                                <div className="text-center">
                                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">Code Sent</h3>
                                  <p className="text-xs sm:text-sm text-gray-600">Enter 4-digit code from SMS</p>
                                </div>
                                

                                <div className="flex space-x-1 sm:space-x-2">
                                  {[0, 1, 2, 3].map((index) => (
                                    <div 
                                      key={index}
                                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 rounded-lg text-center text-xs sm:text-sm md:text-lg font-bold flex items-center justify-center transition-all duration-300 ${
                                        codeDigits[index] 
                                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md' 
                                          : 'border-gray-300 bg-gray-50 text-gray-400'
                                      } ${
                                        isAnimating && index === animatingIndex 
                                          ? 'scale-110 border-blue-600 bg-blue-100' 
                                          : ''
                                      }`}
                                    >
                                      {codeDigits[index] || ''}
                                    </div>
                                  ))}
                                </div>
                                

                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                  Confirm Code
                                </button>
                                

                                <div className="text-center">
                                  <p className="text-xs text-gray-500">Didn't receive code?</p>
                                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
                                    Send Again
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    

                    <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-xl opacity-90">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-8 left-2 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-xl opacity-80">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    

                    <div className="absolute top-1/4 -right-4 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-lg opacity-60"></div>
                    <div className="absolute bottom-1/4 -left-6 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-lg opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="who-we-are" className="py-6 px-5 lg:px-10">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative overflow-hidden">

            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none">
                <path d="M0,100 Q250,50 500,100 T1000,100 L1000,300 L0,300 Z" fill="url(#wave3)" />
                <path d="M0,150 Q250,200 500,150 T1000,150 L1000,300 L0,300 Z" fill="url(#wave4)" />
                <defs>
                  <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="wave4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">

                <div className="space-y-8 text-center sm:text-left">
                  <div>
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 text-blue-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Who We Are
              </h2>
                  </div>
                  
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg text-center sm:text-left">
                    We provide a <span className="text-blue-600 font-semibold">user verification system</span> for your projects, with <span className="text-green-600 font-semibold">website builder integrations</span> and <span className="text-purple-600 font-semibold">API for custom implementation</span>.
                  </p>
                  
                  <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 max-w-lg mx-auto sm:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-xl"></div>
                    <p className="relative text-base sm:text-lg text-gray-800 leading-relaxed font-medium text-center sm:text-left">
                      <strong>Through us, getting rid of spam and implementing the system is much easier and cheaper</strong> 🚀
                    </p>
                  </div>
                </div>
                

                <div className="space-y-4 sm:space-y-6 mt-8 lg:mt-0">
                  <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Ready Integrations</h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Integrations with popular website builders and platforms
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">API for Developers</h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Powerful API for custom integration with any projects
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Simple and Cheap</h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Quick implementation and affordable prices for any business
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="how-it-works" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-12">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-100 text-green-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                <span className="text-blue-600 font-semibold">Three simple steps</span> to connect fraud protection
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="relative h-full flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 rounded-lg bg-white border-2 border-gray-900 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-900">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Create Integration</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex-1">
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">In your dashboard:</p>
                  <ul className="text-sm sm:text-base text-gray-600 space-y-1">
                    <li>• Go to "Integrations" section</li>
                    <li>• Click "Create New"</li>
                    <li>• Select website type</li>
                    <li>• Specify domain</li>
                    <li>• Copy integration link</li>
                  </ul>
                </div>
                <div className="bg-white border-2 border-gray-900 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-gray-900 font-medium">Time: 2-3 minutes</p>
                </div>
              </div>
              
              <div className="relative h-full flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 rounded-lg bg-white border-2 border-gray-900 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-900">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Add Script to Website</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex-1">
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">Integration code:</p>
                  <div className="bg-gray-900 rounded p-2 sm:p-3 text-green-400 text-xs sm:text-sm font-mono overflow-x-auto">
                    <div className="whitespace-nowrap">&lt;script src="https://verifybox.com/integration.js" defer&gt;&lt;/script&gt;</div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 mt-2">Insert into HTML HEAD section</p>
                </div>
                <div className="bg-white border-2 border-gray-900 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-gray-900 font-medium">Automatic form connection</p>
                </div>
              </div>
              
              <div className="relative h-full flex flex-col">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 rounded-lg bg-white border-2 border-gray-900 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-900">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Ready to Work</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex-1">
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">What happens:</p>
                  <ul className="text-sm sm:text-base text-gray-600 space-y-1">
                    <li>• Our system automatically connects to your forms</li>
                    <li>• Form is blocked until number verification</li>
                    <li>• User confirms their number</li>
                    <li>• Form is unlocked for submission</li>
                  </ul>
                </div>
                <div className="bg-white border-2 border-gray-900 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-gray-900 font-medium">Verification time: 2-3 sec</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="channels" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-12">
              <h2 className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Code Delivery Channels
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                Choose the <span className="text-blue-600 font-semibold">most suitable</span> method for your users
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors transform hover:scale-[1.02]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 text-center">SMS</h3>
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">from $0.09</div>
                  <div className="text-sm sm:text-base text-gray-500">per message</div>
                </div>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">5-15 sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  </div>
                <div className="mt-3 sm:mt-4 p-2 bg-green-50 rounded text-xs sm:text-sm text-green-700 text-center">
                  Привычный и быстрый способ
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors transform hover:scale-[1.02]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 text-center">Voice Call</h3>
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">from $0.03</div>
                  <div className="text-sm sm:text-base text-gray-500">per call</div>
                </div>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">10-30 sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium text-gray-900">Personal</span>
                  </div>
                  </div>
                <div className="mt-3 sm:mt-4 p-2 bg-blue-50 rounded text-xs sm:text-sm text-blue-700 text-center">
                  Надежнее и дешевле
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors transform hover:scale-[1.02]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 text-center">Telegram</h3>
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">from $0.015</div>
                  <div className="text-sm sm:text-base text-gray-500">per message</div>
                </div>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">1-3 sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium text-gray-900">Business</span>
                  </div>
                  </div>
                <div className="mt-3 sm:mt-4 p-2 bg-cyan-50 rounded text-xs sm:text-sm text-cyan-700 text-center">
                  Cost-effective for messengers
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors transform hover:scale-[1.02]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 text-center">WhatsApp</h3>
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">from $0.015</div>
                  <div className="text-sm sm:text-base text-gray-500">per message</div>
                </div>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">2-5 sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium text-gray-900">Business</span>
                  </div>
                  </div>
                <div className="mt-3 sm:mt-4 p-2 bg-green-50 rounded text-xs sm:text-sm text-green-700 text-center">
                  Cost-effective for messengers
                </div>
              </div>
            </div>
            

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-500 italic">
                * Code sending cost is approximate and depends on operator rates, so it may vary
              </p>
                </div>
            

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                No additional mailing services needed, pay for sends from your dashboard
              </p>
            </div>
          </div>
        </section>


        <section id="benefits" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-12">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-yellow-100 text-yellow-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Key Benefits
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                What <span className="text-green-600 font-semibold">you get</span> from implementing VerifyBox on your website
              </p>
            </div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div 
                className={`text-center p-4 sm:p-6 bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                  hoveredMetric === 0 
                    ? 'border-red-400 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onMouseEnter={() => setHoveredMetric(0)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">-90%</div>
                <div className="text-sm sm:text-base text-gray-500">Fake applications after implementation</div>
              </div>
              
              <div 
                className={`text-center p-4 sm:p-6 bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                  hoveredMetric === 1 
                    ? 'border-green-400 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onMouseEnter={() => setHoveredMetric(1)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">60%</div>
                <div className="text-sm sm:text-base text-gray-500">Advertising budget savings</div>
              </div>
              
              <div 
                className={`text-center p-4 sm:p-6 bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                  hoveredMetric === 2 
                    ? 'border-blue-400 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onMouseEnter={() => setHoveredMetric(2)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">+30%</div>
                <div className="text-sm sm:text-base text-gray-500">KPI of processed real applications</div>
              </div>
              
              <div 
                className={`text-center p-4 sm:p-6 bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                  hoveredMetric === 3 
                    ? 'border-purple-400 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onMouseEnter={() => setHoveredMetric(3)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">+100%</div>
                <div className="text-sm sm:text-base text-gray-500">To brand credibility</div>
              </div>
            </div>
            

            <div className="space-y-4 sm:space-y-6">
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredMetric === 0 
                    ? 'bg-red-50 border-red-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredMetric(0)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredMetric === 0 ? 'bg-red-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredMetric === 0 ? 'text-red-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">-90% fake applications</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">Our system blocks your forms until the user's phone number is confirmed, meaning 9 out of 10 fraudulent applications will be stopped before reaching your managers.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Блокировка подозрительных IP</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Ограничение запросов на отправку кода</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Защита от спамеров</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredMetric === 1 
                    ? 'bg-green-50 border-green-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredMetric(1)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredMetric === 1 ? 'bg-green-100' : 'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredMetric === 1 ? 'text-green-600' : 'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">60% advertising budget savings</h3>
                  <p className="text-gray-600 mb-3">Every fake application wastes your advertising budget. With VerifyBox you only pay for real clients. The average cost of SMS verification is $0.09-0.14, which is much cheaper than a click in an advertising campaign.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>Pay advertising budget only for real clients</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>Don't worry about spammers clicking</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredMetric === 2 
                    ? 'bg-blue-50 border-blue-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredMetric(2)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredMetric === 2 ? 'bg-blue-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredMetric === 2 ? 'text-blue-600' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">+30% KPI of processed real applications</h3>
                  <p className="text-gray-600 mb-3">Your managers no longer waste time processing fake applications. They focus on working with real clients, leading to increased sales conversion and improved service quality.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>Increased manager efficiency</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>Clean CRM</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>Verified applications</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredMetric === 3 
                    ? 'bg-purple-50 border-purple-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredMetric(3)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredMetric === 3 ? 'bg-purple-100' : 'bg-purple-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredMetric === 3 ? 'text-purple-600' : 'text-purple-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">+100% to brand credibility</h3>
                  <p className="text-gray-600 mb-3">Clients see that you care about security and quality. Phone number verification increases trust in your brand and shows that you take your business seriously.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 3 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>Increased client trust</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredMetric === 3 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>Improved brand reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="detailed-benefits" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-12">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-100 text-purple-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About the Module
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                A bit about the verification module itself
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredModule === 0 
                    ? 'bg-red-50 border-red-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredModule(0)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredModule === 0 ? 'bg-red-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredModule === 0 ? 'text-red-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Module spam protection</h3>
                  <p className="text-gray-600 mb-3">The module itself is also protected from spam, our servers have limits on code sending requests, we block frequent and suspicious requests, so your verification budget is safe.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Request limits</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Suspicious IP blocking</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>Behavior analysis</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredModule === 1 
                    ? 'bg-green-50 border-green-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredModule(1)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredModule === 1 ? 'bg-green-100' : 'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredModule === 1 ? 'text-green-600' : 'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration</h3>
                  <p className="text-gray-600 mb-3">Your integration is also securely protected, public integration links cannot be accessed outside your website, the module cannot be opened anywhere or connected to any other website not specified in the integration.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>Protected links</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>Domain restriction</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredModule === 2 
                    ? 'bg-blue-50 border-blue-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredModule(2)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredModule === 2 ? 'bg-blue-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredModule === 2 ? 'text-blue-600' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
                  <p className="text-gray-600 mb-3">Complete statistics of verifications and spam, conversions and expenses with data export capability</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>Real-time statistics</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>Excel/CSV export</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 2 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>API for integration</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredModule === 3 
                    ? 'bg-purple-50 border-purple-200 shadow-lg scale-[1.02]' 
                    : 'bg-gray-50 border-transparent'
                }`}
                onMouseEnter={() => setHoveredModule(3)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  hoveredModule === 3 ? 'bg-purple-100' : 'bg-purple-100'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    hoveredModule === 3 ? 'text-purple-600' : 'text-purple-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Settings</h3>
                  <p className="text-gray-600 mb-3">Customization of appearance and additional checks</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 3 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>Design customization</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 3 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>Multilingual</span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      hoveredModule === 3 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>IP filtering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="demo" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-12">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-red-100 text-red-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Try It Right Now
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                Enter your details and see how verification works
              </p>
            </div>
            
            <div className="max-w-sm sm:max-w-md mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-lg">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">Phone Number Verification</h3>
                  <p className="text-sm sm:text-base text-gray-600">Enter your details for demonstration</p>
                </div>
                
                <form onSubmit={handleDemoSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={demoForm.name}
                      onChange={(e) => handleDemoFormChange('name', e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={demoForm.phone}
                        onChange={(e) => handleDemoFormChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        maxLength={10}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg text-center"
                      />
                      {validatePhoneNumber(demoForm.phone) && (
                        <button
                          type="button"
                          onClick={handlePhoneCheckmarkClick}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                        </button>
                      )}
                  </div>
                  </div>
                  

                  {isCodeSent && !isCodeVerified && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Код верификации
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg text-center tracking-widest"
                      />
                    </div>
                  )}


                  {isCodeVerified && (
                    <div className="p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-sm sm:text-base text-green-700 font-semibold">Number verified!</span>
                  </div>
                </div>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={!isDemoFormValid}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 ${
                      isDemoFormValid 
                        ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isDemoFormValid ? 'Submit Form' : isCodeVerified ? 'Submit Form' : isCodeSent ? 'Enter verification code' : 'Fill in all fields'}
                  </button>
                  
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    This is a demo version. No real code will be sent. The real module has differences.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>


        <section id="pricing" className="py-6 px-5 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center sm:text-left mb-8">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-pink-100 text-pink-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-4 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                Pricing Plans
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-4 sm:mb-6 mx-auto sm:mx-0 text-center sm:text-left">
                Choose the plan that suits you best. All plans include <span className="text-purple-600 font-semibold">unlimited projects</span> and API access.
              </p>
              

              <div className="flex items-center justify-center">
                <div className="pricing-toggle bg-white border border-gray-200 p-1 rounded-xl flex flex-col sm:flex-row items-center shadow-lg gap-1 sm:gap-0">
                  <button 
                    onClick={() => setIsYearly(false)}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                      !isYearly 
                        ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setIsYearly(true)}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 relative transform hover:scale-[1.02] ${
                      isYearly 
                        ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    Annual Subscription
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-cyan-400 to-indigo-600 text-white text-xs px-1 sm:px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                      -17%
                    </span>
                  </button>
                  </div>
                </div>
            </div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 items-start">

              <div className="animate-fadeInUp tariff-card bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 p-3 sm:p-4 relative h-full flex flex-col">

                <div className="text-center pt-4 sm:pt-6 pb-3 sm:pb-4" style={{ minHeight: '120px' }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Free</h3>
                  <div className="px-2 sm:px-3" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">Free plan for testing</p>
                  </div>
                </div>


                <div className="text-center pb-4 sm:pb-6" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1" style={{
                    background: 'linear-gradient(135deg, #374151, #111827)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Free
                  </div>
                </div>


                <div className="px-3 sm:px-4 pb-4 sm:pb-6" style={{ minHeight: '240px' }}>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Projects</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Unlimited</div>
                  </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Statistics</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Today only</div>
                  </div>
                    </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">White-label</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                  </div>
                </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Voice calls</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
              </div>
            </div>
            
                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Telegram</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                    </div>
                    </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">WhatsApp</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                      </div>
                    </div>
                  </div>
                </div>
                

                <div className="px-3 sm:px-4 pb-4 sm:pb-6 mt-auto" style={{ minHeight: '100px' }}>
                  <div className="space-y-2 sm:space-y-3">
                    <button 
                      onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Pricing Plan'}
                      className="w-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Contact Us
                    </button>
                    </div>
                      </div>
                    </div>
              

              <div className="animate-fadeInUp tariff-card bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 p-3 sm:p-4 relative h-full flex flex-col" style={{ animationDelay: '0.1s' }}>

                {isYearly && (
                  <div className="absolute top-0 right-2 sm:right-3 z-10">
                    <span className="badge-savings bg-gradient-to-r from-cyan-400 to-indigo-600 text-white px-1 sm:px-2 py-1 rounded-full text-xs font-semibold shadow-lg transform -translate-y-1/2">
                      -17%
                    </span>
                  </div>
                )}


                <div className="text-center pt-4 sm:pt-6 pb-3 sm:pb-4" style={{ minHeight: '120px' }}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Starter</h3>
                  <div className="px-2 sm:px-3" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">Starter plan for small business</p>
                  </div>
                </div>
                

                <div className="text-center pb-4 sm:pb-6" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1" style={{
                    background: 'linear-gradient(135deg, #374151, #111827)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {isYearly ? '$99' : '$9.90'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">{isYearly ? 'per year' : 'per month'}</div>
                </div>


                <div className="px-3 sm:px-4 pb-4 sm:pb-6" style={{ minHeight: '240px' }}>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Projects</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Unlimited</div>
                    </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Statistics</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Last month</div>
                      </div>
                    </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">White-label</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                  </div>
                </div>
                
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Voice calls</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                    </div>
                    </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Telegram</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                      </div>
                    </div>

                    <div className="flex items-start opacity-60">
                      <svg className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">WhatsApp</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Not available</div>
                  </div>
                </div>
              </div>
            </div>
            

                <div className="px-4 pb-6 mt-auto" style={{ minHeight: '120px' }}>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Pricing Plan'}
                      className="w-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Contact Us
                    </button>
                </div>
                </div>
                </div>
              

              <div className="animate-fadeInUp tariff-card ring-2 ring-indigo-200 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 p-4 relative h-full flex flex-col" style={{ animationDelay: '0.2s' }}>

                <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                  <span className="badge-popular bg-gradient-to-r from-cyan-400 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg transform -translate-y-1/2">
                    ⭐ Popular
                  </span>
              </div>
                
                {isYearly && (
                  <div className="absolute top-0 right-3 z-10">
                    <span className="badge-savings bg-gradient-to-r from-cyan-400 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg transform -translate-y-1/2">
                      -17%
                    </span>
                  </div>
                )}


                <div className="text-center pt-6 pb-4" style={{ minHeight: '140px' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Business</h3>
                  <div className="px-3" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">Business plan for medium business</p>
          </div>
                </div>


                <div className="text-center pb-6" style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="text-3xl font-bold text-gray-900 mb-1" style={{
                    background: 'linear-gradient(135deg, #374151, #111827)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {isYearly ? '$299' : '$29.90'}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{isYearly ? 'per year' : 'per month'}</div>
            </div>
            

                <div className="px-4 pb-6" style={{ minHeight: '280px' }}>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Projects</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Unlimited</div>
                  </div>
                </div>
                
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                  <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Statistics</div>
                        <div className="text-gray-600 text-xs sm:text-sm">All time</div>
                      </div>
                  </div>
                  
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">White-label</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Voice calls</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                </div>
              </div>

                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Telegram</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
            </div>
          </div>

                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">WhatsApp</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                      </div>
                    </div>
                  </div>
            </div>
            

                <div className="px-4 pb-6 mt-auto" style={{ minHeight: '120px' }}>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Pricing Plan'}
                      className="w-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Contact Us
                    </button>
                  </div>
                </div>
            </div>
              

              <div className="animate-fadeInUp tariff-card bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 p-4 relative h-full flex flex-col" style={{ animationDelay: '0.3s' }}>

                {isYearly && (
                  <div className="absolute top-0 right-3 z-10">
                    <span className="badge-savings bg-gradient-to-r from-cyan-400 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg transform -translate-y-1/2">
                      -17%
                    </span>
                  </div>
                )}


                <div className="text-center pt-6 pb-4" style={{ minHeight: '140px' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise</h3>
                  <div className="px-3" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">Enterprise plan with custom conditions</p>
                  </div>
            </div>
            

                <div className="text-center pb-6" style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="text-3xl font-bold text-gray-900 mb-1" style={{
                    background: 'linear-gradient(135deg, #374151, #111827)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {isYearly ? 'from $1,000' : 'from $100'}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{isYearly ? 'per year' : 'per month'}</div>
                </div>


                <div className="px-4 pb-6" style={{ minHeight: '280px' }}>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Projects</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Unlimited</div>
            </div>
          </div>
                    
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Statistics</div>
                        <div className="text-gray-600 text-xs sm:text-sm">All time</div>
                      </div>
            </div>
            
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">White-label</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                    </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Voice calls</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                      </div>
                  </div>
                  
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">Telegram</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                      </div>
                  </div>
                  
                    <div className="flex items-start">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      <div>
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">WhatsApp</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Available</div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="px-4 pb-6 mt-auto" style={{ minHeight: '120px' }}>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = 'mailto:verifyboxorigin@gmail.com?subject=VerifyBox Pricing Plan'}
                      className="w-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Contact Us
                    </button>
                </div>
            </div>
      </div>
            </div>


            <div className="mt-12">
              <div className="text-left mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
                  Feature Comparison
                </h3>
                <p className="text-gray-600">
                  Detailed comparison of all pricing plan features
              </p>
            </div>
            
              <div className="overflow-x-auto">
                <table className="comparison-table w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-50 to-indigo-50">
                      <th className="border-b border-gray-200 p-3 text-left font-bold text-gray-800 text-sm">
                        <svg className="w-4 h-4 inline-block mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                        </svg>
                        Функция
                      </th>
                      <th className="border-b border-gray-200 p-3 text-center font-bold text-sm text-gray-800">
                        Free
                      </th>
                      <th className="border-b border-gray-200 p-3 text-center font-bold text-sm text-gray-800">
                        Starter
                      </th>
                      <th className="border-b border-gray-200 p-3 text-center font-bold text-sm text-gray-800">
                        Business
                      </th>
                      <th className="border-b border-gray-200 p-3 text-center font-bold text-sm text-gray-800">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {isYearly ? "Price/year" : "Price/month"}
                </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Free</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">{isYearly ? '$99' : '$9.90'}</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">{isYearly ? '$299' : '$29.90'}</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">{isYearly ? 'from $1,000' : 'from $100'}</span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m14-2a2 2 0 002-2V9a2 2 0 00-2-2" />
                          </svg>
                          Projects
              </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Unlimited</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Unlimited</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Unlimited</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Unlimited</span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Statistics
                </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Today only</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">Last month</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">All time</span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="font-medium text-gray-700">All time</span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                          </svg>
                          White-label
              </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          API
                </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          SMS
              </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call-OTP
                        </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Telegram
                        </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>


                    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-indigo-50/50 transition-all duration-200">
                      <td className="border-b border-gray-100 p-3 font-semibold text-gray-800 text-sm bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          WhatsApp
                        </div>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                      <td className="border-b border-gray-100 p-3 text-center text-sm">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        <section id="contact" className="py-6 px-5 lg:px-10 pb-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="text-center sm:text-left mb-8">
              <h2 className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-100 text-teal-800 text-2xl sm:text-3xl lg:text-4xl font-bold rounded-full mb-3 mx-auto sm:mx-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
                Contact us for support and consultations
              </p>
            </div>
            

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              <div className="bg-white/50 rounded-2xl border border-gray-200 p-4 sm:p-6 transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </h2>
                
              <div className="space-y-3 sm:space-y-4">

                  <div className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Telegram</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">@verifybox</p>
                      <a 
                        href="https://t.me/verifybox" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                      >
                        Write to Telegram
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                  </div>
                </div>
                

                  <div className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">verifyboxorigin@gmail.com</p>
                      <a 
                        href="mailto:verifyboxorigin@gmail.com" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-700 text-xs sm:text-sm font-medium"
                      >
                        Write to email
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
                


              <div className="bg-white/50 rounded-2xl border border-gray-200 p-4 sm:p-6 transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="border-l-4 border-cyan-500 pl-3 sm:pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">How to start working with the service?</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Register, choose a pricing plan and set up integration with Tilda according to our documentation.</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">What payment methods are available?</h3>
                    <p className="text-xs sm:text-sm text-gray-600">We accept payments via Stripe: bank cards, ACH, electronic wallets.</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">How fast is support?</h3>
                    <p className="text-xs sm:text-sm text-gray-600">We respond in Telegram within 1-2 hours during business hours (9:00-18:00 EST).</p>
                  </div>
                </div>
              </div>


              <div className="bg-white/50 rounded-2xl border border-gray-200 p-4 sm:p-6 transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Working Hours
                </h2>
              
              <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Technical Support</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">9:00 - 18:00 EST</span>
              </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Service works</span>
                    <span className="font-medium text-green-600 text-sm sm:text-base">24/7</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-600 text-sm sm:text-base">Weekends</span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Sat, Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        <Footer onLegalPageNavigation={handleLegalPageNavigation} />
      </div>


      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Verification Demo</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h4 className="text-2xl font-semibold text-gray-900 mb-2">Phone Number Verification</h4>
                <p className="text-gray-600 mb-4">Choose a method and verify your phone number</p>
                

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
                  <div className="text-lg font-medium text-gray-900">+1 {demoForm.phone}</div>
                </div>
              </div>
              

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={() => handleVerificationMethodSelect('sms')}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 group ${
                    selectedVerificationMethod === 'sms' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      selectedVerificationMethod === 'sms' 
                        ? 'bg-blue-200' 
                        : 'bg-blue-100 group-hover:bg-blue-200'
                    }`}>
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">SMS</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleVerificationMethodSelect('call')}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 group ${
                    selectedVerificationMethod === 'call' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      selectedVerificationMethod === 'call' 
                        ? 'bg-green-200' 
                        : 'bg-green-100 group-hover:bg-green-200'
                    }`}>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Call</span>
                  </div>
                </button>
              </div>
              

              <div className="flex items-start space-x-3 mb-6">
                <input type="checkbox" id="demo-consent" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="demo-consent" className="text-sm text-gray-600">
                  I agree to the processing of my phone number and receiving a one-time code via SMS or voice call.
                </label>
              </div>
              

              {showCodeInput && !isCodeVerified && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter code from {selectedVerificationMethod === 'sms' ? 'SMS' : 'call'}
                  </label>
                  <input
                    type="text"
                    value={modalCodeInput}
                    onChange={(e) => handleModalCodeChange(e.target.value)}
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg text-center tracking-widest"
                  />
                </div>
              )}


              {isCodeVerified && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 font-semibold">Code verified!</span>
                  </div>
                </div>
              )}


              {!showCodeInput && (
                <button 
                  onClick={handleSendCode}
                  disabled={!selectedVerificationMethod}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    selectedVerificationMethod 
                      ? 'bg-black text-white hover:bg-gray-800 transform hover:-translate-y-0.5' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCodeSent ? 'Code sent!' : 'Send code'}
                </button>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                This is a demo version. No real code will be sent
              </p>
            </div>
          </div>
        </div>
      )}


      {showCodeNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold">Code sent!</div>
              <div className="text-sm">Your code: <span className="font-mono text-lg font-bold">{generatedCode}</span></div>
            </div>
          </div>
        </div>
      )}


      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">We use cookies</h3>
                </div>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. 
                  <button 
                    onClick={() => handleLegalPageNavigation('privacy')}
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    Learn more
                  </button>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAcceptCookies}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;