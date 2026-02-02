# ShopEase - Premium E-commerce Application 🛍️✨

ShopEase is a modern, high-performance e-commerce platform built with React and Vite. It features a premium "glassmorphism" aesthetic, comprehensive order management, and a robust admin dashboard, all powered by Supabase.

![ShopEase Preview](https://via.placeholder.com/800x400?text=ShopEase+Premium+UI)

## 🚀 Key Features

### ⚡ Performance & Core
*   **Lazy Loading**: Route-based code splitting using `React.lazy()` and `Suspense` for lightning-fast initial loads.
*   **Smart Image Loading**: Custom `<LazyImage />` component with skeleton placeholders for smooth visual transitions.
*   **SEO Engine**: Integrated `react-helmet-async` for dynamic page titles and metadata.
*   **Optimized Assets**: All icons via `lucide-react` and animations via `framer-motion`.

### 🎨 Premium UI/UX
*   **Aesthetic Design**: Minimalist, high-end design with consistent spacing and typography.
*   **Dark Mode**: Fully supported system-wide dark/light theme switching using Tailwind v4.
*   **Interactive Skeletons**: Premium "shimmer" loading states for products and tables (replacing basic spinners).
*   **Mobile-First**: Fully responsive layouts, including a custom mobile card view for the Admin Dashboard.
*   **Smooth Animations**: Page transitions, hover effects, and modal entrances powered by Framer Motion.

### 🛒 Shopping Functionality
*   **Cart System**: Real-time cart management with local storage persistence.
*   **Checkout Flow**: Multi-step checkout with address pre-filling.
*   **Pincode Validation**: Integration with India Post API to auto-fill City and State based on Pincode.
*   **Order Success**: Confetti celebration and PDF Invoice generation (`jspdf`).

### 🛠️ Admin System
*   **Dashboard**: Real-time metrics (Revenue, Users, Orders) with visualized trends.
*   **Order Management**: Detailed table view (Desktop) and card view (Mobile) for managing orders.
*   **Fulfillment**: Status updates (Placed -> Shipped -> Delivered) and order deletion.
*   **Role-Based Access**: Secure Admin-only routes protected by Supabase RLS and Context logic.

### 🔐 Authentication
*   **Supabase Auth**: Secure Email/Password login and registration.
*   **Profile Management**: User profile editing and address persistence.
*   **Session Management**: Persistent sessions with automatic refresh.

## 💻 Tech Stack

**Frontend Framework:**
*   [React](https://react.dev/) (v18)
*   [Vite](https://vitejs.dev/) (Build Tool)

**Styling & UI:**
*   [Tailwind CSS](https://tailwindcss.com/) (v4.0)
*   [Framer Motion](https://www.framer.com/motion/) (Animations)
*   [Lucide React](https://lucide.dev/) (Icons)

**State & Data:**
*   [Supabase](https://supabase.com/) (Auth & Database)
*   [Axios](https://axios-http.com/) (API Requests)
*   Context API (State Management)

**Utilities:**
*   `react-router-dom` (Routing)
*   `react-helmet-async` (SEO)
*   `react-hot-toast` (Notifications)
*   `react-hook-form` (Form Handling)
*   `jspdf` (Invoice Generation)

## 📂 Project Structure

```bash
src/
├── components/         # Reusable UI components (Card, Navbar, Modal, SEO, etc.)
│   └── ui/             # Atomic components (Skeleton, PageLoader, LazyImage)
├── context/            # Global State (Auth, Cart, Product, Theme)
├── lib/                # Utilities (Supabase client)
├── pages/              # Route Components (Home, Product, Cart, Admin...)
│   └── admin/          # Admin-specific pages
├── assets/             # Static assets
└── main.jsx            # Entry point with Providers
```

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/shopease.git
    cd shopease
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📄 License

This project is licensed under the MIT License.
