import React from 'react';
import { Container } from '../ui/Container';
import { ProjectSlider } from './ProjectSlider';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { projects } from '../../data/projects';

export function Projects() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-24 bg-black">
      <Container>
        <div className="flex flex-row justify-between items-center gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {t('projects.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 font-light">
              {t('projects.subtitle')}
            </p>
          </div>
          <a 
            href="/projects" 
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2
            bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 
            text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            {t('projects.seeAll')}
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
        <ProjectSlider projects={projects} />
      </Container>
    </section>
  );
}