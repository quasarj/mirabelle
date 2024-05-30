import React from 'react';
import {useState} from 'react';

import Masker from './components/Masker.jsx';
import VisualReview from './components/VisualReview.jsx';

function App() {

  const [template, setLayout] = useState('');

  
  return (
    <div>
        {template === 'masker' ? <Masker /> : <VisualReview />}
    </div>
  )
}

export default App
