import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

// ======== Set up page ======== //
const size = '500px';

const content = document.getElementById('content');

const title = document.createElement('h1');
title.innerText = "NIfTI Curation Tools";
content.append(title);

const description = document.createElement('h2');
description.innerText = "A visualization tool for NIfTI curation";
content.append(description);

const viewportGrid = document.createElement('div');

viewportGrid.style.display = 'flex';
viewportGrid.style.flexDirection = 'row';

const element1 = document.createElement('div');
const element2 = document.createElement('div');
const element3 = document.createElement('div');

// Disable right click context menu
element1.oncontextmenu = () => false;
element2.oncontextmenu = () => false;
element3.oncontextmenu = () => false;

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

// ============================= //

async function run() {
    await cornerstone.init();
    await cornerstoneTools.init();

    const volumeId = 'nifti:' + getNiftiVolume();

    cornerstone.volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

    const volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
        type: 'image',
    });

    const viewportId1 = 'VP_AXIAL';
    const viewportId2 = 'VP_SAGITTAL';
    const viewportId3 = 'VP_CORONAL';
    
    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

    const viewportInputArray = [
        {
            viewportId: viewportId1,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element1,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                //VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
        {
            viewportId: viewportId2,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element2,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                //VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
        {
            viewportId: viewportId3,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element3,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                //VOILUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,
            },
        },
    ];

    renderingEngine.setViewports(viewportInputArray);

    volume.load();

    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId: volumeId,
                //callback: ({ volumeActor }) => {
                //    volumeActor
                //        .getProperty()
                //        .getRGBTransferFunction(0)
                //        .setMappingRange(-180, 220);
                //},
                //slabThickness: 0.1,
            }
        ],
        viewportInputArray.map(v => v.viewportId)
    );
    
    // Tools setup
    // --------------------------------
    const toolGroupId = 'defaultToolGroup';
    const toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);

    toolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    toolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    toolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
    toolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);

    toolGroup.addViewport(viewportId1, renderingEngineId);
    toolGroup.addViewport(viewportId2, renderingEngineId);
    toolGroup.addViewport(viewportId3, renderingEngineId);

    toolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    toolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
    toolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
            },
        ],
    });
    toolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
            },
        ],
    });

    // Seg setup
    // --------------------------------

    const segmentationId = 'nifti:' + getNiftiSeg();

    //const segVolume = await cornerstone.volumeLoader.createAndCacheDerivedSegmentationVolume(volumeId, {
    //    volumeId: segmentationId,
    //});

    const segVolume = await cornerstone.volumeLoader.createAndCacheVolume(segmentationId, {
        type: 'labelmap',
    });

    // Add the segmentations to state
    cornerstoneTools.segmentation.addSegmentations([
        {
            segmentationId,
            representation: {
                type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                data: {
                    volumeId: segmentationId,
                },
            },
        },
    ]);

    const toolGroupConfiguration = {
        renderInactiveSegmentations: true,
        representations: {
            //https://www.cornerstonejs.org/api/tools/namespace/Types#LabelmapConfig
            LABELMAP: {
                renderFill: true,
                renderOutline: true,
                fillAlpha: 0.5,
                //fillAlphaInactive: 0.5,
                outlineOpacity: 1,
                outlineWidthActive: 1,
            },
        },
    }
    cornerstoneTools.segmentation.config.setToolGroupSpecificConfig(toolGroupId, toolGroupConfiguration)

    await cornerstoneTools.segmentation.addSegmentationRepresentations(toolGroupId, [
        {
            segmentationId,
            type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
        },
    ]);

    //cornerstoneTools.segmentation.getActiveSegmentationRepresentation(toolGroupId);

    // --------------------------------
        
    renderingEngine.render();
    //renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
}

function getNiftiVolume() {//{{{
    return '/nifti/brain/BraTS-MET-00086-000-t1n.nii.gz';
}//}}}

function getNiftiSeg() {//{{{
    //return '/nifti/brain/BraTS-MET-00086-000-seg.nii.gz';
    return '/nifti/brain/BraTS-MET-00086-000-seg_new.nii.gz';
}//}}}


run();