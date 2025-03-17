import React, { useState, useEffect } from 'react';

import { 
  RenderingEngine, 
  Enums, 
  volumeLoader,
  cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/core"
import * as cornerstone from "@cornerstonejs/core"
import { init as csRenderInit, imageLoader } from "@cornerstonejs/core"
import { init as csToolsInit } from "@cornerstonejs/tools"
import * as cornerstoneTools from '@cornerstonejs/tools'
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader"
import { cornerstoneNiftiImageLoader } from '@cornerstonejs/nifti-volume-loader'
import { expandSegTo3D } from '@/utilities';

volumeLoader.registerUnknownVolumeLoader(
  cornerstoneStreamingImageVolumeLoader 
)


function EnableCornerstone({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // new 2.0 init routines
      await csRenderInit()
      await csToolsInit()
      dicomImageLoaderInit({
        maxWebWorkers: 5,
        startWebWorkersOnDemand: true,
      });

      imageLoader.registerImageLoader('nifti', cornerstoneNiftiImageLoader);

      window.cornerstoneTools = cornerstoneTools;
      window.cornerstone = cornerstone;
      window.expandSegTo3D = expandSegTo3D;

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
    {children}
    </>
  );
};

export default EnableCornerstone;
