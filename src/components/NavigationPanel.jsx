
import React from 'react';
import MaterialButtonSet from '@/components/MaterialButtonSet';

import './NavigationPanel.css';

function NavigationPanel({
  onNext = () => { },
  onPrevious = () => { },
  currentId,
  idLabel = 'IEC',
}) {

  const navButtons = [
    { name: 'Next', icon: 'arrow_forward', action: onNext },
    { name: 'Previous', icon: 'arrow_back', action: onPrevious },
  ];

  return (
    <div id="navigation-panel" className="side-panel">
      {currentId && <p>{idLabel}: {currentId}</p>}
      <MaterialButtonSet buttonConfig={navButtons} />
    </div>
  )
}

export default NavigationPanel
