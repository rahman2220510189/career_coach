import React from 'react'
import Navbar from '../Navbar & Footer/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Navbar & Footer/Footer'

const Main = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/login' || location.pathname === '/signup';

  if (hideNavbarFooter) {
    return <Outlet />;
  }
  

  return (
    <div>
      <Navbar></Navbar>,
      <Outlet></Outlet>,
      <Footer></Footer>

    </div>
  )
}

export default Main
