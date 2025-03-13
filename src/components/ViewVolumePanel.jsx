// React
import React, { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react';

// Components
import MiddleBottomPanel from './MiddleBottomPanel.jsx';

// Context
import { Context } from './Context.js';

// Cornerstone
import * as cornerstone from '@cornerstonejs/core';
import { imageLoader } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
// import { cornerstoneStreamingDynamicImageVolumeLoader } from '@cornerstonejs/streaming-image-volume-loader';
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import { init as csRenderInit } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";


import dicomParser from 'dicom-parser';
import { cornerstoneNiftiImageLoader, createNiftiImageIdsAndCacheMetadata } from '@cornerstonejs/nifti-volume-loader';

// Utilities
import { expandSegTo3D } from '../utilities';
import { setParameters, loaded, flagAsAccepted, flagAsRejected, flagAsSkipped, flagAsNonmaskable, finalCalc } from '../masking';
import { getNiftiDetails, setNiftiStatus, getDicomDetails, setDicomStatus, setMaskingFlag } from '../visualreview';
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { viewport } from '@cornerstonejs/tools/utilities';

//Segmentation V2
let segId = 'seg_id';

const {
    segmentation,
    RectangleScissorsTool,
    Enums: csToolsEnums,
} = cornerstoneTools;

function getOrCreateToolgroup(toolgroup_name) {
    let group = cornerstoneTools.ToolGroupManager.getToolGroup(toolgroup_name);
    if (group === undefined) {
        group = cornerstoneTools.ToolGroupManager.createToolGroup(toolgroup_name);
    }

    // Segmentation V2
    cornerstoneTools.segmentation.addSegmentationRepresentations(
        group,
        [
            {
                segmentationId: segId,
                type: csToolsEnums.SegmentationRepresentations.Labelmap,
            },
        ]
    );

    return group;
}

function ViewVolumePanel({ details, volumeName, files, iec }) {

    const context = useContext(Context);

    const [loading, setLoading] = useState(true);
    const [filesLoaded, setFilesLoaded] = useState(false);
    const [firstPass, setFirstPass] = useState(true);
    const [volSlabGlobal, setVolSlabGlobal] = useState(0);

    // set a state variable that will save each viewport's normal/expanded/minimized state
    const [expandedViewports, setExpandedViewports] = useState([
        { id: 'axial', state: 'normal' },
        { id: 'sagittal', state: 'normal' },
        { id: 'coronal', state: 'normal' },
        { id: 't3d_coronal', state: 'normal' },
    ]);

    const renderingEngineId = 'viewer_render_engine';
    const renderingEngineRef = useRef(null);
    const containerRef = useRef(null);


    let coords;
    let volumeId;
    let niftiURL;

    if (context.nifti) {
        // niftiURL = 'https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/CTACardio.nii.gz';
        // niftiURL = `nifti:/papi/v1/files/${files[0]}/data`;
        let windowLocation = new URL(window.location);

        if (details.is_zipped) {
            niftiURL = `${windowLocation.origin}/papi/v1/files/${files[0]}/data.gz`;
        } else {
            niftiURL = `${windowLocation.origin}/papi/v1/files/${files[0]}/data`;
        }



        // niftiURL = `http://144.30.108.205:8080/data.gz`;
        // check if a file is compressed or not
        const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
        volumeId = `${volumeLoaderScheme}:${niftiURL}`;
    } else {
        volumeId = 'cornerstoneStreamingImageVolume: newVolume' + volumeName;
    }

    useLayoutEffect(() => {
        let volume = null;
        cornerstone.cache.purgeCache();

        const { volumeLoader } = cornerstone;

        const resizeObserver = new ResizeObserver(() => {
            const renderingEngine = cornerstone.getRenderingEngine('viewer_render_engine');
            if (renderingEngine) {
                renderingEngine.resize(true, true);
            }
        });

        function setupVolumePanel(panelId) {
            const panelWrapper = document.createElement('div');
            const resizeButton = document.createElement('button');
            const panel = document.createElement('div');

            // set panelWrapper styles
            panelWrapper.id = panelId + '_wrapper';
            panelWrapper.style.display = 'block';
            panelWrapper.style.width = '100%';
            panelWrapper.style.height = '100%';
            panelWrapper.style.position = 'relative';
            panelWrapper.style.borderRadius = '8px';
            panelWrapper.style.overflow = 'hidden';
            panelWrapper.style.backgroundColor = 'black';
            panelWrapper.style.visibility = 'hidden';

            // remove default button styling
            resizeButton.style.border = 'none';
            resizeButton.style.outline = 'none';
            resizeButton.style.cursor = 'pointer';
            resizeButton.style.backgroundColor = 'transparent';
            resizeButton.style.padding = '8px';

            // set resizeButton backgorund image to the resizeButtonLogo
            resizeButton.id = panelId + '_resize_button';
            //resizeButton.innerHTML = '<span class="material-symbols-rounded" style="color: white">open_in_full</span>';
            resizeButton.style.backgroundColor = '#424242';
            resizeButton.style.color = 'white';
            resizeButton.classList.add('material-symbols-rounded');
            resizeButton.textContent = 'open_in_full';
            // resizeButton.style.backgroundImage = `url(${resizeButtonLogo})`;
            // resizeButton.style.backgroundSize = 'contain';
            // resizeButton.style.backgroundRepeat = 'no-repeat';
            // resizeButton.style.backgroundPosition = 'center';
            // resizeButton.style.padding = '8px 8px';
            // resizeButton.style.paddingBottom = '3px';
            ///resizeButton.style.width = '30px';
            //resizeButton.style.height = '30px';
            resizeButton.style.position = 'absolute';
            resizeButton.style.top = '10px';
            resizeButton.style.left = '10px';
            resizeButton.style.zIndex = '1000';
            resizeButton.style.display = 'none';

            resizeButton.onmouseover = () => {
                resizeButton.style.backgroundColor = 'rgb(59 130 246)';
            };
            resizeButton.onmouseleave = () => {
                resizeButton.style.backgroundColor = '#424242';
            };

            // set button to show when mouse is over panelWrapper
            panelWrapper.onmouseover = () => {
                resizeButton.style.display = 'block';
            };
            panelWrapper.onmouseout = () => { resizeButton.style.display = 'none'; };

            // on resizeButton click, set the panelWrapper to be full viewport size
            resizeButton.onclick = (event) => {
                // panelWrapper.style.width = '100vw';
                // panelWrapper.style.height = '100vh';
                // panelWrapper.style.position = 'fixed';
                // panelWrapper.style.top = '0';
                // panelWrapper.style.left = '0';
                // panelWrapper.style.zIndex = '1000';
                // resizeButton.style.display = 'none';

                // Haydex: I can improve this code by using a state variable to keep track of the expanded viewport

                // Minimization
                if (event.currentTarget.parentNode.classList.contains('Expanded')) {
                    event.currentTarget.textContent = 'open_in_full';
                    event.currentTarget.title = 'Maximize';
                    event.currentTarget.parentNode.classList.remove('Expanded');
                    event.currentTarget.parentNode.style.gridColumn = 'span 1';
                    event.currentTarget.parentNode.style.gridRow = 'span 1';
                    // set the gridArea of the panelWrapper to the saved gridArea
                    event.currentTarget.parentNode.style.gridArea = event.currentTarget.parentNode.getAttribute('data-gridArea');


                    // Show all other minimized panelWrappers
                    const allPanelWrappers = event.currentTarget.parentNode.parentNode.childNodes;
                    allPanelWrappers.forEach((panelWrapper) => {
                        if (panelWrapper.classList.contains('Minimized')) {
                            panelWrapper.querySelector('button').title = 'Maximize';
                            panelWrapper.style.position = 'relative';
                            panelWrapper.style.width = '100%';
                            panelWrapper.style.height = '100%';
                            panelWrapper.style.visibility = 'visible';
                            // panelWrapper.style.display = 'block';
                            panelWrapper.classList.remove('Minimized');
                        }
                    });
                    // render all viewports
                    renderingEngineRef.current.getViewports().forEach((viewport) => {
                        viewport.render();
                    });
                    // console.log('Minimized', event.currentTarget.parentNode.id);

                } else { // Maximization
                    // console.log (event.currentTarget.parentNode.id);
                    // Get the gridArea of the panelWrapper
                    const gridArea = event.currentTarget.parentNode.style.gridArea;
                    // save the gridArea into the panelWrapper
                    event.currentTarget.parentNode.setAttribute('data-gridArea', gridArea);
                    event.currentTarget.parentNode.style.gridColumn = 'span 2';
                    event.currentTarget.parentNode.style.gridRow = 'span 2';
                    event.currentTarget.parentNode.classList.add('Expanded');
                    expandedViewports.id = event.currentTarget.parentNode.id;
                    event.currentTarget.textContent = 'close_fullscreen';
                    event.currentTarget.title = 'Minimize';

                    // hide all other visible panelWrappers
                    const allPanelWrappers = event.currentTarget.parentNode.parentNode.childNodes;
                    allPanelWrappers.forEach((panelWrapper) => {
                        if (panelWrapper.id !== event.currentTarget.parentNode.id && panelWrapper.style.visibility === 'visible') {
                            panelWrapper.querySelector('button').title = 'Minimize';

                            // Haydex: Trick to hide the panelWarpper without breaking the WebGL rendering engine, set the width and height to 1px and position to absolute
                            panelWrapper.style.visibility = 'hidden';
                            panelWrapper.style.position = 'absolute';
                            panelWrapper.style.width = '1px';
                            panelWrapper.style.height = '1px';
                            // panelWrapper.style.display = 'none'; // Haydex: don't use display:none as it will break the WebGL rendering engine
                            panelWrapper.classList.add('Minimized');
                        }
                    });
                    // render all viewports
                    renderingEngineRef.current.getViewports().forEach((viewport) => {
                        viewport.render();
                    });
                    // console.log('Expanded', event.currentTarget.parentNode.id);
                }
            };

            panel.id = panelId;
            panel.style.display = 'block';
            panel.style.width = '100%';
            panel.style.height = '100%';
            panel.style.borderRadius = '8px';
            panel.style.overflow = 'hidden';
            panel.style.backgroundColor = 'black';
            panel.oncontextmenu = e => e.preventDefault();
            resizeObserver.observe(panel);

            // add resizebutton and panel to panelWrapper
            panelWrapper.appendChild(panel);
            panelWrapper.appendChild(resizeButton);

            return panelWrapper;
        }

        function setup3dViewportTools() {
            // Add tools if needed
            try {
                cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);
            } catch (error) { }

            // Tool Group Setup
            const t3dToolGroup = getOrCreateToolgroup('t3d_tool_group');
            t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

            // Trackball Rotate
            t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);

            // delay the activation for 500 milliseconds
            // setTimeout(() => {

            //     t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
            //         bindings: [
            //             {
            //                 mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
            //             },
            //         ],
            //     });

            // }, 1000);

            t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
            t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);

            if (context.rightClickToolGroupValue === 'pan') {
                // Pan
                // cornerstoneTools.addTool(cornerstoneTools.PanTool);
                t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                    bindings: [
                        {
                            mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
                        },
                    ],
                });
            } else {
                // Zoom
                // cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
                t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                    bindings: [
                        {
                            mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
                        },
                    ],
                });
            }

            // Pan
            t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                bindings: [
                    {
                        mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
                    },
                ],
            });

            // Segmentation Display
            // cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
            // t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
            // t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
        }

        function setupVolViewportTools() {

            const viewportColors = {
                ['vol_axial']: 'rgb(200, 0, 0)',
                ['vol_sagittal']: 'rgb(200, 200, 0)',
                ['vol_coronal']: 'rgb(0, 200, 0)',
            };

            const viewportReferenceLineControllable = [
                'vol_axial',
                'vol_sagittal',
                'vol_coronal',
            ];

            const viewportReferenceLineDraggableRotatable = [
                'vol_axial',
                'vol_sagittal',
                'vol_coronal',
            ];

            const viewportReferenceLineSlabThicknessControlsOn = [
                'vol_axial',
                'vol_sagittal',
                'vol_coronal',
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

            try {
                cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);
                // cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
                cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
                cornerstoneTools.addTool(cornerstoneTools.PanTool);
                cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
                cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);
                cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
            } catch (error) {
                // console.log("errors while loading tools:", error);
            }

            // Create group and add viewports
            // TODO: should the render engine be coming from a var instead?
            const group = getOrCreateToolgroup('vol_tool_group');
            group.addViewport('vol_axial', 'viewer_render_engine');
            group.addViewport('vol_sagittal', 'viewer_render_engine');
            group.addViewport('vol_coronal', 'viewer_render_engine');

            // Stack Scroll Tool
            group.addTool(cornerstoneTools.StackScrollTool.toolName);
            group.setToolActive(cornerstoneTools.StackScrollTool.toolName, {
                bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Wheel }],
            });

            // group.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
            // group.setToolActive(cornerstoneTools.SegmentationDisplayTool.toolName);
            // group.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

            group.addTool(cornerstoneTools.RectangleScissorsTool.toolName);

            if (context.leftClickToolGroupValue === 'selection') {
                group.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                    ]
                });
            }

            group.addTool(cornerstoneTools.PanTool.toolName);
            group.addTool(cornerstoneTools.ZoomTool.toolName);

            if (context.rightClickToolGroupValue === 'pan') {
                group.setToolActive(cornerstoneTools.PanTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
                    ],
                });
            } else {
                group.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
                    ],
                });
            }

            // Pan
            group.setToolActive(cornerstoneTools.PanTool.toolName, {
                bindings: [
                    {
                        mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
                    },
                ],
            });

            // Window Level
            group.addTool(cornerstoneTools.WindowLevelTool.toolName);

            if (context.leftClickToolGroupValue === 'windowlevel') {
                group.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                    bindings: [
                        {
                            mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
                        },
                    ],
                });
            }

            group.addTool(cornerstoneTools.CrosshairsTool.toolName, {
                getReferenceLineColor,
                getReferenceLineControllable,
                getReferenceLineDraggableRotatable,
                getReferenceLineSlabThicknessControlsOn,
            });

            if (context.leftClickToolGroupValue === 'crosshairs') {
                group.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                    ],
                });
            }

            const volVOISyncronizer = cornerstoneTools.synchronizers.createVOISynchronizer("vol_voi_syncronizer");

            ['vol_axial', 'vol_sagittal', 'vol_coronal'].forEach((viewport) => {
                volVOISyncronizer.add({ renderingEngineId: 'viewer_render_engine', viewportId: viewport });
            });

        }

        function setupMipViewportTools() {

            const viewportColors = {
                ['mip_axial']: 'rgb(200, 0, 0)',
                ['mip_sagittal']: 'rgb(200, 200, 0)',
                ['mip_coronal']: 'rgb(0, 200, 0)',
            };

            const viewportReferenceLineControllable = [
                'mip_axial',
                'mip_sagittal',
                'mip_coronal',
            ];

            const viewportReferenceLineDraggableRotatable = [
                'mip_axial',
                'mip_sagittal',
                'mip_coronal',
            ];

            const viewportReferenceLineSlabThicknessControlsOn = [
                'mip_axial',
                'mip_sagittal',
                'mip_coronal',
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

            try {
                cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);
                // cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
                cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
                cornerstoneTools.addTool(cornerstoneTools.PanTool);
                cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
                cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);
                cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
            } catch (error) {
                // console.log("errors while loading tools:", error);
            }

            // Create group and add viewports
            // TODO: should the render engine be coming from a var instead?
            const group = getOrCreateToolgroup('mip_tool_group');
            group.addViewport('mip_axial', 'viewer_render_engine');
            group.addViewport('mip_sagittal', 'viewer_render_engine');
            group.addViewport('mip_coronal', 'viewer_render_engine');

            // Stack Scroll Tool
            group.addTool(cornerstoneTools.StackScrollTool.toolName);
            group.setToolActive(cornerstoneTools.StackScrollTool.toolName, {
                bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Wheel }],
            });

            // group.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
            // group.setToolActive(cornerstoneTools.SegmentationDisplayTool.toolName);
            // group.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

            group.addTool(cornerstoneTools.RectangleScissorsTool.toolName);

            if (context.leftClickToolGroupValue === 'selection') {
                group.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                    ]
                });
            }

            group.addTool(cornerstoneTools.PanTool.toolName);
            group.addTool(cornerstoneTools.ZoomTool.toolName);

            if (context.rightClickToolGroupValue === 'pan') {
                group.setToolActive(cornerstoneTools.PanTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
                    ],
                });
            } else {
                group.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
                    ],
                });
            }

            // Pan
            group.setToolActive(cornerstoneTools.PanTool.toolName, {
                bindings: [
                    {
                        mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
                    },
                ],
            });

            // Window Level
            group.addTool(cornerstoneTools.WindowLevelTool.toolName);

            if (context.leftClickToolGroupValue === 'windowlevel') {
                group.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                    bindings: [
                        {
                            mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
                        },
                    ],
                });
            }

            group.addTool(cornerstoneTools.CrosshairsTool.toolName, {
                getReferenceLineColor,
                getReferenceLineControllable,
                getReferenceLineDraggableRotatable,
                getReferenceLineSlabThicknessControlsOn,
            });

            if (context.leftClickToolGroupValue === 'crosshairs') {
                group.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                    bindings: [
                        { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                    ],
                });
            }

            const mipVOISyncronizer = cornerstoneTools.synchronizers.createVOISynchronizer("mip_voi_syncronizer");

            ['mip_axial', 'mip_sagittal', 'mip_coronal'].forEach((viewport) => {
                mipVOISyncronizer.add({ renderingEngineId: 'viewer_render_engine', viewportId: viewport });
            });

        }

        async function run() {

            if (!loaded.loaded) {
                // new 2.0 init routines
                await csRenderInit()
                await csToolsInit()
                dicomImageLoaderInit({ maxWebWorkers: 1 });
                loaded.loaded = true;
            }

            const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');
            renderingEngineRef.current = renderingEngine;

            const container = containerRef.current;
            container.innerHTML = ''; // Clear previous content

            const viewportInput = [];

            container.style.display = 'grid';
            if (context.viewToolGroupValue === 'all') {
                container.style.gridTemplateColumns = 'repeat(3, 1fr)';
                container.style.gridTemplateRows = 'repeat(3, 1fr)';
            } else {
                container.style.gridTemplateColumns = 'repeat(2, 1fr)';
                container.style.gridTemplateRows = 'repeat(2, 1fr)';
            }

            container.style.gridGap = '6px';
            container.style.width = '100%';
            container.style.height = '100%';

            const volAxialContent = setupVolumePanel('vol_axial');
            const volSagittalContent = setupVolumePanel('vol_sagittal');
            const volCoronalContent = setupVolumePanel('vol_coronal');
            const mipAxialContent = setupVolumePanel('mip_axial');
            const mipSagittalContent = setupVolumePanel('mip_sagittal');
            const mipCoronalContent = setupVolumePanel('mip_coronal');
            const t3dCoronalContent = setupVolumePanel('t3d_coronal');

            container.appendChild(volAxialContent);
            container.appendChild(volSagittalContent);
            container.appendChild(volCoronalContent);
            container.appendChild(mipAxialContent);
            container.appendChild(mipSagittalContent);
            container.appendChild(mipCoronalContent);
            container.appendChild(t3dCoronalContent);

            viewportInput.push(
                {
                    viewportId: 'vol_axial',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volAxialContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                    },
                },
                {
                    viewportId: 'vol_sagittal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volSagittalContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                    },
                },
                {
                    viewportId: 'vol_coronal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: volCoronalContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
                {
                    viewportId: 'mip_axial',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipAxialContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.AXIAL,
                    },
                },
                {
                    viewportId: 'mip_sagittal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipSagittalContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
                    },
                },
                {
                    viewportId: 'mip_coronal',
                    type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
                    element: mipCoronalContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
                {
                    viewportId: 't3d_coronal',
                    type: cornerstone.Enums.ViewportType.VOLUME_3D,
                    element: t3dCoronalContent.childNodes[0],
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                }
            );

            renderingEngine.setViewports(viewportInput);

            setupVolViewportTools();
            setupMipViewportTools();
            setup3dViewportTools();

            setLoading(false);
        }

        run();

        return () => {
            cornerstone.cache.purgeCache();
            resizeObserver.disconnect();
        };
    }, [context.layout]);


    // ----------------------------------------------------
    // Set the viewports based on the viewToolGroupValue
    useEffect(() => {
        // check if files are loaded before setting viewports
        if (!filesLoaded) {
            return;
        }


        // Now that the volumes are loaded, on the first pass only:
        if (firstPass) {

            // activate the TrackballRotateTool.
            const t3dToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('t3d_tool_group');
            t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
                bindings: [
                    { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }
                ],
            });

            // Restore all viewport cameras to their default settings.
            const viewports = renderingEngineRef.current.getViewports();
            viewports.forEach((viewport) => {
                viewport.resetCamera(true, true, true, true);
            });

            console.log('Volumes loaded.');

            setFirstPass(false);
        }



        // console.log("viewports loaded");

        const container = containerRef.current;

        const volAxialContent = document.getElementById('vol_axial_wrapper');
        const volSagittalContent = document.getElementById('vol_sagittal_wrapper');
        const volCoronalContent = document.getElementById('vol_coronal_wrapper');
        const mipAxialContent = document.getElementById('mip_axial_wrapper');
        const mipSagittalContent = document.getElementById('mip_sagittal_wrapper');
        const mipCoronalContent = document.getElementById('mip_coronal_wrapper');
        const t3dCoronalContent = document.getElementById('t3d_coronal_wrapper');

        if (context.viewToolGroupValue === 'volume') {

            // Haydex: I can improve this code by using a state variable to keep track of the expanded viewport
            console.log('Drawing volume viewports...');
            // remove all viewports Minimized and Expanded classes
            const allPanelWrappers = container.childNodes;
            allPanelWrappers.forEach((panelWrapper) => {
                panelWrapper.classList.remove('Minimized');
                panelWrapper.classList.remove('Expanded');
                panelWrapper.querySelector('button').textContent = 'open_in_full';
                panelWrapper.querySelector('button').title = 'Maximize';
            });

            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            container.style.gridTemplateRows = 'repeat(2, 1fr)';

            // set volume viewport panels to be visible
            // Haydex: I can improve repetition with classes and looping through the viewports

            volAxialContent.style.visibility = 'visible';
            volAxialContent.style.position = 'relative';
            volAxialContent.style.width = '100%';
            volAxialContent.style.height = '100%';
            volSagittalContent.style.visibility = 'visible';
            volSagittalContent.style.position = 'relative';
            volSagittalContent.style.width = '100%';
            volSagittalContent.style.height = '100%';
            volCoronalContent.style.visibility = 'visible';
            volCoronalContent.style.position = 'relative';
            volCoronalContent.style.width = '100%';
            volCoronalContent.style.height = '100%';

            // Haydex: Trick to hide the viewports without breaking the WebGL rendering engine, set the width and height to 1px and position to absolute
            mipAxialContent.style.visibility = 'hidden';
            mipAxialContent.style.position = 'absolute';
            mipAxialContent.style.width = '1px';
            mipAxialContent.style.height = '1px';
            mipSagittalContent.style.visibility = 'hidden';
            mipSagittalContent.style.position = 'absolute';
            mipSagittalContent.style.width = '1px';
            mipSagittalContent.style.height = '1px';
            mipCoronalContent.style.visibility = 'hidden';
            mipCoronalContent.style.position = 'absolute';
            mipCoronalContent.style.width = '1px';
            mipCoronalContent.style.height = '1px';

            // mipAxialContent.style.display = 'none';
            // mipSagittalContent.style.display = 'none';
            // mipCoronalContent.style.display = 'none';

            t3dCoronalContent.style.visibility = 'visible';
            t3dCoronalContent.style.position = 'relative';
            t3dCoronalContent.style.width = '100%';
            t3dCoronalContent.style.height = '100%';

            // move t3dCoronalContent to the top right cell of the grid
            t3dCoronalContent.style.gridColumn = 2;
            t3dCoronalContent.style.gridRow = 1;

            // move volCoronalContent to the bottom left cell of the grid
            volCoronalContent.style.gridColumn = 1;
            volCoronalContent.style.gridRow = 2;

            volSagittalContent.style.gridColumn = 2;
            volSagittalContent.style.gridRow = 2;

            volAxialContent.style.gridColumn = 1;
            volAxialContent.style.gridRow = 1;

            // t3dCoronalContent.style.gridColumn = 'span 3';
        } else if (context.viewToolGroupValue === 'projection') {

            // We can improve this code by using a state variable to keep track of the expanded viewport

            // remove all viewports Minimized and Expanded classes
            const allPanelWrappers = container.childNodes;
            allPanelWrappers.forEach((panelWrapper) => {
                panelWrapper.classList.remove('Minimized');
                panelWrapper.classList.remove('Expanded');
            });

            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            container.style.gridTemplateRows = 'repeat(2, 1fr)';

            // set projection viewport panels to be visible
            // volAxialContent.style.visibility = 'hidden';
            // volSagittalContent.style.visibility = 'hidden';
            // volCoronalContent.style.visibility = 'hidden';

            // WebGL rendering engine trick to hide the viewports without breaking the rendering engine
            volAxialContent.style.visibility = 'hidden';
            volAxialContent.style.position = 'absolute';
            volAxialContent.style.width = '1px';
            volAxialContent.style.height = '1px';
            volSagittalContent.style.visibility = 'hidden';
            volSagittalContent.style.position = 'absolute';
            volSagittalContent.style.width = '1px';
            volSagittalContent.style.height = '1px';
            volCoronalContent.style.visibility = 'hidden';
            volCoronalContent.style.position = 'absolute';
            volCoronalContent.style.width = '1px';
            volCoronalContent.style.height = '1px';


            // volAxialContent.style.display = 'none';
            // volSagittalContent.style.display = 'none';
            // volCoronalContent.style.display = 'none';

            mipAxialContent.style.visibility = 'visible';
            mipAxialContent.style.position = 'relative';
            mipAxialContent.style.width = '100%';
            mipAxialContent.style.height = '100%';
            mipSagittalContent.style.visibility = 'visible';
            mipSagittalContent.style.position = 'relative';
            mipSagittalContent.style.width = '100%';
            mipSagittalContent.style.height = '100%';
            mipCoronalContent.style.visibility = 'visible';
            mipCoronalContent.style.position = 'relative';
            mipCoronalContent.style.width = '100%';
            mipCoronalContent.style.height = '100%';

            // mipAxialContent.style.visibility = 'visible';
            // mipSagittalContent.style.visibility = 'visible';
            // mipCoronalContent.style.visibility = 'visible';
            // mipAxialContent.style.display = 'block';
            // mipSagittalContent.style.display = 'block';
            // mipCoronalContent.style.display = 'block';

            t3dCoronalContent.style.visibility = 'visible';
            t3dCoronalContent.style.position = 'relative';
            t3dCoronalContent.style.width = '100%';
            t3dCoronalContent.style.height = '100%';

            // move t3dCoronalContent to the top right cell of the grid
            t3dCoronalContent.style.gridColumn = 2;
            t3dCoronalContent.style.gridRow = 1;

            // move mipCoronalContent to the bottom left cell of the grid
            mipCoronalContent.style.gridColumn = 1;
            mipCoronalContent.style.gridRow = 2;

            mipSagittalContent.style.gridColumn = 2;
            mipSagittalContent.style.gridRow = 2;

            mipAxialContent.style.gridColumn = 1;
            mipAxialContent.style.gridRow = 1;

            // t3dCoronalContent.style.gridColumn = 'span 3';
        }
    }, [context.viewToolGroupValue, filesLoaded]);

    // ----------------------------------------------------
    // Load the actual volume into the display here
    useEffect(() => {

        cornerstone.cache.purgeCache();

        // do nothing if Cornerstone is still loading
        if (loading) {
            return;
        }

        // TODO: not sure if this is helpful here
        cornerstone.cache.purgeCache();
        cornerstone.cache.purgeVolumeCache();

        let volume = null;
        let stack = files;
        const renderingEngine = renderingEngineRef.current;

        async function getFileData() {

            if (context.nifti) {

                console.log("Proceeding in Nifti context!");

                imageLoader.registerImageLoader('nifti', cornerstoneNiftiImageLoader);
                const imageIds = await createNiftiImageIdsAndCacheMetadata({ url: niftiURL });
                // console.log(imageIds);

                volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
                    imageIds,
                });


            } else {
                // volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: files });

                console.log("Proceeding in DICOM context, loading via WADO-RS");
                const imageIds = await createImageIdsAndCacheMetaData({
                    StudyInstanceUID:
                        `iec:${iec}`,
                    SeriesInstanceUID:
                        "any",
                    wadoRsRoot: "/papi/v1/wadors",
                })
                volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds });
            }
        }

        async function doit() {

            window.cornerstone = cornerstone;
            window.cornerstoneTools = cornerstoneTools;
            await getFileData();

            if (context.viewport_layout == 'stack') {

                const viewport = renderingEngine.getViewport('dicom_stack');
                //console.log(stack)
                //console.log(renderingEngine)
                await viewport.setStack(stack);

                //viewport.render();

                const currentImageId = viewport.getCurrentImageId();

                // Create a derived segmentation image for the current image
                // const { imageId: newSegImageId } = await cornerstone.imageLoader.createAndCacheDerivedSegmentationImage(currentImageId);

                // Add the segmentation to the segmentation state
                // cornerstoneTools.segmentation.addSegmentations([
                //     {
                //         segmentationId: segId,
                //         representation: {
                //             type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                //             data: {
                //                 imageIdReferenceMap: new Map([[currentImageId, newSegImageId]]),
                //             },
                //         },
                //     },
                // ]);

                // Add the segmentation representation to the tool group
                // await cornerstoneTools.segmentation.addSegmentationRepresentations(
                //     'stack_tool_group',
                //     [
                //         {
                //             segmentationId: segId,
                //             type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                //         },
                //     ]
                // );

            }
            else if (context.viewport_layout == 'volume') {

                volume.load();

                // Add volumes to volume viewports
                await cornerstone.setVolumesForViewports(
                    renderingEngine,
                    [{ volumeId: volumeId }],
                    ['vol_axial', 'vol_sagittal', 'vol_coronal']
                );

                const volDimensions = volume.dimensions;

                const volSlab = Math.sqrt(
                    volDimensions[0] * volDimensions[0] +
                    volDimensions[1] * volDimensions[1] +
                    volDimensions[2] * volDimensions[2]
                );

                setVolSlabGlobal(volSlab);

                // Add volumes to MIP viewports
                await cornerstone.setVolumesForViewports(
                    renderingEngine,
                    [
                        //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
                        {
                            volumeId: volumeId,
                            blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
                            slabThickness: volSlab,
                        },
                    ],
                    ['mip_axial', 'mip_sagittal', 'mip_coronal']
                );

                await cornerstone.setVolumesForViewports(
                    renderingEngine,
                    [{ volumeId: volumeId }],
                    ['t3d_coronal']
                ).then(() => {
                    const viewport = renderingEngine.getViewport('t3d_coronal');
                    viewport.setProperties({ preset: context.presetToolValue });
                });

                // Segmentation v2
                await cornerstone.volumeLoader.createAndCacheDerivedLabelmapVolume(volumeId, {
                    volumeId: segId,
                    options: {
                        // Specify Uint8Array as the segmentation datatype to avoid Int16Array warnings
                        scalarData: new Uint8Array(),
                        dataType: 'Uint8Array'
                    }
                });

                // Add the segmentation to the segmentation state.
                // (This registers the segmentation with the segmentation module.)
                cornerstoneTools.segmentation.addSegmentations([
                    {
                        segmentationId: segId,
                        representation: {
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                            data: { volumeId: segId },
                        },
                    },
                ]);

                await cornerstoneTools.segmentation.addLabelmapRepresentationToViewportMap({
                    vol_axial: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                    vol_sagittal: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                    vol_coronal: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                    mip_axial: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                    mip_sagittal: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                    mip_coronal: [
                        {
                            segmentationId: segId,
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        },
                    ],
                });

                // setTimeout(() => {
                //     renderingEngine.getViewports().forEach((viewport) => {
                //         viewport.resetCamera(true, true, true, true);
                //     });
                // }, 50);




                //// make sure it doesn't already exist
                //cornerstoneTools.segmentation.state.removeSegmentation(segId);
                //cornerstoneTools.segmentation.state.removeSegmentationRepresentations('t3d_tool_group');

                // create and bind a new segmentation
                // await cornerstone.volumeLoader.createAndCacheDerivedSegmentationVolume(
                //     volumeId,
                //     { volumeId: segId }
                // );

                // cornerstoneTools.segmentation.addSegmentations([
                //     {
                //         segmentationId: segId,
                //         representation: {
                //             type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                //             data: {
                //                 volumeId: segId,
                //             },
                //         },
                //     },
                // ]);

                // await cornerstoneTools.segmentation.addSegmentationRepresentations(
                //     'vol_tool_group',
                //     [
                //         {
                //             segmentationId: segId,
                //             type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                //         },
                //     ]
                // );

                // await cornerstoneTools.segmentation.addSegmentationRepresentations(
                //     'mip_tool_group',
                //     [
                //         {
                //             segmentationId: segId,
                //             type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
                //         },
                //     ]
                // );
            }

            setFilesLoaded(true);
        }

        doit();

    }, [files, loading]);

    // ----------------------------------------------------
    // Load presets when component mounts
    useEffect(() => {
        const loadPresets = () => {
            const fetchedPresets = cornerstone.CONSTANTS.VIEWPORT_PRESETS.map((preset) => preset.name);
            context.setPresetToolList(fetchedPresets);
        };

        if (context.presetToolList.length === 0) {
            loadPresets();
        }
    }, [context.presetToolList, context.setPresetToolList]);

    // ----------------------------------------------------
    // Handle changes to the `preset` prop
    useEffect(() => {
        const renderingEngine = renderingEngineRef.current;
        if (renderingEngine) {
            const viewport = renderingEngine.getViewport('t3d_coronal');
            viewport.setProperties({ preset: context.presetToolValue });
            // console.log(cornerstone.cache.getVolumes());
        }
    }, [context.presetToolValue]);

    // ----------------------------------------------------
    // Handle changes to the `opacity` prop
    useEffect(() => {
        const renderingEngine = renderingEngineRef.current;
        if (renderingEngine) {
            const viewport = renderingEngine.getViewport('t3d_coronal');
            if (viewport) {
                const actorEntry = viewport.getActors()[0];
                if (actorEntry && actorEntry.actor) {
                    const volumeActor = actorEntry.actor;
                    const property = volumeActor.getProperty();
                    const opacityFunction = property.getScalarOpacity(0);

                    opacityFunction.removeAllPoints();
                    opacityFunction.addPoint(0, 0.0);
                    opacityFunction.addPoint(500, context.opacityToolValue);
                    opacityFunction.addPoint(1000, context.opacityToolValue);
                    opacityFunction.addPoint(1500, context.opacityToolValue);
                    opacityFunction.addPoint(2000, context.opacityToolValue);

                    property.setScalarOpacity(0, opacityFunction);
                    viewport.render();
                }
            }
        }
    }, [context.opacityToolValue]);

    // ----------------------------------------------------
    // Handle changes to the `left click` prop
    useEffect(() => {

        if (context.viewport_layout == 'stack') {

            const stackToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('stack_tool_group');

            if (stackToolGroup) {

                // Activate or deactivate the WindowLevelTool based on the windowLevel state
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    stackToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    stackToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }

                if (context.leftClickToolCrossHairsVisible) {
                    // Activate or deactivate the CrosshairsTool based on the crosshairs state
                    if (context.leftClickToolGroupValue === 'crosshairs') {
                        stackToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                            bindings: [
                                { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                            ],
                        });
                    } else {
                        stackToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                    }
                }

                // Activate or deactivate the RectangleScissorsTool based on the rectangleScissors state
                if (context.leftClickToolGroupValue === 'selection') {
                    stackToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    stackToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                }
            }
        }
        else if (context.viewport_layout == 'volume') {

            // Volumes
            const volToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('vol_tool_group');

            if (volToolGroup) {

                // Activate or deactivate the WindowLevelTool based on the windowLevel state
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    volToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    volToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }

                // Activate or deactivate the CrosshairsTool based on the crosshairs state
                if (context.leftClickToolGroupValue === 'crosshairs') {
                    volToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    volToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                }

                // Activate or deactivate the RectangleScissorsTool based on the rectangleScissors state
                if (context.leftClickToolGroupValue === 'selection') {
                    volToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    volToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                }
            }

            // MIPs
            const mipToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('mip_tool_group');

            if (mipToolGroup) {

                // Activate or deactivate the WindowLevelTool based on the windowLevel state
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    mipToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }

                // Activate or deactivate the CrosshairsTool based on the crosshairs state
                if (context.leftClickToolGroupValue === 'crosshairs') {
                    mipToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    mipToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                }


                // Activate or deactivate the RectangleScissorsTool based on the rectangleScissors state
                if (context.leftClickToolGroupValue === 'selection') {
                    mipToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                        bindings: [
                            { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
                        ],
                    });
                } else {
                    mipToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                }
            }
        }
    }, [context.leftClickToolGroupValue]);

    // ----------------------------------------------------
    // Handle changes to the `right click` prop
    useEffect(() => {

        if (context.viewport_layout == 'stack') {

            // Stacks
            const stackToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('stack_tool_group');
            if (context.rightClickToolGroupValue === 'pan') {
                if (stackToolGroup) {
                    stackToolGroup.setToolDisabled(cornerstoneTools.ZoomTool.toolName);
                    stackToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            } else {
                if (stackToolGroup) {
                    stackToolGroup.setToolDisabled(cornerstoneTools.PanTool.toolName);
                    stackToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            }
        }
        else if (context.viewport_layout == 'volume') {

            // Volumes
            const volToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('vol_tool_group');
            if (context.rightClickToolGroupValue === 'pan') {
                if (volToolGroup) {
                    volToolGroup.setToolDisabled(cornerstoneTools.ZoomTool.toolName);
                    volToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            } else {
                if (volToolGroup) {
                    volToolGroup.setToolDisabled(cornerstoneTools.PanTool.toolName);
                    volToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            }

            // MIPs
            const mipToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('mip_tool_group');
            if (context.rightClickToolGroupValue === 'pan') {
                if (mipToolGroup) {
                    mipToolGroup.setToolDisabled(cornerstoneTools.ZoomTool.toolName);
                    mipToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            } else {
                if (mipToolGroup) {
                    mipToolGroup.setToolDisabled(cornerstoneTools.PanTool.toolName);
                    mipToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            }

            // 3D
            const t3dToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('t3d_tool_group');
            if (context.rightClickToolGroupValue === 'pan') {
                if (t3dToolGroup) {
                    t3dToolGroup.setToolDisabled(cornerstoneTools.ZoomTool.toolName);
                    t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            } else {
                if (t3dToolGroup) {
                    t3dToolGroup.setToolDisabled(cornerstoneTools.PanTool.toolName);
                    t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                    });
                }
            }
        }
    }, [context.rightClickToolGroupValue]);

    // ----------------------------------------------------
    // Handle changes to the `reset viewports` prop
    useEffect(() => {

        if (context.resetViewportsValue) {

            // Reset View
            if (context.viewToolGroupVisible) {
                context.setViewToolGroupValue(context.viewport_layout);
                // setTimeout(() => {
                //     // context.setViewToolGroupValue(context.viewToolGroupValue);
                // }, 50);
                //context.setViewToolGroupValue(context.viewToolGroupValue);
            }

            // Reset Function
            if (context.functionToolGroupVisible) {
                context.setFunctionToolGroupValue(context.functionToolGroupDefaultValue);
            }

            // Reset Form
            if (context.formToolGroupVisible) {
                context.setFormToolGroupValue(context.formToolGroupValue);
            }

            // Reset left click
            if (context.leftClickToolGroupVisible) {
                context.setLeftClickToolGroupValue(context.leftClickToolGroupValue);
            }

            // Reset right click
            if (context.rightClickToolGroupVisible) {
                context.setRightClickToolGroupValue(context.rightClickToolGroupValue);
            }

            // Reset Opacity
            if (context.opacityToolVisible) {
                context.setOpacityToolValue(context.opacityToolValue);
            }

            // Reset Preset
            if (context.presetToolVisible) {
                context.setPresetToolValue(context.presetToolValue);
            }

            // reset cameras for all the viewports that its wrapper is visible
            const renderingEngine = renderingEngineRef.current;
            renderingEngine.getViewports().forEach((viewport) => {
                // if the viewport parent node is visible, reset camera
                // const viewportElement = document.getElementById(viewport.id);
                //if (viewportElement.parentNode.style.display !== 'none') {
                const camera = viewport.getCamera();

                // Set these values to your volume’s defaults.
                camera.position = [0, -1000, 0];
                camera.focalPoint = [0, 0, 0];
                camera.viewUp = [0, 0, 1];

                // Apply the updated camera and re-render.
                viewport.setCamera(camera);
                viewport.resetCamera(true, true, true, true);

                viewport.render();
                //}
            });

            // // Remove all segmentations
            // if (cornerstoneTools.segmentation && cornerstoneTools.segmentation.state) {
            //     // Remove the segmentation from the segmentation state
            //     cornerstoneTools.segmentation.state.removeSegmentation(segId);
            // }

            // Remove segmentation from the state
            if (cornerstoneTools.segmentation && cornerstoneTools.segmentation.state) {
                cornerstoneTools.segmentation.state.removeSegmentation(segId);

                // Reinitialize segmentation
                // Check if the volume is already in the cache
                if (cornerstone.cache.getVolume(segId)) {
                    // Remove the existing volume from the cache
                    cornerstone.cache.removeVolumeLoadObject(segId);
                }

                cornerstone.volumeLoader.createAndCacheDerivedLabelmapVolume(volumeId, {
                    volumeId: segId,
                });

                // Add the segmentation to the state
                cornerstoneTools.segmentation.addSegmentations([
                    {
                        segmentationId: segId,
                        representation: {
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                            data: { volumeId: segId },
                        },
                    },
                ]);

                // Add segmentation representations to all relevant viewports
                cornerstoneTools.segmentation.addLabelmapRepresentationToViewportMap({
                    vol_axial: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                    vol_sagittal: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                    vol_coronal: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                    mip_axial: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                    mip_sagittal: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                    mip_coronal: [{
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    }],
                });

                // Reinitialize RectangleScissorsTool for volume viewports
                const volToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('vol_tool_group');
                if (volToolGroup) {
                    // volToolGroup.addTool(cornerstoneTools.RectangleScissorsTool.toolName);
                    if (context.leftClickToolGroupValue === 'selection') {
                        volToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                            bindings: [{
                                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary
                            }]
                        });
                    }
                }

                // Reinitialize RectangleScissorsTool for MIP viewports
                const mipToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('mip_tool_group');
                if (mipToolGroup) {
                    // mipToolGroup.addTool(cornerstoneTools.RectangleScissorsTool.toolName);
                    if (context.leftClickToolGroupValue === 'selection') {
                        mipToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                            bindings: [{
                                mouseButton: cornerstoneTools.Enums.MouseBindings.Primary
                            }]
                        });
                    }
                }

                // Force render all viewports to ensure new segmentation is displayed
                renderingEngine.getViewports().forEach(viewport => {
                    viewport.render();
                });
            }


            // // Remove all segmentations
            // const segVolume = cornerstone.cache.getVolume(segId);
            // //console.log("segVolume is", segVolume);
            // const scalarData = segVolume.scalarData;
            // // console.log("scalarData is", scalarData);
            // scalarData.fill(0);
            // // redraw segmentation
            // cornerstoneTools.segmentation
            //     .triggerSegmentationEvents
            //     .triggerSegmentationDataModified(segId);

            // Wait 100ms then reset the cameras and crosshairs of all the viewports that its wrapper is visible
            setTimeout(() => {

                // if the viewport parent node is visible, reset camera
                // renderingEngine.getViewports().forEach((viewport) => {
                //     const viewportElement = document.getElementById(viewport.id);
                //     if (viewportElement.parentNode.style.display !== 'none') {
                //         const camera = viewport.getCamera();

                //         // Set these values to your volume’s defaults.
                //         camera.position = [0, -1000, 0];
                //         camera.focalPoint = [0, 0, 0];
                //         camera.viewUp = [0, 0, 1];

                //         // Apply the updated camera and re-render.
                //         viewport.setCamera(camera);
                //         viewport.resetCamera(true, true, true, true);
                //         viewport.render();
                //     }
                // });

                // reset crosshairs tool slab thickness if the volume viewport is visible
                if (document.getElementById('vol_axial_wrapper').style.display !== 'none') {
                    const volToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('vol_tool_group');
                    const crosshairsToolInstance = volToolGroup.getToolInstance(cornerstoneTools.CrosshairsTool.toolName);
                    crosshairsToolInstance.resetCrosshairs();
                }
            }, 0);

            // Reset window level for vol viewports to their default values
            if (context.leftClickToolWindowLevelVisible) {
                // Reset window level for all viewports to their default values
                const renderingEngine = renderingEngineRef.current;

                // Get all viewports
                const viewports = renderingEngine.getViewports();

                // Iterate through each viewport and reset window level
                viewports.forEach((viewport) => {
                    // Only reset visible viewports
                    const viewportElement = document.getElementById(viewport.id);
                    if (viewport.id.startsWith('vol_')) {
                        try {
                            // For volume viewports, reset VOI
                            if (viewport.type === cornerstone.Enums.ViewportType.ORTHOGRAPHIC) {

                                // Reset to default window level
                                viewport.resetProperties();
                                // viewport.resetVOI();
                            }
                        } catch (error) {
                            console.log('Error resetting window level for viewport:', viewport.id, error);
                        }
                    }
                });
            }

            // Reset window level for mip viewports
            cornerstone.setVolumesForViewports(
                renderingEngine,
                [
                    //https://www.cornerstonejs.org/api/core/namespace/Types#IVolumeInput
                    {
                        volumeId: volumeId,
                        blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
                        slabThickness: volSlabGlobal,
                    },
                ],
                ['mip_axial', 'mip_sagittal', 'mip_coronal']
            );
        }
        context.setResetViewportsValue(false);

    }, [context.resetViewportsValue]);


    async function handleExpandSelection() {
        console.log('handleExpandSelection called, setId is', segId);
        coords = expandSegTo3D(segId);

        cornerstoneTools.segmentation
            .triggerSegmentationEvents
            .triggerSegmentationDataModified(segId);

        await cornerstoneTools.segmentation.addSegmentationRepresentations(
            't3d_tool_group', [
            {
                segmentationId: segId,
                type: cornerstoneTools.Enums.SegmentationRepresentations.Surface,
                options: {
                    polySeg: {
                        enabled: true,
                    }
                }
            }
        ]
        );
    }
    async function handleClearSelection() {
        // const segVolume = cornerstone.cache.getVolume(segId);
        // const scalarData = segVolume.scalarData;
        // scalarData.fill(0);

        // // redraw segmentation
        // cornerstoneTools.segmentation
        //     .triggerSegmentationEvents
        //     .triggerSegmentationDataModified(segId);
    }
    async function handleAcceptSelection() {
        const maskForm = context.formToolGroupValue
        const maskFunction = context.functionToolGroupValue
        await finalCalc(coords, volumeId, iec, maskForm, maskFunction);
    }
    async function handleMarkAccepted() {
        await flagAsAccepted(iec);
        alert("Marked as accepted!");
    }
    async function handleMarkRejected() {
        await flagAsRejected(iec);
        alert("Marked as rejected!");
    }
    async function handleMarkSkipped() {
        await flagAsSkipped(iec);
        alert("Marked as skipped!");
    }
    async function handleMarkNonmaskable() {
        await flagAsNonmaskable(iec);
        alert("Marked as Non-Maskable!");
    }
    async function handleMarkGood() {
        if (context.nifti) {
            await setNiftiStatus(files[0], "Good");
        } else {
            await setDicomStatus(iec, "Good");
        }
        alert("Marked as Good!");
    }
    async function handleMarkBad() {
        if (context.nifti) {
            await setNiftiStatus(files[0], "Bad");
        } else {
            await setDicomStatus(iec, "Bad");
        }
        alert("Marked as Bad!");

    }
    async function handleMarkBlank() {
        if (context.nifti) {
            await setNiftiStatus(files[0], "Blank");
        } else {
            await setDicomStatus(iec, "Blank");
        }
        alert("Marked as Blank!");
    }
    async function handleMarkScout() {
        if (context.nifti) {
            await setNiftiStatus(files[0], "Scout");
        } else {
            await setDicomStatus(iec, "Scout");
        }
        alert("Marked as Scout!");
    }
    async function handleMarkOther() {
        if (context.nifti) {
            await setNiftiStatus(files[0], "Other");
        } else {
            await setDicomStatus(iec, "Other");
        }
        alert("Marked as Other!");
    }
    async function handleMarkFlag() {
        if (context.nifti) {
            await setMaskingFlag(files[0]);
        } else {
            await setMaskingFlag(iec);
        }
        alert("Flagged for Masking");
    }

    return (
        <>
            <div ref={containerRef}
                style={{ width: '100%', height: '100%' }}
                id="container"></div>
            <MiddleBottomPanel
                onAccept={handleAcceptSelection}
                onClear={handleClearSelection}
                onExpand={handleExpandSelection}

                onMarkAccepted={handleMarkAccepted}
                onMarkRejected={handleMarkRejected}
                onMarkSkip={handleMarkSkipped}
                onMarkNonMaskable={handleMarkNonmaskable}

                onMarkGood={handleMarkGood}
                onMarkBad={handleMarkBad}
                onMarkBlank={handleMarkBlank}
                onMarkScout={handleMarkScout}
                onMarkOther={handleMarkOther}
                onMarkFlag={handleMarkFlag}
            />
        </>
    );
};

export default ViewVolumePanel;
