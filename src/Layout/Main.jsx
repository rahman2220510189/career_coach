import React from 'react'
import Navbar from '../Navbar & Footer/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Navbar & Footer/Footer'

const Main = () => {
  return (
    <div>
      <Navbar></Navbar>,
      <Outlet></Outlet>,
      <Footer></Footer>

    </div>
  )
}

export default Main
