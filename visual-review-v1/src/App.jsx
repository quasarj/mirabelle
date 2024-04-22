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

      <div className="flex rounded-lg overflow-hidden">
        {showSidePanel && (
          <div className={`transition-width ease-in-out w-72 h-full`}>
            <SidePanel />
          </div>
        )}
        <ReviewPanel 
          showSidePanel={showSidePanel} 
          setShowSidePanel={setShowSidePanel} 
          showDescriptionPanel={showDescriptionPanel} 
          setShowDescriptionPanel={setShowDescriptionPanel}
        />
        {showDescriptionPanel && (
          <div className={`transition-width ease-in-out w-72 h-full`}>
            <DescriptionPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
