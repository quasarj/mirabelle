import * as cornerstone from '@cornerstonejs/core';
import { volumeLoader } from '@cornerstonejs/core';
import {
	addTool,
	BidirectionalTool,
	RectangleROITool,
	StackScrollMouseWheelTool,
	ToolGroupManager,
	Enums as csToolsEnums,
	init as csToolsInit,
	annotation as csAnnotations,
} from '@cornerstonejs/tools';
import dicomParser from 'dicom-parser';
import { api } from 'dicomweb-client';
import dcmjs from 'dcmjs';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import {
	cornerstoneStreamingImageVolumeLoader,
	cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';

async function runFunction() {
	await cornerstone.init();
	initCornerstoneDICOMImageLoader();
	initVolumeLoader();
	await csToolsInit();

const imageIds = getTestImageIds();

const content = document.getElementById('content');

const viewportGrid = document.createElement('div');
viewportGrid.style.display = 'flex';
viewportGrid.style.flexDirection = 'row';

// element for axial view
const element1 = document.createElement('div');
element1.style.width = '500px';
element1.style.height = '500px';

// element for sagittal view
const element2 = document.createElement('div');
element2.style.width = '500px';
element2.style.height = '500px';

viewportGrid.appendChild(element1);
viewportGrid.appendChild(element2);

content.appendChild(viewportGrid);

const renderingEngineId = 'myRenderingEngine';
const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

// note we need to add the cornerstoneStreamingImageVolume: to
// use the streaming volume loader
const volumeId = 'cornerstoneStreamingImageVolume: myVolume';

// Define a volume in memory
const volume = await volumeLoader.createAndCacheVolume(volumeId, {
  imageIds,
});

const viewportId1 = 'CT_AXIAL';
const viewportId2 = 'CT_SAGITTAL';

const viewportInput = [
  {
    viewportId: viewportId1,
    element: element1,
    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: cornerstone.Enums.OrientationAxis.CORONAL,
      VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
    },
  },
  {
    viewportId: viewportId2,
    element: element2,
    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
    },
  },
];

renderingEngine.setViewports(viewportInput);

addTool(RectangleROITool);
addTool(StackScrollMouseWheelTool);

const toolGroupId = 'myToolGroup';
const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
toolGroup.addTool(StackScrollMouseWheelTool.toolName);
toolGroup.addTool(RectangleROITool.toolName, {
	getTextLines: () => {}
});

toolGroup.addViewport(viewportId1, renderingEngineId);
toolGroup.addViewport(viewportId2, renderingEngineId);
toolGroup.setToolActive(RectangleROITool.toolName, {
	bindings: [
		{
			mouseButton: csToolsEnums.MouseBindings.Primary,
		},
	]
});
toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);


// Set the volume to load
volume.load();

cornerstone.setVolumesForViewports(
  renderingEngine,
  [
	  { 
		  volumeId,
// 			  callback: ({ volumeActor }) => {
// 				  volumeActor
// 				    .getProperty()
// 				    .getRGBTransferFunction(0)
// 				    .setMappingRange(-180, 220);
// 			  },
	  }
  ],
  [viewportId1, viewportId2]
);

// Render the image
renderingEngine.renderViewports([viewportId1, viewportId2]);

console.log(csAnnotations);
window.annotation = csAnnotations;
window.element1 = element1;
window.qtest = function() {
	const manager = csAnnotations.state.getAnnotationManager();

	console.log(manager.getNumberOfAllAnnotations());

	// collection of all annotations
	console.log(manager.annotations);

	const framesOfReference = Object.keys(manager.annotations);
	console.log(framesOfReference);

	const firstFOR = framesOfReference[0]; // there will probably only be one anyway

	const rectangleROIs = manager.annotations[firstFOR].RectangleROI;

	console.log(rectangleROIs);

	rectangleROIs.forEach((roi) => {
		console.log(roi);
	});


}

	window.doStuff = function() {
		const viewport1 = renderingEngine.getViewport(viewportId1);
		const viewport2 = renderingEngine.getViewport(viewportId2);

		viewport1.setProperties({
		      VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.SAMPLED_SIGMOID,
		});
		viewport2.setProperties({
		      VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.SAMPLED_SIGMOID,
		});

	}

}

function initVolumeLoader() {
	volumeLoader.registerUnknownVolumeLoader(
		cornerstoneStreamingImageVolumeLoader
	);
	volumeLoader.registerVolumeLoader(
		'cornerstoneStreamingImageVolume',
		cornerstoneStreamingImageVolumeLoader
	);
	volumeLoader.registerVolumeLoader(
		'cornerstoneStreamingDynamicImageVolume',
		cornerstoneStreamingDynamicImageVolumeLoader
	);
}


function initCornerstoneDICOMImageLoader() {
  const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
  cornerstoneDICOMImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: false,
      use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
    },
  });

  let maxWebWorkers = 1;

  if (navigator.hardwareConcurrency) {
    maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
  }

  var config = {
    maxWebWorkers,
    startWebWorkersOnDemand: false,
    taskConfiguration: {
      decodeTask: {
	initializeCodecsOnStartup: false,
	strict: false,
      },
    },
  };

  cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
}

