import React from 'react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setStackConfig, setVolumeConfig } from '@/features/presentationSlice';

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
import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { StackView } from '@/features/stack-view';

import { Context } from './Context.js';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function MaskIECPanel({ iec, volumetric }) {
  console.log(">>>>", iec, "volumetric:", volumetric);

  const dispatch = useDispatch();

  const [volumeId, setVolumeId] = useState()
  const [segmentationId, setSegmentationId] = useState();
  const [imageIds, setImageIds] = useState()

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  let coords; // coordinates of drawn mask

  // Load the volume into the cache
  useEffect(() => {
    console.log("MaskIECPanel useEffect[iec]:", iec);
    const initializeVolume = async () => {
      // setIsInitialized(false);
      setIsErrored(false);
      // cornerstone.cache.purgeCache();
      let volumeId = `vol-${iec}`;
      let segmentationId = `vol-${iec}-seg`;

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
      setVolumeId(volumeId);
      setSegmentationId(segmentationId);

      dispatch(setVolumeConfig());
    };

    const initializeStack = async () => {
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
        `iec:${iec}`,
        SeriesInstanceUID:
        "any",
        wadoRsRoot: "/papi/v1/wadors",
      })
      setImageIds(imageIds);
      setIsInitialized(true);
      
      dispatch(setStackConfig());
    };

    if (volumetric) {
      initializeVolume();
    } else {
      initializeStack();
    }
  }, [iec, volumetric]);

  async function handleExpand() {
    coords = expandSegTo3D(segmentationId);

    //flag data as updated so it will redraw
    cornerstoneTools.segmentation
        .triggerSegmentationEvents
        .triggerSegmentationDataModified(segmentationId);


    // TODO I don't like this being here, perhaps put it inside VolumeView
    // and expose a callback that can be called from here? 
    const renderingEngine = cornerstone.getRenderingEngines()[0];
    const viewports = renderingEngine.getViewports();
    viewports.forEach(async (item) => {
      let viewportId = item.id;
      if (viewportId.startsWith("coronal3d")) {
        await segmentation.addSegmentationRepresentations(
          viewportId, [
            {
              segmentationId,
              type: csToolsEnums.SegmentationRepresentations.Surface,
            }
          ],
        );
      }
    });

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
    console.log(coords, volumeId, iec);
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
    return <LoadingSpinner />
  }

  if (volumetric) {
    console.log(">>>>> about to pass volumeId=", volumeId);
    return (
      <>
        <VolumeView 
          volumeId={volumeId} 
          segmentationId={segmentationId} 
          defaultPreset3d="CT-MIP" 
        />
        <OperationsPanel 
          onExpand={handleExpand}
          onClear={handleClear}
          onAccept={handleAccept}
        />
      </>
    )
  } else {
    return (
      <>
        <StackView frames={imageIds}/>
      </>
    );
  }
}

export default MaskIECPanel
