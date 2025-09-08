# Earthster Clone - Life Cycle Assessment Platform

A pixel-perfect clone of the Earthster.org website built with React 18, TypeScript, and Tailwind CSS.

## Project Overview

This project recreates the Earthster homepage and sign-in page as a frontend-only application, matching the original design, layout, and user experience exactly.

## Features

### 📱 **Responsive Design**
- Mobile-first approach
- Seamless experience across desktop, tablet, and mobile
- Progressive enhancement for larger screens

### 🎨 **Design System**
- Custom Earthster brand colors and design tokens
- Dark theme with cyan accent colors
- Consistent typography and spacing
- Smooth animations and transitions

### 🏗️ **Pages Implemented**
- **Homepage** (`/`) - Complete landing page with all sections
- **Sign-in** (`/signin`) - User authentication interface

### 🧩 **Components**
- Header with navigation
- Hero section with call-to-action
- Feature highlights section
- Network visualization with Earth imagery
- Productivity features showcase
- How it works interface previews
- Expandable FAQ section
- Contact form with mountain backdrop
- Footer with company information

### ⚡ **Technical Features**
- React 18 with TypeScript (strict mode)
- Modern CSS with Tailwind CSS
- Component-based architecture
- SEO-optimized meta tags and structured HTML
- Smooth animations and micro-interactions
- Cross-browser compatibility

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui components
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript strict mode

## Assets Used

The following assets were generated specifically for this project:
- `src/assets/earth-hero.jpg` - Earth visualization for hero section
- `src/assets/network-bg.jpg` - Abstract network visualization background
- `src/assets/mountain-bg.jpg` - Mountain landscape for contact section

*Note: All images are AI-generated and created specifically for this implementation.*

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd earthster-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── Header.tsx      # Site navigation
│   ├── Hero.tsx        # Landing hero section
│   ├── FeatureSection.tsx
│   ├── NetworkSection.tsx
│   ├── ProductivitySection.tsx
│   ├── HowItWorks.tsx
│   ├── FAQ.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   └── SignIn.tsx      # Sign-in page
├── assets/             # Static assets
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── index.css           # Global styles & design system
└── main.tsx           # App entry point
```

## Design System

The project implements Earthster's design language with:

- **Primary Color**: `hsl(176, 100%, 42%)` (Cyan)
- **Background**: `hsl(210, 20%, 8%)` (Dark blue-black)
- **Cards**: `hsl(210, 20%, 10%)` (Slightly lighter dark)
- **Typography**: Clean, modern font hierarchy
- **Animations**: Smooth transitions and hover effects

## SEO Optimization

- Semantic HTML structure with proper headings (h1, h2, h3)
- Comprehensive meta tags including Open Graph and Twitter Cards
- Descriptive alt attributes for all images
- Clean URL structure with React Router
- Fast loading optimized images and code splitting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- Optimized images with proper sizing
- CSS-in-JS with Tailwind for minimal bundle size
- Component lazy loading ready
- Efficient React rendering patterns

## Development Notes

This is a frontend-only implementation with:
- Mock data for all dynamic content
- Placeholder form submissions (console.log)
- Static routing without backend integration
- Responsive design that adapts to all screen sizes

## License

This project is for demonstration purposes only. All Earthster branding and design elements are property of their respective owners.