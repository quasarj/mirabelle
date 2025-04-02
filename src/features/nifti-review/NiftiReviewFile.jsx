import React, { useState, useEffect } from 'react';

import { getNiftiDetails } from '@/visualreview';
import {
  Enums as NiftiEnums,
  createNiftiImageIdsAndCacheMetadata,
} from '@cornerstonejs/nifti-volume-loader';
import { volumeLoader } from '@cornerstonejs/core';

import { toAbsoluteURL } from '@/utilities';

import { VolumeView } from '@/features/volume-view';
import LabelingPanel from '@/components/LabelingPanel';
import './NiftiReviewFile.css'

export default function NiftiReviewFile({ file }) {
  const [loaded, setLoaded] = useState(false);
  const [volumeId, setVolumeId] = useState();
  const [error, setError] = useState(false);

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

    // NOTE this syntax just creates an anonymous
    // async function and immediately runs it
    // This is necessary because the function given to 
    // useEffect is not allowed to be async
    (async () => {
      // code to load the volume goes here
      // try to keep most of it in an external file
      // when it's done, call setLoaded(true) and
      // also setVolumeId(new_volume_id)

      // await cornerstone.cache.purgeVolumeCache();
      const details = await getNiftiDetails(file);

      if (details.download_path === undefined) {
        setError(true);
        return;
      }

      // This is a workaround to deal with the fact that 
      // the nifti image loader guesses at zipped status based
      // only on the end of the filename
      let rel_url = details.download_path;
      if (details.is_zipped) {
        rel_url += ".gz"
      }
      const url = toAbsoluteURL(rel_url);
      const imageIds = await createNiftiImageIdsAndCacheMetadata({ url });
      const volumeId = `cornerstoneStreamingImageVolume: ${rel_url}`;
      // check if it's already in the cache
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

      // console.log(url, imageIds, volumeId, volume);

      // remove everything else from the cache. There is a purgeCache
      // function but it deletes too much and breaks the world
      cornerstone.cache.getVolumes().forEach((v) => { 
        if (v.volumeId != volumeId) { 
          cornerstone.cache.removeVolumeLoadObject(v.volumeId);
        }
      });


      // set the component state
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
    <div id="NiftiReviewFile">
      <p>NiftiReviewFile: ({file})</p>
      <VolumeView 
        volumeId={volumeId}
        defaultPreset3d="MR-Default" 
      />
      <LabelingPanel 
        onLabel={alert}
	  	config={labelPanelConfig}
      />
    </div>
  );
}



