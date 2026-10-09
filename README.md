# youGO-mart — Premium E-Commerce Marketplace 🇪🇹

**A modern, production-ready, bilingual e-commerce marketplace connecting buyers and sellers across Ethiopia and Africa through an intuitive, trustworthy, and secure shopping experience.**

* **Brand:** youGO-mart
* **Founder:** Endegena Abebe
* **Official Repository:** [https://github.com/kiyaab/youGO-Mart.git](https://github.com/kiyaab/youGO-Mart.git)
* **Design Identity:** Clean Orange & White Glassmorphism with Strict No-Demo Standard
* **Supported Languages:** English & Amharic (አማርኛ)

---

## 1. Brand Identity & Design System

The visual design system strictly follows youGO-mart's curated brand palette:

* **Primary Orange:** `#F97316`
* **White:** `#FFFFFF`
* **Soft Background:** `#FFF7F0`
* **Light Neutral:** `#F5F5F5`
* **Supporting Orange:** `#EA580C`
* **Dark / Black backgrounds are strictly avoided** to maintain an airy, warm, inviting, and trustworthy e-commerce aesthetic.

Key design elements:
* **Floating Glassmorphism Navbar:** Translucent background (`rgba(255, 255, 255, 0.85)`), backdrop blur (`blur(16px)`), subtle border, and rounded corners.
* **Modern Typography & Spacing:** Inter / Outfit typography, generous whitespace, soft rounded corners (`rounded-2xl`).
* **Subtle Framer Motion Animations:** Smooth page transitions, staggered hero cards, and reduced-motion accessibility support.
* **Polished Empty States & Micro-Interactions:** Honest empty states when items or orders are not yet present—no artificial statistics or mock data.

---

## 2. Platform Architecture

```
youGO-Mart/
├── backend/
│   ├── apps/
│   │   ├── accounts/      # User model, Google OAuth, JWT/Token auth & RBAC
│   │   ├── profiles/      # User profile, location, preferences
│   │   ├── sellers/       # Seller profile, verification, business data
│   │   ├── categories/    # Hierarchical product category taxonomy
│   │   ├── listings/      # Product listings, images, pricing, conditions
│   │   ├── orders/        # Shopping Cart, Cart Items, Orders, Order Items, Fulfillment
│   │   ├── favorites/     # Wishlists & saved items
│   │   ├── messaging/     # Buyer-to-seller private communications
│   │   ├── notifications/ # Event-driven notifications
│   │   ├── moderation/    # Content reporting & review queue
│   │   ├── promotions/    # Spotlight & promoted placements
│   │   └── core/          # Admin bootstrap management commands & core utils
│   ├── yougo_core/        # Django settings, WSGI, ASGI, root URLs
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx               # Homepage with 9 comprehensive landing sections
    │   │   ├── about-us/              # Dedicated About youGO-mart story & vision
    │   │   ├── for-sellers/           # Seller recruitment & onboarding overview
    │   │   ├── how-it-works/          # Step-by-step buyer & seller marketplace guide
    │   │   ├── buyer/dashboard/       # Dedicated Buyer workspace (Cart, Orders, Wishlist)
    │   │   ├── seller/dashboard/      # Dedicated Seller workspace (Products, Inventory, Orders)
    │   │   ├── admin-portal/          # Secured Administrator Control Center
    │   │   ├── auth/login/            # Sign In with Google OAuth & Email
    │   │   ├── auth/register/         # Distinct Buyer & Seller registration pathways
    │   │   ├── search/                # Product discovery & filter search
    │   │   └── listings/[slug]/       # Product detail page
    │   ├── components/
    │   │   ├── layout/Navbar.tsx      # Floating glassmorphic navigation bar
    │   │   ├── layout/Footer.tsx      # Bilingual footer with policies & controls
    │   │   └── home/                  # 9 modular landing sections
    │   └── lib/
    │       ├── api.ts                 # Full DRF API client with Cart & Orders support
    │       ├── auth-context.tsx       # Auth provider with Google OAuth & RBAC
    │       └── language-context.tsx   # Bilingual English & Amharic i18n dictionary
    ├── package.json
    └── next.config.ts
```

---

## 3. Strict Role-Based Access Control (RBAC)

The platform strictly enforces three distinct roles validated on the server:

1. **`BUYER`**:
   * Access to shopping cart, checkout, order tracking, wishlist, order history, and account profile.
   * **Strictly blocked** from seller inventory, seller analytics, and administrative tools.
2. **`SELLER`**:
   * Access to store management, product creation, stock updates, fulfillment of received order items, and sales analytics derived from database records.
   * **Strictly blocked** from buyer-only dashboards and administrative control tools.
3. **`ADMIN`**:
   * Full platform oversight: user account management, seller application reviews, product moderation, category management, order oversight, and audit logs.
   * **Strictly protected:** No public sign-up for admins. Admins can only be provisioned through server-side CLI management command.

---

## 4. Strict No-Demo Policy

In accordance with startup standards:
* **Zero Demo Accounts:** No fake accounts, no pre-filled demo logins, no demo switchers.
* **Zero Fabricated Reviews or Ratings:** Testimonials and reviews are not fabricated.
* **Zero Hardcoded Statistics:** All metrics in seller and admin dashboards are calculated directly from active database records.
* **Honest Empty States:** When a buyer has no orders or a seller has no products, intuitive empty states provide clear calls to action (e.g., *"Your shopping cart is currently empty. Explore our verified marketplace products."*).

---

## 5. Google OAuth Authentication & Registration

The platform supports genuine Google OAuth authentication:

* **Buyer Registration Pathway:**
  1. Selects "Continue as a Buyer".
  2. Authenticates with Google.
  3. Server automatically creates or links a Buyer account and redirects to `/buyer/dashboard`.

* **Seller Registration Pathway:**
  1. Selects "Register as a Seller".
  2. Authenticates with Google.
  3. Completes seller onboarding (store name, phone, city, business category).
  4. Server creates a Seller profile in `pending` verification status.
  5. Redirects to `/seller/dashboard`.

* **Security Guard:** Google OAuth endpoints explicitly sanitize the role parameter, ensuring the `admin` role can **never** be claimed via client input.

---

## 6. Secure Administrator Provisioning

Administrator accounts cannot be created via public registration. Provision the first administrator securely using the Django management command:

```bash
# In backend directory
python manage.py bootstrap_admin --email admin@yougomart.et --password "YourStrongPassword2026!" --username leadadmin
```

Or set environment variables in `backend/.env`:
```env
ADMIN_EMAIL=admin@yougomart.et
ADMIN_PASSWORD=YourStrongPassword2026!
ADMIN_USERNAME=leadadmin
```
and execute:
```bash
python manage.py bootstrap_admin
```

---

## 7. Dual-Language System: English & Amharic (አማርኛ)

The platform features complete bilingual localization via `language-context.tsx`:
* Floating glassmorphic navbar language switcher (English / አማርኛ).
* Translated hero headlines, value propositions, and section headers.
* Fully localized navigation tabs, button labels, and validation errors.
* Localized buyer, seller, and administrator workspace actions.
* Localized empty states, cart counters, and order statuses.
* Preserves user language preference across sessions via `localStorage`.

---

## 8. Local Setup & Running the Platform

### Prerequisites
* Python 3.10+
* Node.js 18+ (tested with React 19 and Next.js 16)
* Git

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate

# Optional: seed authentic categories & sample verified listings
python manage.py seed_yougo_data

# Bootstrap an administrator
python manage.py bootstrap_admin --email admin@yougomart.et --password "AdminPass2026!"

# Start Django API server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be running at: `http://127.0.0.1:8000/api/v1/`  
Swagger API Documentation: `http://127.0.0.1:8000/api/docs/`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at: `http://localhost:3000`

---

## 9. Automated Testing & Verification

Comprehensive automated test suites cover authentication, role-based access control, cart calculations, checkout operations, and seller fulfillment:

```bash
# Run all backend unit tests:
cd backend
python manage.py test apps

# Run frontend production build check:
cd frontend
npm run build
```

Both backend test suites (12 tests) and frontend builds (20 static/dynamic routes) pass with 100% success.

---

## 10. License & Copyright

© 2026 youGO-mart. Built with ❤️ for Ethiopia and Africa. All rights reserved.
