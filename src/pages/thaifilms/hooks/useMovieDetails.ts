import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';

interface Director {
  name: string;
  name_en?: string;
  photo?: string;
}

interface MovieDetails {
  id: string;
  title: string;
  titleEng: string;
  director: string;
  rating: string;
  box_office: string;
  cast: string;
  genre: string;
  length: number;
  poster: string;
  production_house: string;
  release_date: string;
  studio: string;
  subgenre: string;
  synopsis: string;
  trailer_url: string;
  year_be: number;
  year_ce: number;
}

export function useMovieDetails(movieId: string) {
  const { db } = useFirebase();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError(new Error('No movie ID provided'));
        setLoading(false);
        return;
      }

      try {
        // Fetch movie data
        const movieDoc = await getDoc(doc(db, 'movies', movieId)).catch(err => {
          console.error('Error fetching movie document:', err);
          throw new Error('Failed to fetch movie details');
        });

        if (!movieDoc.exists()) {
          throw new Error('Movie not found');
        }

        const data = movieDoc.data();
        const movieData: MovieDetails = {
          id: movieDoc.id,
          title: data.Movie || '',
          titleEng: data.movieEng || '',
          director: data.Director || '',
          rating: data.Rating || '',
          box_office: data.box_office || '',
          cast: data.cast || '',
          genre: data.genre || '',
          length: data.length || 0,
          poster: data.poster || '',
          production_house: data.production_house || '',
          release_date: data.release_date || '',
          studio: data.studio || '',
          subgenre: data.subgenre || '',
          synopsis: data.synopsis || '',
          trailer_url: data.trailer || '',
          year_be: data.year_be || 0,
          year_ce: data.year_ce || 0
        };

        setMovie(movieData);

        // Fetch director data if available
        if (data.Director) {
          try {
            // Split director names by comma and trim whitespace
            const directorNames = data.Director.split(',').map((name: string) => name.trim());
            
            const directorsData: Director[] = [];
            
            // Fetch data for each director from users collection
            for (const directorName of directorNames) {
              try {
                // Query users collection by fullname_th
                const usersQuery = query(
                  collection(db, 'users'),
                  where('fullname_th', '==', directorName),
                  where('occupation', '==', 'director')
                );
                const usersSnapshot = await getDocs(usersQuery);
                
                if (!usersSnapshot.empty) {
                  const userData = usersSnapshot.docs[0].data();
                  directorsData.push({
                    name: userData.fullname_th,
                    name_en: userData.fullname_en,
                    photo: userData.profile_image_url
                  });
                } else {
                  // If no matching user found, add just the name
                  directorsData.push({
                    name: directorName
                  });
                }
              } catch (directorErr) {
                console.error(`Error fetching director data for ${directorName}:`, directorErr);
                // Add director with just the name if fetch fails
                directorsData.push({
                  name: directorName
                });
              }
            }

            setDirectors(directorsData);
          } catch (directorsErr) {
            console.error('Error processing directors:', directorsErr);
            // Don't fail the whole request if directors fetch fails
            setDirectors([{ name: data.Director }]);
          }
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch movie details'));
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [db, movieId]);

  return { movie, directors, loading, error };
}