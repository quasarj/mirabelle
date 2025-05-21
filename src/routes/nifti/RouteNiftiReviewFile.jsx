import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import NiftiReviewFile from '@/features/nifti-review/NiftiReviewFile';

import { setVisualReviewConfig, reset } from '@/features/presentationSlice'

import './RouteNiftiReviewFile.css';

export async function loader({ params }) {
  return { file: params.fileId };
}

export default function RouteNiftiReviewFile() {
  const dispatch = useDispatch();
  const viewState = useSelector(state => state.options.view);

  let { file } = useLoaderData();

  useEffect(() => {
    dispatch(reset());
    dispatch(setVisualReviewConfig());
  }, []);

  return (
    <NiftiReviewFile file={file} />
  );
}
