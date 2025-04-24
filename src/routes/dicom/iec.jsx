import React from 'react';

import { useLoaderData } from 'react-router-dom';
import { Context } from '@/components/Context';

import useConfigState from '@/hooks/useConfigState';
import { getDicomDetails } from '@/visualreview.js';
import { getFiles, getIECInfo } from '@/utilities';
import { TASK_CONFIGS } from '@/config/config';

import Header from '@/components/Header';
import DicomReviewIEC from '@/features/dicom-review/DicomReviewIEC';

import './iec.css';

export async function loader({ params }) {

  const details = await getDicomDetails(params.iec);
  return { details, iec: params.iec };
}

export default function RouteDicomReviewIEC() {

  const { details, iec } = useLoaderData();

  return (
    <div id="RouteDICOMReviewIEC">
      <Context.Provider value={{ title: "DICOM Review IEC" }}>
        <Header />
        <p>Route: DICOM Reivew: IEC ({iec})</p>
        <DicomReviewIEC
          iec={iec}
          details={details}
        />
      </Context.Provider>
    </div>
  )
}
