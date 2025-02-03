import React from 'react';

import { useState, useEffect } from 'react';
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { volumeLoader } from "@cornerstonejs/core";

import Header from './Header';
import ToolsPanel from './ToolsPanel';
import OperationsPanel from './OperationsPanel';
import VolumeView from './VolumeView';

import { Context } from './Context.js';

function MaskIECPanel({ details, files, iec }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [volumeId, setVolumeId] = useState(null);

  // Load the volume into the cache
  useEffect(() => {
    const initialize = async () => {
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          `iec:${iec}`,
        SeriesInstanceUID:
          "any",
        wadoRsRoot: "/papi/v1/wadors",
      })

      const newvolumeId = `vol-${iec}`;
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

  // short-circuit if not loaded yet
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

    return (
      <>
		<Header />
		<ToolsPanel />
		<VolumeView volumeId={volumeId} />
		<OperationsPanel />
      </>
    )
}

export default MaskIECPanel
