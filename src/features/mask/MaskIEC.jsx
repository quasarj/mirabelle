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
import {
  expandSegTo3D,
  isSegFlat,
  loadIECVolumeAndSegmentation,
  loadVolumeAndSegmentation,
  getIECInfo,

} from '@/utilities';
import { getDicomDetails } from '@/visualreview';
import { finalCalc } from '@/masking';

import Header from '@/components/Header';

import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { StackView } from '@/features/stack-view';
import { ToolsPanel } from '@/features/tools';
import OperationsPanel from '@/components/OperationsPanel';
import NavigationPanel from '@/components/NavigationPanel';
import { DetailsPanel } from '@/features/details';

import { Context } from '@/components/Context.js';
import RouteLayout from '@/components/RouteLayout';

import './MaskIEC.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function transformDetails(details) {

  return {
    'IEC': details.image_equivalence_class_id,
    'Images in IEC': details.file_count,
    'Processing Status': details.processing_status,
    'Review Status': details.review_status,
    'Patient ID': details.patient_id,
    'Series Instance UID': details.series_instance_uid,
    'Series Description': details.series_description,
    'Body Part Examined': details.body_part_examined,
    'Path': details.path,
    'download_path': details.download_path,
    'download_name': details.download_name,
  }
}

export default function MaskIEC({ iec, vr, onNext, onPrevious }) {

  const options = useSelector(state => state.options);
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
  const [details, setDetails] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [coords, setCoords] = useState();

  let viewer;

  console.log("MaskIEC renderingEngine:", renderingEngine);

  function handlePresetChange(newPreset) {
    const viewport = renderingEngine.getViewport("t3d_coronal");
    viewport.setProperties({ preset: context.presetToolValue });
  }
  useEffect(() => {
    // Only create a new rendering engine if one doesn't already exist
    if (renderingEngine === undefined) {
      console.log("Creating new rendering engine");
      setRenderingEngine(new cornerstone.RenderingEngine("re1"));
    }

    let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");
    let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");

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
    console.log("MaskIEC useEffect[iec]:", iec);

    const initialize = async () => {
      const details = await getDicomDetails(iec);
      const { volumetric } = details;
      setDetails(details);
      setVolumetric(volumetric); // still update state

      if (volumetric) {
        await initializeVolume();
      } else {
        await initializeStack();
      }
    };

    const initializeVolume = async () => {
      setIsErrored(false);
      let volumeId = `vol-${iec}-${Date.now()}`;
      let segmentationId = `vol-${iec}-seg-${Date.now()}`;

      try {
        await loadIECVolumeAndSegmentation(iec, volumeId, segmentationId, vr);
      } catch (error) {
        console.log(error);
        // TODO: set an isError status here and display an error message?
        setErrorMessage(error);
        setIsErrored(true);
      }

      setIsInitialized(true);
      setVolumeId(volumeId);
      setSegmentationId(segmentationId);

      dispatch(setTitle("Mask Volume"));
      dispatch(setVolumeConfig());

      dispatch(setOption({ key: "view", value: Enums.ViewOptions.VOLUME }));
      dispatch(setOption({ key: "function", value: Enums.FunctionOptions.MASK }));
      dispatch(setOption({ key: "form", value: Enums.FormOptions.CYLINDER }));
      dispatch(setOption({ key: "leftClick", value: Enums.LeftClickOptions.WINDOW_LEVEL }));
      dispatch(setOption({ key: "rightClick", value: Enums.RightClickOptions.ZOOM }));
      dispatch(setLoading(false));

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

      dispatch(setOption({ key: "view", value: Enums.ViewOptions.STACK }));
      dispatch(setOption({ key: "function", value: Enums.FunctionOptions.BLACKOUT }));
      dispatch(setOption({ key: "form", value: Enums.FormOptions.CUBOID }));
      dispatch(setOption({ key: "leftClick", value: Enums.LeftClickOptions.WINDOW_LEVEL }));
      dispatch(setOption({ key: "rightClick", value: Enums.RightClickOptions.ZOOM }));

      dispatch(setLoading(false));

    };

    initialize();

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
    const coords = expandSegTo3D(segmentationId);


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
    setCoords(coords);
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
    if (!expanded) {
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
              currentId={iec}
              idLabel='IEC'
            />
          }
          <ToolsPanel
            toolGroup={toolGroup}
            toolGroup3d={toolGroup3d}
            defaultPreset={preset3d}
            onPresetChange={setPreset3d}
            renderingEngine={renderingEngine}
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
      rightPanel={
        <DetailsPanel details={transformDetails(details)} />
      }
    />
  )
}
