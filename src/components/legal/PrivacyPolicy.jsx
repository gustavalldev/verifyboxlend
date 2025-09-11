import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 2024</p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            VerifyBox ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">2.1 Information You Provide</h3>
          <p className="text-gray-700 mb-4">
            We may collect information that you voluntarily provide to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Contact information (name, email address, phone number)</li>
            <li>Communication data when you contact us</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">2.2 Information We Collect Automatically</h3>
          <p className="text-gray-700 mb-4">
            When you visit our website, we may automatically collect certain information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our website</li>
            <li>Referring website</li>
            <li>Device information</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Provide and maintain our services</li>
            <li>Improve our website and services</li>
            <li>Communicate with you</li>
            <li>Analyze usage patterns and trends</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Remember your preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve website functionality</li>
            <li>Provide personalized content</li>
          </ul>
          <p className="text-gray-700 mb-4">
            You can control cookies through your browser settings, but disabling cookies may affect website functionality.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>With service providers who assist us in operating our website</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Our services are available worldwide. Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> verifyboxorigin@gmail.com</p>
            <p className="text-gray-700"><strong>Website:</strong> <a href="/" className="text-blue-600 hover:text-blue-800">verifybox.tech</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
