import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { Context } from '@/components/Context';
import useConfigState from '@/hooks/useConfigState';
import { getDetails } from '@/masking.js';
import { getFiles, getIECInfo } from '@/utilities';
import { TASK_CONFIGS } from '@/config/config';

import Header from '@/components/Header';
import Counter from '@/components/Counter';

export async function loader({ params }) {

    const details = await getDetails(params.iec);
    const fileInfo = await getIECInfo(params.iec, true);
    return { details, fileInfo, iec: params.iec };
}

export default function RouteMaskReviewIEC() {

    const { details, fileInfo, iec } = useLoaderData();

	return (
    <div id="RouteMaskReviewIEC">
      <Context.Provider value={{ title: "Route Mask Review IEC" }}>
        <Header />
        <p>
          Route: Mask Review: IEC ({iec})
        </p>
		<Counter />
      </Context.Provider>
    </div>
	);
}
