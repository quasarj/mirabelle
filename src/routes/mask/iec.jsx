import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';
import { Context } from '../../components/Context';
import useConfigState from '../../hooks/useConfigState';
import { getDetails, getFiles } from '../../masking.js';
import { ROUTE_CONFIGS } from '../../config/config';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

    const details = await getDetails(params.iec);
    const files = await getFiles(params.iec);
    return { details, files, iec: params.iec };
}

export default function MaskIEC() {
    const { details, files, iec } = useLoaderData();

    // TODO - Check whether single or multiframe and use masker_volume or masker_image
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Use specific config for this route, fallback to 'default' if not found
    const configState = useConfigState(ROUTE_CONFIGS.masker_volume || ROUTE_CONFIGS.default);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ ...configState }}>
            <Masker details={details} files={files} iec={iec} />
        </Context.Provider>
    );
}
