import React from 'react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setVolumeConfig, setNiftiConfig, setTitle, setLoading } from '@/features/presentationSlice';
import toast from 'react-hot-toast';

import {
  Enums as NiftiEnums,
  createNiftiImageIdsAndCacheMetadata,
} from '@cornerstonejs/nifti-volume-loader';
import { volumeLoader } from '@cornerstonejs/core';
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools';
import { toAbsoluteURL } from '@/utilities';
import { getNiftiDetails, setNiftiStatus } from '@/visualreview';

import Header from '@/components/Header';

import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { ToolsPanel } from '@/features/tools';
import OperationsPanel from '@/components/OperationsPanel';
import NavigationPanel from '@/components/NavigationPanel';

import { Context } from '@/components/Context.js';
import RouteLayout from '@/components/RouteLayout';

import './NiftiReviewFile.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  Enums: csToolsEnums,
  segmentation
} = cornerstoneTools;

function NiftiReviewFile({ file, vr, onNext, onPrevious }) {

  const [renderingEngine, setRenderingEngine] = useState(cornerstone.getRenderingEngine("re1"));

  const dispatch = useDispatch();

  const [volumeId, setVolumeId] = useState();
  const [segmentationId, setSegmentationId] = useState();
  const [imageIds, setImageIds] = useState()

  const [toolGroup, setToolGroup] = useState(null);
  const [toolGroup3d, setToolGroup3d] = useState();
  const [preset3d, setPreset3d] = useState("MR-Default");

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [volumetric, setVolumetric] = useState(true);

  //const [loaded, setLoaded] = useState(false);
  //const [error, setError] = useState(false);

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

  useEffect(() => {
    console.log("NiftiReviewFile useEffect[file]:", file);

    const initializeVolume = async () => {
      // setIsInitialized(false);
      setIsErrored(false);
      // cornerstone.cache.purgeCache();
      let volumeId = `vol-${file}`;
      //let segmentationId = `vol-${file}-seg`;

      try {
        const details = await getNiftiDetails(file);

        if (details.download_path === undefined) {
          setError(true);
          return;
        }

        let rel_url = details.download_path;
        if (details.is_zipped) {
          rel_url += ".gz";
        }
        const url = toAbsoluteURL(rel_url);
        const imageIds = await createNiftiImageIdsAndCacheMetadata({ url });
        let volume = cornerstone.cache.getVolume(volumeId);
        if (!volume) {
          volume = await volumeLoader.createAndCacheVolume(volumeId, {
            imageIds,
          });
        }
        try {
          await volume.load();
        } catch (error) {
          console.log(error);
          return;
        }

        cornerstone.cache.getVolumes().forEach((v) => {
          if (v.volumeId !== volumeId) {
            cornerstone.cache.removeVolumeLoadObject(v.volumeId);
          }

        });

      } catch (error) {
        console.log(error);
        // TODO: set an isError status here and display an error message?
        setErrorMessage(error);
        setIsErrored(true);
        return;
      }

      setIsInitialized(true);
      setVolumeId(volumeId);
      //setSegmentationId(segmentationId);
      
      dispatch(setVolumeConfig());
      dispatch(setNiftiConfig());
      dispatch(setTitle("Nifti File Review"));
      dispatch(setLoading(false));
    };

    initializeVolume();

  }, [file]);


  async function handleOperationsAction(action) {
    switch (action) {
      case "good":
        await setNiftiStatus(file, "Good");
        toast.success("Status set to Good!");
        break;
      case "bad":
        await setNiftiStatus(file, "Bad");
        toast.success("Status set to Bad!");
        break;
      case "blank":
        await setNiftiStatus(file, "Blank");
        toast.success("Status set to Blank!");
        break;
      case "scout":
        await setNiftiStatus(file, "Scout");
        toast.success("Status set to Scout!");
        break;
      case "other":
        await setNiftiStatus(file, "Other");
        toast.success("Status set to Other!");
        break;
      default:
        console.log("Unknown action:", action);
    }
  }

  // short-circuit if not loaded yet
  if (isErrored) {
    return (
      <>
        <div>There was an error loading this File :(</div>
        <p>{errorMessage.message}</p>
      </>
    );
  }
  if (!isInitialized) {
    return <LoadingSpinner />
  }

  console.log(">>>>> about to pass volumeId=", volumeId);
  viewer =
    <VolumeView
      volumeId={volumeId}
      defaultPreset3d="MR-Default"
      toolGroup={toolGroup}
      toolGroup3d={toolGroup3d}
    />


  return (
    <RouteLayout
      leftPanel={
        <ToolsPanel
          toolGroup={toolGroup}
          defaultPreset={preset3d}
          onPresetChange={setPreset3d}
        />
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
  );
}

export default NiftiReviewFile




//useEffect(() => {
//  setError(false);
//  setLoaded(false);

//  dispatch(setTitle("Nifti File Review"));
//  // Initialize the tool group
//  const tg = cornerstoneTools.ToolGroupManager.createToolGroup("niftiToolGroup");
//  setToolGroup(tg);

//  (async () => {
//    const details = await getNiftiDetails(file);

//    if (details.download_path === undefined) {
//      setError(true);
//      return;
//    }

//    let rel_url = details.download_path;
//    if (details.is_zipped) {
//      rel_url += ".gz";
//    }
//    const url = toAbsoluteURL(rel_url);
//    const imageIds = await createNiftiImageIdsAndCacheMetadata({ url });
//    const volumeId = `cornerstoneStreamingImageVolume: ${rel_url}`;
//    let volume = cornerstone.cache.getVolume(volumeId);
//    if (!volume) {
//      volume = await volumeLoader.createAndCacheVolume(volumeId, {
//        imageIds,
//      });
//    }
//    try {
//      await volume.load();
//    } catch (error) {
//      console.log(error);
//      return;
//    }

//    cornerstone.cache.getVolumes().forEach((v) => {
//      if (v.volumeId !== volumeId) {
//        cornerstone.cache.removeVolumeLoadObject(v.volumeId);
//      }
//    });

//    setVolumeId(volumeId);
//    setLoaded(true);
//  })();
//}, [file]);

//if (error === true) {
//  return (
//    <div id="NiftiReviewFile">
//      <p>NiftiReviewFile: ({file})</p>
//      <p>Error loading this file, cannot continue</p>
//    </div>
//  );
//}
//if (loaded === false) {
//  return (
//    <div id="NiftiReviewFile">
//      <p>NiftiReviewFile: ({file})</p>
//      <p>Loading...</p>
//    </div>
//  );
//}