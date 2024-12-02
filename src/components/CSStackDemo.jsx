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
        series2="1.3.6.1.4.1.14519.5.2.1.120504135771743324054518448238055482080:7333"
        series_bad_no_iop="1.3.6.1.4.1.14519.5.2.1.2454584743577153265662869565560000617@260"
        series3="1.3.6.1.4.1.14519.5.2.1.7009.2401.339279835610748520609872183315"
        series="1.3.6.1.4.1.14519.5.2.1.186848473283379477869709168257845339904:6994"
      />

      <CSToolsPanel toolGroup={toolGroup} />
      <CSStackFiles 
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        series="1.3.6.1.4.1.14519.5.2.1.2454584743577153265662869565560000617@260"
      />
    </div>
  );
};

export default CSStackDemo;
