import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import { SimpleChat } from '../../features/chat';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Content area */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <Footer />
      
      {/* Live Chat Component */}
      <SimpleChat />
    </div>
  );
};

export default MainLayout;
