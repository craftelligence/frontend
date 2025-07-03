# Craftelligence Website - React Version

A modern, responsive single-page website built with React.js for Craftelligence - a tech company specializing in backend systems, AI agents, SaaS platforms, and enterprise software.

## 📁 File Structure

```
craftelligence-frontend/
├── public/
│   ├── index.html
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── Hero.js
│   │   ├── Hero.css
│   │   ├── About.js
│   │   ├── About.css
│   │   ├── Services.js
│   │   ├── Services.css
│   │   ├── Projects.js
│   │   ├── Projects.css
│   │   ├── Contact.js
│   │   ├── Contact.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Sections

1. **Hero Section** - Animated tagline with floating elements and particles
2. **About Us** - Company description with statistics and feature highlights
3. **Services** - Four main service offerings with detailed features
4. **Projects** - Portfolio highlights with technology tags and impact metrics
5. **Contact** - Enhanced contact form with company information
6. **Footer** - Comprehensive footer with social links and navigation

## 🛠️ Technologies Used

- **React 18** - Component-based UI library
- **Framer Motion** - Animation library
- **React Intersection Observer** - Scroll animations
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🎯 Key Features

### Navigation
- Non-fixed header with gradient background
- Smooth scrolling to sections
- Mobile hamburger menu
- Hover animations

### Animations
- Scroll-triggered fade-in animations
- Hover effects on cards and buttons
- Floating elements in hero section
- Parallax effects
- Loading states

### Form Handling
- React state management
- Client-side validation
- Loading states with spinners
- Success feedback
- Form reset functionality

### Enhanced UI Elements
- Gradient backgrounds
- Card-based layouts
- Technology tags
- Impact metrics
- Social media integration

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 📧 Contact Information

- **Email**: hello@craftelligence.com
- **LinkedIn**: [Craftelligence](https://www.linkedin.com/company/craftelligence)
- **Headquarters**: Jaipur, Rajasthan, India

## 🔧 Customization

### Colors
Update the CSS custom properties in `src/App.css`:
```css
:root {
    --midnight-blue: #1A1D3D;
    --electric-purple: #A259FF;
    --light-gray: #F5F5F5;
    /* ... other colors */
}
```

### Content
Edit the component files to update:
- Company information
- Service descriptions
- Project highlights
- Contact details

### Animations
Modify Framer Motion animations in component files:
```javascript
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
```

### Logo
Replace `public/logo.png` with your updated logo file (recommended size: 200x200px or larger).

## 🌐 Deployment

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect React settings

### GitHub Pages
1. Add `"homepage": "https://username.github.io/repo-name"` to package.json
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add scripts to package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy: `npm run deploy`

## 📄 License

This website is created for Craftelligence. All rights reserved.

---

**Craftelligence** - We Build. You Scale. 