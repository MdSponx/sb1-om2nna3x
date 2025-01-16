import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Select } from '../../ui/select';
import { useLanguage } from '../../../contexts/LanguageContext';
import { X, Upload } from 'lucide-react';

// Helper functions for date formatting
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const formatDateForDB = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEng: z.string().optional(),
  director: z.string().min(1, 'Director is required'),
  release_date: z.string().min(1, 'Release date is required'),
  year_be: z.number(),
  year_ce: z.number(),
  genre: z.string().min(1, 'Genre is required'),
  subgenre: z.string().optional(),
  length: z.number().min(1, 'Length is required'),
  rating: z.string().optional(),
  cast: z.string().optional(),
  synopsis: z.string().optional(),
  trailer_url: z.string().url().optional(),
  production_house: z.string().optional(),
  studio: z.string().optional(),
  box_office: z.string().optional(),
  poster: z.string().url().optional()
});

type MovieFormData = z.infer<typeof movieSchema>;

const GENRES = [
  { value: 'Action', label: { th: 'แอคชัน', en: 'Action' } },
  { value: 'Adventure', label: { th: 'ผจญภัย', en: 'Adventure' } },
  { value: 'Animation', label: { th: 'แอนิเมชัน', en: 'Animation' } },
  { value: 'Biography', label: { th: 'ชีวประวัติ', en: 'Biography' } },
  { value: 'Comedy', label: { th: 'ตลก', en: 'Comedy' } },
  { value: 'Crime', label: { th: 'อาชญากรรม', en: 'Crime' } },
  { value: 'Documentary', label: { th: 'สารคดี', en: 'Documentary' } },
  { value: 'Drama', label: { th: 'ดราม่า', en: 'Drama' } },
  { value: 'Drama Experimental', label: { th: 'ดราม่าทดลอง', en: 'Drama Experimental' } },
  { value: 'Erotic', label: { th: 'อีโรติก', en: 'Erotic' } },
  { value: 'Family', label: { th: 'ครอบครัว', en: 'Family' } },
  { value: 'Fantasy', label: { th: 'แฟนตาซี', en: 'Fantasy' } },
  { value: 'Horror', label: { th: 'สยองขวัญ', en: 'Horror' } },
  { value: 'Musical', label: { th: 'เพลง', en: 'Musical' } },
  { value: 'Romance', label: { th: 'โรแมนซ์', en: 'Romance' } },
  { value: 'Romantic Comedy', label: { th: 'โรแมนติกคอมเมดี้', en: 'Romantic Comedy' } },
  { value: 'Sci-Fi', label: { th: 'ไซไฟ', en: 'Sci-Fi' } },
  { value: 'Suspense', label: { th: 'ระทึกขวัญ', en: 'Suspense' } },
  { value: 'TBC', label: { th: 'รอการจัดประเภท', en: 'TBC' } },
  { value: 'Thriller', label: { th: 'ระทึกใจ', en: 'Thriller' } },
  { value: 'War', label: { th: 'สงคราม', en: 'War' } }
] as const;

const SUBGENRES: Record<string, string[]> = {
  'Action': ['Martial Arts', 'War', 'Spy'],
  'Drama': ['Historical', 'Social', 'Family', 'Experimental'],
  'Comedy': ['Romantic Comedy', 'Slapstick', 'Satire'],
  'Horror': ['Supernatural', 'Psychological', 'Gore'],
  'Romance': ['Melodrama', 'Teen Romance', 'Adult Romance'],
  'Thriller': ['Crime', 'Mystery', 'Psychological'],
  'Sci-Fi': ['Space', 'Time Travel', 'Cyberpunk'],
  'Fantasy': ['Supernatural', 'Mythology', 'Magic'],
  'Documentary': ['Historical', 'Nature', 'Social'],
  'Animation': ['2D', '3D', 'Stop Motion']
};

interface MovieEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  movieId?: string;
  onSaveSuccess?: () => void;
}

