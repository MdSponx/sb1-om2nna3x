import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { News } from './components/home/News';
import { Projects } from './components/home/Projects';
import { Footer } from './components/layout/Footer';
import { History } from './pages/about/History';
import { Mission } from './pages/about/Mission';
import { ThaiFilmDefinition } from './pages/about/ThaiFilmDefinition';
import { UnderProduction } from './pages/UnderProduction';
import { NewsPage } from './pages/news/News';
import { Committee } from './pages/members/Committee';
import { DirectorDirectory } from './pages/directory/DirectorDirectory';
import { RegisterPage } from './pages/register';
import { DirectorSearchPage } from './pages/register/director-search';
import { DepartmentPage } from './pages/register/department';
import { PublicMemberPage } from './pages/register/public-member';
import { LoginPage } from './pages/login';
import { CreateAccountPage } from './pages/create-account';
import { EditProfile } from './pages/profile/EditProfile';
import { PublicProfile } from './pages/profile/PublicProfile';
import { ThaiFilmsPage } from './pages/thaifilms';
import { MovieDetailsPage } from './pages/thaifilms/[id]';
import { AdminDashboard } from './pages/admin/dashboard';
import { ContentEditorPage } from './pages/admin/content';
import { ThaiFilmDataEditorPage } from './pages/admin/content/films';
import { MemberApplications } from './pages/admin/applications';
import { RoleManagement } from './pages/admin/roles';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function getContent() {
  const pathname = window.location.pathname;
  
  // Check if path matches movie details pattern
  if (pathname.match(/^\/thaifilms\/[^/]+$/)) {
    return <MovieDetailsPage />;
  }

  // Protected routes
  const protectedRoutes = {
    '/register/director-search': <DirectorSearchPage />,
    '/register/department': <DepartmentPage />,
    '/register/verify': <UnderProduction />,
    '/register/basic-info': <UnderProduction />,
    '/profile': <UnderProduction />,
    '/profile/public': <PublicProfile />,
    '/edit-profile': <EditProfile />,
    '/admin': <AdminDashboard />,
    '/admin/dashboard': <AdminDashboard />,
    '/admin/applications': <MemberApplications />,
    '/admin/roles': <RoleManagement />,
    '/admin/content': <ContentEditorPage />,
    '/admin/content/films': <ThaiFilmDataEditorPage />,
    '/admin/content/awards': <UnderProduction />,
    '/admin/content/projects': <UnderProduction />,
    '/admin/content/events': <UnderProduction />
  };

  if (pathname in protectedRoutes) {
    return (
      <ProtectedRoute>
        {protectedRoutes[pathname as keyof typeof protectedRoutes]}
      </ProtectedRoute>
    );
  }
  
  // Public routes
  switch (pathname) {
    case '/about/history':
      return <History />;
    case '/about/mission':
      return <Mission />;
    case '/about/thaifilm':
      return <ThaiFilmDefinition />;
    case '/news':
      return <NewsPage />;
    case '/members/committee':
      return <Committee />;
    case '/members/directory':
      return <DirectorDirectory />;
    case '/register':
      return <RegisterPage />;
    case '/register/public-member':
      return <PublicMemberPage />;
    case '/login':
      return <LoginPage />;
    case '/create-account':
      return <CreateAccountPage />;
    case '/thaifilms':
      return <ThaiFilmsPage />;
    case '/about/provision':
    case '/projects':
    case '/members':
    case '/members/list':
    case '/awards':
    case '/contact':
      return <UnderProduction />;
    default:
      return (
        <main>
          <Hero />
          <News />
          <Projects />
        </main>
      );
  }
}

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {getContent()}
      <Footer />
    </div>
  );
}