# youGO-mart 🇪🇹

**Commission-Free Online Classifieds Marketplace Designed for Ethiopia First, Expandable Across Africa**

* **Founder:** Endegena Abebe  
* **Brand:** youGO-mart  
* **Brand Promise:** *Discover products. Connect directly. Sell for free.*  
* **Core Launch Market:** Ethiopia (Addis Ababa, Hawassa, Adama, Bahir Dar, Dire Dawa, Mekelle)  
* **Currency:** Ethiopian Birr (ETB)  

---

## 1. Product & Business Model Overview

youGO-mart is a modern direct-connection classifieds marketplace similar to Jiji. Sellers publish product listings with photos, prices, descriptions, and contact options. Buyers discover products locally and connect directly to negotiate and arrange their own purchases.

### Non-Negotiable Business Rules:
* **0% Sales Commission:** Sellers keep 100% of their earnings.
* **Free Standard Listings:** Standard product postings are completely free of charge.
* **No Mandatory Cart or Checkout:** Buyers and sellers negotiate directly.
* **Direct Contact Channels:** Phone calls (`tel:`), WhatsApp (`wa.me`), and in-platform private messaging.
* **Self-Arranged Payments & Handover:** Transactions are completed in person via cash or telebirr.
* **Seller Quality & Trust:** Seller verification badges (Kebele/License review) and moderation queues protect marketplace integrity.

---

## 2. Full-Stack Architecture

### Frontend (`frontend/`)
* **Framework:** Next.js (App Router) + React 19 + TypeScript (Strict Mode)
* **Design System & Grid:** Bootstrap 5 layout + custom CSS tokens
* **Primary Brand Colors:**
  * Primary Orange: `#F97316` (Hover: `#EA580C`)
  * Ink: `#171717` | White: `#FFFFFF` | Mist: `#F5F5F5`
  * Secondary Text: `#737373` | Borders: `#E5E5E5`
* **Icons:** Lucide Icons
* **Theming:** Full persistent Light/Dark mode toggle (respects system preferences)
* **Form Handling:** Controlled state & validation with immediate feedback

### Backend (`backend/`)
* **Framework:** Python 3.11 + Django 5.1 + Django REST Framework
* **Database:** SQLite (default for development) / PostgreSQL (production configured)
* **API Documentation:** Interactive OpenAPI 3.0 & Swagger UI at `/api/docs/`
* **Modular Django Structure:**
  * `accounts`: Custom User model with email authentication & role management (`visitor`, `buyer`, `seller`, `verified_seller`, `moderator`, `admin`)
  * `profiles`: UserProfile with Ethiopian cities, languages (English, Amharic, Afaan Oromo), notification preferences
  * `sellers`: SellerProfile, SellerVerification (Kebele/License document verification queue)
  * `categories`: Category & subcategory taxonomy with active listing count annotations
  * `listings`: Listing with slug generation, reference ID (`YG-XXXX`), images, condition, view & contact click tracking
  * `favorites`: Favorites & Saved Searches
  * `messaging`: Real-time/polling private buyer-to-seller conversations & messages
  * `notifications`: In-app notification center for approvals, rejections, verifications, and messages
  * `moderation`: ListingReport, UserReport, and AuditLog
  * `promotions`: Featured spotlight and category placements
  * `core`: Site settings & `seed_yougo_data` management command

---

## 3. Quick Start & Local Development

### Prerequisites:
* Python 3.10+
* Node.js 18+ and npm

### A. Run Backend (Django REST Framework)

1. Open a terminal in `./backend`:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

2. Run Migrations & Seed Authentic Ethiopian Marketplace Data:
   ```bash
   python manage.py migrate
   python manage.py seed_yougo_data
   ```

3. Start Django Development Server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   * REST API: `http://127.0.0.1:8000/api/v1/`
   * Swagger Documentation: `http://127.0.0.1:8000/api/docs/`

### B. Run Frontend (Next.js)

1. Open a second terminal in `./frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser.

---

## 4. One-Click Demo Personas (Fast Role Switching)

A dedicated **"Switch Demo Role"** dropdown is placed in the navigation header, allowing instant testing of all user journeys:

| Role | Persona Name | Email | Password | Privileges |
|---|---|---|---|---|
| **Buyer** | Abebe Bikila | `buyer@yougomart.et` | `Buyer2026!` | Search, favorite items, inquiry chat |
| **Verified Seller** | Tigist Mengistu | `tigist@yougomart.et` | `Seller2026!` | Verified badge, manage ads, edit prices, chat |
| **Admin & Founder** | Endegena Abebe | `endegena@yougomart.et` | `YouGoMart2026!` | Full Admin Portal, approve/reject ads, verify sellers |

---

## 5. Application Routes

| Route | Description |
|---|---|
| `/` | **Homepage:** Hero ("Find it. Love it. Make it yours."), category cards, featured & recent listings, trust section |
| `/search` | **Search & Filters:** Keyword search, category, location (Bole, Kazanchis, etc.), price min/max, condition, negotiable filter |
| `/listings/[slug]` | **Product Details:** Image gallery, ETB price, Call (`tel:`), WhatsApp (`wa.me`), in-app chat modal, safety notice, report ad |
| `/post-ad` | **5-Step Free Listing:** Product info, photo uploads, Ethiopian location, contact toggles, live preview & publish |
| `/dashboard` | **Seller Dashboard:** Real database metrics (views, contact clicks, active ads), listing status controls, profile editor |
| `/messages` | **Private Messaging Inbox:** Buyer-to-seller chat thread with product thumbnail card and unread indicators |
| `/favorites` | **Saved Favorites:** User's bookmarked products with quick removal |
| `/seller/verify` | **Seller Verification:** Submit Kebele ID or Business License to earn the green Verified Badge |
| `/admin-portal` | **Admin Portal:** Moderation metrics, pending listings approval/rejection, verification queue, report reviews |
| `/auth/login` | **Authentication Login:** Email/password sign-in and 1-click demo login buttons |
| `/auth/register` | **Registration:** User sign-up with optional instant seller profile creation |
| `/safety` | **Safety Guidelines:** Inspection best practices for Ethiopian buyers & sellers |
| `/how-it-works` | **How It Works:** Commission-free rules and direct connection workflow |
| `/terms` | **Terms of Service:** Community guidelines & founder vision |

---

## 6. Running Automated Tests

Run the test suite covering authentication, categories, listings, search, and favorites:
```bash
cd backend
python manage.py test apps.core.test_api
```

---

## 7. Docker Deployment

Deploy the entire stack with PostgreSQL using Docker Compose:
```bash
docker-compose up --build
```
* Frontend will run on port `3000`
* Backend will run on port `8000`
* PostgreSQL will run on port `5432`

---

## 8. Brand Identity & Founder Statement

> *"youGO-mart was created to empower Ethiopian buyers and sellers with an open, modern, and completely commission-free classifieds marketplace. By eliminating middleman transaction fees and enabling direct communication, we make digital commerce accessible, fair, and trustworthy for everyone across Ethiopia."*  
> — **Endegena Abebe, Founder**
