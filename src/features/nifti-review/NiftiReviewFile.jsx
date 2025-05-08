import React, { useState, useEffect } from 'react';

import { getNiftiDetails } from '@/visualreview';
import {
  Enums as NiftiEnums,
  createNiftiImageIdsAndCacheMetadata,
} from '@cornerstonejs/nifti-volume-loader';
import { volumeLoader } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { toAbsoluteURL } from '@/utilities';

import { VolumeView } from '@/features/volume-view';
import LabelingPanel from '@/components/LabelingPanel';
import ToolsPanel from '@/features/tools/ToolsPanel';
import RouteLayout from '@/components/RouteLayout';
import Header from '@/components/Header';

import './NiftiReviewFile.css';

export default function NiftiReviewFile({ file }) {
  const [loaded, setLoaded] = useState(false);
  const [volumeId, setVolumeId] = useState();
  const [error, setError] = useState(false);
  const [toolGroup, setToolGroup] = useState(null);
  const [preset3d, setPreset3d] = useState("MR-Default");

  const labelPanelConfig = [
    {
      name: "Good",
      action: "good",
    },
    {
      name: "Bad",
      action: "bad",
    },
  ];

  useEffect(() => {
    setError(false);
    setLoaded(false);

    // Initialize the tool group
    const tg = cornerstoneTools.ToolGroupManager.createToolGroup("niftiToolGroup");
    setToolGroup(tg);

    (async () => {
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
      const volumeId = `cornerstoneStreamingImageVolume: ${rel_url}`;
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

      setVolumeId(volumeId);
      setLoaded(true);
    })();
  }, [file]);

  if (error === true) {
    return (
      <div id="NiftiReviewFile">
        <p>NiftiReviewFile: ({file})</p>
        <p>Error loading this file, cannot continue</p>
      </div>
    );
  }
  if (loaded === false) {
    return (
      <div id="NiftiReviewFile">
        <p>NiftiReviewFile: ({file})</p>
        <p>Loading...</p>
      </div>
    );
  }

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
          <VolumeView
            volumeId={volumeId}
            defaultPreset3d="MR-Default"
          />
          <LabelingPanel
            onLabel={alert}
            config={labelPanelConfig}
          />
        </>
      }
      rightPanel={null}
    />
  );
}