import React from 'react';

import NiftiReviewFile from './NiftiReviewFile';

export default function NiftiReviewVR({ vr }) {
  return (
    <div id="NiftiReviewVR">
      <p>NiftiReviewVR: ({vr})</p>
      <NiftiReviewFile file={22} />

    </div>
  );
}
