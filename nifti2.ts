import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

// ============================= //

const renderingEngineId = 'myRenderingEngine';

const resizeObserver = new ResizeObserver(() => {
    console.log('Size changed');

    const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);

    if (renderingEngine) {
        renderingEngine.resize(true, false);
    }
});

// ======== Set up page ======== //
const size = '500px';

const content = document.getElementById('content');

//const title = document.createElement('h1');
//title.innerText = "NIfTI Curation Tools";
//content.append(title);

//const description = document.createElement('h2');
//description.innerText = "A visualization tool for NIfTI curation";
//content.append(description);

const viewportGrid = document.createElement('div');

content.appendChild(viewportGrid);

viewportGrid.style.display = 'grid';
viewportGrid.style.gridTemplateRows = `[row1-start] 50% [row2-start] 50% [end]`;
viewportGrid.style.gridTemplateColumns = `[col1-start] 20% [col2-start] 20% [col3-start] 20% [col4-start] 20% [end]`;
viewportGrid.style.width = '95vw';
viewportGrid.style.height = '80vh';

const element1_1 = document.createElement('div');
const element1_2 = document.createElement('div');
const element1_3 = document.createElement('div');
const element2_1 = document.createElement('div');
const element2_2 = document.createElement('div');
const element2_3 = document.createElement('div');
const element_3D = document.createElement('div');

element1_1.style.gridColumnStart = '1';
element1_1.style.gridRowStart = '1';
element1_2.style.gridColumnStart = '2';
element1_2.style.gridRowStart = '1';
element1_3.style.gridColumnStart = '3';
element1_3.style.gridRowStart = '1';
element2_1.style.gridColumnStart = '1';
element2_1.style.gridRowStart = '2';
element2_2.style.gridColumnStart = '2';
element2_2.style.gridRowStart = '2';
element2_3.style.gridColumnStart = '3';
element2_3.style.gridRowStart = '2';

element_3D.style.gridColumnStart = '4';
element_3D.style.gridRowStart = '1';
element_3D.style.gridRowEnd = 'rowspan 2';

viewportGrid.appendChild(element1_1);
viewportGrid.appendChild(element1_2);
viewportGrid.appendChild(element1_3);
viewportGrid.appendChild(element2_1);
viewportGrid.appendChild(element2_2);
viewportGrid.appendChild(element2_3);
viewportGrid.appendChild(element_3D);

const elements = [
    element1_1,
    element1_2,
    element1_3,
    element2_1,
    element2_2,
    element2_3,
    element_3D,
];

elements.forEach((element) => {
    element.style.width = '100%';
    element.style.height = '100%';
    //element.style.width = size;
    //element.style.height = size;
    element.oncontextmenu = (e) => e.preventDefault();

    resizeObserver.observe(element);
});

// ============================= //





async function run() {
    await cornerstone.init();
    await cornerstoneTools.init();

    const volumeId = 'nifti:' + getNiftiVolume();

    cornerstone.volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

    const volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
        type: 'image',
    });

    const viewportIds = {
        VOL: { AXIAL: 'VOL_AXIAL', SAGITTAL: 'VOL_SAGITTAL', CORONAL: 'VOL_CORONAL' },
        MIP: { AXIAL: 'MIP_AXIAL', SAGITTAL: 'MIP_SAGITTAL', CORONAL: 'MIP_CORONAL' },
        T3D: { CORONAL: 'T3D_CORONAL'},
    };
    
    const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

    const viewportInputArray = [
        {
            viewportId: viewportIds.VOL.AXIAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element1_1,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
            },
        },
        {
            viewportId: viewportIds.VOL.SAGITTAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element1_2,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
            },
        },
        {
            viewportId: viewportIds.VOL.CORONAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element1_3,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
            },
        },
        {
            viewportId: viewportIds.MIP.AXIAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element2_1,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
            },
        },
        {
            viewportId: viewportIds.MIP.SAGITTAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element2_2,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
            },
        },
        {
            viewportId: viewportIds.MIP.CORONAL,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: element2_3,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
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
        //viewportInputArray.map(v => v.viewportId)
        [viewportIds.VOL.AXIAL, viewportIds.VOL.SAGITTAL, viewportIds.VOL.CORONAL]
    );

    const volumeDimensions = volume.dimensions;

    const slabThickness = Math.sqrt(
        volumeDimensions[0] * volumeDimensions[0] +
        volumeDimensions[1] * volumeDimensions[1] +
        volumeDimensions[2] * volumeDimensions[2]
    );

    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId: volumeId,
                blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
                slabThickness,
            },
        ],
        [viewportIds.MIP.AXIAL, viewportIds.MIP.SAGITTAL, viewportIds.MIP.CORONAL]
    );
    
    // Tools setup
    // --------------------------------
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.VolumeRotateMouseWheelTool);

    const volToolGroupId = 'volToolGroup';
    const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(volToolGroupId);
    const mipToolGroupId = 'mipToolGroup';
    const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(mipToolGroupId);
    const t3dToolGroupId = 't3dToolGroup';
    const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(t3dToolGroupId);

    volToolGroup.addViewport(viewportIds.VOL.AXIAL, renderingEngineId);
    volToolGroup.addViewport(viewportIds.VOL.SAGITTAL, renderingEngineId);
    volToolGroup.addViewport(viewportIds.VOL.CORONAL, renderingEngineId);
    mipToolGroup.addViewport(viewportIds.MIP.AXIAL, renderingEngineId);
    mipToolGroup.addViewport(viewportIds.MIP.SAGITTAL, renderingEngineId);
    mipToolGroup.addViewport(viewportIds.MIP.CORONAL, renderingEngineId);

    [volToolGroup, mipToolGroup].forEach((toolGroup) => {
        toolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
        toolGroup.addTool(cornerstoneTools.PanTool.toolName);
        toolGroup.addTool(cornerstoneTools.ZoomTool.toolName);

        toolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
            bindings: [
                {
                    mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
                },
            ],
        });
        toolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
            bindings: [
                {
                    mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
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
    });

    volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);

    volToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    volToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

    mipToolGroup.addTool(cornerstoneTools.VolumeRotateMouseWheelTool.toolName);
    mipToolGroup.setToolActive(cornerstoneTools.VolumeRotateMouseWheelTool.toolName);


    // Seg setup
    // --------------------------------

    const segmentationId = 'nifti:' + getNiftiSeg();

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
    cornerstoneTools.segmentation.config.setToolGroupSpecificConfig(volToolGroupId, toolGroupConfiguration)

    await cornerstoneTools.segmentation.addSegmentationRepresentations(volToolGroupId, [
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