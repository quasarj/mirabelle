function ReviewPanel({ showSidePanel, setShowSidePanel, showDescriptionPanel, setShowDescriptionPanel }) {
  return (
    <div className="relative w-full bg-white rounded-lg border-4 border-blue-600 p-2 flex flex-col gap-2 mx-2">
        <button
        onClick={() => setShowSidePanel(!showSidePanel)}
        className={`flex items-center justify-center w-10 h-10 leading-10 absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 border-0 rounded-full p-2 transition-transform ${showSidePanel ? '' : 'rotate-180'}`}
      
      >
        <span className="material-icons text-white">chevron_left</span>
      </button>
      <button
        onClick={() => setShowDescriptionPanel(!showDescriptionPanel)}
        className={`flex items-center justify-center absolute w-10 h-10 leading-10 top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-blue-500 rounded-full p-2 transition-transform ${showDescriptionPanel ? '' : 'rotate-180'}`}
      
      >
        <span className="material-icons text-white">chevron_right</span>
      </button>

      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2">
          <button>Back</button>
          <button>Forward</button>
        </div>
        <div className="flex gap-2">
          <button>Volumes View</button>
          <button>Projections View</button>
          <button>3D View</button>
        </div>
      </div>
      <div className="flex text-center gap-2 h-my-2 flex-grow">
        <div className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center"><p>Coronal View</p></div>
        <div className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center mr-1 ml-1"><p>Sagittal View</p></div>
        <div className="rounded-lg border-2 border-gray-100 w-1/3 flex flex-col justify-center items-center"><p>3D View</p></div>
      </div>
      <div className="w-full flex justify-center gap-2">
        <button>Good</button>
        <button>Bad</button>
        <button>Blank</button>
        <button>Scout</button>
        <button>Other</button>
      </div>
      
    </div>
  );
}

export default ReviewPanel;