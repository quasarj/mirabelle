import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/mirabelle-logo-light.svg'; 

function Header({title}) {
  return (
    <div id="header" className=" h-12 flex items-center px-6 font-black rounded-lg dark:bg-opacity-5 bg-gray-100">
      <div id="logo" className="h-10">
        <Link to="/">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </Link>
      </div>
      <div id="title" className="flex-1 text-center">{title}</div>
      <div id="username" className="flex-1 text-right">Username</div>
    </div>
  );
}

export default Header;