export function MovieEditorPanel({
  isOpen,
  onClose,
  movieId,
  onSaveSuccess
}: MovieEditorPanelProps) {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema)
  });

  // Watch release_date to auto-calculate years
  const releaseDate = watch('release_date');

  useEffect(() => {
    if (releaseDate) {
      const date = new Date(releaseDate);
      const yearCE = date.getFullYear();
      const yearBE = yearCE + 543;
      setValue('year_ce', yearCE);
      setValue('year_be', yearBE);
    }
  }, [releaseDate, setValue]);

  // Fetch movie data if editing
  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        reset();
        return;
      }

      try {
        const movieDoc = await getDoc(doc(db, 'movies', movieId));
        if (movieDoc.exists()) {
          const data = movieDoc.data();
          
          // Format the release date for the input field
          const formattedDate = formatDateForInput(data.release_date);
          
          reset({
            title: data.Movie || '',
            titleEng: data.movieEng || '',
            director: data.Director || '',
            release_date: formattedDate,
            year_be: data.year_be || 0,
            year_ce: data.year_ce || 0,
            genre: data.genre || '',
            subgenre: data.subgenre || '',
            length: data.length || 0,
            rating: data.rating || '',
            cast: data.cast || '',
            synopsis: data.synopsis || '',
            trailer_url: data.trailer || '',
            production_house: data.production_house || '',
            studio: data.studio || '',
            box_office: data.box_office || '',
            poster: data.poster || ''
          });
          setSelectedGenre(data.genre || '');
          setPosterPreview(data.poster || null);
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(language === 'th' 
          ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' 
          : 'Error loading movie data');
      }
    };

    if (isOpen) {
      fetchMovie();
    }
  }, [db, movieId, isOpen, reset, language]);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGenre(value);
    setValue('genre', value);
    setValue('subgenre', '');
  };

  const onSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const movieData = {
        Movie: data.title,
        movieEng: data.titleEng,
        Director: data.director,
        release_date: formatDateForDB(data.release_date),
        year_be: data.year_be,
        year_ce: data.year_ce,
        genre: data.genre,
        subgenre: data.subgenre,
        length: data.length,
        rating: data.rating,
        cast: data.cast,
        synopsis: data.synopsis,
        trailer: data.trailer_url,
        production_house: data.production_house,
        studio: data.studio,
        box_office: data.box_office,
        poster: posterPreview || data.poster,
        updated_at: new Date().toISOString()
      };

      const docRef = doc(db, 'movies', movieId || crypto.randomUUID());
      await setDoc(docRef, movieData, { merge: true });

      if (onSaveSuccess) {
        onSaveSuccess();
      }

      onClose();
      reset();
      setPosterFile(null);
      setPosterPreview(null);
      setSelectedGenre('');
    } catch (err) {
      console.error('Error saving movie:', err);
      setError(language === 'th'
        ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        : 'Error saving movie data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full sm:w-[600px] bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {movieId 
              ? language === 'th' ? 'แก้ไขภาพยนตร์' : 'Edit Movie'
              : language === 'th' ? 'เพิ่มภาพยนตร์' : 'Add Movie'
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Poster Upload */}
            <div className="w-1/2 mx-auto mb-6">
              <Label className="block mb-2">
                {language === 'th' ? 'โปสเตอร์ภาพยนตร์' : 'Movie Poster'}
              </Label>
              <div 
                className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={() => document.getElementById('poster-upload')?.click()}
              >
                {posterPreview ? (
                  <img 
                    src={posterPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">
                      {language === 'th' ? 'คลิกเพื่ออัพโหลด' : 'Click to upload'}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePosterChange}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" required>
                {language === 'th' ? 'ชื่อภาพยนตร์ (ภาษาไทย)' : 'Movie Title (Thai)'}
              </Label>
              <Input
                id="title"
                {...register('title')}
                className="bg-gray-800 border-gray-700"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* English Title */}
            <div className="space-y-2">
              <Label htmlFor="titleEng">
                {language === 'th' ? 'ชื่อภาพยนตร์ (ภาษาอังกฤษ)' : 'Movie Title (English)'}
              </Label>
              <Input
                id="titleEng"
                {...register('titleEng')}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            {/* Director */}
            <div className="space-y-2">
              <Label htmlFor="director" required>
                {language === 'th' ? 'ผู้กำกับ' : 'Director'}
              </Label>
              <Input
                id="director"
                {...register('director')}
                className="bg-gray-800 border-gray-700"
              />
              {errors.director && (
                <p className="text-sm text-red-500">{errors.director.message}</p>
              )}
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <Label htmlFor="release_date" required>
                {language === 'th' ? 'วันที่เข้าฉาย' : 'Release Date'}
              </Label>
              <Input
                id="release_date"
                type="date"
                {...register('release_date')}
                className="bg-gray-800 border-gray-700"
              />
              {errors.release_date && (
                <p className="text-sm text-red-500">{errors.release_date.message}</p>
              )}
            </div>

            {/* Year BE/CE (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year_be">
                  {language === 'th' ? 'ปี พ.ศ.' : 'Year BE'}
                </Label>
                <Input
                  id="year_be"
                  type="number"
                  {...register('year_be')}
                  className="bg-gray-800 border-gray-700"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year_ce">
                  {language === 'th' ? 'ปี ค.ศ.' : 'Year CE'}
                </Label>
                <Input
                  id="year_ce"
                  type="number"
                  {...register('year_ce')}
                  className="bg-gray-800 border-gray-700"
                  readOnly
                />
              </div>
            </div>

            {/* Genre and Subgenre */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre" required>
                  {language === 'th' ? 'ประเภท' : 'Genre'}
                </Label>
                <select
                  id="genre"
                  {...register('genre')}
                  onChange={handleGenreChange}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
                >
                  <option value="">
                    {language === 'th' ? '-- เลือกประเภท --' : '-- Select Genre --'}
                  </option>
                  {GENRES.map(genre => (
                    <option key={genre.value} value={genre.value}>
                      {language === 'th' ? genre.label.th : genre.label.en}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-sm text-red-500">{errors.genre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subgenre">
                  {language === 'th' ? 'ประเภทย่อย' : 'Subgenre'}
                </Label>
                <select
                  id="subgenre"
                  {...register('subgenre')}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
                  disabled={!selectedGenre}
                >
                  <option value="">
                    {language === 'th' ? '-- เลือกประเภทย่อย --' : '-- Select Subgenre --'}
                  </option>
                  {selectedGenre && SUBGENRES[selectedGenre]?.map(subgenre => (
                    <option key={subgenre} value={subgenre}>
                      {subgenre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Length and Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length" >
                  {language === 'th' ? 'ความยาว (นาที)' : 'Length (minutes)'}
                </Label>
                <Input
                  id="length"
                  type="number"
                  {...register('length', { valueAsNumber: true })}
                  className="bg-gray-800 border-gray-700"
                />
                {errors.length && (
                  <p className="text-sm text-red-500">{errors.length.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">
                  {language === 'th' ? 'เรท' : 'Rating'}
                </Label>
                <Input
                  id="rating"
                  {...register('rating')}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            {/* Cast */}
            <div className="space-y-2">
              <Label htmlFor="cast">
                {language === 'th' ? 'นักแสดง' : 'Cast'}
              </Label>
              <Input
                id="cast"
                {...register('cast')}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <Label htmlFor="synopsis">
                {language === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
              </Label>
              <textarea
                id="synopsis"
                {...register('synopsis')}
                rows={4}
                className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Trailer URL */}
            <div className="space-y-2">
              <Label htmlFor="trailer_url">
                {language === 'th' ? 'URL ตัวอย่างภาพยนตร์' : 'Trailer URL'}
              </Label>
              <Input
                id="trailer_url"
                {...register('trailer_url')}
                className="bg-gray-800 border-gray-700"
                placeholder="https://www.youtube.com/watch?v="
              />
              {errors.trailer_url && (
                <p className="text-sm text-red-500">{errors.trailer_url.message}</p>
              )}
            </div>

            {/* Production Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="production_house">
                  {language === 'th' ? 'บริษัทผู้ผลิต' : 'Production House'}
                </Label>
                <Input
                  id="production_house"
                  {...register('production_house')}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studio">
                  {language === 'th' ? 'สตูดิโอ' : 'Studio'}
                </Label>
                <Input
                  id="studio"
                  {...register('studio')}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            {/* Box Office */}
            <div className="space-y-2">
              <Label htmlFor="box_office">
                {language === 'th' ? 'รายได้' : 'Box Office'}
              </Label>
              <Input
                id="box_office"
                {...register('box_office')}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-white text-white hover:bg-white hover:text-black w-32 h-10"
          >
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 w-32 h-10"
          >
            {isSubmitting
              ? language === 'th' ? 'กำลังบันทึก...' : 'Saving...'
              : language === 'th' ? 'บันทึก' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}