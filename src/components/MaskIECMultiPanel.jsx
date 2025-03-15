import React, { useState } from 'react';
import MaterialButtonSet from '@/components/MaterialButtonSet';
import MaskIECPanel from '@/components/MaskIECPanel';

export default function MaskIECMultiPanel({ vr, iecs }) {
	const [iec, setIec] = useState();
	const [offset, setOffset] = useState();

	const handleNext = () => {
		let currentOffset = 0;
		if (offset != null) {
			currentOffset = offset + 1;	
		}
		console.log("setting to", currentOffset);
		setIec(iecs[currentOffset]);
		setOffset(currentOffset);
	};

    const navigationButtonConfig = [
		{
			name: "Previous",
			icon: "arrow_back",
			action: () => console.log("back"),
		},
		{
			name: "Next",
			icon: "arrow_forward",
			action: () => handleNext(),
		},

    ];

	return (
		<div id="MaskIECMultiPanel">
			<p>Mask IEC Multi Panel: {vr}</p>
			<MaterialButtonSet
				buttonConfig={navigationButtonConfig}
			/>
			<p>Current IEC: {iec}</p>
			{ iec && 
				<MaskIECPanel iec={iec} />
			}
			
		</div>
	);
}
