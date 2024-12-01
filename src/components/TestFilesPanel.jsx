/*
 *
 * This component generates the list of imageIds to be displayed
 *
 */
import React, { useState, useEffect, useRef } from 'react';
import { volumeLoader } from "@cornerstonejs/core"

import CSStackViewPanel from './CSSTackViewPanel';
import CSVolumeViewPanel from './CSVolumeViewPanel';

function TestFilesPanel({ renderingEngine, toolGroup, series }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [files, setFiles] = useState([]);
  const [volumeId, setVolumeId] = useState(null);

  useEffect(() => {
    const initialize = async () => {

      // TODO: this can be cleaned up
      // This is just a quick and dirty implementation of reading the
      // frames data from a series
      // Perhaps this series could be a prop?
      // let series = '1.3.6.1.4.1.14519.5.2.1.2454584743577153265662869565560000617@260';
      let response = await fetch(`/papi/v1/series/${series}/frames`);
      let final_files = [];
      if (response.ok) {
        let resjson = await response.json();
        for (const o of resjson) {
          console.log(o);
          if (o.frames == 1) {
            final_files.push(`wadouri:/papi/v1/files/${o.file_id}/data`);
          } else {
            for (let i = 0; i < o.frames; i++) {
              final_files.push(`wadouri:/papi/v1/files/${o.file_id}/data?frame=${i}`);
            }
          }
        }
      }

      const newvolumeId = `vol-${series}`; // TODO fix this
      const volume = await volumeLoader.createAndCacheVolume(newvolumeId, {
        imageIds: final_files,
      })

      // Set the volume to load
      volume.load();



      setVolumeId(newvolumeId);
      setFiles(final_files); // TODO this should be removed
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
      <CSVolumeViewPanel
        renderingEngine={renderingEngine}
        viewportId='1'
        toolGroup={toolGroup}
        volumeId={volumeId}
        orientation="CORONAL"
      />
      <CSVolumeViewPanel
        renderingEngine={renderingEngine}
        viewportId='2'
        toolGroup={toolGroup}
        volumeId={volumeId}
        orientation="AXIAL"
      />
      <CSVolumeViewPanel
        renderingEngine={renderingEngine}
        viewportId='3'
        toolGroup={toolGroup}
        volumeId={volumeId}
        orientation="SAGITTAL"
      />
    </div>
  );
}

export default TestFilesPanel;
