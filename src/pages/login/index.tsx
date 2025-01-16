import React from 'react';
import { Container } from '../../components/ui/Container';
import { LoginForm } from '../../components/auth/LoginForm';
import { useLanguage } from '../../contexts/LanguageContext';

export function LoginPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
            </h1>
            <p className="text-gray-400">
              {language === 'th' 
                ? 'เข้าสู่ระบบเพื่อจัดการข้อมูลสมาชิก' 
                : 'Sign in to manage your membership'}
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {language === 'th' ? 'ยังไม่มีบัญชี?' : "Don't have an account?"}{' '}
              <a href="/create-account" className="text-red-500 hover:text-red-400">
                {language === 'th' ? 'สร้างบัญชี' : 'Create Account'}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;