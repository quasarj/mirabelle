import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';

import { getReviewFiles, getDetails } from '../../masking.js';
import TemplateContextProvider from '../../components/TemplateContextProvider.js';

export async function loader({ params }) {


	const details = await getDetails(params.iec);
  const files = await getReviewFiles(params.iec);

	return { details, files, iec: params.iec };
}

export default function ReviewIEC() {
  const { details, files, iec } = useLoaderData();

  return (
    <TemplateContextProvider template={ { template: "MaskerVR", other: 7 } }>
      <Masker template="Masker" files={files} iec={iec}/>
    </TemplateContextProvider>
  );
}
