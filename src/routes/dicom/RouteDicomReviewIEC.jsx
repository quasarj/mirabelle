import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import DicomReviewIEC from '@/features/dicom-review/DicomReviewIEC';

//import { getDicomDetails } from '@/visualreview.js';

import { setVisualReviewConfig, reset } from '@/features/presentationSlice'

import './RouteDicomReviewIEC.css';

export async function loader({ params }) {

  //const details = await getDicomDetails(params.iec);
  //return { details, iec: params.iec };

  return { iec: params.iec };
}

export default function RouteDicomReviewIEC() {

  const dispatch = useDispatch();
  const viewState = useSelector(state => state.options.view);

  let { iec } = useLoaderData();

  useEffect(() => {
    dispatch(reset());
    dispatch(setVisualReviewConfig());
  }, []);

  return (
    <DicomReviewIEC iec={iec} />
  );
}
