import React from 'react';
import { Container } from '../../components/ui/Container';
import { SearchBar } from '../../components/directory/SearchBar';
import { SearchResults } from '../../components/directory/SearchResults';
import { useDirectorSearch } from '../../hooks/useDirectorSearch';
import { useLanguage } from '../../contexts/LanguageContext';

export function DirectorDirectory() {
  const { searchState, searchDirectors, clearSearch } = useDirectorSearch();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-16">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {language === 'th' ? 'ทำเนียบผู้กำกับ' : 'Director Directory'}
              </h1>
              <p className="text-lg text-gray-400">
                {language === 'th' 
                  ? 'ค้นหาและเรียนรู้เกี่ยวกับผู้กำกับภาพยนตร์ไทย' 
                  : 'Search and learn about Thai film directors'}
              </p>
            </div>

            <div className="mb-8">
              <SearchBar
                query={searchState.query}
                onSearch={searchDirectors}
                onClear={clearSearch}
                disabled={searchState.isSearching}
              />
            </div>

            <SearchResults searchState={searchState} />
          </div>
        </Container>
      </div>
    </div>
  );
}