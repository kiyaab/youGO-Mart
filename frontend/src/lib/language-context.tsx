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

  // About Us Page Translations
  about_nav_home: {
    en: 'Home',
    am: 'መነሻ',
    om: 'Mana',
  },
  about_nav_shop: {
    en: 'Shop',
    am: 'ሱቅ',
    om: 'Dukaana',
  },
  about_nav_about_us: {
    en: 'About Us',
    am: 'ስለ እኛ',
    om: "Waa'ee Keenya",
  },
  about_nav_contact: {
    en: 'Contact',
    am: 'አግኙን',
    om: 'Quunnamtii',
  },
  about_hero_eyebrow: {
    en: 'ABOUT US',
    am: 'ስለ እኛ',
    om: "WAA'EE KEENYA",
  },
  about_hero_title_1: {
    en: 'More Than a Store,',
    am: 'ከሱቅ በላይ፣',
    om: 'Mana Daldalaa Qofa Miti,',
  },
  about_hero_title_2: {
    en: "We're Your",
    am: 'እኛ የእርስዎ',
    om: 'Nuti Kan Keessani',
  },
  about_hero_title_highlight: {
    en: 'Shopping Partner.',
    am: 'የግብይት አጋር ነን።',
    om: 'Hiriyaa Bittaa Keessaniiti.',
  },
  about_hero_desc: {
    en: "At youGO-mart, we believe shopping should be simple, fast, and enjoyable. We're here to bring your everyday needs closer to you — with convenience, trust, and a smile.",
    am: 'በyouGO-mart ግብይት ቀላል፣ ፈጣን እና አስደሳች መሆን አለበት ብለን እናምናለን። የዕለት ተዕለት ፍላጎቶችዎን በምቾት፣ በእምነት እና በፈገግታ ወደ እርስዎ ለማቅረብ እዚህ ነን።',
    om: 'youGO-mart keessatti bittaan salphaa, ariifataa fi kan gammachiisu ta\'uu qaba jennee amanna. Fedhii keessan guyyaa guyyaa mijaa\'ina, amantii fi seeqaan gara keessanitti fiduuf as jirra.',
  },
  about_fast_delivery: {
    en: 'Fast Delivery',
    am: 'ፈጣን ማድረስ',
    om: 'Dhaqqabsiisa Ariifataa',
  },
  about_fast_delivery_desc: {
    en: 'At your door, on time',
    am: 'ደጃፍዎ ድረስ፣ በሰዓቱ',
    om: 'Balbala keessanitti, yeroon',
  },
  about_trusted: {
    en: 'Trusted by Millions',
    am: 'በብዙዎች የታመነ',
    om: 'Miliyoonaan Kan Amaname',
  },
  about_trusted_desc: {
    en: 'Your satisfaction matters',
    am: 'እርካታዎ ቀዳሚ ጉዳያችን ነው',
    om: 'Gammachuun keessan dhimma duraati',
  },
  about_badge_shop_smarter: {
    en: 'Shop Smarter, Live Better',
    am: 'በብልሃት ይሸምቱ፣ በደስታ ይኑሩ',
    om: 'Ogeessaan Bitaa, Gaarii Jiraadhaa',
  },

  // Mission
  about_mission_eyebrow: {
    en: 'OUR MISSION',
    am: 'ተልዕኳችን',
    om: 'ERGAMA KEENYA',
  },
  about_mission_title: {
    en: 'Building a Smarter Shopping Future',
    am: 'ብልህ የዲጂታል ግብይት ወደፊት መገንባት',
    om: 'Bittaa Ammayyaa Fuulduraa Ijaaruu',
  },
  about_mission_desc: {
    en: 'We created youGO-mart to make everyday shopping easier, faster, and more affordable for everyone. Our mission is to connect people with the products they need — anytime, anywhere — while supporting local businesses and building a stronger digital economy in Ethiopia and beyond.',
    am: 'youGO-mart የተፈጠረው የዕለት ተዕለት ግብይትን ለሁሉም ሰው ቀላል፣ ፈጣን እና ተመጣጣኝ ለማድረግ ነው። ተልዕኳችን ሰዎችን ከሚፈልጉት ምርቶች ጋር — በማንኛውም ጊዜ፣ በማንኛውም ቦታ — ማገናኘት ሲሆን፣ ሀገር በቀል ንግዶችን መደገፍ እና በኢትዮጵያ ጠንካራ ዲጂታል ኢኮኖሚ መገንባት ነው።',
    om: 'youGO-mart bittaa guyyaa guyyaa hundaaf salphaa, ariifataa fi gatii madaalawaa gochuuf kan uumamedha. Ergamni keenya namoota meeshaalee isaan barbaadan waliin wal qunnamsiisuudha — yeroo kamiyyuu, bakka kamiyyuu — daldala naannoo deeggaruu fi diinagdee dijitaalaa Itoophiyaa cimsudha.',
  },
  about_val_convenience: {
    en: 'Convenience',
    am: 'ምቹነት',
    om: "Mijaa'ina",
  },
  about_val_convenience_desc: {
    en: 'Shop from anywhere.',
    am: 'ከየትኛውም ቦታ ሆነው ይሸምቱ።',
    om: 'Bakka kamirraayyuu bitaa.',
  },
  about_val_trust: {
    en: 'Trust',
    am: 'አስተማማኝነት',
    om: 'Amanamummaa',
  },
  about_val_trust_desc: {
    en: 'Your data is safe.',
    am: 'መረጃዎ የተጠበቀ ነው።',
    om: 'Daataan keessan eegamaadha.',
  },
  about_val_community: {
    en: 'Community',
    am: 'ማህበረሰብ',
    om: 'Hawaasa',
  },
  about_val_community_desc: {
    en: 'Supporting local.',
    am: 'ሀገር በቀል ንግዶችን እንደግፋለን።',
    om: 'Daldala naannoo deeggaruu.',
  },
  about_val_sustainability: {
    en: 'Sustainability',
    am: 'ዘላቂነት',
    om: 'Itti fufiinsa',
  },
  about_val_sustainability_desc: {
    en: 'A better tomorrow.',
    am: 'ለተሻለ ነገ።',
    om: "Boruu fooyya'aaf.",
  },
  about_door_to_door: {
    en: 'From Our Store to Your Door',
    am: 'ከሱቃችን እስከ ደጃፍዎ',
    om: 'Dukaana Keenya Irraa Hanga Balbala Keessaniitti',
  },

  // Stats
  about_stat_1_val: { en: '100%', am: '100%', om: '100%' },
  about_stat_1_label: { en: 'Commission-Free', am: 'ከኮሚሽን ነፃ', om: 'Komishinii Malee' },
  about_stat_1_sub: { en: '0% fees on all standard listings', am: '0% ክፍያ ለመደበኛ ማስታወቂያዎች', om: 'Kaffaltii 0% tarreeffamoota hundarra' },

  about_stat_2_val: { en: '10K+', am: '10K+', om: '10K+' },
  about_stat_2_label: { en: 'Products Available', am: 'የሚገኙ ምርቶች', om: 'Oomishaalee Argaman' },
  about_stat_2_sub: { en: 'Across Addis Ababa & regions', am: 'በአዲስ አበባ እና በክልሎች', om: 'Finfinnee fi naannolee keessatti' },

  about_stat_3_val: { en: 'Direct', am: 'ቀጥታ', om: 'Kallattiin' },
  about_stat_3_label: { en: 'Buyer-Seller Chat', am: 'የገዢና ሻጭ ግንኙነት', om: 'Mariin Bittaa fi Gurguraa' },
  about_stat_3_sub: { en: 'Phone, WhatsApp & Telegram', am: 'በስልክ፣ ዋትስአፕ እና ቴሌግራም', om: 'Bilbila, WhatsApp fi Telegram' },

  about_stat_4_val: { en: 'Verified', am: 'የተረጋገጠ', om: 'Mirkanaa\'aa' },
  about_stat_4_label: { en: 'Community Trust', am: 'የማህበረሰብ እምነት', om: 'Amantaa Hawaasaa' },
  about_stat_4_sub: { en: 'Safe direct transactions', am: 'ደህንነቱ የተጠበቀ ቀጥታ ግብይት', om: 'Daldala qajeelaa nagaa' },

  // Story
  about_story_eyebrow: {
    en: 'OUR STORY',
    am: 'ታሪካችን',
    om: 'SEENA KEENYA',
  },
  about_story_title: {
    en: 'From a Simple Idea to a Growing Community',
    am: 'ቀላል ከሆነ ሃሳብ እስከ ተወዳጅ ማህበረሰብ',
    om: 'Yaada Salphaa Irraa Gara Hawaasa Guddataatti',
  },
  about_story_desc: {
    en: "youGO-mart started with a simple idea: make shopping more accessible, more enjoyable, and more convenient. We're building an experience that brings customers, products, and businesses closer together — one order at a time.",
    am: 'youGO-mart የተጀመረው በቀላል ራዕይ ነው፡ ግብይትን የበለጠ ተደራሽ፣ አስደሳች እና ምቹ ማድረግ። ደንበኞችን፣ ምርቶችን እና የሀገር ውስጥ ንግዶችን የሚያቀራርብ የላቀ ተሞክሮ እየገነባን ነው።',
    om: 'youGO-mart yaada salphaa tokkoon jalqabe: bittaa caalaatti dhiyeessaa, gammachiisaa fi mijataa gochuu. Maamiltoota, oomishaalee fi daldaloota caalaatti walitti fiduuf hojjetaa jirra.',
  },
  about_learn_more: {
    en: 'Learn More',
    am: 'የበለጠ ይወቁ',
    om: 'Dabalata Baraa',
  },
  about_story_badge: {
    en: 'Together We Go Further',
    am: 'አብረን ሩቅ እንጓዛለን',
    om: 'Waliin Fagootti Imalla',
  },

  // Final CTA
  about_cta_title: {
    en: 'Ready to start shopping?',
    am: 'መሸመት ለመጀመር ዝግጁ ኖት?',
    om: 'Bittaa jalqabuuf qophiidhaa?',
  },
  about_cta_desc: {
    en: 'Discover a simpler way to shop with youGO-mart.',
    am: 'በyouGO-mart ቀላል እና ዘመናዊ የግብይት መንገድን ያግኙ።',
    om: 'Mala bittaa salphaa youGO-mart waliin baruu.',
  },
  about_cta_btn: {
    en: 'Register Now',
    am: 'አሁኑኑ ይመዝገቡ',
    om: "Ammuma Galmaa'aa",
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
