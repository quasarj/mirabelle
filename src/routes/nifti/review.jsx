import React from 'react';
import { useLoaderData } from 'react-router-dom';
import VisualReview from '../../components/VisualReview.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getUsername, getDetails } from '../../nifti.js';
import { ROUTE_CONFIGS } from '../../config/config';

export async function loader({ params }) {

    const details = await getDetails(params.fileId);
    const files = [params.fileId];
    return { details, files };
}

export default function ReviewNIFTI() {

    const { details, files } = useLoaderData();

    // Use specific config for this route, fallback to 'default' if not found
    const configState = useConfigState(ROUTE_CONFIGS.nifti_review || ROUTE_CONFIGS.default);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ ...configState }}>
            <VisualReview details={details} files={files} />
        </Context.Provider>
    );
}
