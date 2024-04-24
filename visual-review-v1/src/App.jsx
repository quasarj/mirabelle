import { useState } from 'react';

import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import MiddlePanel from './components/MiddlePanel';
import RightPanel from './components/RightPanel';

function App() {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showDescriptionPanel, setShowDescriptionPanel] = useState(true);
  
  return (
    <div id="app" className="grid grid-rows-[auto_minmax(0,1fr)] gap-2 w-screen h-screen p-2">
      <Header />
      <div id="main" className="flex rounded-lg">
        {showLeftPanel && (
          <div id="leftPanel">
            <LeftPanel />
          </div>
        )}
        <MiddlePanel
          showLeftPanel={showLeftPanel} 
          setShowLeftPanel={setShowLeftPanel} 
          showDescriptionPanel={showDescriptionPanel} 
          setShowDescriptionPanel={setShowDescriptionPanel}
        />
        {showDescriptionPanel && (
          <div id="rightPanel" className={`transition-width ease-in-out w-72 h-full`}>
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
