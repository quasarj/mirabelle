import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
//const { createVOISynchronizer } = cornerstoneTools.synchronizers;

// All page elements
let elements = {
    FILE: {
        CURRENT: {
            PATH: '',
            NAME: '',
            INDEX: 0,
        },        
        LIST: [],
        ACTIVE: [],
        VOLUME: {
            ID: null,
            OBJECT: null,
            INPUT: null,
            DIMENSIONS: null,
            SLAB: null,
        },
    },
    PAGE: {
        RENDER: {
            ID: 'nifti_render_engine',
            ENGINE: null,
        },
    },
    VOL: {
        CONTENT: document.getElementById('vol_content'),
        TOOLS: {
            ID: 'vol_tool_group',
            GROUP: null,
            PANEL: document.getElementById('vol_tools'),
            SYNC: "vol_voi_syncronizer"
        },            
        GRID: document.createElement('div'),
        AXIAL: {
            ID: 'vol_axial',
            CONTENT: document.createElement('div'),
        },
        SAGITTAL: {
            ID: 'vol_sagittal',
            CONTENT: document.createElement('div'),
        },
        CORONAL: {
            ID: 'vol_coronal',
            CONTENT: document.createElement('div'),
        },
    },
    MIP: {
        CONTENT: document.getElementById('mip_content'),
        TOOLS: {
            ID: 'mip_tool_group',
            GROUP: null,
            PANEL: document.getElementById('mip_tools'),
            SYNC: "mip_voi_syncronizer"
        },  
        GRID: document.createElement('div'),
        AXIAL: {
            ID: 'mip_axial',
            CONTENT: document.createElement('div'),
        },
        SAGITTAL: {
            ID: 'mip_sagittal',
            CONTENT: document.createElement('div'),
        },
        CORONAL: {
            ID: 'mip_coronal',
            CONTENT: document.createElement('div'),
        },
    },
    T3D: {
        CONTENT: document.getElementById('t3d_content'),
        TOOLS: {
            ID: 't3d_tool_group',
            GROUP: null,
            PANEL: document.getElementById('t3d_tools'),
            SYNC: "t3d_voi_syncronizer"
        }, 
        GRID: document.createElement('div'),
        CORONAL: {
            ID: 't3d_coronal',
            CONTENT: document.createElement('div'),
        },
    },
};

// Adjusts the rendered size when the window size changes
const resizeObserver = new ResizeObserver(() => {
    console.log('Size changed');

    const renderingEngine = cornerstone.getRenderingEngine(elements.PAGE.RENDER.ID);

    if (renderingEngine) {
        renderingEngine.resize(true, false);
    }
});

function setupVolPanel() {

    elements.VOL.CONTENT.appendChild(elements.VOL.GRID);

    elements.VOL.GRID.style.display = 'flex';
    elements.VOL.GRID.style.flexDirection = 'row';
    elements.VOL.GRID.style.width = '100%';
    elements.VOL.GRID.style.height = '100%';

    elements.VOL.AXIAL.CONTENT.style.gridColumnStart = '1';
    elements.VOL.AXIAL.CONTENT.style.gridRowStart = '1';
    elements.VOL.SAGITTAL.CONTENT.style.gridColumnStart = '2';
    elements.VOL.SAGITTAL.CONTENT.style.gridRowStart = '1';
    elements.VOL.CORONAL.CONTENT.style.gridColumnStart = '3';
    elements.VOL.CORONAL.CONTENT.style.gridRowStart = '1';

    elements.VOL.GRID.appendChild(elements.VOL.AXIAL.CONTENT);
    elements.VOL.GRID.appendChild(elements.VOL.SAGITTAL.CONTENT);
    elements.VOL.GRID.appendChild(elements.VOL.CORONAL.CONTENT);

    const elementList = [
        elements.VOL.AXIAL.CONTENT,
        elements.VOL.SAGITTAL.CONTENT,
        elements.VOL.CORONAL.CONTENT,
    ];

    elementList.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.oncontextmenu = (e) => e.preventDefault();

        resizeObserver.observe(element);
    });
}

