# youGO-mart 🇪🇹

**Premium Bilingual E-Commerce Marketplace & Direct Connection Platform for Ethiopia**

* **Founder:** Endegena Abebe  
* **Brand:** youGO-mart  
* **Brand Colors:** Primary Orange (`#F97316`), Supporting Orange (`#EA580C`), Pure White (`#FFFFFF`), Soft Background (`#FFF7F0`), Light Neutral (`#F5F5F5`)  
* **Launch Market:** Ethiopia (Addis Ababa, Hawassa, Adama, Bahir Dar, Dire Dawa, Mekelle)  
* **Languages:** English & Amharic (አማርኛ)  
* **Currency:** Ethiopian Birr (ETB)  

---

## 1. Brand Identity & Design System

youGO-mart implements a distinctive orange-and-white visual identity:
* **Primary Orange (`#F97316`) & Supporting Orange (`#EA580C`):** High-energy brand accents.
* **Pure White (`#FFFFFF`) & Soft Background (`#FFF7F0`):** Clean, generous whitespace.
* **Light Neutral (`#F5F5F5`):** Subtle borders and card surfaces. Zero dark-heavy themes or unnecessary gradients.
* **Floating Glassy Navbar:** Translucent blur backdrop (`backdrop-filter: blur(12px)`), rounded pill controls, bilingual language switcher (`EN | አማ`), and sticky elevation.
* **Strict No-Demo Policy:** Zero fake accounts, zero artificial reviews, zero hardcoded statistics. Clean, encouraging empty states when records are newly initialized.

---

## 2. Full-Stack Architecture

### Frontend (`frontend/`)
* **Framework:** Next.js 16 (App Router) with React 19 and TypeScript (Strict Mode)
* **Bundler & Build Engine:** Turbopack (Optimized production static generation for all routes)
* **Styling:** Custom CSS design system with CSS custom properties (`globals.css`)
* **State & Authentication:** React Context (`auth-context.tsx`, `language-context.tsx`)
* **Icons:** Lucide Icons
* **Bilingual Localization:** English and Amharic dictionaries for navigation, dashboards, checkout, and safety guides

### Backend (`backend/`)
* **Framework:** Python 3.11 + Django 5.1 + Django REST Framework
* **Database:** SQLite (default for development) / PostgreSQL (production configured)
* **Authentication:** Token authentication + Google OAuth endpoint (`/api/v1/auth/google/`)
* **Interactive API Documentation:** OpenAPI 3.0 & Swagger UI at `/api/docs/`
* **Modular Applications:**
  * `accounts`: Custom User model with email authentication & strict RBAC (`buyer`, `seller`, `admin`).
  * `profiles`: UserProfile with Ethiopian cities and language preferences.
  * `sellers`: SellerProfile and SellerVerification (Kebele / Business License moderation queue).
  * `categories`: Taxonomy with active product count annotations.
  * `listings`: Real product listings with image uploads, status workflow, and slug generation.
  * `orders`: Shopping Cart (`Cart`, `CartItem`) and Order Processing (`Order`, `OrderItem`) with server-side pricing validation and fulfillment management.
  * `messaging`: Real-time buyer-to-seller private conversations.
  * `notifications`: In-app notification alerts for orders, approvals, and reviews.
  * `moderation`: Administrative controls, community abuse reporting, and immutable audit logs.
  * `core`: Management commands, including `bootstrap_admin`.

---

## 3. Strict Role-Based Access Control (RBAC)

The platform enforces three distinct, non-overlapping roles:

1. **`BUYER`**:
   * Access to public marketplace, search, product details, favorites.
   * Dedicated Buyer Dashboard: Wishlist, Shopping Cart, Checkout, Order Tracking, Profile.
   * Strictly blocked from seller management and administrative consoles.

2. **`SELLER`**:
   * Access to dedicated Seller Hub: Store Profile, Product Inventory, Order Fulfillment status (`processing`, `shipped`, `delivered`), Sales Analytics, Customer inquiries.
   * Strictly blocked from buyer checkout dashboards and administrative portals.

3. **`ADMIN`**:
   * Dedicated private Administrative Console (`/admin-portal`).
   * Platform oversight, user suspension/activation, seller verification badge review, product moderation, and audit logs.
   * Protected by server-side credential challenges; cannot be claimed through public registration or OAuth.

---

## 4. Quick Start & Local Setup

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### A. Backend Setup (Django)

1. Navigate to `backend`:
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

2. Run Database Migrations:
   ```bash
   python manage.py migrate
   ```

3. Provision the Initial Administrator:
   Admin accounts cannot be registered publicly. Provision staff credentials via the secure bootstrap command:
   ```bash
   python manage.py bootstrap_admin --email admin@yougomart.et --password "YourSecureAdminPassword2026!" --name "Platform Administrator"
   ```

4. Start the Django Development Server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   * REST API: `http://127.0.0.1:8000/api/v1/`
   * Swagger Docs: `http://127.0.0.1:8000/api/docs/`

### B. Frontend Setup (Next.js)

1. Navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Development Server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

4. Run Production Build Verification:
   ```bash
   npm run build
   ```

---

## 5. Google OAuth Configuration

To configure production Google OAuth credentials:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add authorized JavaScript origins:
   * `http://localhost:3000`
   * `https://yougomart.et`
4. Add authorized redirect URIs:
   * `http://localhost:3000/auth/callback`
   * `https://yougomart.et/auth/callback`
5. Configure your environment variables in `.env` (refer to `.env.example`).
6. The backend endpoint `/api/v1/auth/google/` verifies Google credentials, assigns requested Buyer or onboarding Seller roles, and sanitizes role permissions to prevent unauthorized elevation to admin.

---

## 6. Running Automated Tests

Run backend automated test suite across authentication, authorization, cart, orders, and core features:
```bash
cd backend
python manage.py test apps.core apps.orders apps.accounts
```
Expected result: `Ran 12 tests ... OK`.

---

## 7. Application Routes

| Route | Workspace | Description |
|---|---|---|
| `/` | Public | Master landing page: 9 sections, glassy navbar, real categories, search |
| `/search` | Public | Multi-criteria product search with category, location, and price filters |
| `/listings/[slug]` | Public | Product detail page with photos, direct contact (Call/WhatsApp), and Add-to-Cart |
| `/how-it-works` | Public | Step-by-step marketplace guide for buyers and sellers |
| `/for-sellers` | Public | Merchant showcase and seller registration gateway |
| `/about-us` | Public | Founder statement and platform architectural vision |
| `/auth/login` | Public | Secure credential and Google authentication login |
| `/auth/register` | Public | Separate registration flows: Continue as Buyer or Register as Seller |
| `/buyer/dashboard` | Buyer | Dedicated buyer workspace: Cart, Wishlist, Orders, Tracking, Profile |
| `/seller/dashboard` | Seller | Dedicated seller hub: Products, Inventory, Orders, Analytics, Settings |
| `/seller/verify` | Seller | Ethiopian Kebele / Business License verification portal |
| `/admin-portal` | Admin | Private control center: User oversight, Verification, Moderation, Audit logs |

---

## 8. Founder Statement

> *"youGO-mart was created to empower Ethiopian buyers and merchants with an authentic, modern, and completely commission-free marketplace. By eliminating middleman fees, offering dedicated buyer and seller hubs, and providing direct communication, we make digital commerce accessible, fair, and trustworthy for everyone across Ethiopia."*  
> — **Endegena Abebe, Founder**

