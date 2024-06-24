import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';


import { getDetails, getIECsForVR } from '../../masking.js';

import TemplateContextProvider from '../../components/TemplateContextProvider.js';

export async function loader({ params }) {

  const iecs = await getIECsForVR(params.visual_review_instance_id);

  return { iecs };

}

export default function MaskVR() {
  const { iecs } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <TemplateContextProvider template={ { template: "MaskerVR", other: 7 } }>
      <Masker iecs={iecs} />
    </TemplateContextProvider>
    
  );
}
