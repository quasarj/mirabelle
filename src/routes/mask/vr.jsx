import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';

import { TemplateContext } from '../../components/TemplateContext.js';


import { getDetails, getIECsForVR } from '../../masking.js';

export async function loader({ params }) {

  const iecs = await getIECsForVR(params.visual_review_instance_id);

  return { iecs };

}

export default function MaskVR() {
  const { iecs } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <TemplateContext.Provider value={ "MaskerVR" }>
      <Masker iecs={iecs} />
    </TemplateContext.Provider>
    
  );
}
