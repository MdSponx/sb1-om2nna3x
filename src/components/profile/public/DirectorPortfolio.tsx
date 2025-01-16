import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFirebase } from '../../../contexts/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Film, ArrowRight } from 'lucide-react';

interface DirectorPortfolioProps {
  userId: string;
}

interface DirectorData {
  Director: string;
  Movies: string;
  'Total Work': number;
}

export function DirectorPortfolio({ userId }: DirectorPortfolioProps) {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const [directorData, setDirectorData] = useState<DirectorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        const docRef = doc(db, 'directors', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDirectorData(docSnap.data() as DirectorData);
        }
      } catch (error) {
        console.error('Error fetching director data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDirectorData();
    }
  }, [db, userId]);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!directorData) {
    return null;
  }

  // Split movies and reverse the array to show newest first
  const movies = directorData.Movies?.split('•')
    .filter(movie => movie.trim())
    .map(movie => movie.trim())
    .reverse() || [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <a 
              href="#directing"
              className="text-2xl font-bold text-white hover:text-red-500 transition-colors"
            >
              {language === 'th' ? 'ผลงานการกำกับ' : 'Directing Portfolio'}
            </a>
            <a 
              href="#other-works"
              className="text-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              {language === 'th' ? 'ผลงานอื่นๆ' : 'Other Portfolio'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Film className="w-5 h-5 text-red-500" />
            <span className="text-lg font-bold text-red-500">
              {directorData['Total Work'] || movies.length}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <div 
              key={index}
              className="group relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200"
            >
              {/* Default background with film icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Film className="w-12 h-12 text-gray-700" />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100" />

              {/* Movie title */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-sm font-medium text-white line-clamp-3">
                  {movie}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}