import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import DicomReviewVR from '@/features/dicom-review/DicomReviewVR';

import { getIECsForVR } from '@/utilities';

import { setVisualReviewConfig, reset } from '@/features/presentationSlice'

import './RouteDicomReviewVR.css';

export async function loader({ params }) {
  const iecs = await getIECsForVR(params.visual_review_instance_id);

  return { vr: params.visual_review_instance_id, iecs };
}

export default function RouteDicomReviewVR() {
  const { vr, iecs } = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(setVisualReviewConfig());
  }, []);
  
  return (
    <DicomReviewVR vr={vr} iecs={iecs} />
  );
}