function setupMipPanel() {

    elements.MIP.CONTENT.appendChild(elements.MIP.GRID);

    elements.MIP.GRID.style.display = 'flex';
    elements.MIP.GRID.style.flexDirection = 'row';
    elements.MIP.GRID.style.width = '100%';
    elements.MIP.GRID.style.height = '100%';

    elements.MIP.AXIAL.CONTENT.style.gridColumnStart = '1';
    elements.MIP.AXIAL.CONTENT.style.gridRowStart = '1';
    elements.MIP.SAGITTAL.CONTENT.style.gridColumnStart = '2';
    elements.MIP.SAGITTAL.CONTENT.style.gridRowStart = '1';
    elements.MIP.CORONAL.CONTENT.style.gridColumnStart = '3';
    elements.MIP.CORONAL.CONTENT.style.gridRowStart = '1';

    elements.MIP.GRID.appendChild(elements.MIP.AXIAL.CONTENT);
    elements.MIP.GRID.appendChild(elements.MIP.SAGITTAL.CONTENT);
    elements.MIP.GRID.appendChild(elements.MIP.CORONAL.CONTENT);

    const elementList = [
        elements.MIP.AXIAL.CONTENT,
        elements.MIP.SAGITTAL.CONTENT,
        elements.MIP.CORONAL.CONTENT,
    ];

    elementList.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.oncontextmenu = (e) => e.preventDefault();

        resizeObserver.observe(element);
    });
}

function setup3dPanel() {

    elements.T3D.CONTENT.appendChild(elements.T3D.GRID);

    elements.T3D.GRID.style.display = 'flex';
    elements.T3D.GRID.style.flexDirection = 'row';
    elements.T3D.GRID.style.width = '100%';
    elements.T3D.GRID.style.height = '100%';
    
    elements.T3D.CORONAL.CONTENT.style.gridColumnStart = '1';
    elements.T3D.CORONAL.CONTENT.style.gridRowStart = '1';

    elements.T3D.GRID.appendChild(elements.T3D.CORONAL.CONTENT);

    elements.T3D.CORONAL.CONTENT.style.width = '100%';
    elements.T3D.CORONAL.CONTENT.style.height = '100%';
    elements.T3D.CORONAL.CONTENT.oncontextmenu = (e) => e.preventDefault();

    resizeObserver.observe(elements.T3D.CORONAL.CONTENT);
}

function setupTools() {
    // Tools setup
    // --------------------------------
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.VolumeRotateMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);
    cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);

    setupVolTools();
    setupMipTools();
    setup3dTools();
}

