// ViewStackPanel.jsx

import React, { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react';
import MiddleBottomPanel from './MiddleBottomPanel.jsx';
import { Context } from './Context.js';

// Cornerstone imports
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import {
    RectangleScissorsTool,
    segmentation,
    ToolGroupManager,
    Enums as csToolsEnums,
} from '@cornerstonejs/tools';

// import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader"
// import { init as csRenderInit } from "@cornerstonejs/core"
// import { init as csToolsInit } from "@cornerstonejs/tools"

// import dicomParser from 'dicom-parser';

// Utilities
import { setParameters, loaded, flagAsAccepted, flagAsRejected, flagAsSkipped, flagAsNonmaskable, finalCalc } from '../masking';
import { getNiftiDetails, setNiftiStatus, getDicomDetails, setDicomStatus, setMaskingFlag } from '../visualreview';
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";

// Helper: get or create a tool group.
function getOrCreateToolgroup(toolgroup_name) {
    let group = cornerstoneTools.ToolGroupManager.getToolGroup(toolgroup_name);
    if (group === undefined) {
        group = cornerstoneTools.ToolGroupManager.createToolGroup(toolgroup_name);
    }
    return group;
}

function ViewStackPanel({ volumeName, files, iec }) {
    const context = useContext(Context);

    const [loading, setLoading] = useState(true);
    const [filesLoaded, setFilesLoaded] = useState(false);

    // For mouse binding constants
    // const { MouseBindings } = csToolsEnums;

    //Segmentation V2
    let segId = 'seg_id';

    const renderingEngineId = 'viewer_render_engine';
    const renderingEngineRef = useRef(null);
    const containerRef = useRef(null);

    let coords;
    // let volumeId;

    // if (context.nifti) {
    //     volumeId = `nifti:/papi/v1/files/${files[0]}/data`;
    // } else {
    //     volumeId = 'cornerstoneStreamingImageVolume: newVolume' + volumeName;
    // }

    useLayoutEffect(() => {
        if (!loaded.loaded) {
            cornerstone.init();
            cornerstoneTools.init();
            dicomImageLoaderInit({
                maxWebWorkers: navigator.hardwareConcurrency
                    ? Math.min(navigator.hardwareConcurrency, 7)
                    : 1,
                startWebWorkersOnDemand: false,
                taskConfiguration: {
                    decodeTask: {
                        initializeCodecsOnStartup: false,
                        strict: false,
                    },
                },
            });
            loaded.loaded = true;
        }

        // Create the rendering engine.
        renderingEngineRef.current = new cornerstone.RenderingEngine('viewer_render_engine');

        const container = containerRef.current;
        // if (!container) return;
        container.innerHTML = ''; // Clear previous content

        // Create a panel wrapper and panel element with explicit dimensions.
        const panelWrapper = document.createElement('div');
        panelWrapper.id = 'stackViewer_wrapper';
        panelWrapper.style.display = 'block';
        panelWrapper.style.width = '100%';
        panelWrapper.style.height = '100%';
        panelWrapper.style.position = 'relative';
        panelWrapper.style.borderRadius = '8px';
        panelWrapper.style.overflow = 'hidden';
        panelWrapper.style.backgroundColor = 'black';

        const panel = document.createElement('div');
        panel.id = 'stackViewer';
        panel.style.display = 'block';
        panel.style.width = '100%';
        panel.style.height = '100%';
        panel.style.borderRadius = '8px';
        panel.style.overflow = 'hidden';
        panel.style.backgroundColor = 'black';
        panel.oncontextmenu = e => e.preventDefault();

        panelWrapper.appendChild(panel);
        container.appendChild(panelWrapper);

        // Wait until the element is rendered.
        //requestAnimationFrame(() => {
        const stackElement = container.querySelector('#stackViewer');
        // if (!stackElement) {
        //     console.error('Stack element not found!');
        //     return;
        // }
        const viewportInput = {
            viewportId: 'dicom_stack',
            type: cornerstone.Enums.ViewportType.STACK,
            element: stackElement,
        };
        renderingEngineRef.current.enableElement(viewportInput);
        setupStackViewportTools();
        setLoading(false);

        async function setupStackViewportTools() {
            const group = getOrCreateToolgroup('stack_tool_group');
            group.addViewport('dicom_stack', renderingEngineId);

            // WindowLevelTool
            cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
            group.addTool(cornerstoneTools.WindowLevelTool.toolName);
            if (context.leftClickToolGroupValue === 'windowlevel') {
                group.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                    bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                });
            }

            // Pan and Zoom tools
            cornerstoneTools.addTool(cornerstoneTools.PanTool);
            cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
            group.addTool(cornerstoneTools.PanTool.toolName);
            group.addTool(cornerstoneTools.ZoomTool.toolName);
            if (context.rightClickToolGroupValue === 'pan') {
                group.setToolActive(cornerstoneTools.PanTool.toolName, {
                    bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                });
            } else {
                group.setToolActive(cornerstoneTools.ZoomTool.toolName, {
                    bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary }],
                });
            }

            // Segmentation
            // First get the viewport
            const viewport = renderingEngineRef.current.getViewport('dicom_stack');

            // Create imageIds and cache metadata
            const imageIds = await createImageIdsAndCacheMetaData({
                StudyInstanceUID: `iec:${iec}`,
                SeriesInstanceUID: "any",
                wadoRsRoot: "/papi/v1/wadors",
            });
            console.log("imageIds:", imageIds);

            const imageIdsArray = [imageIds[0]];
            console.log("imageIdsArray:", imageIdsArray);

            // Set the viewport stack first
            await viewport.setStack(imageIdsArray, 0);

            // Create derived labelmap images after setting the stack
            const segImages = await cornerstone.imageLoader.createAndCacheDerivedLabelmapImages(imageIdsArray);
            console.log("segImages:", segImages);

            // Add segmentation with these derived images
            await segmentation.addSegmentations([
                {
                    segmentationId: segId,
                    representation: {
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                        data: {
                            imageIds: segImages.map(it => it.imageId), // Use the derived images
                        },
                    },
                },
            ]);

            // Add segmentation representation to viewport
            await segmentation.addSegmentationRepresentations('dicom_stack', [
                {
                    segmentationId: segId,
                    type: csToolsEnums.SegmentationRepresentations.Labelmap,
                },
            ]);

            // Set active segmentation
            await segmentation.activeSegmentation.setActiveSegmentation(
                'dicom_stack',
                segId
            );

            console.log("Segmentation setup complete");

            // Now add the RectangleScissorsTool
            if (context.leftClickToolGroupValue === 'selection') {
                cornerstoneTools.addTool(RectangleScissorsTool);
                group.addTool(RectangleScissorsTool.toolName);
                group.setToolActive(RectangleScissorsTool.toolName, {
                    bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                });
                console.log("RectangleScissorsTool added and activated");
            }
        }

        // return () => {
        //     cornerstone.cache.purgeCache();
        // };
    }, [context.layout]);

    // ----------------------------------------------------
    // Load the actual volume into the display here
    useEffect(() => {
        // cornerstone.cache.purgeCache();

        // do nothing if Cornerstone is still loading
        if (loading) {
            return;
        }

        // cornerstone.cache.purgeCache();
        // cornerstone.cache.purgeVolumeCache();

        // let volume = null;
        // let stack = files;
        const renderingEngine = renderingEngineRef.current;

        // async function getFileData() {
        //     if (context.viewport_layout === 'stack') {
        //         if (context.nifti) {
        //             volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { type: 'image' });
        //         } else {
        //             const imageIds = await createImageIdsAndCacheMetaData({
        //                 StudyInstanceUID: `iec:${iec}`,
        //                 SeriesInstanceUID: "any",
        //                 wadoRsRoot: "/papi/v1/wadors",
        //             });
        //             volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: files });
        //         }
        //     }
        // }

        async function doit() {
            // window.cornerstone = cornerstone;
            // window.cornerstoneTools = cornerstoneTools;
            // await getFileData();

            // if (context.viewport_layout === 'stack') {
            // const viewport = renderingEngine.getViewport('dicom_stack');
            // await viewport.setStack(files);
            // const currentImageId = viewport.getCurrentImageId();
            // Optionally, you can perform additional image setup here.
            // }
            // else if (context.viewport_layout === 'volume') {
            //     volume.load();
            //     await cornerstone.setVolumesForViewports(
            //         renderingEngine,
            //         [{ volumeId: volumeId }],
            //         ['vol_axial', 'vol_sagittal', 'vol_coronal']
            //     );

            //     const volDimensions = volume.dimensions;
            //     const volSlab = Math.sqrt(
            //         volDimensions[0] * volDimensions[0] +
            //         volDimensions[1] * volDimensions[1] +
            //         volDimensions[2] * volDimensions[2]
            //     );

            //     await cornerstone.setVolumesForViewports(
            //         renderingEngine,
            //         [
            //             {
            //                 volumeId: volumeId,
            //                 blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
            //                 slabThickness: volSlab,
            //             },
            //         ],
            //         ['mip_axial', 'mip_sagittal', 'mip_coronal']
            //     );

            //     await cornerstone.setVolumesForViewports(
            //         renderingEngine,
            //         [{ volumeId: volumeId }],
            //         ['t3d_coronal']
            //     ).then(() => {
            //         const viewport = renderingEngine.getViewport('t3d_coronal');
            //         viewport.setProperties({ preset: context.presetToolValue });
            //     });
            // }
            setFilesLoaded(true);
        }

        doit();
    }, [files, loading]);

    // ----------------------------------------------------
    // Handle changes to the `left click` prop
    useEffect(() => {
        if (context.viewport_layout === 'stack') {
            const stackToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('stack_tool_group');
            if (stackToolGroup) {
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    stackToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    });
                } else {
                    stackToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }
                if (context.leftClickToolCrossHairsVisible) {
                    if (context.leftClickToolGroupValue === 'crosshairs') {
                        stackToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                            bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                        });
                    } else {
                        stackToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                    }
                }
                if (context.leftClickToolGroupValue === 'selection') {
                    // No segmentation or selection tool will be activated.
                    // console.log('Disabling RectangleScissorsTool');
                    // stackToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                    // stackToolGroup.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
                    //     bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    // });
                }
            }
        }
        else if (context.viewport_layout === 'volume') {
            const volToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('vol_tool_group');
            if (volToolGroup) {
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    volToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    });
                } else {
                    volToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }
                if (context.leftClickToolGroupValue === 'crosshairs') {
                    volToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    });
                } else {
                    volToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                }
                if (context.leftClickToolGroupValue === 'selection') {
                    volToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                }
            }

            const mipToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup('mip_tool_group');
            if (mipToolGroup) {
                if (context.leftClickToolGroupValue === 'windowlevel') {
                    mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    });
                } else {
                    mipToolGroup.setToolDisabled(cornerstoneTools.WindowLevelTool.toolName);
                }
                if (context.leftClickToolGroupValue === 'crosshairs') {
                    mipToolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
                        bindings: [{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary }],
                    });
                } else {
                    mipToolGroup.setToolDisabled(cornerstoneTools.CrosshairsTool.toolName);
                }
                if (context.leftClickToolGroupValue === 'selection') {
                    mipToolGroup.setToolDisabled(cornerstoneTools.RectangleScissorsTool.toolName);
                }
            }
        }
    }, [context.leftClickToolGroupValue]);

    // ----------------------------------------------------
    // Handle changes to the `right click` prop
    useEffect(() => {
        if (context.viewport_layout === 'stack') {
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
        else if (context.viewport_layout === 'volume') {
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
            // Clear the segmentation
            cornerstoneTools.segmentation.state.removeSegmentation(segId);

            // Segmentation
            // Start a fresh segmentation setup here
            async function setupSegmentation() {

                // Create imageIds and cache metadata
                const imageIds = await createImageIdsAndCacheMetaData({
                    StudyInstanceUID: `iec:${iec}`,
                    SeriesInstanceUID: "any",
                    wadoRsRoot: "/papi/v1/wadors",
                });

                const imageIdsArray = [imageIds[0]];

                const segImages = await cornerstone.imageLoader.createAndCacheDerivedLabelmapImages(imageIdsArray);

                // Add segmentation with these derived images
                await segmentation.addSegmentations([
                    {
                        segmentationId: segId,
                        representation: {
                            type: csToolsEnums.SegmentationRepresentations.Labelmap,
                            data: {
                                imageIds: segImages.map(it => it.imageId), // Use the derived images
                            },
                        },
                    },
                ]);

                // Add segmentation representation to viewport
                await segmentation.addSegmentationRepresentations('dicom_stack', [
                    {
                        segmentationId: segId,
                        type: csToolsEnums.SegmentationRepresentations.Labelmap,
                    },
                ]);

                // Set active segmentation
                await segmentation.activeSegmentation.setActiveSegmentation(
                    'dicom_stack',
                    segId
                );

                console.log("Segmentation setup complete");

            }

            setupSegmentation();

            if (context.viewToolGroupVisible) {
                context.setViewToolGroupValue(context.viewToolGroupValue + " ");
                setTimeout(() => {
                    context.setViewToolGroupValue(context.viewToolGroupValue);
                }, 50);
            }
            if (context.functionToolGroupVisible) {
                context.setFunctionToolGroupValue(context.functionToolGroupValue);
            }
            if (context.formToolGroupVisible) {
                context.setFormToolGroupValue(context.formToolGroupValue);
            }
            if (context.leftClickToolGroupVisible) {
                context.setLeftClickToolGroupValue(context.leftClickToolGroupValue);
            }
            if (context.rightClickToolGroupVisible) {
                context.setRightClickToolGroupValue(context.rightClickToolGroupValue);
            }
            if (context.opacityToolVisible) {
                context.setOpacityToolValue(context.opacityToolValue);
            }
            if (context.presetToolVisible) {
                context.setPresetToolValue(context.presetToolValue);
            }

            const renderingEngine = renderingEngineRef.current;
            renderingEngine.getViewports().forEach((viewport) => {
                viewport.resetCamera(true, true, true, true);
                viewport.render();
            });

            if (context.leftClickToolWindowLevelVisible) {
                const viewportId = 'dicom_stack';
                const viewport = renderingEngine.getViewport(viewportId);
                const imageId = viewport.getCurrentImageId();
                const image = cornerstone.cache.getImage(imageId);
                viewport.setProperties({
                    voiRange: cornerstone.utilities.windowLevel.toLowHighRange(image.windowWidth, image.windowCenter),
                });
            }
        }
        context.setResetViewportsValue(false);
    }, [context.resetViewportsValue]);

    async function handleClearSelection() {
        // Clear selection action if needed.
    }
    async function handleAcceptSelection() {
        const maskForm = context.formToolGroupValue;
        const maskFunction = context.functionToolGroupValue;
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
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>
            <MiddleBottomPanel
                onAccept={handleAcceptSelection}
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
}

export default ViewStackPanel;
