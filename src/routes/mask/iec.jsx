import React from 'react';
import { useLoaderData } from 'react-router-dom';
import MaskIECPanel from '@/components/MaskIECPanel';
import EnableCornerstone from '@/components/EnableCornerstone';
import Header from '@/components/Header';

import { Context } from '@/components/Context';
import useConfigState from '@/hooks/useConfigState';
import { getDetails } from '@/masking.js';
import { getFiles, getIECInfo } from '@/utilities';
import { TASK_CONFIGS } from '@/config/config';


// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

    const details = await getDetails(params.iec);
    //const files = await getFiles(params.iec);
    const fileInfo = await getIECInfo(params.iec);
    return { details, fileInfo, iec: params.iec };
}

export default function RouteMaskIEC() {
    const { iec } = useLoaderData();

    return (
        <Context.Provider value={{ title: "Mask IEC" }}>
			<EnableCornerstone>
				<Header />
				<MaskIECPanel iec={iec} />
			</EnableCornerstone>
        </Context.Provider>
    );
}