function setupVolTools() {

    const viewportColors = {
        [elements.VOL.AXIAL.ID]: 'rgb(200, 0, 0)',
        [elements.VOL.SAGITTAL.ID]: 'rgb(200, 200, 0)',
        [elements.VOL.CORONAL.ID]: 'rgb(0, 200, 0)',
    };

    const viewportReferenceLineControllable = [
        elements.VOL.AXIAL.ID,
        elements.VOL.SAGITTAL.ID,
        elements.VOL.CORONAL.ID,
    ];

    const viewportReferenceLineDraggableRotatable = [
        elements.VOL.AXIAL.ID,
        elements.VOL.SAGITTAL.ID,
        elements.VOL.CORONAL.ID,
    ];

    const viewportReferenceLineSlabThicknessControlsOn = [
        elements.VOL.AXIAL.ID,
        elements.VOL.SAGITTAL.ID,
        elements.VOL.CORONAL.ID,
    ];

    function getReferenceLineColor(viewportId) {
        return viewportColors[viewportId];
    }

    function getReferenceLineControllable(viewportId) {
        const index = viewportReferenceLineControllable.indexOf(viewportId);
        return index !== -1;
    }

    function getReferenceLineDraggableRotatable(viewportId) {
        const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
        return index !== -1;
    }

    function getReferenceLineSlabThicknessControlsOn(viewportId) {
        const index =
            viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
        return index !== -1;
    }

    // Tool group setup
    elements.VOL.TOOLS.GROUP = cornerstoneTools.ToolGroupManager.createToolGroup(elements.VOL.TOOLS.ID);
    //const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(elements.VOL.TOOLS.ID);
    elements.VOL.TOOLS.GROUP.addViewport(elements.VOL.AXIAL.ID, elements.PAGE.RENDER.ID);
    elements.VOL.TOOLS.GROUP.addViewport(elements.VOL.SAGITTAL.ID, elements.PAGE.RENDER.ID);
    elements.VOL.TOOLS.GROUP.addViewport(elements.VOL.CORONAL.ID, elements.PAGE.RENDER.ID);

    // Scroll Mouse Wheel
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    elements.VOL.TOOLS.GROUP.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);

    // Segmentation Display
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    elements.VOL.TOOLS.GROUP.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

    // Window Level
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.WindowLevelTool.toolName);
    elements.VOL.TOOLS.GROUP.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
            },
        ],
    });

    // Pan
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.PanTool.toolName);
    elements.VOL.TOOLS.GROUP.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
            },
        ],
    });

    // Zoom
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.ZoomTool.toolName);
    elements.VOL.TOOLS.GROUP.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
            },
        ],
    });

    // Crosshairs
    elements.VOL.TOOLS.GROUP.addTool(cornerstoneTools.CrosshairsTool.toolName, {
        getReferenceLineColor,
        getReferenceLineControllable,
        getReferenceLineDraggableRotatable,
        getReferenceLineSlabThicknessControlsOn,
    });
    elements.VOL.TOOLS.GROUP.setToolPassive(cornerstoneTools.CrosshairsTool.toolName);
    //elements.VOL.TOOLS.GROUP.setToolEnabled(cornerstoneTools.CrosshairsTool.toolName);

    const volVOISyncronizer = cornerstoneTools.synchronizers.createVOISynchronizer(elements.VOL.TOOLS.SYNC);

    [elements.VOL.AXIAL.ID, elements.VOL.SAGITTAL.ID, elements.VOL.CORONAL.ID].forEach((viewport) => {
        volVOISyncronizer.add({ renderingEngineId: elements.PAGE.RENDER.ID, viewportId: viewport });
    });
}

function setupMipTools() {

    // Tool group setup
    elements.MIP.TOOLS.GROUP = cornerstoneTools.ToolGroupManager.createToolGroup(elements.MIP.TOOLS.ID);
    //const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(elements.MIP.TOOLS.ID);
    elements.MIP.TOOLS.GROUP.addViewport(elements.MIP.AXIAL.ID, elements.PAGE.RENDER.ID);
    elements.MIP.TOOLS.GROUP.addViewport(elements.MIP.SAGITTAL.ID, elements.PAGE.RENDER.ID);
    elements.MIP.TOOLS.GROUP.addViewport(elements.MIP.CORONAL.ID, elements.PAGE.RENDER.ID);

    // Scroll Mouse Wheel
    elements.MIP.TOOLS.GROUP.addTool(cornerstoneTools.VolumeRotateMouseWheelTool.toolName);
    elements.MIP.TOOLS.GROUP.setToolActive(cornerstoneTools.VolumeRotateMouseWheelTool.toolName);

    // Segmentation Display
    elements.MIP.TOOLS.GROUP.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    elements.MIP.TOOLS.GROUP.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

    // Window Level
    elements.MIP.TOOLS.GROUP.addTool(cornerstoneTools.WindowLevelTool.toolName);
    elements.MIP.TOOLS.GROUP.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
            },
        ],
    });

    // Pan
    elements.MIP.TOOLS.GROUP.addTool(cornerstoneTools.PanTool.toolName);
    elements.MIP.TOOLS.GROUP.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
            },
        ],
    });

    // Zoom
    elements.MIP.TOOLS.GROUP.addTool(cornerstoneTools.ZoomTool.toolName);
    elements.MIP.TOOLS.GROUP.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
            },
        ],
    });

    const mipVOISyncronizer = cornerstoneTools.synchronizers.createVOISynchronizer(elements.MIP.TOOLS.SYNC);

    [elements.MIP.AXIAL.ID, elements.MIP.SAGITTAL.ID, elements.MIP.CORONAL.ID].forEach((viewport) => {
        mipVOISyncronizer.add({ renderingEngineId: elements.PAGE.RENDER.ID, viewportId: viewport });
    });
}

