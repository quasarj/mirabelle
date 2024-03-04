import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

// ============================= //
// Adjusts the rendered size when the window size changes
const renderingEngineId = 'niftiRenderingEngine';

const resizeObserver = new ResizeObserver(() => {
    console.log('Size changed');

    const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);

    if (renderingEngine) {
        renderingEngine.resize(true, false);
    }
});

// ======== Set up page ======== //

const file_content = document.getElementById('file_panel');

function updateFilePanel() {
    const fileList = getNiftiList();
    const filePanel = document.getElementById('file_content');
    filePanel.innerHTML = ''; // Clear existing list
    fileList.forEach((file, index) => {
        const listItem = document.createElement('li');

        const fileNameDiv = document.createElement('div');
        const fileParts = file.split(/[/\\]/)
        fileNameDiv.textContent = fileParts.pop();

        //const filePathDiv = document.createElement('div');
        //filePathDiv.textContent = file;

        listItem.onclick = () => {
            //loadVolume(file); // Function to load the clicked file as volume
            highlightSelectedFile(index); // Function to highlight the selected file
        };

        // Add more divs for additional data columns if needed
        listItem.appendChild(fileNameDiv);
        //listItem.appendChild(filePathDiv);

        // Append additional divs as needed
        filePanel.appendChild(listItem);
    });
}

function highlightSelectedFile(selectedIndex) {
    const filePanel = document.getElementById('file_content');
    Array.from(filePanel.children).forEach((child, index) => {
        if (index === selectedIndex) {
            child.style.backgroundColor = 'orange'; // Highlight selected
        } else {
            child.style.backgroundColor = ''; // Reset others
        }
    });
}


updateFilePanel();



//const tool_content = document.getElementById('tool_panel');






const elements = {
    VOL: {
        CONTENT: document.getElementById('vol_content'),
        TOOLS: document.getElementById('vol_tools'),
        GRID: document.createElement('div'),
        AXIAL: {
            CONTENT: document.createElement('div'),
            ID: 'VOL_AXIAL',
        },
        SAGITTAL: {
            CONTENT: document.createElement('div'),
            ID: 'VOL_SAGITTAL',
        },
        CORONAL: {
            CONTENT: document.createElement('div'),
            ID: 'VOL_CORONAL',
        },
    },
    MIP: {
        CONTENT: document.getElementById('mip_content'),
        TOOLS: document.getElementById('mip_tools'),
        GRID: document.createElement('div'),
        AXIAL: {
            CONTENT: document.createElement('div'),
            ID: 'MIP_AXIAL',
        },
        SAGITTAL: {
            CONTENT: document.createElement('div'),
            ID: 'MIP_SAGITTAL',
        },
        CORONAL: {
            CONTENT: document.createElement('div'),
            ID: 'MIP_CORONAL',
        },
    },
    T3D: {
        CONTENT: document.getElementById('t3d_content'),
        GRID: document.createElement('div'),
        TOOLS: document.getElementById('t3d_tools'),
        CORONAL: {
            CONTENT: document.createElement('div'),
            ID: 'T3D_CORONAL',
        },
    },
};

elements.VOL.CONTENT.appendChild(elements.VOL.GRID);
elements.MIP.CONTENT.appendChild(elements.MIP.GRID);
elements.T3D.CONTENT.appendChild(elements.T3D.GRID);

[elements.VOL.GRID, elements.MIP.GRID, elements.T3D.GRID].forEach((viewportGrid) => {
    viewportGrid.style.display = 'flex';
    viewportGrid.style.flexDirection = 'row';
    viewportGrid.style.width = '100%';
    viewportGrid.style.height = '100%';
});

elements.VOL.AXIAL.CONTENT.style.gridColumnStart = '1';
elements.VOL.AXIAL.CONTENT.style.gridRowStart = '1';
elements.VOL.SAGITTAL.CONTENT.style.gridColumnStart = '2';
elements.VOL.SAGITTAL.CONTENT.style.gridRowStart = '1';
elements.VOL.CORONAL.CONTENT.style.gridColumnStart = '3';
elements.VOL.CORONAL.CONTENT.style.gridRowStart = '1';

elements.MIP.AXIAL.CONTENT.style.gridColumnStart = '1';
elements.MIP.AXIAL.CONTENT.style.gridRowStart = '1';
elements.MIP.SAGITTAL.CONTENT.style.gridColumnStart = '2';
elements.MIP.SAGITTAL.CONTENT.style.gridRowStart = '1';
elements.MIP.CORONAL.CONTENT.style.gridColumnStart = '3';
elements.MIP.CORONAL.CONTENT.style.gridRowStart = '1';

