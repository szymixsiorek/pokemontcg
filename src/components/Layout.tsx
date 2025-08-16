
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="h-12 flex items-center border-b">
            <SidebarTrigger className="ml-2" />
            <Header />
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
