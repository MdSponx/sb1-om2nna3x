import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { NavMenu } from './NavMenu';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserDropdownMenu } from '../user/UserDropdownMenu';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const aboutSubmenu = [
    { href: '/about/history', labelKey: 'nav.about.history' },
    { href: '/about/mission', labelKey: 'nav.about.mission' },
    { href: '/about/provision', labelKey: 'nav.about.provision' },
    { href: '/about/thaifilm', labelKey: 'nav.about.thaifilm' }
  ];

  const membersSubmenu = [
    { href: '/members/committee', labelKey: 'nav.members.committee' },
    { href: '/members', labelKey: 'nav.members.list' },
    { href: '/members/directory', labelKey: 'nav.members.directory' }
  ];

  const navLinks = [
    { href: '/', label: t('nav.home'), current: false },
    { 
      href: '#',
      label: t('nav.about'), 
      current: false,
      submenuItems: aboutSubmenu
    },
    { href: '/news', label: t('nav.news'), current: false },
    { href: '/projects', label: t('nav.projects'), current: false },
    { 
      href: '#',
      label: t('nav.members'), 
      current: false,
      submenuItems: membersSubmenu
    },
    { href: '/awards', label: t('nav.awards'), current: false },
    { href: '/thaifilms', label: t('nav.thaifilms'), current: false }
  ];

  return (
    <nav className="fixed w-full z-50 py-6">
      <Container>
        <div className="relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-md rounded-full -z-10" />
          <div className="relative flex items-center h-[50px] sm:h-[55px] lg:h-[60px] px-4 sm:px-6 lg:px-8">
            <div className="absolute left-4 sm:left-6 lg:left-8 flex items-center gap-2">
              <div className="aspect-square w-[30px] sm:w-[35px] lg:w-[40px] flex items-center justify-center">
                <Logo />
              </div>
              <span className="text-white text-base sm:text-lg lg:text-xl font-semibold">
                TFDA
              </span>
            </div>
            
            <div className="hidden lg:flex flex-1 justify-center">
              <NavMenu 
                links={navLinks}
                mobile={false}
              />
            </div>

            <div className="absolute right-4 sm:right-6 lg:right-8 hidden lg:flex items-center space-x-4">
              <LanguageSwitcher />
              <UserDropdownMenu />
            </div>

            <button 
              className="absolute right-4 sm:right-6 lg:hidden text-white/90 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? 
                <X className="h-5 w-5 sm:h-6 sm:w-6" /> : 
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              }
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-2">
            <div className="rounded-2xl bg-black/10 backdrop-blur-md p-3">
              <NavMenu 
                links={navLinks} 
                mobile={true}
              />
              <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-white/10">
                <LanguageSwitcher />
                <UserDropdownMenu />
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}