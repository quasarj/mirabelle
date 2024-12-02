import React from 'react';
import { useLoaderData } from 'react-router-dom';
import MainPanel from '../../components/MainPanel.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getUsername, getNiftiDetails } from '../../visualreview.js';
import { TASK_CONFIGS } from '../../config/config';

export async function loader({ params }) {

    const details = await getNiftiDetails(params.fileId);
    const files = [params.fileId];
    return { details, files };
}

export default function ReviewNIFTI() {

    const { details, files } = useLoaderData();

    // Use specific config for this route, fallback to 'default' if not found
    const configState = useConfigState(TASK_CONFIGS.nifti_review || TASK_CONFIGS.default);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ ...configState }}>
            <MainPanel details={details} files={files} />
        </Context.Provider>
    );
}