<p align="center">
  <h1 align="center">🛒 NexCart E-Commerce Platform</h1>
  <p align="center">Production Full-Stack E-Commerce & Retail Shopping Web Application</p>
  <p align="center">
    <a href="https://full-stack-e-commerce-web-app-front-xi.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel" /></a>
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs" />
    <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" />
    <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />
  </p>
</p>

---

## 🌟 Live Demo
🔗 **Deployed Store**: [https://full-stack-e-commerce-web-app-front-xi.vercel.app](https://full-stack-e-commerce-web-app-front-xi.vercel.app)

---

## ✨ Overview

**NexCart** is a modern, high-performance, full-stack e-commerce platform modeled after top-tier retail platforms like Amazon and Flipkart. Built with a sleek dark/light design system, fast client-side state management, and real-time backend synchronization, NexCart supports:

- 🛒 **624 Authentic Products** across 12 distinct shopping categories with realistic market prices in INR (₹).
- 🔍 **Live Search & Autocomplete**: Real-time multi-attribute search with search history, trending suggestions, and category filters.
- ⚡ **Seamless Authentication**: 1-Click direct account creation, email/password login, and GitHub social sign-in.
- 🔐 **Protected Super Admin Dashboard**: Complete merchant portal with real-time order polling, revenue metrics, customer CRM, catalog management, and printable GST invoices.
- 🚚 **Order Tracking & Management**: Live status progression (`Accepted` ➡️ `Processing` ➡️ `Shipped` ➡️ `Delivered`) for customers.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :---- | :--------- |
| **Frontend Framework** | React 18, Vite 5, JavaScript (ESNext) |
| **Styling & Theme** | Modern Vanilla CSS Design Tokens, Glassmorphism, Dark/Light Mode |
| **Icons** | Lucide React |
| **Backend API** | Node.js, Express.js |
| **Database & Persistence** | In-Memory Database with JSON Persistence & LocalStorage Fallbacks |
| **Authentication** | JWT (JSON Web Tokens), GitHub Social Auth |
| **Build & Deployment** | Vite, Vercel (Frontend), Render (Backend API) |

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Interactive Hero & Deals**: Dynamic promotional banners, deal of the day counters, and category pills.
- **Product Catalog & Filters**: Filter by category, brand, price range, rating, discount, stock status, color, and size.
- **Product Detail Modal**: High-res product images gallery, seller information, stock availability, specs, and customer reviews.
- **Cart & Wishlist Drawers**: Real-time quantity adjustments, coupon application, save for later, and instant subtotal calculation.
- **Express Checkout**: Address selection, payment method choices (UPI, Credit/Debit Card, Net Banking, COD), QR payment options, and instant order confirmation.
- **User Orders Portal**: Track active orders, view shipment timelines, cancel orders, and download printable GST tax invoices.

### 🛡️ Merchant & Super Admin Portal
- **Real-Time Order Polling**: Syncs incoming customer orders automatically every 8 seconds across all devices.
- **Analytics & Revenue Metrics**: Live total revenue, monthly sales charts, daily order counters, and top-performing products.
- **Inventory & Product Management**: Add new products, update prices, modify stock levels, or remove items.
- **Customer CRM**: View registered customer profiles, total orders count, and spent history.
- **GST Invoice Generator**: Generate clean, professional printable invoices for any customer order.

---

## 📁 Repository Structure

```
Full-Stack-E-Commerce-Web-App/
├── src/                      # Main React Application
│   ├── components/           # Core UI Components
│   │   ├── Navbar.jsx        # Sticky navigation, search, cart & auth buttons
│   │   ├── HeroBanner.jsx    # Deals & promotional sliders
│   │   ├── ProductCatalog.jsx# Filterable product grid
│   │   ├── CartDrawer.jsx    # Shopping cart side drawer
│   │   ├── CheckoutModal.jsx # Checkout & payment gateway modal
│   │   ├── AuthModal.jsx     # Direct signup, login & GitHub social auth
│   │   ├── AdminDashboard.jsx# Restricted Super Admin panel
│   │   └── UserOrdersModal.jsx# Customer order tracking & invoices
│   ├── context/
│   │   └── ShopContext.jsx   # Global state provider
│   ├── services/
│   │   └── api.js            # Central API client & product dataset
│   ├── App.jsx               # Main App shell
│   └── main.jsx              # React DOM entry point & ErrorBoundary
├── backend/                  # Express REST API Server
│   ├── server.js             # Express API endpoints
│   ├── db.js                 # Database operations
│   └── seed.js               # Data seeder
├── public/                   # Static assets
├── vercel.json               # Vercel deployment configuration
├── vite.config.js            # Vite build setup
└── package.json              # Project dependencies & scripts
```

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 1. Clone Repository

```bash
git clone https://github.com/Revu-15/Full-Stack-E-Commerce-Web-App.git
cd Full-Stack-E-Commerce-Web-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
# Start Frontend Dev Server (Port 3000)
npm run dev

# (Optional) Start Backend Express Server (Port 5000)
npm run backend
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔒 Security & Privacy

- **Protected Admin Panel**: Super Admin credentials are strictly authenticated and never hardcoded or displayed publicly on login screens.
- **Isolated User Sessions**: Order history and user profiles are tied to specific authenticated user tokens.
- **Sanitized Input Handling**: Runtime validation on all search, checkout, and registration forms.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

Developed with ❤️ by [Revu-15](https://github.com/Revu-15).
