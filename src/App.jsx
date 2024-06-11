import React from 'react';
import {useState} from 'react';

import { TemplateContext } from './components/TemplateContext.js';

import Masker from './components/Masker.jsx';
import VisualReview from './components/VisualReview.jsx';

function App({children}) {

  const [template, setLayout] = useState('Masker');

  return (
    <TemplateContext.Provider value={ template }>
      <Masker files={["22835914"]} iecs={["117"]}/>
    </TemplateContext.Provider>
  )
}

export default App

    /*// <div>
    //     {template === 'Masker' ? <Masker template={template} /> : <VisualReview template={template} />}
  // </div> */
