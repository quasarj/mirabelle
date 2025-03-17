import * as cornerstone from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';
import * as cornerstoneTools from '@cornerstonejs/tools';
import createImageIdsAndCacheMetaData from './lib/createImageIdsAndCacheMetaData';

const { 
  volumeLoader,
} = cornerstone;
const { 
  Enums: csToolsEnums,
  segmentation,
} = cornerstoneTools;


export function expandSegTo3D(segmentationId) {
	const segmentationVolume = cornerstone.cache.getVolume(segmentationId);
	const { dimensions, voxelManager } = segmentationVolume;

	// It's fastest to extract the scalardata as an array
	// and then set it back later, rather than to update individual pixels
	let scalarData = voxelManager.getCompleteScalarDataArray();

	const [x_size, y_size, z_size] = dimensions;

	let xmin = z_size * y_size * x_size;
	let xmax = 0;
	let ymin = xmin;
	let ymax = 0;
	let zmin = xmin;
	let zmax = 0;

	for (let z = 0; z < z_size; z++) {
		for (let y = 0; y < y_size; y++) {
			for (let x = 0; x < x_size; x++) {
				// offset into the array
				let offset = (z * x_size * y_size) + (y * x_size) + x;

				if (scalarData[offset] > 0) {
					if (x < xmin) { xmin = x; }
					if (x > xmax) { xmax = x; }
					if (y < ymin) { ymin = y; }
					if (y > ymax) { ymax = y; }
					if (z < zmin) { zmin = z; }
					if (z > zmax) { zmax = z; }
				}
			}
		}
	}
	// Expand into a cube
	for (let z = 0; z < z_size; z++) {
		for (let y = 0; y < y_size; y++) {
			for (let x = 0; x < x_size; x++) {
				// offset into the array
				let offset = (z * x_size * y_size) + (y * x_size) + x;
				if (
					x >= xmin &&
					x <= xmax &&
					y >= ymin &&
					y <= ymax &&
					z >= zmin &&
					z <= zmax
				) {
					scalarData[offset] = 2;
				} else {
					scalarData[offset] = 0;
				}
			}
		}
	}

	voxelManager.setCompleteScalarDataArray(scalarData);

	return {
		x: { min: xmin, max: xmax },
		y: { min: ymin, max: ymax },
		z: { min: zmin, max: zmax },
	};
}

/**
 * A generic distance calucaltion between two (3D) points
 */
export function calculateDistance(point1, point2) {
	const dx = point2[0] - point1[0];
	const dy = point2[1] - point1[1];
	const dz = point2[2] - point1[2];

	const distance = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

	return distance;
}

export async function getUsername() {
	const response = await fetch(`/papi/v1/other/testme`);
	const details = await response.json();

	return details.username;
}

export async function getFiles(iec) {

	const response = await fetch(`/papi/v1/iecs/${iec}/files`);
	const details = await response.json();

	return details.file_ids;
}

export async function getIECInfo(iec, mask_review=false) {

	let response

	if (mask_review) {
		response = await fetch(`/papi/v1/masking/${iec}/reviewfiles`);
	} else {
		response = await fetch(`/papi/v1/iecs/${iec}/frames`);
	}

	let volumetric;
	let frames = [];

	if (response && response.ok) {
		let fileInfo = await response.json();
		volumetric = fileInfo.volumetric;

		for (let file of fileInfo.frames) {
			//console.log(file);
			for (let i = 0; i < file.num_of_frames; i++) {
				if (frames.num_of_frames > 1) {
					frames.push(`wadouri:/papi/v1/files/${file.file_id}/data?frame=${i}`);
				} else {
					frames.push(`wadouri:/papi/v1/files/${file.file_id}/data`);
				}
			}
		}
	}
	return { volumetric, frames };
}

export async function getIECsForVR(visual_review_id) {

	const response = await fetch(
		`/papi/v1/masking/visualreview/${visual_review_id}`);
	const details = await response.json();

	return details;
}


export async function loadIECVolumeAndSegmentation(iec, volumeId, segmentationId) {
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
    `iec:${iec}`,
    SeriesInstanceUID:
    "any",
    wadoRsRoot: "/papi/v1/wadors",
  })

  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  })

  // Create a segmentation of the same resolution as the source data for the CT volume
  volumeLoader.createAndCacheDerivedLabelmapVolume(volumeId, {
    volumeId: segmentationId,
  });

  segmentation.addSegmentations([
    {
      segmentationId,
      representation: {
        // The type of segmentation
        type: csToolsEnums.SegmentationRepresentations.Labelmap,
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId,
        },
      },
    },
  ]);


  // Set the volume to load
  volume.load();

  return volume;
}

export function toAbsoluteURL(relative_url) {
  // There are a few functions in Cornerstone that expect an absolute URL
  // even when they really sould be able to accept a relative one.
  // This is a hacky way to generate an absolute URL from a relative

  let url = new URL(window.location);

  return url.origin + relative_url;
}
