# VerifyBox Landing Page

A modern, responsive landing page for VerifyBox - a phone number verification service that protects your projects from fraudsters.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
landing_en/
├── src/
│   ├── components/
│   │   ├── ui/              # UI Components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── landing/         # Landing Components
│   │   │   ├── MobileHeader.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── layout/          # Layout Components
│   │   │   ├── Footer.jsx
│   │   │   └── index.js
│   │   └── legal/           # Legal Pages
│   │       ├── PrivacyPolicy.jsx
│   │       ├── TermsOfService.jsx
│   │       └── CookiePolicy.jsx
│   ├── App.jsx              # Main Component
│   ├── main.jsx             # Entry Point
│   ├── index.css            # Global Styles
│   └── Tariffs.css          # Pricing Styles
├── public/                  # Static Assets
│   ├── favicon.svg
│   ├── logo.svg
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   └── cookie-policy.html
├── index.html               # HTML Template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind Configuration
├── postcss.config.js        # PostCSS Configuration
├── vite.config.js           # Vite Configuration
└── nginx.conf               # Nginx Configuration
```

## 🎨 Technologies

- **React 18** - UI Library
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling Framework
- **PostCSS** - CSS Processing

## 🌟 Features

- **Phone Number Verification Demo** - Interactive verification module
- **Responsive Design** - Works on all devices
- **SEO Optimized** - Meta tags and structured data
- **Fast Loading** - Optimized with Vite
- **Modern UI** - Clean, professional design
- **Smooth Animations** - CSS animations and transitions
- **Legal Pages** - Privacy Policy, Terms of Service, Cookie Policy
- **Cookie Consent** - GDPR compliant cookie banner
- **Pricing Plans** - Multiple subscription tiers
- **Contact Information** - Multiple contact methods

## 🌐 Deployment

### Nginx Configuration

```nginx
server {
    server_name verifybox.tech www.verifybox.tech;
    root /path/to/landing_en/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔗 Links

- **Landing Page**: https://verifybox.tech
- **Contact Email**: verifyboxorigin@gmail.com

## 📝 Key Sections

- **Hero Section** - Main value proposition with 3D phone visualization
- **Who We Are** - Company introduction and benefits
- **How It Works** - Step-by-step verification process
- **Channels** - Supported verification methods (SMS, Call, Telegram, WhatsApp)
- **Benefits** - Key advantages and statistics
- **Demo** - Interactive phone verification demonstration
- **Pricing** - Subscription plans and comparison table
- **Contact** - Contact information and FAQ
- **Legal** - Privacy Policy, Terms of Service, Cookie Policy

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

No environment variables required for basic functionality.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2025 VerifyBox**

## 🔒 Security

This repository contains only frontend code and does not include:
- API keys or secrets
- Database configurations
- Private credentials
- Sensitive user data

All sensitive information is properly excluded via `.gitignore`.