/**
 * A simple Button Set component for use in the toolbar or elsewhere
 *
 * Keeps track of which button is active, and calls a callback on click
 */
import React from 'react';
import { useState } from 'react';


function MaterialButtonSet({ buttonConfig, initialActiveButton }) {
  const [activeButton, setActiveButton] = useState(initialActiveButton);

  function buttonClick(item) {
    item.action(); // call the supplied callback
    setActiveButton(item.name);
  }

  function getButtonClassNames(buttonName) {
    if (buttonName === activeButton) {
      // active CSS
      return 'w-full text-white bg-blue-500';
    } else {
      // default CSS
      return 'w-full bg-white dark:bg-slate-900';
    }
  }

    return (
      <>
        {buttonConfig.map((item, index) => (
          <button 
              title={item.name}
              onClick={() => buttonClick(item)}
              className={getButtonClassNames(item.name)}
          >
              <span className='material-symbols-rounded'>{item.icon}</span>
          </button>
        ))}
      </>
    )
}

export default MaterialButtonSet
