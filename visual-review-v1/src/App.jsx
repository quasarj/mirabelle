import { useState } from 'react';

import Topbar from './components/Topbar';
import SidePanel from './components/SidePanel';
import ReviewPanel from './components/ReviewPanel';
import DescriptionPanel from './components/DescriptionPanel';

function App() {
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [showDescriptionPanel, setShowDescriptionPanel] = useState(true);
  
  return (
    <div className="grid grid-rows-[auto_minmax(0,1fr)] gap-2 w-screen h-screen p-2">
      <Topbar />

      <div className="flex rounded-lg">
        <div className={`transition-width ease-in-out ${showSidePanel ? 'w-72' : 'w-0'} h-full overflow-hidden`}>
          <SidePanel />
        </div>
        <ReviewPanel />
        <div className={`transition-width ease-in-out ${showDescriptionPanel ? 'w-72' : 'w-0'} h-full overflow-hidden`}>
          <DescriptionPanel />
        </div>
      </div>

      <div className="absolute flex left-2 bottom-2">
        <button onClick={() => setShowSidePanel(!showSidePanel)} className="mr-2 bg-blue-500 text-white px-4 py-2">
          {showSidePanel ? 'Hide' : 'Show'} Side Panel
        </button>
        <button onClick={() => setShowDescriptionPanel(!showDescriptionPanel)} className="bg-blue-500 text-white px-4 py-2">
          {showDescriptionPanel ? 'Hide' : 'Show'} Description Panel
        </button>
      </div>
    </div>
  )
}

export default App
