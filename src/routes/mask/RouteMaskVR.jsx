import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';

import Header from '@/components/Header';
import MaskVR from '@/features/mask/MaskVR';


import { getDetails } from '@/masking';
import { getIECsForVR } from '@/utilities';

import { Context } from '@/components/Context';

import './RouteMaskVR.css';

export async function loader({ params }) {

    const iecs = await getIECsForVR(params.visual_review_instance_id);

    return { vr: params.visual_review_instance_id, iecs };

}

export default function RouteMaskVR() {
    const { vr, iecs } = useLoaderData();

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{ title: "Route Mask VR" }}>
            <MaskVR
                vr={vr}
                iecs={iecs}
            />
        </Context.Provider>
    );
}
