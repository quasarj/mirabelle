import React from 'react';
import {useState} from 'react';

import Masker from './components/Masker.jsx';
import VisualReview from './components/VisualReview.jsx';

function App() {

  const [template, setLayout] = useState('VisualReview');

  
  return (
    <div>
        {template === 'Masker' ? <Masker template={template} /> : <VisualReview template={template} />}
    </div>
  )
}

export default App
