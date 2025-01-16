import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative h-[600px] sm:h-[800px]"> {/* กำหนดความสูงแบบ fixed แทน min-height */}
      <div className="absolute inset-0">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2Fcover.jpg?alt=media&token=b95bcf3b-1342-486a-972d-4c372ac28fde"
          alt="Film director background"
          className="w-full h-full object-cover object-[75%_20%] sm:object-center brightness-50" 
        />
      </div>
      
      <div className="relative h-full flex items-center sm:items-center pt-0"> {/* ปรับ vertical alignment */}
        <Container className="px-6 md:px-8">
          <div className="max-w-2xl mx-auto md:mx-0 md:-ml-32 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-thin text-gray-200 mb-6 md:mb-8 px-4 md:px-0">
              {t('hero.subtitle')}
            </p>
            <Button className="
              w-full sm:w-auto 
              text-sm sm:text-base lg:text-lg
              px-4 sm:px-6 lg:px-8 
              py-2 sm:py-2.5 lg:py-3
              min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]
            ">
              {t('hero.cta')}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}