import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';

import ContextProvider from '../../components/ContextProvider.js';
import PresetsContextProvider from '../../components/PresetsContextProvider.js';


import { getDetails, getFiles } from '../../masking.js';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {


	const details = await getDetails(params.iec);
  const files = await getFiles(params.iec);

	return { details, files, iec: params.iec };
}

export default function MaskIEC() {
  const { details, files, iec } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <ContextProvider template={ "Masker" }>
        <Masker files={files} iec={iec} />
    </ContextProvider>
  );
}
