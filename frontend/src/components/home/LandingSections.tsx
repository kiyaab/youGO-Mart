'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { GoogleIcon } from '@/components/common/GoogleIcon';
import { Category } from '@/types';
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  UserCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  MapPin,
  Clock,
  Tag,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface LandingSectionsProps {
  categories: Category[];
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ categories }) => {
  const { language, t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'am' ? 'ዩጎ-ማርት (youGO-mart) እንዴት ይሰራል?' : 'How does youGO-mart work?',
      a: language === 'am'
        ? 'ዩጎ-ማርት በኢትዮጵያ ውስጥ ገዢዎችን እና ሻጮችን በቀጥታ የሚያገናኝ መድረክ ነው። ሻጮች እቃዎቻቸውን በነፃ ይለጥፋሉ፤ ገዢዎች የሚፈልጉትን ፈልገው በስልክ ወይም በውስጥ መልእክት በቀጥታ ይገናኛሉ።'
        : 'youGO-mart connects verified buyers and sellers directly across Ethiopia. Sellers list products without commission cuts, and buyers can browse, save wishlists, add to cart, and contact merchants directly.',
    },
    {
      q: language === 'am' ? 'እቃዎችን መለጠፍ ወይም መሸጥ ክፍያ አለው?' : 'Are there listing fees or sales commissions?',
      a: language === 'am'
        ? 'በፍጹም! መደበኛ ማስታወቂያዎችን መለጠፍ 100% ነፃ ነው። ዩጎ-ማርት ከሽያጭዎ ላይ ምንም አይነት ኮሚሽን አይቆርጥም።'
        : 'No. Standard product listings are 100% free with zero sales commission. Sellers keep 100% of their earnings with no hidden transaction fees.',
    },
    {
      q: language === 'am' ? 'ትዕዛዞችን እና ክፍያን እንዴት መፈጸም እችላለሁ?' : 'How do orders and payments work?',
      a: language === 'am'
        ? 'በቴሌብር (Telebirr)፣ በሲቢኢ ብር (CBE Birr) ወይም እቃውን በአካል ተቀብለው በመመርመር በካሽ መክፈል ይችላሉ።'
        : 'You can complete orders using local payment preferences including Telebirr, CBE Birr, direct bank transfer, or cash upon in-person delivery inspection.',
    },
    {
      q: language === 'am' ? 'የተረጋገጠ ሻጭ መሆን እንዴት እችላለሁ?' : 'How can I become a Verified Seller?',
      a: language === 'am'
        ? 'የሻጭ መለያ ከፈጠሩ በኋላ በሻጭ ዳሽቦርድ በኩል የቀበሌ መታወቂያ ወይም የንግድ ፈቃድ በማስገባት የተረጋገጠ ባጅ ማግኘት ይችላሉ።'
        : 'Once registered as a Seller, submit your business license or national ID in the Seller Hub to receive the Verified Seller trust badge.',
    },
    {
      q: language === 'am' ? 'በቀጥታ ግብይት ወቅት ደህንነቴን እንዴት መጠበቅ እችላለሁ?' : 'What safety practices should I follow?',
      a: language === 'am'
        ? 'ሁልጊዜ በህዝብ በሚበዛባቸው የታወቁ ቦታዎች (ለምሳሌ ቦሌ፣ ካዛንቺስ፣ ፒያሳ) በቀን ሰዓት ይገናኙ። እቃውን በእጅዎ ተቀብለው እስካልመረመሩ ድረስ ምንም አይነት የቅድመ ክፍያ አይላኩ።'
        : 'Always arrange to meet in public daylight spots in Addis Ababa or your city. Inspect items thoroughly before releasing payment, and never wire unverified advance deposits.',
    },
  ];

  return (
    <div className="d-flex flex-column gap-5 py-5" style={{ backgroundColor: 'var(--bg-soft)' }}>
      {/* SECTION 1: Explore the Marketplace */}
      <section id="explore" className="container py-4">
        <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge rounded-pill px-3 py-1.5 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
            {t('explore_section_title')}
          </span>
          <h2 className="fw-bold h2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'በአዲስ አበባ እና በመላው ኢትዮጵያ የሚፈልጉትን ያግኙ' : 'Smart Discovery & Direct Commerce'}
          </h2>
          <p className="text-muted small">
            {t('explore_section_desc')}
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-card p-4 h-100 rounded-4 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                <Search size={26} />
              </div>
              <h5 className="fw-bold mb-2">{language === 'am' ? 'ትክክለኛ ፍለጋ' : 'Precision Search & Filters'}</h5>
              <p className="text-muted small mb-0">
                {language === 'am'
                  ? 'በምድብ፣ በዋጋ፣ በከተማ እና በክፍለ ከተማ ማጣሪያዎች የሚፈልጉትን እቃ በሰከንዶች ውስጥ ያግኙ።'
                  : 'Filter by subcity, price range, brand, and condition across Bole, Kazanchis, Hawassa, and beyond.'}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card p-4 h-100 rounded-4 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
                <ShieldCheck size={26} />
              </div>
              <h5 className="fw-bold mb-2">{language === 'am' ? 'የተረጋገጡ ሻጮች' : 'Verified Merchants'}</h5>
              <p className="text-muted small mb-0">
                {language === 'am'
                  ? 'መታወቂያቸው እና የንግድ ፈቃዳቸው የተረጋገጠ የታመኑ የሀገር ውስጥ ሻጮችን በቀላሉ ለይተው ይወቁ።'
                  : 'Shop with confidence by identifying merchants who have completed verification badges.'}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card p-4 h-100 rounded-4 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563EB' }}>
                <PhoneCall size={26} />
              </div>
              <h5 className="fw-bold mb-2">{language === 'am' ? 'ቀጥታ ግንኙነት' : 'Direct Call & Chat'}</h5>
              <p className="text-muted small mb-0">
                {language === 'am'
                  ? 'ያለ ደላላ ጣልቃ ገብነት በቀጥታ በስልክ ወይም በዋትስአፕ ከሻጩ ጋር ይነጋገሩ እና ይደራደሩ።'
                  : 'Connect with sellers via phone, WhatsApp, or in-platform chat to negotiate directly.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How It Works */}
      <section id="how-it-works" className="container py-4">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
          <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span className="badge rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
              {t('how_it_works_title')}
            </span>
            <h3 className="fw-bold h2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {language === 'am' ? 'ግብይት በ 3 ቀላል ደረጃዎች' : 'Simple 3-Step Process'}
            </h3>
            <p className="text-muted small">
              {language === 'am'
                ? 'ለገዢዎችም ሆነ ለሻጮች ግልጽ እና ደህንነቱ የተጠበቀ የቀጥታ ግብይት መድረክ'
                : 'A transparent experience designed for clarity, zero middleman cuts, and mutual trust.'}
            </p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 border h-100 shadow-sm">
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--primary-orange)' }}>
                  01
                </div>
                <h5 className="fw-bold mb-2">{language === 'am' ? 'ፈልግ እና ምረጥ' : 'Discover & Compare'}</h5>
                <p className="text-muted small mb-0">
                  {language === 'am'
                    ? 'በመቶዎች የሚቆጠሩ እውነተኛ ምርቶችን ያስሱ፣ ወደ ተወዳጅ ወይም ቅርጫት ያክሉ።'
                    : 'Search live local inventory across tech, vehicles, home, and fashion.'}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 border h-100 shadow-sm">
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--primary-orange)' }}>
                  02
                </div>
                <h5 className="fw-bold mb-2">{language === 'am' ? 'ተገናኝ እና ተደራደር' : 'Connect & Negotiate'}</h5>
                <p className="text-muted small mb-0">
                  {language === 'am'
                    ? 'በቀጥታ ለሻጩ ይደውሉ ወይም በዋትስአፕ ያነጋግሩ፤ ስለ ዋጋው እና ስለ እቃው ይነጋገሩ።'
                    : 'Call or message the merchant directly to confirm availability and discuss pricing.'}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 border h-100 shadow-sm">
                <div className="display-6 fw-bold mb-2" style={{ color: 'var(--primary-orange)' }}>
                  03
                </div>
                <h5 className="fw-bold mb-2">{language === 'am' ? 'መርምር እና ተረከብ' : 'Inspect & Close Deal'}</h5>
                <p className="text-muted small mb-0">
                  {language === 'am'
                    ? 'በደህና የህዝብ ቦታ ተገናኝተው እቃውን በአካል ይፈትሹ፤ ከዚያም በቴሌብር ወይም በካሽ ይክፈሉ።'
                    : 'Meet safely in public spots to inspect items in person before completing payment.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: For Buyers vs For Sellers */}
      <section className="container py-4">
        <div className="row g-4">
          {/* FOR BUYERS */}
          <div className="col-lg-6">
            <div className="glass-card p-4 p-md-5 rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2.5 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span className="badge bg-primary text-white text-uppercase small">BUYER PORTAL</span>
                    <h4 className="fw-bold m-0 mt-0.5">{t('for_buyers_title')}</h4>
                  </div>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                  {language === 'am'
                    ? 'ዘመናዊ የገበያ መድረክ ለእርስዎ። የራስዎን የገዢ ዳሽቦርድ በመጠቀም የሚወዷቸውን እቃዎች ያስቀምጡ፣ ትዕዛዞችዎን ይከታተሉ፣ እና ከሻጮች ጋር በነፃነት ይነጋገሩ።'
                    : 'Enjoy a personalized shopping workspace with wishlist curation, cart checkouts, direct message inquiries, and comprehensive buyer protection guidelines.'}
                </p>

                <ul className="list-unstyled d-flex flex-column gap-2.5 small text-muted mb-4">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? 'የተመረጡ እቃዎችን ማስቀመጥ (Wishlist)' : 'Saved wishlist with real-time price monitoring'}
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? 'ቀጥታ የትዕዛዝ ክትትል (Order Tracking)' : 'Order history & status tracking'}
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? 'ደህንነቱ የተጠበቀ የቀጥታ ግንኙነት' : 'Verified contact preferences (Phone / WhatsApp)'}
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-top d-flex gap-2">
                <Link href="/auth/register?role=buyer" className="btn-orange px-4 py-2.5 small">
                  {t('continue_as_buyer')} <ArrowRight size={15} />
                </Link>
                <Link href="/search" className="btn btn-neutral px-4 py-2.5 small">
                  {language === 'am' ? 'ምርቶችን ያስሱ' : 'Browse Catalog'}
                </Link>
              </div>
            </div>
          </div>

          {/* FOR SELLERS */}
          <div className="col-lg-6">
            <div className="glass-card p-4 p-md-5 rounded-4 h-100 d-flex flex-column justify-content-between border-warning">
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2.5 rounded-3 bg-warning bg-opacity-10" style={{ color: 'var(--primary-orange)' }}>
                    <Store size={24} />
                  </div>
                  <div>
                    <span className="badge bg-warning text-dark text-uppercase small">SELLER HUB</span>
                    <h4 className="fw-bold m-0 mt-0.5">{t('for_sellers_title')}</h4>
                  </div>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                  {language === 'am'
                    ? 'ንግድዎን ያለ ምንም የኮሚሽን ወጪ ያሳድጉ። የራስዎን ዲጂታል ሱቅ ይክፈቱ፣ ምርቶችዎን ያስተዳድሩ፣ እና በየቀኑ አዳዲስ ደንበኞችን በቀጥታ ያግኙ።'
                    : 'Manage your storefront, upload high-resolution product photos, track customer calls, fulfill orders, and retain 100% of your sales revenue.'}
                </p>

                <ul className="list-unstyled d-flex flex-column gap-2.5 small text-muted mb-4">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? '0% ኮሚሽን - 100% ነፃ መለጠፊያ' : '0% commission guarantee on all standard listings'}
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? 'የእቃ ክምችት እና የትዕዛዝ አስተዳደር' : 'Inventory tracking & fulfillment controls'}
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {language === 'am' ? 'የተረጋገጠ የሻጭ ባጅ ማመልከቻ' : 'Official Verified Merchant badge application'}
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-top d-flex gap-2">
                <Link href="/auth/register?role=seller" className="btn-orange px-4 py-2.5 small">
                  {t('register_as_seller')} <ArrowRight size={15} />
                </Link>
                <Link href="/seller/dashboard" className="btn btn-neutral px-4 py-2.5 small">
                  {language === 'am' ? 'የሻጭ ዳሽቦርድ' : 'Open Seller Hub'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Why youGO-mart */}
      <section className="container py-4">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm text-center">
          <span className="badge rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
            {t('why_yougo_title')}
          </span>
          <h3 className="fw-bold h2 mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'የእውነተኛ እና የፍትሃዊ ገበያ መርሆዎች' : 'Authentic, Commission-Free Ethiopian Commerce'}
          </h3>
          <p className="text-muted small mx-auto mb-5" style={{ maxWidth: '640px' }}>
            {language === 'am'
              ? 'ዩጎ-ማርት የተመሰረተው የሀገር ውስጥ ገዢዎችን እና ሻጮችን ከአላስፈላጊ ወጪዎች ነፃ በማድረግ ቀጥተኛ ግንኙነትን ለማስፈን ነው።'
              : 'Built for Ethiopia first, youGO-mart eliminates inflated middleman markups by connecting buyers and merchants directly.'}
          </p>

          <div className="row g-4 text-start">
            <div className="col-md-3">
              <div className="p-3.5 bg-white rounded-3 border h-100">
                <div className="fw-bold mb-1" style={{ color: 'var(--primary-orange)' }}>0 ETB Fees</div>
                <div className="fw-semibold small mb-1">{language === 'am' ? 'ነፃ ማስታወቂያ' : 'No Listing Fees'}</div>
                <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                  {language === 'am' ? 'ማንኛውም ሰው እቃውን በነፃ መለጠፍ ይችላል።' : 'Publish products without mandatory listing charges.'}
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3.5 bg-white rounded-3 border h-100">
                <div className="fw-bold mb-1 text-success">0% Cut</div>
                <div className="fw-semibold small mb-1">{language === 'am' ? 'ያለ ኮሚሽን' : 'Zero Commissions'}</div>
                <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                  {language === 'am' ? 'ከሽያጭዎ ላይ ምንም አይነት ገንዘብ አንቀንስም።' : 'Keep 100% of negotiated deal proceeds.'}
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3.5 bg-white rounded-3 border h-100">
                <div className="fw-bold mb-1 text-primary">Direct</div>
                <div className="fw-semibold small mb-1">{language === 'am' ? 'ቀጥታ ድርድር' : 'Direct Talks'}</div>
                <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                  {language === 'am' ? 'ከእውነተኛ ሰዎች ጋር በቀጥታ ይደራደሩ።' : 'Call or WhatsApp sellers on your terms.'}
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3.5 bg-white rounded-3 border h-100">
                <div className="fw-bold mb-1 text-warning">Verified</div>
                <div className="fw-semibold small mb-1">{language === 'am' ? 'የደህንነት ባጅ' : 'Verified ID'}</div>
                <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                  {language === 'am' ? 'የቀበሌ እና የንግድ ፈቃድ ማረጋገጫ።' : 'Merchant identity authentication.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Popular Categories (Only rendered when real DB categories exist) */}
      {categories && categories.length > 0 && (
        <section id="categories" className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge rounded-pill px-3 py-1 mb-1 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                {t('popular_categories_title')}
              </span>
              <h3 className="fw-bold h3 m-0" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {language === 'am' ? 'በምድብ ይፈልጉ' : 'Browse by Category'}
              </h3>
            </div>
            <Link href="/search" className="btn btn-neutral btn-sm px-3 fw-semibold">
              {language === 'am' ? 'ሁሉንም እይ' : 'View All'} →
            </Link>
          </div>

          <div className="row g-3">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat.id} className="col-6 col-sm-4 col-md-3">
                <Link
                  href={`/search?category=${cat.slug}`}
                  className="glass-card p-3.5 rounded-4 d-flex flex-column align-items-center text-center h-100 text-reset transition-all"
                >
                  <div className="p-3 rounded-circle mb-2" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                    <Layers size={22} />
                  </div>
                  <div className="fw-bold small text-truncate w-100">{cat.name}</div>
                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    {cat.listing_count ?? 0} {language === 'am' ? 'ዕቃዎች' : 'items'}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 7: Become a Seller Recruitment Section */}
      <section className="container py-4">
        <div className="p-4 p-md-5 rounded-4 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF7F0 0%, #FFFFFF 100%)', border: '1.5px solid var(--primary-orange)' }}>
          <div className="position-relative z-1" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-2">
              {language === 'am' ? 'ነጋዴ ነዎት?' : 'Are you a Merchant or Seller?'}
            </span>
            <h3 className="fw-extrabold display-6 mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {language === 'am' ? 'ምርቶችዎን በመላው ኢትዮጵያ በነፃ ይሽጡ' : 'Sell to Thousands Across Ethiopia for Free'}
            </h3>
            <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
              {language === 'am'
                ? 'ምንም የኮሚሽን ክፍያ ሳይከፍሉ ሱቅዎን በ 2 ደቂቃ ውስጥ ይክፈቱ። ስልኮች፣ መኪናዎች፣ አልባሳት ወይም የቤት እቃዎችን በቀጥታ ለገዢዎች ያቅርቡ።'
                : 'Open your storefront in minutes. Zero commission cuts, instant phone leads, and dedicated seller analytics.'}
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link href="/auth/register?role=seller" className="btn-orange px-4 py-2.5 fw-bold shadow-sm">
                <Store size={18} />
                <span>{t('register_as_seller')}</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/auth/register?role=seller&provider=google" className="btn-google px-4 py-2.5 small">
                <GoogleIcon size={18} />
                <span>{t('continue_with_google')} (Seller)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Frequently Asked Questions (FAQ) */}
      <section id="faq" className="container py-4">
        <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
            {t('faq_title')}
          </span>
          <h3 className="fw-bold h2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'የተለመዱ ጥያቄዎች እና መልሶች' : 'Frequently Asked Questions'}
          </h3>
          <p className="text-muted small">
            {language === 'am'
              ? 'ስለ ዩጎ-ማርት መለያ፣ ትዕዛዞች እና የደህንነት መመሪያዎች አስፈላጊ መረጃዎች'
              : 'Clear answers about accounts, orders, seller stores, and marketplace safety.'}
          </p>
        </div>

        <div className="glass-card p-3 p-md-4 rounded-4 shadow-sm mx-auto" style={{ maxWidth: '780px' }}>
          <div className="accordion accordion-flush" id="yougoFaqAccordion">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border-bottom py-3">
                  <button
                    type="button"
                    className="w-100 bg-transparent border-0 d-flex align-items-center justify-content-between text-start fw-bold p-0"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{ color: 'var(--text-main)', fontSize: '0.96rem' }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className="text-muted transition-transform"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-muted small pt-1" style={{ lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
