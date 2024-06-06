import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';

// import { getDetails, getFiles } from '../../masking.js';

export default function ReviewIEC() {
  const { details, files, iec } = useLoaderData();

  return (
    <p>stuff here</p>
  );
  // Here we just assemble the various panels that we need for this mode
  // return (
  //   <Masker template="Masker" files={files} iec={iec}/>
  // );
}
