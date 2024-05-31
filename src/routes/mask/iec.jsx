import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';


import Header from '../../components/Header';
import TopPanel from '../../components/TopPanel';
import LeftPanel from '../../components/LeftPanel';
// import MiddlePanel from '../components/MiddlePanel.jsx';
import RightPanel from '../../components/RightPanel';

import { getDetails, tests as maskingTests } from '../../masking.js';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

	// TODO remove this when testing is done
	await maskingTests();


	const details = await getDetails(params.iec);

	return { details };
}

export default function MaskIEC() {
  const { details } = useLoaderData();

  // Here we just assemble the various panels that we need for this mode
  return (
    <div id="app" className="grid grid-rows-[1fr] gap-2 w-screen h-screen p-2">
	  <Header />
	  <TopPanel />
      <div id="main" className="h-full grid rounded-lg gap-2 overflow-hidden">
	      <div id="middlePanel" className="relative w-full rounded-lg border-4 border-blue-500 p-2 flex flex-col gap-2 overflow-hidden">
			<h1>were masking IECs here</h1>
			<p>
				Working on this IEC: {details.image_equivalence_class_id}
			</p>
			<p>
				Current status: {details.masking_status}
			</p>
			<Link to="/">
				<button type="button">
					Go home
				</button>
			</Link>
	      </div>
		</div>
	  </div>
  );
}
