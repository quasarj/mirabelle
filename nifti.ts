import {
    RenderingEngine,
    Enums,
    init as csInit,
    Types,
    volumeLoader,
    setVolumesForViewports,
} from '@cornerstonejs/core';
import { init as csTools3dInit } from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
//import { setCtTransferFunctionForVolumeActor } from './setCtTransferFunctionForVolumeActor';
//import setCtTransferFunctionForVolumeActor from './setCtTransferFunctionForVolumeActor';


async function setup() {
    await csInit();
    await csTools3dInit();

    const size = '500px';
    //const windowWidth = 600;
    //const windowCenter = 300;
    //const lower = windowCenter - windowWidth / 2.0;
    //const upper = windowCenter + windowWidth / 2.0;

    const content = document.getElementById('content');
    const viewportGrid = document.createElement('div');
    viewportGrid.style.display = 'flex';
    viewportGrid.style.display = 'flex';
    viewportGrid.style.flexDirection = 'row';

    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element3 = document.createElement('div');
    element1.style.width = size;
    element1.style.height = size;
    element2.style.width = size;
    element2.style.height = size;
    element3.style.width = size;
    element3.style.height = size;

    viewportGrid.appendChild(element1);
    viewportGrid.appendChild(element2);
    viewportGrid.appendChild(element3);

    content.appendChild(viewportGrid);

    const viewportId1 = 'CT_NIFTI_AXIAL';
    const viewportId2 = 'CT_NIFTI_SAGITTAL';
    const viewportId3 = 'CT_NIFTI_CORONAL';
    
    volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

    const niftiURL = getNiftiVolume();
    const volumeId = 'nifti:' + niftiURL;

    const volume = await volumeLoader.createAndCacheVolume(volumeId);

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportInputArray = [
        {
            viewportId: viewportId1,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: element1,
            defaultOptions: {
                orientation: Enums.OrientationAxis.AXIAL,
            },
        },
        {
            viewportId: viewportId2,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: element2,
            defaultOptions: {
                orientation: Enums.OrientationAxis.SAGITTAL,
            },
        },
        {
            viewportId: viewportId3,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: element3,
            defaultOptions: {
                orientation: Enums.OrientationAxis.CORONAL,
            },
        },
    ];

    renderingEngine.setViewports(viewportInputArray);

    setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId,
                //callback: setTransferFunctionForVolumeActor
                //callback: ({ volumeActor }) => {
                //    volumeActor
                //        .getProperty()
                //        .getRGBTransferFunction(0)
                //        .setMappingRange(lower, upper);
                //},
                slabThickness: 0.1,
            }],
        viewportInputArray.map((v) => v.viewportId)
    );

    renderingEngine.render();
}

function getNiftiVolume() {//{{{
    return '/nifti/brain/BraTS-MET-00086-000-t1n.nii.gz';
}//}}}

function getNiftiSeg() {//{{{
    return '/nifti/brain/BraTS-MET-00086-000-seg.nii.gz';
}//}}}



setup();