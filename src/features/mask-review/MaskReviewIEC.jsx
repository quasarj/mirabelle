import React from 'react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setStackConfig, setVolumeConfig } from '@/features/presentationSlice';
import { setTitle, setLoading } from '@/features/optionSlice';
import toast from 'react-hot-toast';

import createImageIdsAndCacheMetaData from "@/lib/createImageIdsAndCacheMetaData";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  expandSegTo3D,
  isSegFlat,
  loadVolumeAndSegmentation,
  getIECInfo,
} from '@/utilities';
import { getDicomDetails } from '@/visualreview';
import { finalCalc } from '@/masking';


import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { StackView } from '@/features/stack-view';
import { ToolsPanel } from '@/features/tools';
import OperationsPanel from '@/components/OperationsPanel';
import NavigationPanel from '@/components/NavigationPanel';

import RouteLayout from '@/components/RouteLayout';

import './MaskReviewIEC.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

export default function MaskReviewIEC({ iec, vr, onNext, onPrevious }) {

  const [renderingEngine, setRenderingEngine] = useState(cornerstone.getRenderingEngine("re1"));

  const dispatch = useDispatch();

  const [volumeId, setVolumeId] = useState()
  const [imageIds, setImageIds] = useState()

  const [toolGroup, setToolGroup] = useState();
  const [toolGroup3d, setToolGroup3d] = useState();
  const [preset3d, setPreset3d] = useState("CT-MIP");

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [volumetric, setVolumetric] = useState(true);
  const [expanded, setExpanded] = useState(false);

  let viewer;

  let coords; // coordinates of drawn mask

  /**
   * Setup the RenderingEngine and ToolGroup
   */
  useEffect(() => {
    // Only create a new rendering engine if one doesn't already exist
    if (renderingEngine === undefined) {
      setRenderingEngine(new cornerstone.RenderingEngine("re1"));
    }

    let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");
    let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");

    setRenderingEngine(renderingEngine);
    setToolGroup(toolGroup);
    setToolGroup3d(toolGroup3d);

    // TODO: this is for debug use only
    window.ToolGroupManager = ToolGroupManager;
    window.renderingEngine = renderingEngine;
    window.toolGroup2d = toolGroup;

    // Teardown function
    return () => {
      ToolGroupManager.destroyToolGroup("toolGroup2d")
      ToolGroupManager.destroyToolGroup("toolGroup3d")
      // Do not delete the RenderingEngine here, it needs
      // to stay, for now
    };
  }, []);

  // Load the volume into the cache
  useEffect(() => {
    console.log("MaskReviewIEC useEffect[iec]:", iec);

    const initialize = async () => {
      const { volumetric } = await getDicomDetails(iec);
      setVolumetric(volumetric); // still update state

      if (volumetric) {
        await initializeVolume();
      } else {
        await initializeStack();
      }
    };

    const initializeVolume = async () => {
      setIsErrored(false);
      let volumeId = `vol-review-${iec}`;

      const { volumetric, frames } = await getIECInfo(iec, true); 
      const volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
        imageIds: frames,
      });

      volume.load();

      setIsInitialized(true);
      setVolumeId(volumeId);

      dispatch(setTitle("Mask Review Volume"));
      dispatch(setVolumeConfig());
      dispatch(setLoading(false));
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

      dispatch(setTitle("Mask Stack"));
      dispatch(setStackConfig());
    };

    initialize();

  }, [iec]);

  function handleAction(action) {
    toast.success("Action: " + action);
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
    viewer =
      <VolumeView
        volumeId={volumeId}
        defaultPreset3d="CT-MIP"
        toolGroup={toolGroup}
        toolGroup3d={toolGroup3d}
      />
  } else {
    viewer = <StackView toolGroup={toolGroup} frames={imageIds} />
  }

  return (
    <RouteLayout
      leftPanel={
        <>
          {vr &&
            <NavigationPanel
              onNext={onNext}
              onPrevious={onPrevious}
              currentIec={iec}
            />
          }
          <ToolsPanel
            toolGroup={toolGroup}
            defaultPreset={preset3d}
            onPresetChange={setPreset3d}
          />
        </>
      }
      middlePanel={
        <>
          {viewer}
          <OperationsPanel onAction={handleAction}/>
        </>
      }
      rightPanel={null}
    />
  )
}
