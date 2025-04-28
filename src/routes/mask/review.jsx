import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import MainPanel from '../../components/MainPanel.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getDetails } from '../../masking.js';
import { getFiles, getIECInfo } from '../../utilities';
import { TASK_CONFIGS } from '../../config/config';
import { getDicomDetails } from '../../visualreview.js';

import Toast from "../../components/Toast";

export async function loader({ params }) {

    // const details = await getDetails(params.iec);
    const details = await getDicomDetails(params.iec);
    //const files = await getFiles(params.iec);
    const fileInfo = await getIECInfo(params.iec, true);
    return { details, fileInfo, iec: params.iec };
}

export default function ReviewIEC({ forcenav }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("initial message");
  const { details, fileInfo, iec } = useLoaderData();

  let configState;

  // Use specific config for this route, fallback to 'default' if not found
  if (fileInfo.volumetric) {
    configState = useConfigState(
      TASK_CONFIGS.masker_review_volume || TASK_CONFIGS.default,
    );
  } else {
    configState = useConfigState(
      TASK_CONFIGS.masker_review_stack || TASK_CONFIGS.default,
    );
  }

  if (forcenav) {
    configState.navigationPanelVisible = true;
  }

  configState.showToast = (message) => {
    setToastMessage(message)
    setShowToast(true)
  };

  // Here we just assemble the various panels that we need for this mode
  return (
    <Context.Provider value={{ ...configState }}>
      <MainPanel details={details} files={fileInfo.frames} iec={iec} />
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </Context.Provider>
  );
}
