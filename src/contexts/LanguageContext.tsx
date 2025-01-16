import React, { createContext, useContext, useState } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  th: {
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.about.history': 'ประวัติความเป็นมา',
    'nav.about.mission': 'พันธกิจ',
    'nav.about.provision': 'ข้อบัญญัติ',
    'nav.about.thaifilm': 'นิยามภาพยนตร์ไทย',
    'nav.news': 'ข่าวสาร',
    'nav.projects': 'โครงการ',
    'nav.members': 'สมาชิก',
    'nav.members.committee': 'กรรมการสมาคม',
    'nav.members.list': 'รายชื่อสมาชิก',
    'nav.members.directory': 'ทำเนียบผู้กำกับ',
    'nav.awards': 'รางวัลสมาคมฯ',
    'nav.thaifilms': 'ทำเนียบหนังไทย',
    'hero.title': 'ยินดีต้อนรับสู่ สมาคมผู้กำกับภาพยนตร์ไทย',
    'hero.subtitle': 'เสริมสร้างความแข็งแกร่งให้วงการภาพยนตร์ไทยผ่านความร่วมมือ การศึกษา และนวัตกรรม',
    'hero.cta': 'เช้าร่วมกับเรา',
    'news.title': 'ข่าวสารสมาคมฯ',
    'news.subtitle': 'ความคืบหน้าและเรื่องราวใหม่ๆเกิดขึ้นที่นี่',
    'news.seeAll': 'ดูทั้งหมด',
    'projects.title': 'โครงการของเรา',
    'projects.subtitle': 'ลงทะเบียนเข้าร่วมโครงการที่น่าสนใจได้ที่นี่',
    'projects.seeAll': 'ดูทั้งหมด',
    'footer.quickLinks': 'ลิงก์ด่วน',
    'footer.about': 'เกี่ยวกับเรา',
    'footer.news': 'ข่าวสาร',
    'footer.projects': 'โครงการ',
    'footer.contact': 'ติดต่อ',
    'footer.contactUs': 'ติดต่อเรา',
    'footer.address': 'เลขที่ 25/1 ซอยลาดพร้าว 60 ถนนลาดพร้าว\nแขวงวังทองหลาง เขตวังทองหลาง\nกรุงเทพมหานคร 10110',
    'footer.phone': 'โทร: +66 96-659-3969',
    'footer.email': 'อีเมล: contact@thaifilmdirectors.com',
    'footer.followUs': 'ติดตามเรา',
    'footer.description': 'สมาคมผู้กำกับภาพยนตร์ไทย\nส่งเสริมและพัฒนาวงการภาพยนตร์ไทย',
    'footer.copyright': 'สงวนลิขสิทธิ์',
    'committee.president': 'นายกสมาคม',
    'committee.board': 'กรรมการ',
    'committee.secretary': 'เลขาธิการ/เลขานุการ',
    'committee.advisor': 'ที่ปรึกษา',
    'committee.honoraryAdvisor': 'ที่ปรึกษากิตติมศักดิ์',
    'committee.pr': 'ฝ่ายประชาสัมพันธ์',
    'committee.error': 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.about.history': 'History',
    'nav.about.mission': 'Mission',
    'nav.about.provision': 'Provision',
    'nav.about.thaifilm': 'Thai Film Definition',
    'nav.news': 'News',
    'nav.projects': 'Projects',
    'nav.members': 'Members',
    'nav.members.committee': 'Committee',
    'nav.members.list': 'Members List',
    'nav.members.directory': 'Director Directory',
    'nav.awards': 'TFDA Awards',
    'nav.thaifilms': 'Thai Films',
    'hero.title': 'Welcome to Thai Film Director Association',
    'hero.subtitle': 'Strengthening the Thai film industry through collaboration, education, and innovation',
    'hero.cta': 'Join us',
    'news.title': 'News',
    'news.subtitle': 'Updates and new stories happen here',
    'news.seeAll': 'See All',
    'projects.title': 'Our Projects',
    'projects.subtitle': 'Register for our exciting projects here',
    'projects.seeAll': 'See All',
    'footer.quickLinks': 'Quick Links',
    'footer.about': 'About Us',
    'footer.news': 'News',
    'footer.projects': 'Projects',
    'footer.contact': 'Contact',
    'footer.contactUs': 'Contact Us',
    'footer.address': '25/1 Soi Ladprao 60, Ladprao Road\nWang Thonglang, Wang Thonglang\nBangkok 10110',
    'footer.phone': 'Tel: +66 96-659-3969',
    'footer.email': 'Email: contact@thaifilmdirectors.com',
    'footer.followUs': 'Follow Us',
    'footer.description': 'Thai Film Director Association\nPromoting and developing Thai cinema',
    'footer.copyright': 'All rights reserved',
    'committee.president': 'President',
    'committee.board': 'Board Members',
    'committee.secretary': 'Secretary',
    'committee.advisor': 'Advisors',
    'committee.honoraryAdvisor': 'Honorary Advisors',
    'committee.pr': 'Public Relations',
    'committee.error': 'Error loading data'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('th');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['th']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}