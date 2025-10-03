
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

const pageLabels: Record<string, string> = {
  '/dashboard': 'Ana Panel',
  '/quests': 'Görev Tahtası', 
  '/boss': 'Boss Fight',
  '/exams': 'Deneme Sınavları',
  '/reports': 'Raporlarım',
  '/shop': 'Ödül Mağazası',
  '/settings': 'Motivasyon Ayarları',
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  
  // Admin paneli ve diğer özel sayfalar için layout kullanma
  if (pathname === '/' || pathname?.startsWith('/auth/') || pathname === '/profile-setup' || pathname === '/not-found' || pathname === '/admin') {
    return <>{children}</>;
  }

  const pageTitle = pageLabels[pathname] || 'LGS Liga';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Topbar title={pageTitle} showStats={true} />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
