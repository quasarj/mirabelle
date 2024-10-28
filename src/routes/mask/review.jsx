import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getDetails, getFiles } from '../../masking.js';
import { ROUTE_CONFIGS } from '../../config/config';

export async function loader({ params }) {

    const details = await getDetails(params.iec);
    const files = await getFiles(params.iec);
    return { details, files, iec: params.iec };
}

export default function ReviewIEC() {
    const { details, files, iec } = useLoaderData();

    // TODO - Check whether single or multiframe and use masker_review_volume or masker_review_image
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Use specific config for this route, fallback to 'default' if not found
    const configState = useConfigState(ROUTE_CONFIGS.masker_review_volume || ROUTE_CONFIGS.default);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ ...configState }}>
            <Masker details={details} files={files} iec={iec} />
        </Context.Provider>
    );
}
