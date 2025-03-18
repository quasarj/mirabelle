import React from 'react';

import NiftiReviewFile from './NiftiReviewFile';

import './NiftiReviewVR.css';


export default function NiftiReviewVR({ vr }) {

  return (
    <div id="NiftiReviewVR">
      <p>NiftiReviewVR: ({vr})</p>
	  <section>
		<NiftiReviewFile file={155149762} />
	  </section>
    </div>
  );
}
