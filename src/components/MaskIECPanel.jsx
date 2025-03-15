import React from 'react';

import { useState, useEffect } from 'react';
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { volumeLoader } from "@cornerstonejs/core";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import { 
	expandSegTo3D,
	loadIECVolumeAndSegmentation,
} from '../utilities';
import { finalCalc } from '../masking';

import Header from './Header';
import OperationsPanel from './OperationsPanel';
import VolumeView from './VolumeView';

import { Context } from './Context.js';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function MaskIECPanel({ details, files, iec }) {
  const volumeId = `vol-${iec}`;
  const segmentationId = `vol-${iec}-seg`;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  let coords; // coordinates of drawn mask

  // Load the volume into the cache
  useEffect(() => {
    const initialize = async () => {
      setIsInitialized(false);
      setIsErrored(false);
      // cornerstone.cache.purgeCache();

      try {
        await loadIECVolumeAndSegmentation(iec, volumeId, segmentationId);
      } catch (error) {
        console.log(error);
        // TODO: set an isError status here and display an error message?
        setErrorMessage(error);
        setIsErrored(true);
        return;
      }

      setIsInitialized(true);
    };

    initialize();
  }, [iec]); // passing no value causes this to run ONLY ONCE during mount

  async function handleExpand() {
    coords = expandSegTo3D(segmentationId);

    //flag data as updated so it will redraw
    cornerstoneTools.segmentation
        .triggerSegmentationEvents
        .triggerSegmentationDataModified(segmentationId);

    await segmentation.addSegmentationRepresentations(
      'coronal3d', [
        {
          segmentationId,
          type: csToolsEnums.SegmentationRepresentations.Surface,
        }
      ],
    );
  }
  function handleClear() {
    const segmentationVolume = cornerstone.cache.getVolume(segmentationId);
    const { dimensions, voxelManager } = segmentationVolume;

    let scalarData = voxelManager.getCompleteScalarDataArray();
    scalarData.fill(0);
    voxelManager.setCompleteScalarDataArray(scalarData);

    //flag data as updated so it will redraw
    cornerstoneTools.segmentation
      .triggerSegmentationEvents
      .triggerSegmentationDataModified(segmentationId);
  }
  async function handleAccept() {
    await finalCalc(coords, volumeId, iec, "cuboid", "mask");
  }


  // short-circuit if not loaded yet
  if (isErrored) {
    return (
      <>
        <div>There was an error loading this IEC :(</div>
        <p>{errorMessage.message}</p>
      </>
    );
  }
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

    return (
      <>
        <VolumeView volumeId={volumeId} segmentationId={segmentationId} />
        <OperationsPanel 
          onExpand={handleExpand}
          onClear={handleClear}
          onAccept={handleAccept}
        />
      </>
    )
}

export default MaskIECPanel
