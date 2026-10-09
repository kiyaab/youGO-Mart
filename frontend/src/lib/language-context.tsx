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
  // Navigation
  home: {
    en: 'Home',
    am: 'ዋና ገጽ',
  },
  explore_products: {
    en: 'Explore Products',
    am: 'ምርቶችን ያስሱ',
  },
  how_it_works: {
    en: 'How It Works',
    am: 'እንዴት እንደሚሰራ',
  },
  for_sellers: {
    en: 'For Sellers',
    am: 'ለሻጮች',
  },
  for_buyers: {
    en: 'For Buyers',
    am: 'ለገዢዎች',
  },
  about_us: {
    en: 'About Us',
    am: 'ስለ እኛ',
  },
  sign_in: {
    en: 'Sign In',
    am: 'ይግቡ',
  },
  get_started: {
    en: 'Get Started',
    am: 'ይጀምሩ',
  },

  // Hero Section
  hero_headline: {
    en: 'Discover More. Shop Smarter. Go Further.',
    am: 'የበለጠ ይፈልጉ። በብልሃት ይሸምቱ። ወደ ፊት ይራመዱ።',
  },
  hero_subheadline: {
    en: 'Welcome to youGO-mart, your marketplace to discover products, connect with trusted sellers, and enjoy a simpler way to shop and grow your business.',
    am: 'ወደ ዩጎ-ማርት እንኳን በደህና መጡ! ጥራት ያላቸውን ምርቶች ለማግኘት፣ ከታመኑ ሻጮች ጋር በቀጥታ ለመገናኘት እና ንግድዎን ለማሳደግ ቀላሉ የኢትዮጵያ ዲጂታል ገበያ።',
  },
  start_shopping: {
    en: 'Start Shopping',
    am: 'መሸመት ጀምር',
  },
  become_a_seller: {
    en: 'Become a Seller',
    am: 'ሻጭ ይሁኑ',
  },

  // Brand Values
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
  search_placeholder: {
    en: 'Search products, electronics, cars, fashion across Ethiopia...',
    am: 'ምርቶችን፣ ስልኮች፣ መኪናዎች፣ አልባሳት ይፈልጉ...',
  },
  search_btn: {
    en: 'Search',
    am: 'ፈልግ',
  },

  // Roles & Portals
  seller_hub: {
    en: 'Seller Workspace',
    am: 'የሻጭ የስራ ገጽ',
  },
  buyer_hub: {
    en: 'Buyer Dashboard',
    am: 'የገዢ ዳሽቦርድ',
  },
  admin_portal: {
    en: 'Administrator Console',
    am: 'የአስተዳዳሪ ኮንሶል',
  },
  join_as_seller: {
    en: 'Register as Seller',
    am: 'እንደ ሻጭ ይመዝገቡ',
  },
  join_as_buyer: {
    en: 'Continue as a Buyer',
    am: 'እንደ ገዢ ይቀጥሉ',
  },
  continue_with_google: {
    en: 'Continue with Google',
    am: 'በ Google ይቀጥሉ',
  },

  // E-Commerce Features
  shopping_cart: {
    en: 'Shopping Cart',
    am: 'የግዢ ጋሪ',
  },
  cart_empty: {
    en: 'Your shopping cart is empty',
    am: 'የግዢ ጋሪዎ ባዶ ነው',
  },
  add_to_cart: {
    en: 'Add to Cart',
    am: 'ወደ ጋሪ ጨምር',
  },
  buy_now: {
    en: 'Order Now',
    am: 'አሁን እዘዝ',
  },
  checkout: {
    en: 'Proceed to Checkout',
    am: 'ትዕዛዝ ያጠናቁ',
  },
  orders: {
    en: 'My Orders',
    am: 'የእኔ ትዕዛዞች',
  },
  order_tracking: {
    en: 'Order Tracking',
    am: 'የትዕዛዝ ሁኔታ ክትትል',
  },
  wishlist: {
    en: 'Wishlist',
    am: 'የተመረጡ እቃዎች',
  },
  my_store: {
    en: 'My Store',
    am: 'የእኔ ሱቅ',
  },
  inventory: {
    en: 'Inventory',
    am: 'የእቃ ክምችት',
  },
  sales_analytics: {
    en: 'Sales Analytics',
    am: 'የሽያጭ ትንተና',
  },
  notifications: {
    en: 'Notifications',
    am: 'ማሳወቂያዎች',
  },
  settings: {
    en: 'Settings',
    am: 'ቅንብሮች',
  },
  help_support: {
    en: 'Help & Support',
    am: 'እርዳታ እና ድጋፍ',
  },
  sign_out: {
    en: 'Sign Out',
    am: 'ይውጡ',
  },

  // Landing Page Sections
  explore_marketplace_title: {
    en: 'Explore the Marketplace',
    am: 'ገበያውን ያስሱ',
  },
  explore_marketplace_desc: {
    en: 'Discover thousands of items listed by genuine sellers across Addis Ababa and all Ethiopian cities.',
    am: 'በአዲስ አበባ እና በሁሉም የኢትዮጵያ ከተሞች ካሉ እውነተኛ ሻጮች የቀረቡ በሺዎች የሚቆጠሩ እቃዎችን ያግኙ።',
  },
  how_it_works_title: {
    en: 'How youGO-mart Works',
    am: 'ዩጎ-ማርት እንዴት ይሰራል?',
  },
  why_yougo_title: {
    en: 'Why Choose youGO-mart',
    am: 'ለምን ዩጎ-ማርትን ይመርጣሉ?',
  },
  popular_categories_title: {
    en: 'Popular Product Categories',
    am: 'ተወዳጅ የምርት ምድቦች',
  },
  become_seller_title: {
    en: 'Ready to Grow Your Business?',
    am: 'ንግድዎን ለማሳደግ ዝግጁ ነዎት?',
  },
  become_seller_desc: {
    en: 'Join hundreds of Ethiopian merchants selling smartphones, vehicles, fashion, and home electronics with 0% commission cuts.',
    am: 'ስልኮችን፣ መኪናዎችን፣ አልባሳትን እና የኤሌክትሮኒክስ እቃዎችን ያለ ምንም የኮሚሽን ቅናሽ ከሚሸጡ በመቶዎች ከሚቆጠሩ ነጋዴዎች ጋር ይቀላቀሉ።',
  },
  faq_title: {
    en: 'Frequently Asked Questions',
    am: 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
  },

  // Empty States (Strictly Honest, No Fake Data)
  no_products_yet: {
    en: 'The marketplace is preparing genuine products for you. Check back shortly or be the first to publish!',
    am: 'ገበያው ጥራት ያላቸውን ምርቶች በማዘጋጀት ላይ ነው። በቅርቡ ይመለሱ ወይም የመጀመሪያው ሻጭ ይሁኑ!',
  },
  no_orders_yet: {
    en: 'No orders placed yet. Explore products and start shopping today.',
    am: 'እስካሁን ምንም ትዕዛዝ አልተሰጠም። ምርቶችን ያስሱ እና ዛሬ መሸመት ይጀምሩ።',
  },
  no_wishlist_yet: {
    en: 'Your wishlist is empty. Tap the heart icon on any product to save it.',
    am: 'የተመረጡ እቃዎች ዝርዝር ባዶ ነው። ምርቶችን ለማስቀመጥ የልብ ምልክቱን ይጫኑ።',
  },
  add_first_product: {
    en: 'Add Your First Product',
    am: 'የመጀመሪያ ምርትዎን ይጨምሩ',
  },

  // Role Security
  access_restricted: {
    en: 'Access Restricted',
    am: 'ይህ ገጽ ለእርስዎ የተከለከለ ነው',
  },
  seller_only_notice: {
    en: 'This section is reserved exclusively for registered Sellers. As a Buyer, please access your shopping dashboard.',
    am: 'ይህ ክፍል ለተመዘገቡ ሻጮች ብቻ የተዘጋጀ ነው። እንደ ገዢ፣ እባክዎ ወደ ግዢ ዳሽቦርድዎ ይሂዱ።',
  },
  buyer_only_notice: {
    en: 'This section is reserved exclusively for Buyers. As a Merchant, manage your store and inventory in the Seller Workspace.',
    am: 'ይህ ክፍል ለገዢዎች ብቻ የተዘጋጀ ነው። እንደ ነጋዴ፣ ሱቅዎን እና እቃዎችዎን በሻጭ የስራ ገጽ ያስተዳድሩ።',
  },
  admin_only_notice: {
    en: 'Security Alert: Only verified administrators with authorized credentials can enter this console.',
    am: 'የደህንነት ማስጠንቀቂያ፡ የተረጋገጡ የአስተዳዳሪ ምስክር ወረቀት ያላቸው ብቻ ወደዚህ ኮንሶል መግባት ይችላሉ።',
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
