import React from 'react';
import { useLoaderData } from 'react-router-dom';
import MainPanel from '../../components/MainPanel.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getDetails } from '../../masking.js';
import { getFiles, getIECInfo } from '../../utilities';
import { TASK_CONFIGS } from '../../config/config';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

    const details = await getDetails(params.iec);
    //const files = await getFiles(params.iec);
    const fileInfo = await getIECInfo(params.iec);
    return { details, fileInfo, iec: params.iec };
}

export default function MaskIEC({ forcenav }) {
  const { details, fileInfo, iec } = useLoaderData();

  console.log("details v");
  console.log(details);

  let configState;

  // Use specific config for this route, fallback to 'default' if not found
  if (fileInfo.volumetric) {
      configState = useConfigState(TASK_CONFIGS.masker_volume || TASK_CONFIGS.default);
  } else {
      configState = useConfigState(TASK_CONFIGS.masker_stack || TASK_CONFIGS.default);
  }

  configState.navigationPanelVisible = true;

  // Here we just assemble the various panels that we need for this mode
  return (
      <Context.Provider value={{ ...configState }}>
          <MainPanel details={details} files={fileInfo.frames} iec={iec} />
      </Context.Provider>
  );
}
