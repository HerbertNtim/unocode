'use client'

import Header from '@/components/shared/Header';
import { usePathname } from 'next/navigation';

const RootPage = ({ children }: { children: React.ReactNode }) => {
 const pathname = usePathname()
 const admin = pathname !== '/admin'
 
  return (
    <main className="flex flex-col h-screen">
      { admin && <Header />}
      <div className={`${admin && "flex-1 py-5 md:py-10"}`}>
        {children}
      </div>
    </main>
  );
};

export default RootPage;

