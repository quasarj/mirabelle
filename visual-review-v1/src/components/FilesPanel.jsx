function FilesPanel() {
  return (
    <div id="filesPanel" className="flex-grow bg-gray-100 p-6 rounded-lg overflow-hidden">
      <div className="mb-2 text-lg font-semibold">Files</div>
      <ul className="h-full overflow-y-scroll">
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file1.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file2.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file3.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file4.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file5.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file3.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file4.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file5.dcm</li>
          <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file1.dcm</li>
          <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file3.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file4.dcm</li>
        <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file5.dcm</li>
          <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file1.dcm</li>
          <li className="mb-2 p-2 bg-white cursor-pointer hover:bg-gray-200 rounded-lg">file1.dcm</li>
      </ul>
      <div className="h-6 w-full"></div>
    </div>
  );
}

export default FilesPanel;