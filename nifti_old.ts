//import {
//    RenderingEngine,
//    Types,
//    Enums,
//    volumeLoader,
//    setVolumesForViewports,
//} from '@cornerstonejs/core';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
//import {
//    addTool,
//    BidirectionalTool,
//    RectangleROITool,
//    RectangleScissorsTool,
//    PanTool,
//    ZoomTool,
//    StackScrollMouseWheelTool,
//    VolumeRotateMouseWheelTool,
//    TrackballRotateTool,
//    ToolGroupManager,
//    Enums as csToolsEnums,
//    //init as csToolsInit,
//    init as csTools3dInit,
//    annotation as csAnnotations,
//    utilities as csUtilities,
//    segmentation,
//} from '@cornerstonejs/tools';
//import { init as csTools3dInit } from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
//import { setCtTransferFunctionForVolumeActor } from './setCtTransferFunctionForVolumeActor';
//import setCtTransferFunctionForVolumeActor from './setCtTransferFunctionForVolumeActor';


async function run() {
    await cornerstone.init();
    await cornerstoneTools.init();

    const size = '500px';
    //const windowWidth = 600;
    //const windowCenter = 300;
    //const lower = windowCenter - windowWidth / 2.0;
    //const upper = windowCenter + windowWidth / 2.0;

    const content = document.getElementById('content');

    const viewportGrid = document.createElement('div');
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
    
    cornerstone.volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

    const volumeId = 'nifti:' + getNiftiVolume();

    const volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
        type: 'image',
    });

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

    const viewportInputArray = [
        {
            viewportId: viewportId1,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element1,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
        {
            viewportId: viewportId2,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element2,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
        {
            viewportId: viewportId3,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element3,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
    ];

    renderingEngine.setViewports(viewportInputArray);

    cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId: volumeId,
                //callback: ({ volumeActor }) => {
                //    volumeActor
                //        .getProperty()
                //        .getRGBTransferFunction(0)
                //        .setMappingRange(lower, upper);
                //},
                slabThickness: 0.1,
            }
        ],
        viewportInputArray.map(v => v.viewportId)
    );

    // Seg setup
    // --------------------------------

    const segmentationVolumeId = 'nifti:' + getNiftiSeg();

    const segVolume = await cornerstone.volumeLoader.createAndCacheDerivedSegmentationVolume(segmentationVolumeId, {
        type: 'labelmap',
    });

    cornerstoneTools.segmentation.addSegmentations([{
        segmentationId: segmentationVolumeId,
        representation: {
            type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
            data: {
                volumeId: segmentationVolumeId,
            },
        },
    }]);

    //segmentation.setVolumesForViewports(renderingEngine, [segVolume], [viewportId1, viewportId2, viewportId3]);

    //const colorLUT = [
    //    [0, 0, 0, 0], // Assume background is transparent
    //    [255, 0, 0, 255], // Label 1: Red
    //    [0, 255, 0, 255], // Label 2: Green
    //    // Add more colors for additional labels
    //];

    //segmentation.setColorLUT(renderingEngineId, segVolume.volumeId, colorLUT);

    // Activate the segmentation display for each viewport
    //const viewports = renderingEngine.getViewports();
    //viewports.forEach((viewport) => {
    //    segmentation.setSegmentationActive(renderingEngineId, viewport.viewportId, true);
    //});

    // --------------------------------


    // Tool setup
    // --------------------------------
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

    const toolGroupId = 'myToolGroup';
    const toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);
    toolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);

    toolGroup.addViewport(viewportId1, renderingEngineId);
    toolGroup.addViewport(viewportId2, renderingEngineId);
    toolGroup.addViewport(viewportId3, renderingEngineId);

    toolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    // --------------------------------



    renderingEngine.render();
}

function getNiftiVolume() {//{{{
    return '/nifti/brain/BraTS-MET-00086-000-t1n.nii.gz';
}//}}}

function getNiftiSeg() {//{{{
    //return '/nifti/brain/BraTS-MET-00086-000-seg.nii.gz';
    return '/nifti/brain/BraTS-MET-00086-000-seg_new.nii.gz';
}//}}}



run();