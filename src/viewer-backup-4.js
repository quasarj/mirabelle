// import

import * as cornerstone from '@cornerstonejs/core';

import {
	cornerstoneStreamingImageVolumeLoader,
	cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';



// Initialization

let fileList = null;
let volumeId = null;
let volume = null;
let seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
let timepointID = '6750';

const { volumeLoader } = cornerstone;

export function initVolumeLoader() {
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

export function initCornerstoneDICOMImageLoader() {
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



// Volumes

function setupVolPanel() {

    const volGrid = document.createElement('div')
    volGrid.id = 'vol_grid';

    const volAxialContent = document.createElement('div')
    volAxialContent.id = 'vol_axial';
    const volSagittalContent = document.createElement('div')
    volSagittalContent.id = 'vol_sagittal';
    const volCoronalContent = document.createElement('div')
    volCoronalContent.id = 'vol_coronal';

    document.getElementById('container').appendChild(volGrid);

    volGrid.style.display = 'flex';
    volGrid.style.width = '100%';
    volGrid.style.height = '100%';

    volAxialContent.style.gridColumnStart = '1';
    volAxialContent.style.gridRowStart = '1';
    volSagittalContent.style.gridColumnStart = '2';
    volSagittalContent.style.gridRowStart = '1';
    volCoronalContent.style.gridColumnStart = '3';
    volCoronalContent.style.gridRowStart = '1';

    volGrid.appendChild(volAxialContent);
    volGrid.appendChild(volSagittalContent);
    volGrid.appendChild(volCoronalContent);

    const elementList = [
        volAxialContent,
        volSagittalContent,
        volCoronalContent,
    ];

    elementList.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.oncontextmenu = (e) => e.preventDefault();
        resizeObserver.observe(element);
    });

    return { "axial": volAxialContent, "sagittal": volSagittalContent, "coronal": volCoronalContent }
}

function setupMipPanel() {

    const mipGrid = document.createElement('div')
    mipGrid.id = 'mip_grid';
    const mipAxialContent = document.createElement('div')
    mipAxialContent.id = 'mip_axial';
    const mipSagittalContent = document.createElement('div')
    mipSagittalContent.id = 'mip_sagittal';
    const mipCoronalContent = document.createElement('div')
    mipCoronalContent.id = 'mip_coronal';

    document.getElementById('container').appendChild(mipGrid);

    mipGrid.style.display = 'flex';
    mipGrid.style.flexDirection = 'row';
    mipGrid.style.width = '100%';
    mipGrid.style.height = '100%';

    mipAxialContent.style.gridColumnStart = '1';
    mipAxialContent.style.gridRowStart = '1';
    mipSagittalContent.style.gridColumnStart = '2';
    mipSagittalContent.style.gridRowStart = '1';
    mipCoronalContent.style.gridColumnStart = '3';
    mipCoronalContent.style.gridRowStart = '1';

    mipGrid.appendChild(mipAxialContent);
    mipGrid.appendChild(mipSagittalContent);
    mipGrid.appendChild(mipCoronalContent);

    const elementList = [
        mipAxialContent,
        mipSagittalContent,
        mipCoronalContent,
    ];

    elementList.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.oncontextmenu = (e) => e.preventDefault();

        resizeObserver.observe(element);
    });

    return { "axial": mipAxialContent, "sagittal": mipSagittalContent, "coronal": mipCoronalContent }
}

function setup3dPanel() {

    const t3dGrid = document.createElement('div')
    t3dGrid.id = 't3d_grid';
    const t3dCoronalContent = document.createElement('div')
    t3dCoronalContent.id = 't3d_coronal';

    document.getElementById('container').appendChild(t3dGrid);

    t3dGrid.style.display = 'flex';
    t3dGrid.style.flexDirection = 'row';
    t3dGrid.style.width = '100%';
    t3dGrid.style.height = '100%';

    t3dCoronalContent.style.gridColumnStart = '1';
    t3dCoronalContent.style.gridRowStart = '1';

    t3dGrid.appendChild(t3dCoronalContent);

    t3dCoronalContent.style.width = '100%';
    t3dCoronalContent.style.height = '100%';
    t3dCoronalContent.oncontextmenu = (e) => e.preventDefault();

    resizeObserver.observe(t3dCoronalContent);

    return { "coronal": t3dCoronalContent }
}



// Helpers

async function getFileData()
{
    let response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);

    const files = await response.json();
    
    fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);

    volumeId = 'cornerstoneStreamingImageVolume: newVolume';

    volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
}

const resizeObserver = new ResizeObserver(() => {
    const renderingEngine = cornerstone.getRenderingEngine('viewer_render_engine');

    if (renderingEngine) {
        renderingEngine.resize(true, false);
    }
});



// Run

async function run() {
    await cornerstone.init();
    await initVolumeLoader();
    await initCornerstoneDICOMImageLoader();
    await getFileData();

    const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');

    const volContent = setupVolPanel();
    const mipContent = setupMipPanel();
    const t3dContent = setup3dPanel();

    const viewportInput = [
                {
                    viewportId: 'vol_axial',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volContent["axial"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                    },
                },
                {
                    viewportId: 'vol_sagittal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volContent["sagittal"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                    },
                },
                {
                    viewportId: 'vol_coronal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volContent["coronal"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
                {
                    viewportId: 'mip_axial',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipContent["axial"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                    },
                },
                {
                    viewportId: 'mip_sagittal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipContent["sagittal"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                    },
                },
                {
                    viewportId: 'mip_coronal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipContent["coronal"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
                {
                    viewportId: 't3d_coronal',
                    type: cornerstone.Enums.ViewportType.VOLUME_3D,
                    element: t3dContent["coronal"],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
            ];
    
    renderingEngine.setViewports(viewportInput);

    volume.load();

    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId: volumeId,
            }
        ],
        ['vol_axial', 'vol_sagittal', 'vol_coronal']
    );

    // Add volumes to MIP viewports
    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
            {
                volumeId: volumeId,
                blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
            },
        ],
        ['mip_axial', 'mip_sagittal', 'mip_coronal']
    );

    // Add volumes to 3D viewports
    const viewport = renderingEngine.getViewport('t3d_coronal');
    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
            {
                volumeId: volumeId
            },
        ],
        ['t3d_coronal']
    ).then(() => {
        viewport.setProperties({
            preset: 'MR-Default',
        });
    });

    renderingEngine.render();
}

run();