import React from 'react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setStackConfig, setVolumeConfig, setTitle, setLoading } from '@/features/presentationSlice';
import toast from 'react-hot-toast';

import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { volumeLoader } from "@cornerstonejs/core";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  expandSegTo3D,
  isSegFlat,
  loadIECVolumeAndSegmentation,
  getIECInfo,

} from '@/utilities';
import { getDicomDetails } from '@/visualreview';
import { finalCalc } from '../masking';

import Header from './Header';

import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { StackView } from '@/features/stack-view';
import { ToolsPanel } from '@/features/tools';
import OperationsPanel from './OperationsPanel';
import NavigationPanel from './NavigationPanel';

import { Context } from './Context.js';
import RouteLayout from './RouteLayout';

import './MaskIECPanel.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function MaskIECPanel({ iec, vr, onNext, onPrevious }) {

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

  let viewer;

  let coords; // coordinates of drawn mask

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
    console.log("MaskIECPanel useEffect[iec]:", iec);
    const initializeVolume = async () => {
      // setIsInitialized(false);
      setIsErrored(false);
      // cornerstone.cache.purgeCache();
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

      dispatch(setTitle("Mask Volume"));
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

      const { volumetric } = getDicomDetails(iec);


      setImageIds(imageIds);
      setIsInitialized(true);
      setVolumetric(volumetric);

      dispatch(setTitle("Mask Stack"));
      dispatch(setStackConfig());
    };

    if (volumetric) {
      initializeVolume();
    } else {
      initializeStack();
    }
  }, [iec]);

  async function handleOperationsAction(action) {
    switch (action) {
      case "expand":
        await handleExpand();
        break;
      case "clear":
        handleClear();
        break;
      case "accept":
        await handleAccept();
        break;
      default:
        console.log("Unknown action:", action);
    }
  }

  async function handleExpand() {
    if (!expanded && isSegFlat(segmentationId)) {
      alert("Cannot expand a flat selection! You must draw in at least two planes.");
      return;
    }
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

    setExpanded(true);
    toast.success("Expanded selection!");
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
    if (coords === undefined) {
      alert("You Expand Selection first!");
      return;
    }
    console.log(coords, volumeId, iec);
    await finalCalc(coords, volumeId, iec, "cuboid", "mask");
    toast.success("Submitted for masking!");
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

export default MaskIECPanel
