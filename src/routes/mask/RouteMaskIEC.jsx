import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import MaskIEC from '@/features/mask/MaskIEC';

// import { getDetails } from '@/masking.js';

import { setMaskerConfig, reset } from '@/features/presentationSlice'

import './RouteMaskIEC.css';

export async function loader({ params }) {

  // const details = await getDetails(params.iec);
  // return { details, iec: params.iec };

  return { iec: params.iec };
}

export default function RouteMaskIEC() {
  const dispatch = useDispatch();
  const viewState = useSelector(state => state.presentation.stateValues.view);

  let { iec } = useLoaderData();

  useEffect(() => {
    dispatch(reset());
    dispatch(setMaskerConfig());
  }, []);

  return (
    <MaskIEC iec={iec} />
  );
}
