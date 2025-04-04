import React from 'react';
import { useLoaderData } from 'react-router-dom';

import Header from '@/components/Header';

import { Context } from '@/components/Context';

import useConfigState from '@/hooks/useConfigState';
import { getUsername, getNiftiDetails } from '@/visualreview';
import { TASK_CONFIGS } from '@/config/config';

import NiftiReviewFile from '@/features/nifti-review/NiftiReviewFile';

import './file.css';

export async function loader({ params }) {

    // const details = await getNiftiDetails(params.fileId);
    // const files = [params.fileId];
    // return { details, files };
  return { file: params.fileId };
}

export default function RouteNiftiReviewFile() {
    const { file } = useLoaderData();

    return (
        <Context.Provider value={{ title: "Nifti Review File" }}>
          <Header />
          <div id="RouteNiftiReviewFile">
            <p>Route: Nifti Review: File ({file})</p>
            <NiftiReviewFile file={file} />
          </div>
        </Context.Provider>
    );
}
