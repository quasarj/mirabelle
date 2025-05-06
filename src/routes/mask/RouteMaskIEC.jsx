import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import MaskIECPanel from '@/components/MaskIECPanel';
import Header from '@/components/Header';

import { Context } from '@/components/Context';
import useConfigState from '@/hooks/useConfigState';
import { getDetails } from '@/masking.js';
import { getFiles, getIECInfo } from '@/utilities';
import { TASK_CONFIGS } from '@/config/config';

import { setMaskerConfig, Enums, reset } from '@/features/presentationSlice'

import './RouteMaskIEC.css';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

  const details = await getDetails(params.iec);
  const { volumetric } = await getIECInfo(params.iec);
  return { details, volumetric, iec: params.iec };
}

export default function RouteMaskIEC() {
  const dispatch = useDispatch();
  const viewState = useSelector(state => state.presentation.stateValues.view);

  let { iec, volumetric } = useLoaderData();

  if (viewState == Enums.ViewOptions.STACK) {
    // force volumetric off if user wants to see stack
    // regardless of input type
    volumetric = false;
  }

  useEffect(() => {
    dispatch(setMaskerConfig());
  }, [volumetric]);

  return (
    <Context.Provider value={{ title: volumetric ? "Mask IEC Volume" : "Mask IEC Stack" }}>
      <MaskIECPanel iec={iec} volumetric={volumetric} />
    </Context.Provider>
  );
}
