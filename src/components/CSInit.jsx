import React, { useState, useEffect } from 'react';

import { RenderingEngine, Enums, volumeLoader } from "@cornerstonejs/core";
import {init as csRenderInit} from "@cornerstonejs/core";
import * as cornerstone from "@cornerstonejs/core";
import {init as csToolsInit} from "@cornerstonejs/tools"
import * as cornerstoneTools from '@cornerstonejs/tools';
import {init as dicomImageLoaderInit} from "@cornerstonejs/dicom-image-loader"
import {
    cornerstoneStreamingImageVolumeLoader,
    cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

// volumeLoader.registerUnknownVolumeLoader(
//   cornerstoneStreamingImageVolumeLoader 
// )

function initVolumeLoader() {
  volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader('cornerstoneStreamingImageVolume', cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader('cornerstoneStreamingDynamicImageVolume', cornerstoneStreamingDynamicImageVolumeLoader);
  // volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
}

function initCornerstoneDICOMImageLoader() {
  const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
  cornerstoneDICOMImageLoader.configure({
      useWebWorkers: true,
      decodeConfig: {
          convertFloatPixelDataToInt: false,
          use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
      },
  });

  let maxWebWorkers = 1;

  if (navigator.hardwareConcurrency) {
      maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
  }

  const config = {
      maxWebWorkers,
      startWebWorkersOnDemand: false,
      taskConfiguration: {
          decodeTask: {
              initializeCodecsOnStartup: false,
              strict: false,
          },
      },
  };

  cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
}



function CSInit({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await csRenderInit();
      await csToolsInit();
      initVolumeLoader();
      initCornerstoneDICOMImageLoader();

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
      <div>
        <p>Children are below this</p>
        {children}
      </div>
    </>
  );
};

export default CSInit;
