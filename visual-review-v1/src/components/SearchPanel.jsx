function SearchPanel() {
  return (
    <div id="searchPanel" className="flex gap-2 w-full rounded-lg justify-center">
      <label className="flex items-center space-x-1">
        {/*<span>Type:</span>*/}
        <select className="rounded-md border border-gray-300 h-8 px-2">
          <option>DICOM</option>
          <option>NIFTI</option>
        </select>
      </label>
      <label className="flex items-center space-x-1">
        {/*<span>File ID:</span>*/}
        <input type="text" placeholder="Enter File ID" className="rounded-md border border-gray-300 h-8 px-2"/>
      </label>
      <label className="flex items-center space-x-1">
        {/*<span>Series Instance UID:</span>*/}
        <input type="text" placeholder="Enter Series Instance UID" className="rounded-md border border-gray-300 h-8 px-2"/>
      </label>
      <label className="flex items-center space-x-1">
        {/*<span>Timepoint ID:</span>*/}
        <input type="text" placeholder="Enter Timepoint ID" className="rounded-md border border-gray-300 h-8 px-2"/>
      </label>
      <button className="bg-blue-500 text-white rounded-md px-4 h-8 flex items-center justify-center">
        Search
      </button>
    </div>
  );
}

export default SearchPanel;