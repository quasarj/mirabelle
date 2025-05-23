import React, { useState, useEffect } from 'react';
import MaterialButtonSet from '@/components/MaterialButtonSet';
import NiftiReviewFile from '@/features/nifti-review/NiftiReviewFile';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/optionSlice';

import './NiftiReviewVR.css';

export default function NiftiReviewVR({ vr, files }) {
  const [file, setFile] = useState(0);
  const [offset, setOffset] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(files) && file.length) {
      setOffset(0);
      setIec(file[0]);
    }
  }, [files]);

	const handleNext = () => {
		let currentOffset = 0;
		if (offset != null) {
			currentOffset = offset + 1;
		}
		console.log("setting to", currentOffset);
		dispatch(setLoading(true));
		setFile(files[currentOffset]);
		setOffset(currentOffset);
	};

	const handlePrevious = () => {
		let currentOffset = 0;
		if (offset != null) {
			currentOffset = offset - 1;
		}
		console.log("setting to", currentOffset);
		dispatch(setLoading(true));
		setFile(files[currentOffset]);
		setOffset(currentOffset);
	};

	return (
		<>
			{file && (
				<NiftiReviewFile
					vr={vr}
					file={file}
					onNext={handleNext}
					onPrevious={handlePrevious}
				/>
			)}
		</>
	);
}
