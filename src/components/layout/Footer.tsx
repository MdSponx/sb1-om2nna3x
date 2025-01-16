import React from 'react';
import { Container } from '../ui/Container';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';
import { useLanguage } from '../../contexts/LanguageContext';

const quickLinks = [
  { href: '/about', labelKey: 'footer.about' },
  { href: '/news', labelKey: 'footer.news' },
  { href: '/projects', labelKey: 'footer.projects' },
  { href: '/contact', labelKey: 'footer.contact' }
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white">
      <Container className="py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div>
            <div className="mb-3 sm:mb-4">
              <div className="w-[100px] sm:w-[120px] lg:w-[140px]">
                <Logo />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-400 whitespace-pre-line">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('footer.contactUs')}
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 whitespace-pre-line">
              {t('footer.address')}<br />
              {t('footer.phone')}<br />
              {t('footer.email')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {t('footer.followUs')}
            </h3>
            <SocialLinks />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('footer.description')}. {t('footer.copyright')}</p>
        </div>
      </Container>
    </footer>
  );
}