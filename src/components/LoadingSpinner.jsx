import React from 'react';

import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="
      animate-spin
        h-8 w-8
        border-4
        border-b-gray-400
        border-r-gray-400
        border-t-transparent
        border-l-transparent
        rounded-full
        dark:border-b-white
        dark:border-r-white"></div>
      {/* <svg className="animate-spin rounded-full h-12 w-12 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.21 25.033">
        <g id="Group_26" data-name="Group 26" transform="translate(0 0)">
          <path id="Subtraction_4" data-name="Subtraction 4" d="M13.144,18.251a6.658,6.658,0,0,1-2.438-.464,6.672,6.672,0,0,1-2.318.418,6.829,6.829,0,0,1-1.3-.126,6.19,6.19,0,0,1-1.856-.463,7.4,7.4,0,0,1-2.112-1.363,8.91,8.91,0,0,1-1.7-2.111,10.313,10.313,0,0,1-1.1-2.726A10.666,10.666,0,0,1,.006,8.486C-.006,4.4,2.362,1,5.765.216A6.641,6.641,0,0,1,7.256.046,6.986,6.986,0,0,1,9.75.515c.561.334,5.452,3.48,4.55,10.958A7.871,7.871,0,0,0,15.576,7.7a7.948,7.948,0,0,0-.568-3.536A5.856,5.856,0,0,0,11.2.5,6.792,6.792,0,0,1,13.756,0a6.672,6.672,0,0,1,.807.049c4.235.52,7.18,5.015,6.566,10.019a10.111,10.111,0,0,1-2.738,5.851A7.385,7.385,0,0,1,13.144,18.251Z" transform="translate(0 6.782)" />
          <path id="Exclusion_2" data-name="Exclusion 2" d="M9.335,2.054C5,6.072,0,1.86,0,1.86S5.073-2.452,9.335,2.054Z" transform="matrix(0.966, 0.259, -0.259, 0.966, 1.627, 0)" />
        </g>
      </svg>*/}

      <p className="mt-2 text-gray-400 dark:text-white">Loading...</p>
    </div>
  );
}
