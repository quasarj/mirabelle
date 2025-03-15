import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';

import Header from '@/components/Header';
import MaskIECMultiPanel from '@/components/MaskIECMultiPanel';
import EnableCornerstone from '@/components/EnableCornerstone';


import { getDetails } from '@/masking';
import { getIECsForVR } from '@/utilities';

import { Context } from '@/components/Context';

export async function loader({ params }) {

    const iecs = await getIECsForVR(params.visual_review_instance_id);

    return { vr: params.visual_review_instance_id, iecs };

}

export default function RouteMaskVR() {
    const { vr, iecs } = useLoaderData();

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ title: "Route Mask VR" }}>
		<EnableCornerstone>
            <Header />
			<p>Route: Mask VR ({vr})</p>
			<MaskIECMultiPanel 
				vr={vr}
				iecs={iecs}
			/>
		</EnableCornerstone>
        </Context.Provider>
    );
}
