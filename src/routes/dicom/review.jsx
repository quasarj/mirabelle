import React from 'react';
import { useLoaderData } from 'react-router-dom';
import MainPanel from '../../components/MainPanel.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getDicomDetails } from '../../visualreview.js';
import { getFiles, getIECInfo } from '../../utilities';
import { TASK_CONFIGS } from '../../config/config';

export async function loader({ params }) {

    //const details = await getDicomDetails(params.fileId);
    let details;
    //const files = await getFiles(params.iec);
    const fileInfo = await getIECInfo(params.iec);
    return { details, fileInfo, iec: params.iec };
}

export default function ReviewDICOM() {

    const { details, fileInfo, iec } = useLoaderData();

    let configState;

    // Use specific config for this route, fallback to 'default' if not found
    if (fileInfo.volumetric) {
        configState = useConfigState(TASK_CONFIGS.dicom_review_volume || TASK_CONFIGS.default);
    } else {
        configState = useConfigState(TASK_CONFIGS.dicom_review_stack || TASK_CONFIGS.default);
    }

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ ...configState }}>
            <MainPanel details={details} files={fileInfo.frames} iec={iec} />
        </Context.Provider>
    );
}