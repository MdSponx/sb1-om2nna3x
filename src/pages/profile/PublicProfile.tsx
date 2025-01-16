import React, { useEffect, useState } from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { ProfileHeader } from '../../components/profile/public/ProfileHeader';
import { DirectorPortfolio } from '../../components/profile/public/DirectorPortfolio';
import { CrewPortfolio } from '../../components/profile/public/CrewPortfolio';
import { PublicMemberInfo } from '../../components/profile/public/PublicMemberInfo';
import { CameraAnimation } from '../../components/shared/CameraAnimation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';

export function PublicProfile() {
  const { language } = useLanguage();
  const { userData, loading, error } = useUserData();
  const { db } = useFirebase();
  const [totalWorks, setTotalWorks] = useState(0);

  useEffect(() => {
    const fetchDirectorData = async () => {
      if (userData?.director_id) {
        try {
          const docRef = doc(db, 'directors', userData.director_id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const directorData = docSnap.data();
            setTotalWorks(directorData['Total Work'] || 0);
          }
        } catch (error) {
          console.error('Error fetching director data:', error);
        }
      }
    };

    if (userData?.occupation === 'director') {
      fetchDirectorData();
    }
  }, [db, userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' 
            ? 'ไม่พบข้อมูลผู้ใช้' 
            : 'User profile not found'}
        </p>
      </div>
    );
  }

  const socialLinks = {
    facebook: userData.facebook_url,
    youtube: userData.youtube_url,
    instagram: userData.instagram_url,
    vimeo: userData.vimeo_url,
    website: userData.website_url
  };

  // Only show stats for directors and crew members
  const isPublicMember = ['school student', 'college student', 'general people'].includes(userData.occupation || '');
  const stats = !isPublicMember ? {
    views: 0,
    projects: totalWorks,
    endorsements: 0
  } : undefined;

  return (
    <div className="min-h-screen bg-black">
      <ProfileHeader 
        coverImage={userData.cover_image_url}
        profileImage={userData.profile_image_url}
        name={language === 'th' ? userData.fullname_th : userData.fullname_en}
        nickname={language === 'th' ? userData.nickname_th : userData.nickname_en}
        occupation={userData.occupation}
        department={language === 'th' ? userData.department_th : userData.department_en}
        role={language === 'th' ? userData.role_th : userData.role_en}
        email={userData.email}
        socialLinks={socialLinks}
        stats={stats}
      />

      <Container className="py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {userData.occupation === 'director' ? (
            <DirectorPortfolio userId={userData.director_id} />
          ) : userData.occupation === 'crew' ? (
            <CrewPortfolio 
              department={language === 'th' ? userData.department_th : userData.department_en}
              role={language === 'th' ? userData.role_th : userData.role_en}
            />
          ) : (
            <PublicMemberInfo 
              occupation={userData.occupation}
              planSelection={userData.plan_selection}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export default PublicProfile;