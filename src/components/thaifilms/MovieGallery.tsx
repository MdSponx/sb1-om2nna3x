import React from 'react';
import { MovieCard } from './MovieCard';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Movie } from '../../types/movie';

interface MovieGalleryProps {
  movies: Movie[];
  onMovieClick?: (movieId: string) => void;
  isEditable?: boolean;
}

export function MovieGallery({ movies, onMovieClick, isEditable = false }: MovieGalleryProps) {
  const { language } = useLanguage();

  if (!movies.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่พบภาพยนตร์ที่ตรงกับการค้นหา'
            : 'No movies found matching your search'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onMovieClick={onMovieClick}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}