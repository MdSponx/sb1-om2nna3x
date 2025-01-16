import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ThaiFilmDataEditor } from './components/ThaiFilmDataEditor';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function ThaiFilmDataEditorPage() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการข้อมูลภาพยนตร์ไทย' : 'Thai Films Management'}
      subtitle={language === 'th' 
        ? 'จัดการและแก้ไขข้อมูลภาพยนตร์ในระบบ' 
        : 'Manage and edit film information in the system'}
    >
      <ThaiFilmDataEditor />
    </AdminLayout>
  );
}

export default ThaiFilmDataEditorPage;