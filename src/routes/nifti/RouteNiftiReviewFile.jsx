import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import NiftiReviewFile from '@/features/nifti-review/NiftiReviewFile';
import Header from '@/components/Header';

import { Context } from '@/components/Context';
import { getUsername, getNiftiDetails } from '@/visualreview';

import { setVisualReviewConfig, Enums, reset } from '@/features/presentationSlice'

import './RouteNiftiReviewFile.css';

export async function loader({ params }) {

  // const details = await getNiftiDetails(params.fileId);
  // const files = [params.fileId];
  // return { details, files };
  return { file: params.fileId };
}

export default function RouteNiftiReviewFile() {
  const dispatch = useDispatch();
  const viewState = useSelector(state => state.presentation.stateValues.view);

  let { file } = useLoaderData();

  let volumetric = true;

  useEffect(() => {
    dispatch(setVisualReviewConfig());
  }, [volumetric]);

  return (
    <Context.Provider value={{ title: "Nifti Review File" }}>
      <NiftiReviewFile file={file} />
    </Context.Provider>
  );
}
