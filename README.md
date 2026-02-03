# ShopEase Pro - Premium E-commerce Application 🛍️✨

ShopEase Pro is a high-performance, professional e-commerce platform built with React and Vite. It features a stunning "Kinetic" aesthetic, comprehensive order management, and a robust admin dashboard, all powered by a live Supabase backend.

![ShopEase Preview](https://itsshopease.vercel.app)

## 🚀 Key Features

### ⚡ Performance & Core
*   **Lazy Loading**: Route-based code splitting using `React.lazy()` for lightning-fast initial loads.
*   **Kinetic Navigation**: Advanced "Magnetic Pill" navbar with smooth physics-based animations.
*   **Pro Responsiveness**: Adaptive side-drawer for tablets and mobile, optimized for all screen sizes.
*   **Optimized Assets**: All icons via `lucide-react` and kinetic animations via `framer-motion`.

### 🎨 Premium UI/UX
*   **"Kinetic" Design Language**: High-end monochromatic aesthetic with deep shadows and fluid transitions.
*   **Dark Mode**: Native, high-contrast dark/light theme switching.
*   **Interactive Skeletons**: Custom "Staggered" loading states for product grids and dashboard metrics.
*   **Mobile-First**: Ergonimic touch interactions, including a sleek side-panel navigation.
*   **Glassmorphism**: Subtle backdrop blurs and floating elements for a modern feel.

### 🛒 Shopping Functionality
*   **Real-time Cart**: Persistent cart management with live state updates.
*   **Checkout Flow**: Professional multi-step checkout with address pre-filling and validation.
*   **Order Success**: Celebration UI with PDF Invoice generation using `jspdf`.

### 🛠️ Administrative CMS
*   **Inventory Control**: Full CRUD support for products with dynamic category management via Supabase.
*   **Live Dashboard**: Real-time business metrics (Revenue, Users, Pending Orders) with visual trends.
*   **Order Fulfillment**: End-to-end status tracking (Placed -> Shipped -> Delivered) with mobile optimization.
*   **Secure Access**: Role-based routing protecting administrative suites.

### 🔐 Infrastructure
*   **Supabase Backend**: Real-time PostgreSQL database and authentication.
*   **Profile Sync**: Automatic user profile enrichment and profile picture synchronization.
*   **Confetti & Toasts**: High-quality feedback loops for all user actions.

## 💻 Tech Stack

**Frontend Framework:**
*   [React](https://react.dev/) (v18+)
*   [Vite](https://vitejs.dev/) (Build Tool)

**Styling & UI:**
*   [Tailwind CSS](https://tailwindcss.com/) (v4.0)
*   [Framer Motion](https://www.framer.com/motion/) (Animations)
*   [Lucide React](https://lucide.dev/) (Icons)

**State & Data:**
*   [Supabase](https://supabase.com/) (Live Backend & Auth)
*   Context API (Selective Global State)

**Utilities:**
*   `react-router-dom` (Clean Routing)
*   `react-hot-toast` (Visual Notifications)
*   `jspdf` (Dynamic Document Generation)

## 📂 Project Structure

```bash
src/
├── components/         # Premium UI components (Hero, Navbar, Modal, etc.)
│   └── ui/             # Atomic components (Skeleton, PageLoader)
├── context/            # Global State (Auth, Cart, Product, Theme)
├── lib/                # Backend Utilities (Supabase client)
├── pages/              # Route Components (Home, Product, Admin...)
│   └── admin/          # Advanced Administrative Views
├── assets/             # Global assets
├── reducer/            # Clean state logic (Cart Reducer)
└── main.jsx            # Dynamic Entry Point
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