elements.T3D.CORONAL.CONTENT.style.gridColumnStart = '1';
elements.T3D.CORONAL.CONTENT.style.gridRowStart = '1';

elements.VOL.GRID.appendChild(elements.VOL.AXIAL.CONTENT);
elements.VOL.GRID.appendChild(elements.VOL.SAGITTAL.CONTENT);
elements.VOL.GRID.appendChild(elements.VOL.CORONAL.CONTENT);
elements.MIP.GRID.appendChild(elements.MIP.AXIAL.CONTENT);
elements.MIP.GRID.appendChild(elements.MIP.SAGITTAL.CONTENT);
elements.MIP.GRID.appendChild(elements.MIP.CORONAL.CONTENT);
elements.T3D.GRID.appendChild(elements.T3D.CORONAL.CONTENT);

const elementList = [
    elements.VOL.AXIAL.CONTENT,
    elements.VOL.SAGITTAL.CONTENT,
    elements.VOL.CORONAL.CONTENT,
    elements.MIP.AXIAL.CONTENT,
    elements.MIP.SAGITTAL.CONTENT,
    elements.MIP.CORONAL.CONTENT,
    elements.T3D.CORONAL.CONTENT,
];

elementList.forEach((element) => {
    element.style.width = '100%';
    element.style.height = '100%';
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
    
    const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);

    const viewportInputArray = [
        {
            viewportId: elements.VOL.AXIAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.VOL.AXIAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
            },
        },
        {
            viewportId: elements.VOL.SAGITTAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.VOL.SAGITTAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
            },
        },
        {
            viewportId: elements.VOL.CORONAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.VOL.CORONAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
            },
        },
        {
            viewportId: elements.MIP.AXIAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.MIP.AXIAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
            },
        },
        {
            viewportId: elements.MIP.SAGITTAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.MIP.SAGITTAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
            },
        },
        {
            viewportId: elements.MIP.CORONAL.ID,
            type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
            element: elements.MIP.CORONAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
            },
        },
        {
            viewportId: elements.T3D.CORONAL.ID,
            type: cornerstone.Enums.ViewportType.VOLUME_3D,
            element: elements.T3D.CORONAL.CONTENT,
            defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                //background: cornerstone.CONSTANTS.BACKGROUND_COLORS.slicer3D,
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
        [elements.VOL.AXIAL.ID, elements.VOL.SAGITTAL.ID, elements.VOL.CORONAL.ID]
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
        [elements.MIP.AXIAL.ID, elements.MIP.SAGITTAL.ID, elements.MIP.CORONAL.ID]
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
        [elements.T3D.CORONAL.ID]
    );

    const viewport = renderingEngine.getViewport(elements.T3D.CORONAL.ID);
    await cornerstone.setVolumesForViewports(
        renderingEngine,
        [
            {
                volumeId
            }
        ],
        [elements.T3D.CORONAL.ID]).then(() => {
            viewport.setProperties({
                //preset: 'CT-Bone',
                preset: 'MR-T2-Brain',
            });
            viewport.render();
        });

    
    // Tools setup
    // --------------------------------
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.VolumeRotateMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);

    const volToolGroupId = 'volToolGroup';
    const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(volToolGroupId);
    const mipToolGroupId = 'mipToolGroup';
    const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(mipToolGroupId);
    const t3dToolGroupId = 't3dToolGroup';
    const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(t3dToolGroupId);

    volToolGroup.addViewport(elements.VOL.AXIAL.ID, renderingEngineId);
    volToolGroup.addViewport(elements.VOL.SAGITTAL.ID, renderingEngineId);
    volToolGroup.addViewport(elements.VOL.CORONAL.ID, renderingEngineId);
    mipToolGroup.addViewport(elements.MIP.AXIAL.ID, renderingEngineId);
    mipToolGroup.addViewport(elements.MIP.SAGITTAL.ID, renderingEngineId);
    mipToolGroup.addViewport(elements.MIP.CORONAL.ID, renderingEngineId);
    t3dToolGroup.addViewport(elements.T3D.CORONAL.ID, renderingEngineId);

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

    t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
    t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary,
            },
        ],
    });


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


function getNiftiList() {
    return [
        '/nifti/brain/BraTS-MET-00086-000-t1c.nii.gz',
        '/nifti/brain/BraTS-MET-00086-000-t1n.nii.gz',
        '/nifti/brain/BraTS-MET-00086-000-t2f.nii.gz',
        '/nifti/brain/BraTS-MET-00086-000-t2w.nii.gz',
        '/nifti/brain/BraTS-MET-00086-000-seg.nii.gz',
        '/nifti/brain/BraTS-MET-00086-000-seg_new.nii.gz',
    ];
}

run();