import React from 'react';
import { useLoaderData } from 'react-router-dom';

import Header from '@/components/Header';

import { Context } from '@/components/Context';

import useConfigState from '@/hooks/useConfigState';
import { getUsername, getNiftiDetails } from '@/visualreview';
import { TASK_CONFIGS } from '@/config/config';

import NiftiReviewVR from '@/features/nifti-review/NiftiReviewVR';

import './RouteNiftiReviewVR.css';

export async function loader({ params }) {
  return { vr: params.vr };
}

export default function RouteNiftiReviewVR() {
    const { vr } = useLoaderData();

    return (
      <div id="RouteNiftiReviewVR">
        <Context.Provider value={{ title: "Nifti Review VR" }}>
          <Header />
          <p>Route: Nifti Review: VR ({vr})</p>
          <section>
            <NiftiReviewVR vr={vr} />
          </section>
        </Context.Provider>
      </div>
    );
}
