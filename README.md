# AquaFlow - Water Delivery Platform

A modern, premium water delivery e-commerce platform built with Next.js 15, Firebase, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:9002`

## 👨‍💼 Admin Account Setup

### Create Admin Account (Easiest Method)

1. Go to `http://localhost:9002/signup`
2. Sign up with:
   - **Email**: `admin@aquaflow.com`
   - **Password**: Your secure password
   - **Name**: Admin AquaFlow
3. Click "Create an account"
4. You'll be automatically redirected to the admin dashboard

**That's it!** The system automatically creates the admin role.

### Verify Admin Access

After signup, you should see:
- ✅ "Admin" button in the header
- ✅ Access to `/admin` dashboard
- ✅ Access to `/admin/orders` - Manage all orders
- ✅ Access to `/admin/users` - View all customers

### Admin Features

- View and manage all customer orders
- Update order statuses (Processing → Out for Delivery → Delivered)
- Cancel orders
- View customer information
- Track order analytics

## 📚 Documentation

- `QUICK_ADMIN_SETUP.md` - Quick admin setup guide
- `ADMIN_SETUP_GUIDE.md` - Detailed admin setup with multiple methods
- `IMPROVEMENTS.md` - Complete list of UI/UX improvements
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `QUICK_START.md` - Developer quick start guide

## ✨ Features

- 🎨 Premium gradient-based design
- 🌓 Dark mode support
- 🔍 Product search and filtering
- 📦 Order tracking system
- ⏰ Delivery time slot selection
- 👨‍💼 Admin dashboard
- 📱 Fully responsive
- 🎭 Smooth animations
- 🔐 Firebase authentication
- 💳 Multiple payment methods

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Genkit (for route optimization)
- **Language**: TypeScript

## 📱 Key Pages

- `/` - Homepage
- `/products` - Product catalog with search
- `/cart` - Shopping cart
- `/checkout` - Checkout with time slots
- `/track` - Order tracking
- `/admin` - Admin dashboard
- `/admin/orders` - Order management
- `/admin/users` - User management

## 🎨 Design System

- **Primary Color**: Fresh Blue (#64B5F6)
- **Accent Color**: Light Green (#A5D6A7)
- **Font**: PT Sans
- **Animations**: Fade-in, Slide-up, Scale-in
- **Effects**: Glass-morphism, Gradients, Shadows

## 🔒 Security

- Firebase Authentication
- Firestore Security Rules
- Admin role-based access control
- Secure password requirements

## 📞 Support

For detailed setup instructions, see the documentation files in the project root.
