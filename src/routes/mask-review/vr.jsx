import React, { useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { Context } from '@/components/Context';

import OperationsPanel from '@/components/OperationsPanel';
import Header from '@/components/Header';

export async function loader({ params }) {

    return { vr: params.vr };

}

export default function RouteMaskReviewVR() {
    const { vr } = useLoaderData();
	// An example of how you could read the params without having
	// to use a dataLoader
	const { vr: vr2 } = useParams();

	return (
    <div id="RouteMaskReviewIEC">
      <Context.Provider value={{ title: "Route Mask Review VR" }}>
        <Header />
        <p>
          Route: Mask Review: VR ({vr})
          <OperationsPanel />
        </p>
      </Context.Provider>
    </div>
	);
}
