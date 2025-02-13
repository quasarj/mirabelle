import React from 'react';

import { useState, useEffect } from 'react';
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { volumeLoader } from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import { expandSegTo3D } from '../utilities';
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
  const segId = "MY_SEGMENTATION_ID";
  const [isInitialized, setIsInitialized] = useState(false);
  const [volumeId, setVolumeId] = useState(null);
  let coords; // coordinates of drawn mask

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

      const segmentationId = 'MY_SEGMENTATION_ID';

      // Create a segmentation of the same resolution as the source data for the CT volume
      volumeLoader.createAndCacheDerivedLabelmapVolume(newvolumeId, {
        volumeId: segmentationId,
      });

      segmentation.addSegmentations([
        {
          segmentationId,
          representation: {
            // The type of segmentation
            type: csToolsEnums.SegmentationRepresentations.Labelmap,
            // The actual segmentation data, in the case of labelmap this is a
            // reference to the source volume of the segmentation.
            data: {
              volumeId: segmentationId,
            },
          },
        },
      ]);


      // Set the volume to load
      volume.load();

      setVolumeId(newvolumeId);
      setIsInitialized(true);
    };

    initialize();
  }, []); // passing no value causes this to run ONLY ONCE during mount

  async function handleExpand() {
    coords = expandSegTo3D(segId);

    //flag data as updated so it will redraw
    cornerstoneTools.segmentation
        .triggerSegmentationEvents
        .triggerSegmentationDataModified(segId);

    await segmentation.addSegmentationRepresentations(
      'coronal3d', [
        {
          segmentationId: segId,
          type: csToolsEnums.SegmentationRepresentations.Surface,
        }
      ],
    );
  }
  function handleClear() {
    const segmentationVolume = cornerstone.cache.getVolume(segId);
    const { dimensions, voxelManager } = segmentationVolume;

    let scalarData = voxelManager.getCompleteScalarDataArray();
    scalarData.fill(0);
    voxelManager.setCompleteScalarDataArray(scalarData);

    //flag data as updated so it will redraw
    cornerstoneTools.segmentation
        .triggerSegmentationEvents
        .triggerSegmentationDataModified(segId);
  }
  async function handleAccept() {
    await finalCalc(coords, volumeId, iec, "cuboid", "mask");
  }


  // short-circuit if not loaded yet
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

    return (
      <>
        <VolumeView volumeId={volumeId} />
        <OperationsPanel 
          onExpand={handleExpand}
          onClear={handleClear}
          onAccept={handleAccept}
        />
      </>
    )
}

export default MaskIECPanel
