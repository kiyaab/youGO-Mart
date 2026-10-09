'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'om' | 'am';

interface Translations {
  [key: string]: {
    en: string;
    am: string;
    om?: string;
  };
}

export const translations: Translations = {
  // Brand & Tagline
  tagline: {
    en: 'Everything you need, just a click away.',
    am: 'የሚፈልጉትን ሁሉ፣ በአንድ ጠቅታ ብቻ።',
    om: 'Waan barbaaddan hunda, cuqqaasuu tokkoon qofa.',
  },
  subtagline: {
    en: 'Discover more. Shop smarter. Get it moving.',
    am: 'የበለጠ ያግኙ። በብልሃት ይሸምቱ። አሁኑኑ ይጀምሩ።',
    om: 'Dabalata argadhaa. Ogeessaan bitaa. Ammuma jalqabaa.',
  },
  hero_headline: {
    en: 'Everything you need, just a click away.',
    am: 'የሚፈልጉትን ሁሉ፣ በአንድ ጠቅታ ብቻ።',
    om: 'Waan barbaaddan hunda, cuqqaasuu tokkoon qofa.',
  },
  hero_supporting: {
    en: 'Discover more. Shop smarter. Get it moving.',
    am: 'የበለጠ ያግኙ። በብልሃት ይሸምቱ። አሁኑኑ ይጀምሩ።',
    om: 'Dabalata argadhaa. Ogeessaan bitaa. Ammuma jalqabaa.',
  },
  register_button: {
    en: 'Register',
    am: 'ተመዝገብ',
    om: "Galmaa'aa",
  },
  about_us_button: {
    en: 'About Us',
    am: 'ስለ እኛ',
    om: "Waa'ee Keenya",
  },
  scroll_down: {
    en: 'Scroll Down',
    am: 'ወደ ታች ይሸብልሉ',
    om: 'Gadi Siqsaa',
  },
  start_shopping: {
    en: 'Start Shopping',
    am: 'መሸመት ይጀምሩ',
    om: 'Bittaa Jalqabaa',
  },
  become_a_seller: {
    en: 'Become a Seller',
    am: 'ሻጭ ይሁኑ',
    om: 'Gurguraa Ta\'aa',
  },

  // Navbar Links
  nav_home: {
    en: 'Home',
    am: 'መነሻ',
  },
  nav_explore: {
    en: 'Explore Products',
    am: 'ምርቶችን ያስሱ',
  },
  nav_how_it_works: {
    en: 'How It Works',
    am: 'እንዴት እንደሚሰራ',
  },
  nav_for_sellers: {
    en: 'For Sellers',
    am: 'ለሻጮች',
  },
  nav_about_us: {
    en: 'About Us',
    am: 'ስለ እኛ',
  },
  nav_get_started: {
    en: 'Get Started',
    am: 'ይጀምሩ',
  },
  nav_sign_in: {
    en: 'Sign In',
    am: 'ይግቡ',
  },

  // Marketplace & Search
  search_placeholder: {
    en: 'Search genuine products across Addis Ababa and Ethiopia...',
    am: 'በአዲስ አበባ እና በኢትዮጵያ እውነተኛ ምርቶችን ይፈልጉ...',
  },
  cart: {
    en: 'Cart',
    am: 'ቅርጫት',
  },
  wishlist: {
    en: 'Wishlist',
    am: 'የተወደዱ',
  },
  favorites: {
    en: 'Favorites',
    am: 'የተመረጡ',
  },
  messages: {
    en: 'Messages',
    am: 'መልዕክቶች',
  },
  orders: {
    en: 'My Orders',
    am: 'ትዕዛዞቼ',
  },
  order_tracking: {
    en: 'Order Tracking',
    am: 'ትዕዛዝ መከታተያ',
  },
  seller_hub: {
    en: 'Seller Hub',
    am: 'የሻጭ ዳሽቦርድ',
  },
  buyer_hub: {
    en: 'Buyer Portal',
    am: 'የገዢ ገጽ',
  },
  admin_portal: {
    en: 'Admin Security Portal',
    am: 'የአስተዳዳሪ ፖርታል',
  },
  sign_out: {
    en: 'Sign Out',
    am: 'ይውጡ',
  },

  // Landing Page Sections
  explore_section_title: {
    en: 'Explore the Marketplace',
    am: 'የገበያ ቦታውን ያስሱ',
  },
  explore_section_desc: {
    en: 'Smart discovery with verified filters, transparent pricing, and direct communication across Ethiopian subcities.',
    am: 'በተረጋገጡ ማጣሪያዎች፣ ግልጽ ዋጋዎች እና በቀጥታ ግንኙነት በመላው የኢትዮጵያ ክፍለ ከተሞች የሚፈልጉትን ያግኙ።',
  },
  how_it_works_title: {
    en: 'How It Works',
    am: 'እንዴት እንደሚሰራ',
  },
  for_buyers_title: {
    en: 'For Buyers',
    am: 'ለገዢዎች',
  },
  for_sellers_title: {
    en: 'For Sellers',
    am: 'ለሻጮች',
  },
  why_yougo_title: {
    en: 'Why youGO-mart',
    am: 'ለምን ዩጎ-ማርት?',
  },
  popular_categories_title: {
    en: 'Popular Categories',
    am: 'ተወዳጅ ምድቦች',
  },
  faq_title: {
    en: 'Frequently Asked Questions',
    am: 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
  },

  // Auth & Roles
  continue_as_buyer: {
    en: 'Continue as a Buyer',
    am: 'እንደ ገዢ ይቀጥሉ',
  },
  register_as_seller: {
    en: 'Register as a Seller',
    am: 'እንደ ሻጭ ይመዝገቡ',
  },
  continue_with_google: {
    en: 'Continue with Google',
    am: 'በጉግል (Google) ይቀጥሉ',
  },
  zero_commission_badge: {
    en: '0% Sales Commission • Free Postings',
    am: '0% የሽያጭ ኮሚሽን • ነፃ ማስታወቂያ',
  },

  // Access control
  access_restricted: {
    en: 'Access Restricted',
    am: 'ይህ ገጽ ለእርስዎ የተከለከለ ነው',
  },
  seller_only_notice: {
    en: 'This workspace is strictly reserved for approved Sellers. You are currently logged in with a Buyer account.',
    am: 'ይህ የስራ ቦታ ለተፈቀደላቸው ሻጮች ብቻ የተወሰነ ነው። እርስዎ በገዢ አካውንት ገብተዋል።',
  },
  buyer_only_notice: {
    en: 'This portal is strictly reserved for Buyers. As a registered Merchant, please manage your store in the Seller Hub.',
    am: 'ይህ ገጽ ለገዢዎች ብቻ የተዘጋጀ ነው። እንደ ነጋዴ እባክዎ ሱቅዎን በሻጭ ዳሽቦርድ ያስተዳድሩ።',
  },
  admin_only_notice: {
    en: 'Strict Security Zone: Authorized Administrator Credentials Required.',
    am: 'ጥብቅ የደህንነት ክልል፡ የተፈቀደ የአስተዳዳሪ ምስክር ወረቀት ያስፈልጋል።',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('yougo_language') as Language | null;
    if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('yougo_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key].en) {
      return translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
