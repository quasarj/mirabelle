import React, { useState } from 'react';

//import NiftiReviewFile from './NiftiReviewFile';
import Slider from '@/components/Slider';

import './NiftiReviewVR.css';


export default function NiftiReviewVR({ vr }) {
  const good = 13;
  const bad = 17;
  const [offset, setOffset] = useState(good);

  const fakeVRFiles = [
     151939350,
     151939351,
     151939696,
     151939697,
     151940237,
     151940238,
     151940277,
     151940278,
     151940637,
     151940638,
     151940983,
     151940984,
     155149760,
     155149761,
     155149762,
     155149763,
     155149764,
     165610811,
     165610818,
     165610819,
     165610820,
     165610821,
     165610822,
  ];

  return (
    <div id="NiftiReviewVR">
      <p>NiftiReviewVR: ({vr})</p>
      <Slider 
        max={fakeVRFiles.length} 
        initial={offset}
        onChange={setOffset} 
      />
      <section>
        Current: {fakeVRFiles[offset]} / {offset}
        <button onClick={() => setOffset(offset - 1)}>Previous</button>
        <button onClick={() => setOffset(offset + 1)}>Next</button>
      </section>
      <section>
        {/*<NiftiReviewFile file={fakeVRFiles[offset]} />*/}
      </section>
    </div>
  );
}
