import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';

import TemplateContextProvider from '../../components/TemplateContextProvider.js';


import { getDetails, getFiles } from '../../masking.js';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {


	const details = await getDetails(params.iec);
  const files = await getFiles(params.iec);

	return { details, files };
}

export default function MaskIEC() {
  const { details, files } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <TemplateContextProvider template={ "Masker" }>
      <Masker files={files} />
    </TemplateContextProvider>
  );
}
