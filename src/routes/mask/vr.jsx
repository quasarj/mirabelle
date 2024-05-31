import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';


import { getDetails, tests as maskingTests } from '../../masking.js';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

  return null

}

export default function MaskVR() {
  // const { details } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <Masker template="MaskerVR" />
  );
}
