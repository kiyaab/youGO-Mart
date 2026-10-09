'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface Translations {
  [key: string]: {
    en: string;
    am: string;
  };
}

export const translations: Translations = {
  // Brand & Tagline
  tagline: {
    en: 'Find it. Love it. Make it yours.',
    am: 'ፈልገው። ውደዱት። የራስዎ ያድርጉት።',
  },
  subtagline: {
    en: 'Discover great products near you. Sell what you no longer need. Connect directly with people across Ethiopia with zero commission.',
    am: 'በአቅራቢያዎ ያሉ ምርጥ ምርቶችን ያግኙ። የማያስፈልግዎትን ይሽጡ። በመላው ኢትዮጵያ ካሉ ሰዎች ጋር ያለ ምንም ኮሚሽን በቀጥታ ይገናኙ።',
  },
  zero_commission: {
    en: '0% Sales Commission',
    am: '0% የሽያጭ ኮሚሽን',
  },
  ethiopia_first: {
    en: 'Ethiopia First 🇪🇹',
    am: 'ቅድሚያ ለኢትዮጵያ 🇪🇹',
  },
  direct_connection: {
    en: 'Direct Buyer & Seller Deals',
    am: 'ቀጥታ የገዢ እና የሻጭ ግንኙነት',
  },

  // Navigation
  search_placeholder: {
    en: 'Search phones, cars, laptops, fashion across Ethiopia...',
    am: 'ስልኮች፣ መኪናዎች፣ ላፕቶፖች፣ አልባሳት ይፈልጉ...',
  },
  post_ad: {
    en: 'Post a Free Ad',
    am: 'ነፃ ማስታወቂያ ይለጥፉ',
  },
  explore_listings: {
    en: 'Explore Marketplace',
    am: 'ገበያውን ያስሱ',
  },
  sign_in: {
    en: 'Sign In',
    am: 'ይግቡ',
  },
  register: {
    en: 'Register',
    am: 'ይመዝገቡ',
  },
  sign_out: {
    en: 'Sign Out',
    am: 'ይውጡ',
  },
  favorites: {
    en: 'Favorites',
    am: 'የተመረጡ',
  },
  messages: {
    en: 'Messages',
    am: 'መልዕክቶች',
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

  // Role Registrations
  join_as_seller: {
    en: 'Register as Seller',
    am: 'እንደ ሻጭ ይመዝገቡ',
  },
  join_as_buyer: {
    en: 'Register as Buyer',
    am: 'እንደ ገዢ ይመዝገቡ',
  },
  continue_with_google: {
    en: 'Continue with Google',
    am: 'በጉግል (Google) ይቀጥሉ',
  },

  // Portfolio & Deep Overview
  about_title: {
    en: 'Revolutionizing Ethiopian Classifieds',
    am: 'የኢትዮጵያን ዲጂታል ግብይት በአዲስ መልክ ማሳደግ',
  },
  about_desc: {
    en: 'youGO-mart is a commission-free classifieds ecosystem built to empower everyday citizens, small merchants, and shoppers across Addis Ababa and every region of Ethiopia.',
    am: 'ዩጎ-ማርት (youGO-mart) ያለ ምንም ደላላ ወይም ኮሚሽን ተራ ዜጎችን፣ ነጋዴዎችን እና ሸማቾችን በቀጥታ የሚያገናኝ ዘመናዊ የኢትዮጵያ የዲጂታል ገበያ ነው።',
  },
  founder_note: {
    en: 'Founded by Endegena Abebe, youGO-mart eliminates expensive transaction fees and puts power back into the hands of local Ethiopian buyers and sellers.',
    am: 'በእሸቱ እንዳገና አበበ የተመሰረተው ዩጎ-ማርት አላስፈላጊ የደላላ እና የኮሚሽን ወጪዎችን በማስቀረት ለሀገር ውስጥ ሻጮችና ገዢዎች ሙሉ ነፃነት ይሰጣል።',
  },
  why_choose_us: {
    en: 'Why youGO-mart is Different',
    am: 'ዩጎ-ማርት ለምን የተለየ ሆነ?',
  },
  categories_header: {
    en: 'Explore Marketplace Categories',
    am: 'የገበያ ምድቦችን ያስሱ',
  },
  featured_header: {
    en: 'Featured Marketplace Listings',
    am: 'ተለይተው የቀረቡ ማስታወቂያዎች',
  },
  recent_header: {
    en: 'Recently Added Across Ethiopia',
    am: 'በቅርብ ጊዜ የተጨመሩ ዕቃዎች',
  },
  safety_tips: {
    en: 'Safety Guidelines for Ethiopia',
    am: 'የደህንነት መመሪያዎች',
  },

  // Role separation messages
  access_restricted: {
    en: 'Access Restricted',
    am: 'ይህ ገጽ ለእርስዎ የተከለከለ ነው',
  },
  seller_only_notice: {
    en: 'This area is strictly reserved for registered Sellers. You are currently logged in with a Buyer account.',
    am: 'ይህ ገጽ ለሻጮች ብቻ የተፈቀደ ነው። እርስዎ የገቡት በገዢ አካውንት ነው።',
  },
  buyer_only_notice: {
    en: 'This area is strictly reserved for registered Buyers. You are currently logged in with a Seller account.',
    am: 'ይህ ገጽ ለገዢዎች ብቻ የተፈቀደ ነው። እርስዎ የገቡት በሻጭ አካውንት ነው።',
  },
  admin_only_notice: {
    en: 'Access Denied. Only authorized marketplace administrators with verified staff credentials can enter this portal.',
    am: 'መግባት አይቻልም። ይህንን ፖርታል ማግኘት የሚችሉት የተረጋገጡ የአስተዳዳሪ ምስክር ወረቀት ያላቸው ብቻ ናቸው።',
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
    if (saved && (saved === 'en' || saved === 'am')) {
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
