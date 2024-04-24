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

      <div id="middleTopPanel" className="w-full flex justify-between items-center">
        <div id="navigationPanel" className="flex gap-2">
          <button id="goBack">Back</button>
          <button id="skipForward">Forward</button>
        </div>
        <div id="editViewPanel" className="flex gap-2">
          <button id="viewVolume">Volumes View</button>
          <button id="viewProjections">Projections View</button>
          <button id="3dView">3D View</button>
        </div>
      </div>
      <div id="viewPanel" className="flex text-center gap-2 h-my-2 flex-grow">
        <div id="volumeContent" className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center"><p>Coronal View</p></div>
        <div id="mipContent" className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center mr-1 ml-1"><p>Sagittal View</p></div>
        <div id="t3dContent" className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center"><p>3D View</p></div>
      </div>
      <div id="markPanel" className="w-full flex justify-center gap-2">
        <button id="markGood">Good</button>
        <button id="markBad">Bad</button>
        <button id="markBlank">Blank</button>
        <button id="markScout">Scout</button>
        <button id="markOther">Other</button>
      </div>
      
    </div>
  );
}

export default MiddlePanel;