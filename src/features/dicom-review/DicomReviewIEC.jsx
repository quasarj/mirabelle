import React from 'react';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Enums, setStackConfig, setVolumeConfig } from '@/features/presentationSlice';
import { setTitle, setLoading, setOption } from '@/features/optionSlice';
import toast from 'react-hot-toast';

import createImageIdsAndCacheMetaData from "@/lib/createImageIdsAndCacheMetaData";
import { volumeLoader } from "@cornerstonejs/core";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import { loadIECVolumeAndSegmentation, getIECInfo, } from '@/utilities';
import { getDicomDetails, setDicomStatus, setMaskingFlag } from '@/visualreview';

import Header from '@/components/Header';

import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { StackView } from '@/features/stack-view';
import { ToolsPanel } from '@/features/tools';
import OperationsPanel from '@/components/OperationsPanel';
import NavigationPanel from '@/components/NavigationPanel';

import { Context } from '@/components/Context.js';
import RouteLayout from '@/components/RouteLayout';

import './DicomReviewIEC.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function DicomReviewIEC({ iec, vr, onNext, onPrevious }) {

  const [renderingEngine, setRenderingEngine] = useState(cornerstone.getRenderingEngine("re1"));

  const dispatch = useDispatch();

  const [volumeId, setVolumeId] = useState()
  const [segmentationId, setSegmentationId] = useState();
  const [imageIds, setImageIds] = useState()

  const [toolGroup, setToolGroup] = useState();
  const [toolGroup3d, setToolGroup3d] = useState();
  const [preset3d, setPreset3d] = useState("CT-MIP");

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [volumetric, setVolumetric] = useState(true);
  const [expanded, setExpanded] = useState(false);

  //const globalToolsConfig = useSelector(state => state.presentation.toolsConfig);

  let viewer;

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
    console.log("DicomReviewIEC useEffect[iec]:", iec);

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
      let volumeId = `vol-${iec}`;
      let segmentationId = `vol-${iec}-seg`;

      try {
        await loadIECVolumeAndSegmentation(iec, volumeId, segmentationId, vr);
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

      dispatch(setTitle("DICOM Volume Review"));
      dispatch(setVolumeConfig());
      //console.log(globalToolsConfig.leftClickToolGroup.defaultValue)
      //dispatch(setOption({ key: "leftClick", value: globalToolsConfig.leftClickToolGroup.defaultValue }));
      dispatch(setOption({ key: "leftClick", value: Enums.LeftClickOptions.WINDOW_LEVEL }));
      dispatch(setOption({ key: "rightClick", value: Enums.RightClickOptions.ZOOM }));
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

      dispatch(setTitle("DICOM Stack Review"));
      dispatch(setStackConfig());
    };
        
    initialize();

  }, [iec]);

  async function handleOperationsAction(action) {
    switch (action) {
      case "good":
        await setDicomStatus(iec, "Good");
        toast.success("Status set to Good!");
        break;
      case "bad":
        await setDicomStatus(iec, "Bad");
        toast.success("Status set to Bad!");
        break;
      case "blank":
        await setDicomStatus(iec, "Blank");
        toast.success("Status set to Blank!");
        break;
      case "scout":
        await setDicomStatus(iec, "Scout");
        toast.success("Status set to Scout!");
        break;
      case "other":
        await setDicomStatus(iec, "Other");
        toast.success("Status set to Other!");
        break;
      case "flag":
        await setMaskingFlag(iec);
        toast.success("Flagged for Masking!");
        break;
      default:
        console.log("Unknown action:", action);
    }
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
        segmentationId={segmentationId}
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
          <OperationsPanel
            onAction={handleOperationsAction}
          />
        </>
      }
      rightPanel={null}
    />
  )
}

export default DicomReviewIEC
