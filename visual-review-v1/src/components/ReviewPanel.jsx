function ReviewPanel() {
  return (
    <div className="relative w-full bg-white rounded-lg border-4 border-blue-600 p-2 flex flex-col gap-2 mx-2">
        <button className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 leading-none rounded-3xl w-min font-black">{">"}</button>
        <button className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 leading-none rounded-3xl w-min font-black">{"<"}</button>
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