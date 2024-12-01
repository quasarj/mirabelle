/**
 * This component exists only to initialize Cornerstone
 * It then delegates tool setup to a sub-component
 * And it delegates viewport display to another sub-component
 *
 */
import React, { useState, useEffect } from 'react';

import CSInit from './CSInit';
import CSStackDemo from './CSStackDemo';


function ViewPanel({ files, volumeName, iec }) {

  return (
    <div>
      <CSInit>
        <CSStackDemo />
      </CSInit>
    </div>
  );


};

export default ViewPanel;
