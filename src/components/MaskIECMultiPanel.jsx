import React, { useState, useEffect } from 'react';
import MaterialButtonSet from '@/components/MaterialButtonSet';
import MaskIECPanel from '@/components/MaskIECPanel';

import './MaskIECMultiPanel.css';

export default function MaskIECMultiPanel({ vr, iecs }) {
	const [iec, setIec] = useState(0);
	const [offset, setOffset] = useState(null);

	// as soon as we get an array of iecs, show the first one
	useEffect(() => {
		if (Array.isArray(iecs) && iecs.length) {
			setOffset(0);
			setIec(iecs[0]);
		}
	}, [iecs]);

	const handleNext = () => {
		let currentOffset = 0;
		if (offset != null) {
			currentOffset = offset + 1;
		}
		console.log("setting to", currentOffset);
		setIec(iecs[currentOffset]);
		setOffset(currentOffset);
	};

	const handlePrevious = () => {
		let currentOffset = 0;
		if (offset != null) {
			currentOffset = offset - 1;
		}
		console.log("setting to", currentOffset);
		setIec(iecs[currentOffset]);
		setOffset(currentOffset);
	};

	const navigationButtonConfig = [
		{
			name: "Previous",
			icon: "arrow_back",
			action: () => handlePrevious(),
		},
		{
			name: "Next",
			icon: "arrow_forward",
			action: () => handleNext(),
		},

	];

	return (
		<>
			{iec && (
				<MaskIECPanel
					vr={vr}
					iec={iec}
					onNext={handleNext}
					onPrevious={handlePrevious}
				/>
			)}
		</>
	);
}
