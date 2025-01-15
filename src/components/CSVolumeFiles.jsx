/**
 *
 * This component loads the files into a volume 
 */
import React, { useState, useEffect, useRef } from 'react';
import { volumeLoader } from "@cornerstonejs/core";
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";

import CSVolumeViewPanel from './CSVolumeViewPanel';

function CSVolumeFiles({ renderingEngine, toolGroup, series, timepoint }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [volumeId, setVolumeId] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "doesn't really matter",
        SeriesInstanceUID:
          series,
        wadoRsRoot: `/papi/v1/wadors/timepoint/${timepoint}`,
      })

      const newvolumeId = `vol-${series}`; // TODO fix this
      const volume = await volumeLoader.createAndCacheVolume(newvolumeId, {
        imageIds,
      })

      // Set the volume to load
      volume.load();



      setVolumeId(newvolumeId);
      setIsInitialized(true);
    };

    initialize();
  }, []); // passing no value causes this to run ONLY ONCE during mount

  // short-circuit if Cornerstone hasn't loaded yet
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
    </>
  );
}

export default CSVolumeFiles;
