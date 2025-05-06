
import React from 'react';
import MaterialButtonSet from '@/components/MaterialButtonSet';

import './NavigationPanel.css';

function NavigationPanel({
  onNext = () => { },
  onPrevious = () => { },
  currentIec,
}) {

  const navButtons = [
    { name: 'Next', icon: 'arrow_forward', action: onNext },
    { name: 'Previous', icon: 'arrow_back', action: onPrevious },
  ];

  return (
    <div id="navigation-panel" className="side-panel">
      {currentIec && <p>IEC: {currentIec}</p>}
      <MaterialButtonSet buttonConfig={navButtons} />
    </div>
  )
}

export default NavigationPanel
