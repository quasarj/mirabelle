import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import CSToolsPanel from './CSToolsPanel';
import CSVolumeFiles from './CSVolumeFiles';
import CSStackFiles from './CSStackFiles';

const {
  ToolGroupManager,
} = cornerstoneTools;

const toolGroupId = 'STACK_TOOL_GROUP_ID';


function CSStackDemo() {
  // These should probably both be stored in a State. As they are here,
  // they would get re-generated anytime this component is redrawn
  let toolGroup = ToolGroupManager.createToolGroup("tg1");
  let toolGroup2 = ToolGroupManager.createToolGroup("tg2");
  let renderingEngine = new RenderingEngine("re1");
  let renderingEngine2 = new RenderingEngine("re2");

  return (
    <div>
      <CSToolsPanel toolGroup={toolGroup2} />
      <CSVolumeFiles
        renderingEngine={renderingEngine2}
        toolGroup={toolGroup2}
        series="1.3.6.1.4.1.14519.5.2.1.4801.5885.194372676203706186283173165298"
	    timepoint="2"
	    iec="3"
      />
    </div>
  );
};

export default CSStackDemo;
