import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:justify-start lg:items-start">
      <Sidebar />
      <div className="w-full min-h-screen flex-1">
        <Outlet /> 
      </div>
    </div>
  )
}

export default Layout