function setup3dTools() {

    // Tool group setup
    elements.T3D.TOOLS.GROUP = cornerstoneTools.ToolGroupManager.createToolGroup(elements.T3D.TOOLS.ID);
    //const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(elements.T3D.TOOLS.ID);    
    elements.T3D.TOOLS.GROUP.addViewport(elements.T3D.CORONAL.ID, elements.PAGE.RENDER.ID);

    // Trackball Rotate
    elements.T3D.TOOLS.GROUP.addTool(cornerstoneTools.TrackballRotateTool.toolName);
    elements.T3D.TOOLS.GROUP.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
            },
        ],
    });

    // Segmentation Display
    elements.T3D.TOOLS.GROUP.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    elements.T3D.TOOLS.GROUP.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

    // Pan
    elements.T3D.TOOLS.GROUP.addTool(cornerstoneTools.PanTool.toolName);
    elements.T3D.TOOLS.GROUP.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
            },
        ],
    });

    // Zoom
    elements.T3D.TOOLS.GROUP.addTool(cornerstoneTools.ZoomTool.toolName);
    elements.T3D.TOOLS.GROUP.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
            },
        ],
    });
}


// ============================= //

function setupFilePanel() {

    const filePanel = document.getElementById('file_content');
    filePanel.innerHTML = '';
    elements.FILE.LIST.forEach((file, index) => {
        const listItem = document.createElement('li');

        const fileNameDiv = document.createElement('div');
        const fileParts = file.split(/[/\\]/)
        fileNameDiv.textContent = fileParts.pop();

        if (file === elements.FILE.CURRENT.PATH) {
            listItem.style.backgroundColor = 'MediumAquaMarine';
            elements.FILE.CURRENT.INDEX = index
        }
        else {
            listItem.onclick = () => {
                toggleFileOverlays(index);
            };
        }

        listItem.appendChild(fileNameDiv);
        filePanel.appendChild(listItem);
    });
}

async function toggleFileOverlays(selectedIndex) {

    console.log("==============");
    console.log(elements.FILE.ACTIVE);
    console.log(selectedIndex);

    const filePanel = document.getElementById('file_content');
    const selectedItem = filePanel.children[selectedIndex];

    let success = false;

    if (elements.FILE.ACTIVE[selectedIndex]) {
        let success = removeOverlay(selectedIndex);
        if (success) {
            selectedItem.style.backgroundColor = '';
            elements.FILE.ACTIVE[selectedIndex] = false
        }
    }
    else {
        let success = addOverlay(selectedIndex);

        if (success) {
            selectedItem.style.backgroundColor = 'lightsalmon';
            elements.FILE.ACTIVE[selectedIndex] = true

            console.log(elements.FILE.ACTIVE);

            Array.from(filePanel.children).forEach((child, index) => {
                if (index !== selectedIndex && index !== elements.FILE.CURRENT.INDEX) {
                    if (elements.FILE.ACTIVE[index]) {
                        removeOverlay(index);
                        child.style.backgroundColor = '';
                        elements.FILE.ACTIVE[index] = false
                    }
                }
            });
        }
    }

    console.log(elements.FILE.ACTIVE);
    console.log("==============");

    const renderingEngine = cornerstone.getRenderingEngine(elements.PAGE.RENDER.ID);
    renderingEngine.render();
}