function getTestImageIds() {
	return [
		'wadouri:/dicom2/01-001.dcm',
		'wadouri:/dicom2/01-002.dcm',
		'wadouri:/dicom2/01-003.dcm',
		'wadouri:/dicom2/01-004.dcm',
		'wadouri:/dicom2/01-005.dcm',
		'wadouri:/dicom2/01-006.dcm',
		'wadouri:/dicom2/01-007.dcm',
		'wadouri:/dicom2/01-008.dcm',
		'wadouri:/dicom2/01-009.dcm',
		'wadouri:/dicom2/01-010.dcm',
		'wadouri:/dicom2/01-011.dcm',
		'wadouri:/dicom2/01-012.dcm',
		'wadouri:/dicom2/01-013.dcm',
		'wadouri:/dicom2/01-014.dcm',
		'wadouri:/dicom2/01-015.dcm',
		'wadouri:/dicom2/01-016.dcm',
		'wadouri:/dicom2/01-017.dcm',
		'wadouri:/dicom2/01-018.dcm',
		'wadouri:/dicom2/01-019.dcm',
		'wadouri:/dicom2/01-020.dcm',
		'wadouri:/dicom2/01-021.dcm',
		'wadouri:/dicom2/01-022.dcm',
		'wadouri:/dicom2/01-023.dcm',
		'wadouri:/dicom2/01-024.dcm',
		'wadouri:/dicom2/01-025.dcm',
		'wadouri:/dicom2/01-026.dcm',
		'wadouri:/dicom2/01-027.dcm',
		'wadouri:/dicom2/01-028.dcm',
		'wadouri:/dicom2/01-029.dcm',
		'wadouri:/dicom2/02-001.dcm',
		'wadouri:/dicom2/02-002.dcm',
		'wadouri:/dicom2/02-003.dcm',
		'wadouri:/dicom2/02-004.dcm',
		'wadouri:/dicom2/02-005.dcm',
		'wadouri:/dicom2/02-006.dcm',
		'wadouri:/dicom2/02-007.dcm',
		'wadouri:/dicom2/02-008.dcm',
		'wadouri:/dicom2/02-009.dcm',
		'wadouri:/dicom2/02-010.dcm',
		'wadouri:/dicom2/02-011.dcm',
		'wadouri:/dicom2/02-012.dcm',
		'wadouri:/dicom2/02-013.dcm',
		'wadouri:/dicom2/02-014.dcm',
		'wadouri:/dicom2/02-015.dcm',
		'wadouri:/dicom2/02-016.dcm',
		'wadouri:/dicom2/02-017.dcm',
		'wadouri:/dicom2/02-018.dcm',
		'wadouri:/dicom2/02-019.dcm',
		'wadouri:/dicom2/02-020.dcm',
		'wadouri:/dicom2/02-021.dcm',
		'wadouri:/dicom2/02-022.dcm',
		'wadouri:/dicom2/02-023.dcm',
		'wadouri:/dicom2/02-024.dcm',
		'wadouri:/dicom2/02-025.dcm',
		'wadouri:/dicom2/02-026.dcm',
		'wadouri:/dicom2/02-027.dcm',
		'wadouri:/dicom2/02-028.dcm',
		'wadouri:/dicom2/02-029.dcm',
		'wadouri:/dicom2/02-030.dcm',
		'wadouri:/dicom2/03-001.dcm',
		'wadouri:/dicom2/03-002.dcm',
		'wadouri:/dicom2/03-003.dcm',
		'wadouri:/dicom2/03-004.dcm',
		'wadouri:/dicom2/03-005.dcm',
		'wadouri:/dicom2/03-006.dcm',
		'wadouri:/dicom2/03-007.dcm',
		'wadouri:/dicom2/03-008.dcm',
		'wadouri:/dicom2/03-009.dcm',
		'wadouri:/dicom2/03-010.dcm',
		'wadouri:/dicom2/03-011.dcm',
		'wadouri:/dicom2/03-012.dcm',
		'wadouri:/dicom2/03-013.dcm',
		'wadouri:/dicom2/03-014.dcm',
		'wadouri:/dicom2/03-015.dcm',
		'wadouri:/dicom2/03-016.dcm',
		'wadouri:/dicom2/03-017.dcm',
		'wadouri:/dicom2/03-018.dcm',
		'wadouri:/dicom2/03-019.dcm',
		'wadouri:/dicom2/03-020.dcm',
		'wadouri:/dicom2/03-021.dcm',
		'wadouri:/dicom2/03-022.dcm',
		'wadouri:/dicom2/03-023.dcm',
		'wadouri:/dicom2/03-024.dcm',
		'wadouri:/dicom2/03-025.dcm',
		'wadouri:/dicom2/03-026.dcm',
		'wadouri:/dicom2/03-027.dcm',
		'wadouri:/dicom2/03-028.dcm',
		'wadouri:/dicom2/03-029.dcm',
		'wadouri:/dicom2/04-001.dcm',
		'wadouri:/dicom2/04-002.dcm',
		'wadouri:/dicom2/04-003.dcm',
		'wadouri:/dicom2/04-004.dcm',
		'wadouri:/dicom2/04-005.dcm',
		'wadouri:/dicom2/04-006.dcm',
		'wadouri:/dicom2/04-007.dcm',
		'wadouri:/dicom2/04-008.dcm',
		'wadouri:/dicom2/04-009.dcm',
		'wadouri:/dicom2/04-010.dcm',
		'wadouri:/dicom2/04-011.dcm',
		'wadouri:/dicom2/04-012.dcm',
		'wadouri:/dicom2/04-013.dcm',
		'wadouri:/dicom2/04-014.dcm',
		'wadouri:/dicom2/04-015.dcm',
		'wadouri:/dicom2/04-016.dcm',
		'wadouri:/dicom2/04-017.dcm',
		'wadouri:/dicom2/04-018.dcm',
		'wadouri:/dicom2/04-019.dcm',
		'wadouri:/dicom2/04-020.dcm',
		'wadouri:/dicom2/04-021.dcm',
		'wadouri:/dicom2/04-022.dcm',
		'wadouri:/dicom2/04-023.dcm',
		'wadouri:/dicom2/04-024.dcm',
		'wadouri:/dicom2/04-025.dcm',
		'wadouri:/dicom2/04-026.dcm',
		'wadouri:/dicom2/04-027.dcm',
		'wadouri:/dicom2/04-028.dcm',
		'wadouri:/dicom2/04-029.dcm',
		'wadouri:/dicom2/04-030.dcm',
		'wadouri:/dicom2/05-001.dcm',
		'wadouri:/dicom2/05-002.dcm',
		'wadouri:/dicom2/05-003.dcm',
		'wadouri:/dicom2/05-004.dcm',
		'wadouri:/dicom2/05-005.dcm',
		'wadouri:/dicom2/05-006.dcm',
		'wadouri:/dicom2/05-007.dcm',
		'wadouri:/dicom2/05-008.dcm',
		'wadouri:/dicom2/05-009.dcm',
		'wadouri:/dicom2/05-010.dcm',
		'wadouri:/dicom2/05-011.dcm',
		'wadouri:/dicom2/05-012.dcm',
		'wadouri:/dicom2/05-013.dcm',
		'wadouri:/dicom2/05-014.dcm',
		'wadouri:/dicom2/05-015.dcm',
		'wadouri:/dicom2/05-016.dcm',
		'wadouri:/dicom2/05-017.dcm',
		'wadouri:/dicom2/05-018.dcm',
		'wadouri:/dicom2/05-019.dcm',
		'wadouri:/dicom2/05-020.dcm',
		'wadouri:/dicom2/05-021.dcm',
		'wadouri:/dicom2/05-022.dcm',
		'wadouri:/dicom2/05-023.dcm',
		'wadouri:/dicom2/05-024.dcm',
		'wadouri:/dicom2/05-025.dcm',
		'wadouri:/dicom2/05-026.dcm',
		'wadouri:/dicom2/05-027.dcm',
		'wadouri:/dicom2/05-028.dcm',
		'wadouri:/dicom2/05-029.dcm',
		'wadouri:/dicom2/05-030.dcm',
		'wadouri:/dicom2/06-001.dcm',
		'wadouri:/dicom2/06-002.dcm',
		'wadouri:/dicom2/06-003.dcm',
		'wadouri:/dicom2/06-004.dcm',
		'wadouri:/dicom2/06-005.dcm',
		'wadouri:/dicom2/06-006.dcm',
		'wadouri:/dicom2/06-007.dcm',
		'wadouri:/dicom2/06-008.dcm',
		'wadouri:/dicom2/06-009.dcm',
		'wadouri:/dicom2/06-010.dcm',
		'wadouri:/dicom2/06-011.dcm',
		'wadouri:/dicom2/06-012.dcm',
		'wadouri:/dicom2/06-013.dcm',
		'wadouri:/dicom2/06-014.dcm',
		'wadouri:/dicom2/06-015.dcm',
		'wadouri:/dicom2/06-016.dcm',
		'wadouri:/dicom2/06-017.dcm',
		'wadouri:/dicom2/06-018.dcm',
		'wadouri:/dicom2/06-019.dcm',
		'wadouri:/dicom2/06-020.dcm',
		'wadouri:/dicom2/06-021.dcm',
		'wadouri:/dicom2/06-022.dcm',
		'wadouri:/dicom2/06-023.dcm',
		'wadouri:/dicom2/06-024.dcm',
		'wadouri:/dicom2/06-025.dcm',
		'wadouri:/dicom2/06-026.dcm',
		'wadouri:/dicom2/06-027.dcm',
		'wadouri:/dicom2/06-028.dcm',
		'wadouri:/dicom2/06-029.dcm',
		'wadouri:/dicom2/06-030.dcm',
		'wadouri:/dicom2/07-001.dcm',
		'wadouri:/dicom2/07-002.dcm',
		'wadouri:/dicom2/07-003.dcm',
		'wadouri:/dicom2/07-004.dcm',
		'wadouri:/dicom2/07-005.dcm',
		'wadouri:/dicom2/07-006.dcm',
		'wadouri:/dicom2/07-007.dcm',
		'wadouri:/dicom2/07-008.dcm',
		'wadouri:/dicom2/07-009.dcm',
		'wadouri:/dicom2/07-010.dcm',
		'wadouri:/dicom2/07-011.dcm',
		'wadouri:/dicom2/07-012.dcm',
		'wadouri:/dicom2/07-013.dcm',
		'wadouri:/dicom2/07-014.dcm',
		'wadouri:/dicom2/07-015.dcm',
		'wadouri:/dicom2/07-016.dcm',
		'wadouri:/dicom2/07-017.dcm',
		'wadouri:/dicom2/07-018.dcm',
		'wadouri:/dicom2/07-019.dcm',
		'wadouri:/dicom2/07-020.dcm',
		'wadouri:/dicom2/07-021.dcm',
		'wadouri:/dicom2/07-022.dcm',
		'wadouri:/dicom2/07-023.dcm',
		'wadouri:/dicom2/07-024.dcm',
		'wadouri:/dicom2/07-025.dcm',
		'wadouri:/dicom2/07-026.dcm',
		'wadouri:/dicom2/07-027.dcm',
		'wadouri:/dicom2/07-028.dcm',
		'wadouri:/dicom2/07-029.dcm',
		'wadouri:/dicom2/08-001.dcm',
		'wadouri:/dicom2/08-002.dcm',
		'wadouri:/dicom2/08-003.dcm',
		'wadouri:/dicom2/08-004.dcm',
		'wadouri:/dicom2/08-005.dcm',
		'wadouri:/dicom2/08-006.dcm',
		'wadouri:/dicom2/08-007.dcm',
		'wadouri:/dicom2/08-008.dcm',
		'wadouri:/dicom2/08-009.dcm',
		'wadouri:/dicom2/08-010.dcm',
		'wadouri:/dicom2/08-011.dcm',
		'wadouri:/dicom2/08-012.dcm',
		'wadouri:/dicom2/08-013.dcm',
		'wadouri:/dicom2/08-014.dcm',
		'wadouri:/dicom2/08-015.dcm',
		'wadouri:/dicom2/08-016.dcm',
		'wadouri:/dicom2/08-017.dcm',
		'wadouri:/dicom2/08-018.dcm',
		'wadouri:/dicom2/08-019.dcm',
		'wadouri:/dicom2/08-020.dcm',
		'wadouri:/dicom2/08-021.dcm',
		'wadouri:/dicom2/08-022.dcm',
		'wadouri:/dicom2/08-023.dcm',
		'wadouri:/dicom2/08-024.dcm',
		'wadouri:/dicom2/08-025.dcm',
		'wadouri:/dicom2/08-026.dcm',
		'wadouri:/dicom2/08-027.dcm',
		'wadouri:/dicom2/08-028.dcm',
		'wadouri:/dicom2/08-029.dcm',
		'wadouri:/dicom2/08-030.dcm',
		'wadouri:/dicom2/09-001.dcm',
		'wadouri:/dicom2/09-002.dcm',
		'wadouri:/dicom2/09-003.dcm',
		'wadouri:/dicom2/09-004.dcm',
		'wadouri:/dicom2/09-005.dcm',
		'wadouri:/dicom2/09-006.dcm',
		'wadouri:/dicom2/09-007.dcm',
		'wadouri:/dicom2/09-008.dcm',
		'wadouri:/dicom2/09-009.dcm',
		'wadouri:/dicom2/09-010.dcm',
		'wadouri:/dicom2/09-011.dcm',
		'wadouri:/dicom2/09-012.dcm',
		'wadouri:/dicom2/09-013.dcm',
		'wadouri:/dicom2/09-014.dcm',
		'wadouri:/dicom2/09-015.dcm',
		'wadouri:/dicom2/09-016.dcm',
		'wadouri:/dicom2/09-017.dcm',
		'wadouri:/dicom2/09-018.dcm',
		'wadouri:/dicom2/09-019.dcm',
		'wadouri:/dicom2/09-020.dcm',
		'wadouri:/dicom2/09-021.dcm',
		'wadouri:/dicom2/09-022.dcm',
		'wadouri:/dicom2/09-023.dcm',
		'wadouri:/dicom2/09-024.dcm',
		'wadouri:/dicom2/09-025.dcm',
		'wadouri:/dicom2/09-026.dcm',
		'wadouri:/dicom2/09-027.dcm',
		'wadouri:/dicom2/09-028.dcm',
		'wadouri:/dicom2/09-029.dcm',
		'wadouri:/dicom2/09-030.dcm',
		'wadouri:/dicom2/10-001.dcm',
		'wadouri:/dicom2/10-002.dcm',
		'wadouri:/dicom2/10-003.dcm',
		'wadouri:/dicom2/10-004.dcm',
		'wadouri:/dicom2/10-005.dcm',
		'wadouri:/dicom2/10-006.dcm',
		'wadouri:/dicom2/10-007.dcm',
		'wadouri:/dicom2/10-008.dcm',
		'wadouri:/dicom2/10-009.dcm',
		'wadouri:/dicom2/10-010.dcm',
		'wadouri:/dicom2/10-011.dcm',
		'wadouri:/dicom2/10-012.dcm',
		'wadouri:/dicom2/10-013.dcm',
		'wadouri:/dicom2/10-014.dcm',
		'wadouri:/dicom2/10-015.dcm',
		'wadouri:/dicom2/10-016.dcm',
		'wadouri:/dicom2/10-017.dcm',
		'wadouri:/dicom2/10-018.dcm',
		'wadouri:/dicom2/10-019.dcm',
		'wadouri:/dicom2/10-020.dcm',
		'wadouri:/dicom2/10-021.dcm',
		'wadouri:/dicom2/10-022.dcm',
		'wadouri:/dicom2/10-023.dcm',
		'wadouri:/dicom2/10-024.dcm',
		'wadouri:/dicom2/10-025.dcm',
		'wadouri:/dicom2/10-026.dcm',
		'wadouri:/dicom2/10-027.dcm',
		'wadouri:/dicom2/10-028.dcm',
		'wadouri:/dicom2/10-029.dcm',
		'wadouri:/dicom2/11-001.dcm',
		'wadouri:/dicom2/11-002.dcm',
		'wadouri:/dicom2/11-003.dcm',
		'wadouri:/dicom2/11-004.dcm',
		'wadouri:/dicom2/11-005.dcm',
		'wadouri:/dicom2/11-006.dcm',
		'wadouri:/dicom2/11-007.dcm',
		'wadouri:/dicom2/11-008.dcm',
		'wadouri:/dicom2/11-009.dcm',
		'wadouri:/dicom2/11-010.dcm',
		'wadouri:/dicom2/11-011.dcm',
		'wadouri:/dicom2/11-012.dcm',
		'wadouri:/dicom2/11-013.dcm',
		'wadouri:/dicom2/11-014.dcm',
		'wadouri:/dicom2/11-015.dcm',
		'wadouri:/dicom2/11-016.dcm',
		'wadouri:/dicom2/11-017.dcm',
		'wadouri:/dicom2/11-018.dcm',
		'wadouri:/dicom2/11-019.dcm',
		'wadouri:/dicom2/11-020.dcm',
		'wadouri:/dicom2/11-021.dcm',
		'wadouri:/dicom2/11-022.dcm',
		'wadouri:/dicom2/11-023.dcm',
		'wadouri:/dicom2/11-024.dcm',
		'wadouri:/dicom2/11-025.dcm',
		'wadouri:/dicom2/11-026.dcm',
		'wadouri:/dicom2/11-027.dcm',
		'wadouri:/dicom2/11-028.dcm',
		'wadouri:/dicom2/11-029.dcm',
		'wadouri:/dicom2/11-030.dcm',
		'wadouri:/dicom2/12-001.dcm',
		'wadouri:/dicom2/12-002.dcm',
		'wadouri:/dicom2/12-003.dcm',
		'wadouri:/dicom2/12-004.dcm',
		'wadouri:/dicom2/12-005.dcm',
		'wadouri:/dicom2/12-006.dcm',
		'wadouri:/dicom2/12-007.dcm',
		'wadouri:/dicom2/12-008.dcm',
		'wadouri:/dicom2/12-009.dcm',
		'wadouri:/dicom2/12-010.dcm',
		'wadouri:/dicom2/12-011.dcm',
		'wadouri:/dicom2/12-012.dcm',
		'wadouri:/dicom2/12-013.dcm',
		'wadouri:/dicom2/12-014.dcm',
		'wadouri:/dicom2/12-015.dcm',
		'wadouri:/dicom2/12-016.dcm',
		'wadouri:/dicom2/12-017.dcm',
		'wadouri:/dicom2/12-018.dcm',
		'wadouri:/dicom2/12-019.dcm',
		'wadouri:/dicom2/12-020.dcm',
		'wadouri:/dicom2/12-021.dcm',
		'wadouri:/dicom2/12-022.dcm',
		'wadouri:/dicom2/12-023.dcm',
		'wadouri:/dicom2/12-024.dcm',
		'wadouri:/dicom2/12-025.dcm',
		'wadouri:/dicom2/12-026.dcm',
		'wadouri:/dicom2/12-027.dcm',
		'wadouri:/dicom2/12-028.dcm',
		'wadouri:/dicom2/12-029.dcm',
		'wadouri:/dicom2/12-030.dcm',
		'wadouri:/dicom2/13-001.dcm',
		'wadouri:/dicom2/13-002.dcm',
		'wadouri:/dicom2/13-003.dcm',
		'wadouri:/dicom2/13-004.dcm',
		'wadouri:/dicom2/13-005.dcm',
		'wadouri:/dicom2/13-006.dcm',
		'wadouri:/dicom2/13-007.dcm',
		'wadouri:/dicom2/13-008.dcm',
		'wadouri:/dicom2/13-009.dcm',
		'wadouri:/dicom2/13-010.dcm',
		'wadouri:/dicom2/13-011.dcm',
		'wadouri:/dicom2/13-012.dcm',
		'wadouri:/dicom2/13-013.dcm',
		'wadouri:/dicom2/13-014.dcm',
		'wadouri:/dicom2/13-015.dcm',
		'wadouri:/dicom2/13-016.dcm',
		'wadouri:/dicom2/13-017.dcm',
		'wadouri:/dicom2/13-018.dcm',
		'wadouri:/dicom2/13-019.dcm',
		'wadouri:/dicom2/13-020.dcm',
		'wadouri:/dicom2/13-021.dcm',
		'wadouri:/dicom2/13-022.dcm',
		'wadouri:/dicom2/13-023.dcm',
		'wadouri:/dicom2/13-024.dcm',
		'wadouri:/dicom2/13-025.dcm',
		'wadouri:/dicom2/13-026.dcm',
		'wadouri:/dicom2/13-027.dcm',
		'wadouri:/dicom2/13-028.dcm',
		'wadouri:/dicom2/13-029.dcm',
		'wadouri:/dicom2/14-001.dcm',
		'wadouri:/dicom2/14-002.dcm',
		'wadouri:/dicom2/14-003.dcm',
		'wadouri:/dicom2/14-004.dcm',
		'wadouri:/dicom2/14-005.dcm',
		'wadouri:/dicom2/14-006.dcm',
		'wadouri:/dicom2/14-007.dcm',
		'wadouri:/dicom2/14-008.dcm',
		'wadouri:/dicom2/14-009.dcm',
		'wadouri:/dicom2/14-010.dcm',
		'wadouri:/dicom2/14-011.dcm',
		'wadouri:/dicom2/14-012.dcm',
		'wadouri:/dicom2/14-013.dcm',
		'wadouri:/dicom2/14-014.dcm',
		'wadouri:/dicom2/14-015.dcm',
		'wadouri:/dicom2/14-016.dcm',
		'wadouri:/dicom2/14-017.dcm',
		'wadouri:/dicom2/14-018.dcm',
		'wadouri:/dicom2/14-019.dcm',
		'wadouri:/dicom2/14-020.dcm',
		'wadouri:/dicom2/14-021.dcm',
		'wadouri:/dicom2/14-022.dcm',
		'wadouri:/dicom2/14-023.dcm',
		'wadouri:/dicom2/14-024.dcm',
		'wadouri:/dicom2/14-025.dcm',
		'wadouri:/dicom2/14-026.dcm',
		'wadouri:/dicom2/14-027.dcm',
		'wadouri:/dicom2/14-028.dcm',
		'wadouri:/dicom2/14-029.dcm',
		'wadouri:/dicom2/14-030.dcm',
		'wadouri:/dicom2/15-001.dcm',
		'wadouri:/dicom2/15-002.dcm',
		'wadouri:/dicom2/15-003.dcm',
		'wadouri:/dicom2/15-004.dcm',
		'wadouri:/dicom2/15-005.dcm',
		'wadouri:/dicom2/15-006.dcm',
		'wadouri:/dicom2/15-007.dcm',
		'wadouri:/dicom2/15-008.dcm',
		'wadouri:/dicom2/15-009.dcm',
		'wadouri:/dicom2/15-010.dcm',
		'wadouri:/dicom2/15-011.dcm',
		'wadouri:/dicom2/15-012.dcm',
		'wadouri:/dicom2/15-013.dcm',
		'wadouri:/dicom2/15-014.dcm',
		'wadouri:/dicom2/15-015.dcm',
		'wadouri:/dicom2/15-016.dcm',
		'wadouri:/dicom2/15-017.dcm',
		'wadouri:/dicom2/15-018.dcm',
		'wadouri:/dicom2/15-019.dcm',
		'wadouri:/dicom2/15-020.dcm',
		'wadouri:/dicom2/15-021.dcm',
		'wadouri:/dicom2/15-022.dcm',
		'wadouri:/dicom2/15-023.dcm',
		'wadouri:/dicom2/15-024.dcm',
		'wadouri:/dicom2/15-025.dcm',
		'wadouri:/dicom2/15-026.dcm',
		'wadouri:/dicom2/15-027.dcm',
		'wadouri:/dicom2/15-028.dcm',
		'wadouri:/dicom2/15-029.dcm',
		'wadouri:/dicom2/15-030.dcm',
		'wadouri:/dicom2/16-001.dcm',
		'wadouri:/dicom2/16-002.dcm',
		'wadouri:/dicom2/16-003.dcm',
		'wadouri:/dicom2/16-004.dcm',
		'wadouri:/dicom2/16-005.dcm',
		'wadouri:/dicom2/16-006.dcm',
		'wadouri:/dicom2/16-007.dcm',
		'wadouri:/dicom2/16-008.dcm',
		'wadouri:/dicom2/16-009.dcm',
		'wadouri:/dicom2/16-010.dcm',
		'wadouri:/dicom2/16-011.dcm',
		'wadouri:/dicom2/16-012.dcm',
		'wadouri:/dicom2/16-013.dcm',
		'wadouri:/dicom2/16-014.dcm',
		'wadouri:/dicom2/16-015.dcm',
		'wadouri:/dicom2/16-016.dcm',
		'wadouri:/dicom2/16-017.dcm',
		'wadouri:/dicom2/16-018.dcm',
		'wadouri:/dicom2/16-019.dcm',
		'wadouri:/dicom2/16-020.dcm',
		'wadouri:/dicom2/16-021.dcm',
		'wadouri:/dicom2/16-022.dcm',
		'wadouri:/dicom2/16-023.dcm',
		'wadouri:/dicom2/16-024.dcm',
		'wadouri:/dicom2/16-025.dcm',
		'wadouri:/dicom2/16-026.dcm',
		'wadouri:/dicom2/16-027.dcm',
		'wadouri:/dicom2/16-028.dcm',
		'wadouri:/dicom2/16-029.dcm',
		'wadouri:/dicom2/16-030.dcm',
		'wadouri:/dicom2/17-001.dcm',
		'wadouri:/dicom2/17-002.dcm',
		'wadouri:/dicom2/17-003.dcm',
		'wadouri:/dicom2/17-004.dcm',
		'wadouri:/dicom2/17-005.dcm',
		'wadouri:/dicom2/17-006.dcm',
		'wadouri:/dicom2/17-007.dcm',
		'wadouri:/dicom2/17-008.dcm',
		'wadouri:/dicom2/17-009.dcm',
		'wadouri:/dicom2/17-010.dcm',
		'wadouri:/dicom2/17-011.dcm',
		'wadouri:/dicom2/17-012.dcm',
		'wadouri:/dicom2/17-013.dcm',
		'wadouri:/dicom2/17-014.dcm',
		'wadouri:/dicom2/17-015.dcm',
		'wadouri:/dicom2/17-016.dcm',
		'wadouri:/dicom2/17-017.dcm',
		'wadouri:/dicom2/17-018.dcm',
		'wadouri:/dicom2/17-019.dcm',
		'wadouri:/dicom2/17-020.dcm',
		'wadouri:/dicom2/17-021.dcm',
		'wadouri:/dicom2/17-022.dcm',
		'wadouri:/dicom2/17-023.dcm',
		'wadouri:/dicom2/17-024.dcm',
		'wadouri:/dicom2/17-025.dcm',
		'wadouri:/dicom2/17-026.dcm',
		'wadouri:/dicom2/17-027.dcm',
		'wadouri:/dicom2/17-028.dcm',
		'wadouri:/dicom2/17-029.dcm',
		'wadouri:/dicom2/18-001.dcm',
		'wadouri:/dicom2/18-002.dcm',
		'wadouri:/dicom2/18-003.dcm',
		'wadouri:/dicom2/18-004.dcm',
		'wadouri:/dicom2/18-005.dcm',
		'wadouri:/dicom2/18-006.dcm',
		'wadouri:/dicom2/18-007.dcm',
		'wadouri:/dicom2/18-008.dcm',
		'wadouri:/dicom2/18-009.dcm',
		'wadouri:/dicom2/18-010.dcm',
		'wadouri:/dicom2/18-011.dcm',
		'wadouri:/dicom2/18-012.dcm',
		'wadouri:/dicom2/18-013.dcm',
		'wadouri:/dicom2/18-014.dcm',
		'wadouri:/dicom2/18-015.dcm',
		'wadouri:/dicom2/18-016.dcm',
		'wadouri:/dicom2/18-017.dcm',
		'wadouri:/dicom2/18-018.dcm',
		'wadouri:/dicom2/18-019.dcm',
		'wadouri:/dicom2/18-020.dcm',
		'wadouri:/dicom2/18-021.dcm',
		'wadouri:/dicom2/18-022.dcm',
		'wadouri:/dicom2/18-023.dcm',
		'wadouri:/dicom2/18-024.dcm',
		'wadouri:/dicom2/18-025.dcm',
		'wadouri:/dicom2/18-026.dcm',
		'wadouri:/dicom2/18-027.dcm',
		'wadouri:/dicom2/18-028.dcm',
		'wadouri:/dicom2/18-029.dcm',
		'wadouri:/dicom2/18-030.dcm',
		'wadouri:/dicom2/19-001.dcm',
		'wadouri:/dicom2/19-002.dcm',
		'wadouri:/dicom2/19-003.dcm',
		'wadouri:/dicom2/19-004.dcm',
		'wadouri:/dicom2/19-005.dcm',
		'wadouri:/dicom2/19-006.dcm',
		'wadouri:/dicom2/19-007.dcm',
		'wadouri:/dicom2/19-008.dcm',
		'wadouri:/dicom2/19-009.dcm',
		'wadouri:/dicom2/19-010.dcm',
		'wadouri:/dicom2/19-011.dcm',
		'wadouri:/dicom2/19-012.dcm',
		'wadouri:/dicom2/19-013.dcm',
		'wadouri:/dicom2/19-014.dcm',
		'wadouri:/dicom2/19-015.dcm',
		'wadouri:/dicom2/19-016.dcm',
		'wadouri:/dicom2/19-017.dcm',
		'wadouri:/dicom2/19-018.dcm',
		'wadouri:/dicom2/19-019.dcm',
		'wadouri:/dicom2/19-020.dcm',
		'wadouri:/dicom2/19-021.dcm',
		'wadouri:/dicom2/19-022.dcm',
		'wadouri:/dicom2/19-023.dcm',
		'wadouri:/dicom2/19-024.dcm',
		'wadouri:/dicom2/19-025.dcm',
		'wadouri:/dicom2/19-026.dcm',
		'wadouri:/dicom2/19-027.dcm',
		'wadouri:/dicom2/19-028.dcm',
		'wadouri:/dicom2/19-029.dcm',
		'wadouri:/dicom2/19-030.dcm',
		'wadouri:/dicom2/19-031.dcm',
		'wadouri:/dicom2/19-032.dcm',
		'wadouri:/dicom2/19-033.dcm',
		'wadouri:/dicom2/19-034.dcm',
		'wadouri:/dicom2/19-035.dcm',
		'wadouri:/dicom2/19-036.dcm',
		'wadouri:/dicom2/19-037.dcm',
		'wadouri:/dicom2/19-038.dcm',
		'wadouri:/dicom2/19-039.dcm',
		'wadouri:/dicom2/19-040.dcm',
		'wadouri:/dicom2/19-041.dcm',
		'wadouri:/dicom2/19-042.dcm',
		'wadouri:/dicom2/19-043.dcm',
		'wadouri:/dicom2/19-044.dcm',
		'wadouri:/dicom2/19-045.dcm',
		'wadouri:/dicom2/19-046.dcm',
		'wadouri:/dicom2/19-047.dcm',
		'wadouri:/dicom2/19-048.dcm',
		'wadouri:/dicom2/19-049.dcm',
		'wadouri:/dicom2/19-050.dcm',
		'wadouri:/dicom2/19-051.dcm',
		'wadouri:/dicom2/19-052.dcm',
		'wadouri:/dicom2/19-053.dcm',
		'wadouri:/dicom2/19-054.dcm',
		'wadouri:/dicom2/19-055.dcm',
		'wadouri:/dicom2/19-056.dcm',
	];
}
function getTestImageIds2() {
	return [
		'wadouri:/dicom/1-001.dcm',
		'wadouri:/dicom/1-002.dcm',
		'wadouri:/dicom/1-003.dcm',
		'wadouri:/dicom/1-004.dcm',
		'wadouri:/dicom/1-005.dcm',
		'wadouri:/dicom/1-006.dcm',
		'wadouri:/dicom/1-007.dcm',
		'wadouri:/dicom/1-008.dcm',
		'wadouri:/dicom/1-009.dcm',
		'wadouri:/dicom/1-010.dcm',
		'wadouri:/dicom/1-011.dcm',
		'wadouri:/dicom/1-012.dcm',
		'wadouri:/dicom/1-013.dcm',
		'wadouri:/dicom/1-014.dcm',
		'wadouri:/dicom/1-015.dcm',
		'wadouri:/dicom/1-016.dcm',
		'wadouri:/dicom/1-017.dcm',
		'wadouri:/dicom/1-018.dcm',
		'wadouri:/dicom/1-019.dcm',
		'wadouri:/dicom/1-020.dcm',
		'wadouri:/dicom/1-021.dcm',
		'wadouri:/dicom/1-022.dcm',
		'wadouri:/dicom/1-023.dcm',
		'wadouri:/dicom/1-024.dcm',
		'wadouri:/dicom/1-025.dcm',
		'wadouri:/dicom/1-026.dcm',
		'wadouri:/dicom/1-027.dcm',
		'wadouri:/dicom/1-028.dcm',
		'wadouri:/dicom/1-029.dcm',
		'wadouri:/dicom/1-030.dcm',
		'wadouri:/dicom/1-031.dcm',
		'wadouri:/dicom/1-032.dcm',
		'wadouri:/dicom/1-033.dcm',
		'wadouri:/dicom/1-034.dcm',
		'wadouri:/dicom/1-035.dcm',
		'wadouri:/dicom/1-036.dcm',
		'wadouri:/dicom/1-037.dcm',
		'wadouri:/dicom/1-038.dcm',
		'wadouri:/dicom/1-039.dcm',
		'wadouri:/dicom/1-040.dcm',
		'wadouri:/dicom/1-041.dcm',
		'wadouri:/dicom/1-042.dcm',
		'wadouri:/dicom/1-043.dcm',
		'wadouri:/dicom/1-044.dcm',
		'wadouri:/dicom/1-045.dcm',
		'wadouri:/dicom/1-046.dcm',
		'wadouri:/dicom/1-047.dcm',
		'wadouri:/dicom/1-048.dcm',
		'wadouri:/dicom/1-049.dcm',
		'wadouri:/dicom/1-050.dcm',
		'wadouri:/dicom/1-051.dcm',
		'wadouri:/dicom/1-052.dcm',
		'wadouri:/dicom/1-053.dcm',
		'wadouri:/dicom/1-054.dcm',
		'wadouri:/dicom/1-055.dcm',
		'wadouri:/dicom/1-056.dcm',
		'wadouri:/dicom/1-057.dcm',
		'wadouri:/dicom/1-058.dcm',
		'wadouri:/dicom/1-059.dcm',
		'wadouri:/dicom/1-060.dcm',
		'wadouri:/dicom/1-061.dcm',
		'wadouri:/dicom/1-062.dcm',
		'wadouri:/dicom/1-063.dcm',
		'wadouri:/dicom/1-064.dcm',
		'wadouri:/dicom/1-065.dcm',
		'wadouri:/dicom/1-066.dcm',
		'wadouri:/dicom/1-067.dcm',
		'wadouri:/dicom/1-068.dcm',
		'wadouri:/dicom/1-069.dcm',
		'wadouri:/dicom/1-070.dcm',
		'wadouri:/dicom/1-071.dcm',
		'wadouri:/dicom/1-072.dcm',
		'wadouri:/dicom/1-073.dcm',
		'wadouri:/dicom/1-074.dcm',
		'wadouri:/dicom/1-075.dcm',
		'wadouri:/dicom/1-076.dcm',
		'wadouri:/dicom/1-077.dcm',
		'wadouri:/dicom/1-078.dcm',
		'wadouri:/dicom/1-079.dcm',
		'wadouri:/dicom/1-080.dcm',
		'wadouri:/dicom/1-081.dcm',
		'wadouri:/dicom/1-082.dcm',
		'wadouri:/dicom/1-083.dcm',
		'wadouri:/dicom/1-084.dcm',
		'wadouri:/dicom/1-085.dcm',
		'wadouri:/dicom/1-086.dcm',
		'wadouri:/dicom/1-087.dcm',
		'wadouri:/dicom/1-088.dcm',
		'wadouri:/dicom/1-089.dcm',
		'wadouri:/dicom/1-090.dcm',
		'wadouri:/dicom/1-091.dcm',
		'wadouri:/dicom/1-092.dcm',
		'wadouri:/dicom/1-093.dcm',
		'wadouri:/dicom/1-094.dcm',
		'wadouri:/dicom/1-095.dcm',
		'wadouri:/dicom/1-096.dcm',
		'wadouri:/dicom/1-097.dcm',
		'wadouri:/dicom/1-098.dcm',
		'wadouri:/dicom/1-099.dcm',
		'wadouri:/dicom/1-100.dcm',
		'wadouri:/dicom/1-101.dcm',
		'wadouri:/dicom/1-102.dcm',
		'wadouri:/dicom/1-103.dcm',
		'wadouri:/dicom/1-104.dcm',
		'wadouri:/dicom/1-105.dcm',
		'wadouri:/dicom/1-106.dcm',
		'wadouri:/dicom/1-107.dcm',
		'wadouri:/dicom/1-108.dcm',
		'wadouri:/dicom/1-109.dcm',
		'wadouri:/dicom/1-110.dcm',
		'wadouri:/dicom/1-111.dcm',
		'wadouri:/dicom/1-112.dcm',
		'wadouri:/dicom/1-113.dcm',
		'wadouri:/dicom/1-114.dcm',
		'wadouri:/dicom/1-115.dcm',
	];
}


runFunction();
