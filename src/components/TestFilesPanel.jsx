import React, { useState, useEffect, useRef } from 'react';
import TestPanel from './TestPanel';

function TestFilesPanel({ renderingEngine, toolGroup }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const initialize = async () => {

      // TODO: this can be cleaned up
      // This is just a quick and dirty implementation of reading the
      // frames data from a series
      // Perhaps this series could be a prop?
      let series = '1.3.6.1.4.1.14519.5.2.1.2454584743577153265662869565560000617@260';
      let response = await fetch(`/papi/v1/series/${series}/frames`);
      let final_files = [];
      if (response.ok) {
        let resjson = await response.json();
        for (const o of resjson) {
          console.log(o);
          for (let i = 0; i < o.frames; i++) {
            final_files.push(`wadouri:/papi/v1/files/${o.file_id}/data?frame=${i}`);
          }
        }
      }

      setFiles(final_files);
      setIsInitialized(true);
    };

    initialize();
  }, []); // passing no value causes this to run ONLY ONCE during mount

  // short-circuit if Cornerstone hasn't loaded yet
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div id="testFilesPanel" className=" p-6 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900">
      These two components are showing the same stack
      <TestPanel 
        renderingEngine={renderingEngine}
        viewportId='1'
        toolGroup={toolGroup}
        imageIds={files}
      />
      <TestPanel 
        renderingEngine={renderingEngine}
        viewportId='2'
        toolGroup={toolGroup}
        imageIds={files}
      />
    </div>
  );
}

export default TestFilesPanel;
