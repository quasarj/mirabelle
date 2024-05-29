import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';


import Header from '../../components/Header';
import TopPanel from '../../components/TopPanel';
import LeftPanel from '../../components/LeftPanel';
// import MiddlePanel from '../components/MiddlePanel.jsx';
import RightPanel from '../../components/RightPanel';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {
	// TODO get the thing here
	const details = { iec: params.iec };

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
          <div id="leftPanel" className="w-72 h-full rounded-lg overflow-y-hidden">
            <LeftPanel />
          </div>
	      <div>
			<h1>were masking IECs here</h1>
			<p>
				Working on this IEC: {details.iec}
			</p>
			<Link to="/">
				<button type="button">
					Go home
				</button>
			</Link>
	      </div>
          <div id="rightPanel" className="w-72 h-full rounded-lg overflow-hidden">
            <RightPanel />
          </div>
		</div>
	  </div>
  );
}