async function addOverlay(selectedIndex) {

    try {

        const segmentationId = 'nifti:' + elements.FILE.LIST[selectedIndex];

        if (elements.FILE.ACTIVE[selectedIndex] === null) {
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
        }

        const toolGroupConfiguration = {
            renderInactiveSegmentations: false,
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
        cornerstoneTools.segmentation.config.setToolGroupSpecificConfig(elements.VOL.TOOLS.ID, toolGroupConfiguration)

        await cornerstoneTools.segmentation.addSegmentationRepresentations(elements.VOL.TOOLS.ID, [
            {
                segmentationId,
                type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
            },
        ]);
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

async function removeOverlay(selectedIndex) {

    try {
        const segmentationId = 'nifti:' + elements.FILE.LIST[selectedIndex];
        await cornerstoneTools.segmentation.removeSegmentationsFromToolGroup(elements.VOL.TOOLS.ID)        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// ============================= //


function getFileInfo() {

    elements.FILE.CURRENT.PATH = getNiftiVolume();
    const fileParts = elements.FILE.CURRENT.PATH.split(/[/\\]/)
    elements.FILE.CURRENT.NAME = fileParts.pop();
    
    elements.FILE.LIST = getNiftiList();

    elements.FILE.ACTIVE = elements.FILE.LIST.map(() => null);
}

async function run() {
    await cornerstone.init();
    await cornerstoneTools.init();

    getFileInfo();

    setupFilePanel();

    //let volumeId = 'nifti:' + elements.FILE.CURRENT.PATH;
    elements.FILE.VOLUME.ID = 'nifti:' + elements.FILE.CURRENT.PATH;

    cornerstone.volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

    elements.FILE.VOLUME.OBJECT = await cornerstone.volumeLoader.createAndCacheVolume(elements.FILE.VOLUME.ID, {
        type: 'image',
    });

    elements.PAGE.RENDER.ENGINE = new cornerstone.RenderingEngine(elements.PAGE.RENDER.ID);

    setupVolPanel();
    setupMipPanel();
    setup3dPanel();

    elements.FILE.VOLUME.INPUT = [
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

    elements.PAGE.RENDER.ENGINE.setViewports(elements.FILE.VOLUME.INPUT);

    elements.FILE.VOLUME.OBJECT.load();

    // Add volumes to volume viewports
    await cornerstone.setVolumesForViewports(
        elements.PAGE.RENDER.ENGINE,
        [
            {
                volumeId: elements.FILE.VOLUME.ID,
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

    elements.FILE.VOLUME.DIMENSIONS = elements.FILE.VOLUME.OBJECT.dimensions;

    elements.FILE.VOLUME.SLAB = Math.sqrt(
        elements.FILE.VOLUME.DIMENSIONS[0] * elements.FILE.VOLUME.DIMENSIONS[0] +
        elements.FILE.VOLUME.DIMENSIONS[1] * elements.FILE.VOLUME.DIMENSIONS[1] +
        elements.FILE.VOLUME.DIMENSIONS[2] * elements.FILE.VOLUME.DIMENSIONS[2]
    );

    // Add volumes to MIP viewports
    await cornerstone.setVolumesForViewports(
        elements.PAGE.RENDER.ENGINE,
        [
            //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
            {
                volumeId: elements.FILE.VOLUME.ID,
                blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
                slabThickness: elements.FILE.VOLUME.SLAB,
            },
        ],
        [elements.MIP.AXIAL.ID, elements.MIP.SAGITTAL.ID, elements.MIP.CORONAL.ID]
    );

    // Add volumes to 3D viewports
    const viewport = elements.PAGE.RENDER.ENGINE.getViewport(elements.T3D.CORONAL.ID);
    await cornerstone.setVolumesForViewports(
        elements.PAGE.RENDER.ENGINE,
        [
            //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
            {
                volumeId: elements.FILE.VOLUME.ID
            },
        ],
        [elements.T3D.CORONAL.ID]
    ).then(() => {
        viewport.setProperties({
            //preset: 'CT-Bone',
            preset: 'MR-T2-Brain',
        });
        //viewport.render();
    });
    
    setupTools();

    //const seg_path = getNiftiSeg()
    //addOverlay(seg_path);
        
    elements.PAGE.RENDER.ENGINE.render();
}

run();

function getNiftiVolume() {
    return '/nifti/brain/BraTS-MET-00086-000-t1n.nii.gz';
}

function getNiftiSeg() {
    //return '/nifti/brain/BraTS-MET-00086-000-seg.nii.gz';
    return '/nifti/brain/BraTS-MET-00086-000-seg_new.nii.gz';
}


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

