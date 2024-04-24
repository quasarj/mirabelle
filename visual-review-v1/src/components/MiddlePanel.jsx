import MarkPanel from './MarkPanel';
import MiddleTopPanel from './MiddleTopPanel';
import ViewPanel from './ViewPanel';

function MiddlePanel({ showLeftPanel, setShowLeftPanel, showDescriptionPanel, setShowDescriptionPanel }) {
  return (
    <div id="middlePanel" className="relative w-full bg-white rounded-lg border-4 border-blue-600 p-2 flex flex-col gap-2 mx-2">
        <button
        id="leftPanelButton"
        onClick={() => setShowLeftPanel(!showLeftPanel)}
        className={`flex items-center justify-center w-9 h-9 leading-9 absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 border-0 rounded-full p-2 transition-transform ${showLeftPanel ? '' : 'rotate-180'}`}
      
      >
        <span className="material-icons text-white">chevron_left</span>
      </button>
      <button
        id="rightPanelButton"
        onClick={() => setShowDescriptionPanel(!showDescriptionPanel)}
        className={`flex items-center justify-center absolute w-9 h-9 leading-9 top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-blue-500 rounded-full p-2 transition-transform ${showDescriptionPanel ? '' : 'rotate-180'}`}
      
      >
        <span className="material-icons text-white">chevron_right</span>
      </button>

      <MiddleTopPanel />
      <ViewPanel />
      <MarkPanel />
    </div>
  );
}

export default MiddlePanel;