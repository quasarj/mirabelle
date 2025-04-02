import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-gray-400"></div>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );
}
