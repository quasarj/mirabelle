import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import MainPanel from '../../components/MainPanel.jsx';


import { getDetails } from '../../masking.js';
import { getNextIECForVR } from '../../utilities';

import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { TASK_CONFIGS } from '../../config/config';

import MaskIEC, { loader as iecLoader } from './iec';
import { getDicomDetails } from '../../visualreview.js';

export async function loader({ params }) {

  const iec = await getNextIECForVR(params.visual_review_instance_id);

  params.iec = iec;
  const other = await iecLoader({ params });

  const dicom_details = await getDicomDetails(params.iec);
  
  other.details = dicom_details;
  return other;

}
/*
 * So what if the route was just mask/vr/X
 * then we use an endpoint to return "the next IEC in X to be masked"
 * (but make it return a randomly selected one)
 * Then we load the normal mask IEC route with that IEC
 * But include a "next" button that actually just refreshes the page?
 */

export default function MaskVR() {
  return (
    <>
      <MaskIEC forcenav={true} />
    </>
  );
}
