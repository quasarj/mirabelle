import React, { useState, useEffect } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { VolumeView } from '@/features/volume-view';
import { loadIECVolumeAndSegmentation } from '@/utilities';

export default function DicomReviewIEC({ iec, details }) {

  const [volumeId, setVolumeId] = useState()
  const [segmentationId, setSegmentationId] = useState();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // Load the volume into the cache
  useEffect(() => {
    console.log("DicomReviewIEC useEffect[iec]:", iec);
    const initialize = async () => {
      setIsErrored(false);

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
    };

    initialize();
  }, [iec]); // passing no value causes this to run ONLY ONCE during mount

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

  return (
    <>
      <p>DicomReviewIEC {iec}</p>
      <VolumeView 
        volumeId={volumeId} 
        segmentationId={segmentationId} 
        defaultPreset3d="CT-MIP" 
      />
    </>
  );
}
