import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header.tsx';
import Footer from './footer.tsx';
import Side from './side.tsx';

const Layout =()=> {
  return (
    <div className='layout'>
      <Header />
      <Side />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}

export default Layout;
