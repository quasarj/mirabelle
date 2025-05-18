import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import Header from '@/components/Header';
import DicomReviewVR from '@/features/dicom-review/DicomReviewVR';

import { getIECsForVR } from '@/utilities';

import { Context } from '@/components/Context';

import './RouteDicomReviewVR.css';

export async function loader({ params }) {

  const iecs = await getIECsForVR(params.visual_review_instance_id);

  return { vr: params.visual_review_instance_id, iecs };

}

function RouteDicomReviewVR() {
  const { vr, iecs } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <DicomReviewVR
      vr={vr}
      iecs={iecs}
    />
  );
}

export default RouteDicomReviewVR