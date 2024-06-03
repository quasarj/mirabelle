import React from 'react';
import logoLight from '../assets/mirabelle-logo-light.svg';
import logoDark from '../assets/mirabelle-logo-dark.svg'; 

function Header({title}) {
  return (
    <div id="header" className=" h-12 flex items-center px-6 rounded-lg bg-blue-100 dark:bg-blue-950">
      <div id="logo" className="h-10">
        {/* Light theme logo */}
        <img src={logoLight} alt="Logo Light" className="w-full h-full object-contain dark:hidden" />
        {/* Dark theme logo */}
        <img src={logoDark} alt="Logo Dark" className="w-full h-full object-contain hidden dark:block" />
      </div>
      <div id="title" className="flex-1 text-left ml-2">{title}</div>
      <div id="username" className="flex-1 text-right">Username</div>
    </div>
  );
}

export default Header;