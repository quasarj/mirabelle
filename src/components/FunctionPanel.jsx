import React, { useState, useContext } from 'react';
import { Context } from './Context';

function FunctionPanel() {
  const { 
    maskFunction, setMaskFunction
  } = useContext(Context);

  function change(details) {
    setMaskFunction(details.target.name);
  }

  return (
    <>
      <label>Function:</label>
      <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
        <button 
            name="mask"
            title="Mask"
            onClick={change}
            className={`w-full ${ maskFunction === "mask" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
          <span className='material-icons'>masks</span>
        </button>
        <button 
            name="blackout"
            title="Blackout"
            onClick={change}
            className={`w-full ${ maskFunction === "blackout" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
          <span className='material-icons'>imagesearch_roller</span>
        </button>
        <button 
            name="sliceremove" 
            title="Slice Removal"
            onClick={change}
            className={`w-full ${ maskFunction === "sliceremove" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
          <span className='material-icons'>content_cut</span>
        </button>
      </li>
    </>
  );
}

export default FunctionPanel;
