import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setToolsConfig } from '@/features/presentationSlice';

import { Context } from '@/components/Context';

import OperationsPanel from '@/components/OperationsPanel';
import Header from '@/components/Header';

import { StackView } from '@/features/stack-view';

import createImageIdsAndCacheMetaData from '@/lib/createImageIdsAndCacheMetaData';

export async function loader({ params }) {

    return { vr: params.vr };

}

export default function RouteDicomReviewVR() {
  const { vr } = useLoaderData();
  const [imageIds, setImageIds] = useState();
  const dispatch = useDispatch()

  dispatch(setToolsConfig({
      viewToolGroup: {
        visible: true,
        value: 'volume',
        volumeVisible: false,
        projectionVisible: false,
        stackVisible: false,
      }
  }));

  // dispatch(setToolsConfig(
  //   {viewToolGroup: {visible: true}}
  // ));


  // const iec = 1167702;
  const iec = 1167698;

  useEffect(() => {
    const f = async () => {
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
        `iec:${iec}`,
        SeriesInstanceUID:
        "any",
        wadoRsRoot: "/papi/v1/wadors",
      })
      setImageIds(imageIds);
    };

    f();
  }, []);


	return (
    <div id="RouteDICOMReviewVR">
      <Context.Provider value={{ title: "DICOM Review VR" }}>
        <Header />
        <div>
          <p>Route: DICOM Review: VR ({vr})</p>
          <StackView frames={imageIds}/>
        </div>
      </Context.Provider>
    </div>
	);
}
