// V5 Layout 2
import React, { useEffect, useRef } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  cornerstoneStreamingImageVolumeLoader,
  cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

const CornerstoneViewer = ({ zoom, opacity, layout }) => {
  const containerRef = useRef(null);
  const renderingEngineRef = useRef(null);

  useEffect(() => {
    const seriesUID = '1.3.46.670589.61.128.1.2022090215365373100020001';
    const timepointID = '591';

    let volumeId = null;
    let volume = null;

    const { volumeLoader } = cornerstone;

    function initVolumeLoader() {
      volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
      volumeLoader.registerVolumeLoader('cornerstoneStreamingImageVolume', cornerstoneStreamingImageVolumeLoader);
      volumeLoader.registerVolumeLoader('cornerstoneStreamingDynamicImageVolume', cornerstoneStreamingDynamicImageVolumeLoader);
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

      const config = {
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

    async function getFileData() {
      const response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);
      const files = await response.json();
      let fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
      volumeId = 'cornerstoneStreamingImageVolume: newVolume';
      volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
    }

    const resizeObserver = new ResizeObserver(() => {
      const renderingEngine = renderingEngineRef.current;
      if (renderingEngine) {
        renderingEngine.resize(true, false);
      }
    });

    function setupPanel(panelId) {
      const panel = document.createElement('div');
      panel.id = panelId;
      panel.style.width = '100%';
      panel.style.height = '100%';
      panel.style.borderRadius = '8px';
      panel.style.overflow = 'hidden';
      panel.oncontextmenu = e => e.preventDefault();
      resizeObserver.observe(panel);
      return panel;
    }

    function setup3dViewportTools() {
      // Tool Group Setup
      const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('t3d_tool_group');
      t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

      // Trackball Rotate
      cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);
      t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
      t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
          },
        ],
      });

      // Pan
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
      t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
          },
        ],
      });

      // Zoom
      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
      t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
          },
        ],
      });

      // Segmentation Display
      cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
      t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
      t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
    }

    function setupVolViewportTools() {
      // Tool Group setup
      const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('vol_tool_group');
      volToolGroup.addViewport('vol_axial', 'viewer_render_engine');
      volToolGroup.addViewport('vol_sagittal', 'viewer_render_engine');
      volToolGroup.addViewport('vol_coronal', 'viewer_render_engine');

      // Stack Scroll Tool
      cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
      volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
      volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
    }

    function setupMipViewportTools() {
      // Tool Group setup
      const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('mip_tool_group');
      mipToolGroup.addViewport('mip_axial', 'viewer_render_engine');
      mipToolGroup.addViewport('mip_sagittal', 'viewer_render_engine');
      mipToolGroup.addViewport('mip_coronal', 'viewer_render_engine');

      // Window Level
      cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
      mipToolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
      mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
          },
        ],
      });
    }

    async function run() {
      await cornerstone.init();
      await cornerstoneTools.init();
      await initVolumeLoader();
      await initCornerstoneDICOMImageLoader();
      await getFileData();

      const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');
      renderingEngineRef.current = renderingEngine;

      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous content

      if (layout === 'Masker') {
        const viewportInput = [];

        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridGap = '2px';
        container.style.width = '100%';
        container.style.height = '100%';

        const volSagittalContent = setupPanel('vol_sagittal');
        const volCoronalContent = setupPanel('vol_coronal');
        const t3dCoronalContent = setupPanel('t3d_coronal');
          
        container.appendChild(volSagittalContent);
        container.appendChild(volCoronalContent);
        container.appendChild(t3dCoronalContent);

        viewportInput.push(
            {
              viewportId: 'vol_sagittal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: volSagittalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
              },
            },
            {
              viewportId: 'vol_coronal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: volCoronalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
              },
            },
            {
              viewportId: 't3d_coronal',
              type: cornerstone.Enums.ViewportType.VOLUME_3D,
              element: t3dCoronalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
              },
            }
        );

        renderingEngine.setViewports(viewportInput);
        volume.load();

        await cornerstone.setVolumesForViewports(
            renderingEngine,
            [{ volumeId: volumeId }],
            ['vol_sagittal', 'vol_coronal']
          );

        await cornerstone.setVolumesForViewports(
          renderingEngine, 
          [{ volumeId: volumeId }], 
          ['t3d_coronal']).then(() => {
          const viewport = renderingEngine.getViewport('t3d_coronal');
          viewport.setProperties({ preset: 'MR-Default' });
        });        

      }

      if (layout === 'all' || layout === 'volumes' || layout === 'mips' || layout === '3d') {
        const viewportInput = [];

        if (layout === 'all' || layout === 'volumes') {
          container.style.display = 'grid';
          container.style.gridTemplateColumns = 'repeat(3, 1fr)';
          container.style.gridTemplateRows = '1fr';
          container.style.gridGap = '2px';
          container.style.width = '100%';
          container.style.height = '100%';

          const volAxialContent = setupPanel('vol_axial');
          const volSagittalContent = setupPanel('vol_sagittal');
          const volCoronalContent = setupPanel('vol_coronal');

          container.appendChild(volAxialContent);
          container.appendChild(volSagittalContent);
          container.appendChild(volCoronalContent);

          viewportInput.push(
            {
              viewportId: 'vol_axial',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: volAxialContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
              },
            },
            {
              viewportId: 'vol_sagittal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: volSagittalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
              },
            },
            {
              viewportId: 'vol_coronal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: volCoronalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
              },
            }
          );
        }

        if (layout === 'all' || layout === 'mips') {
          container.style.display = 'grid';
          container.style.gridTemplateColumns = 'repeat(3, 1fr)';
          container.style.gridTemplateRows = '1fr';
          container.style.gridGap = '2px';
          container.style.width = '100%';
          container.style.height = '100%';

          const mipAxialContent = setupPanel('mip_axial');
          const mipSagittalContent = setupPanel('mip_sagittal');
          const mipCoronalContent = setupPanel('mip_coronal');

          container.appendChild(mipAxialContent);
          container.appendChild(mipSagittalContent);
          container.appendChild(mipCoronalContent);

          viewportInput.push(
            {
              viewportId: 'mip_axial',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: mipAxialContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.AXIAL,
              },
            },
            {
              viewportId: 'mip_sagittal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: mipSagittalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
              },
            },
            {
              viewportId: 'mip_coronal',
              type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
              element: mipCoronalContent,
              defaultOptions: {
                orientation: cornerstone.Enums.OrientationAxis.CORONAL,
              },
            }
          );
        }

        if (layout === 'all' || layout === '3d') {
          if (layout === 'all') {
            container.style.gridTemplateRows = 'repeat(2, 1fr)';
          } else {
            container.style.gridTemplateColumns = '1fr';
            container.style.gridTemplateRows = '1fr';
          }
          container.style.gridGap = '2px';
          container.style.width = '100%';
          container.style.height = '100%';

          const t3dCoronalContent = setupPanel('t3d_coronal');
          container.appendChild(t3dCoronalContent);

          viewportInput.push({
            viewportId: 't3d_coronal',
            type: cornerstone.Enums.ViewportType.VOLUME_3D,
            element: t3dCoronalContent,
            defaultOptions: {
              orientation: cornerstone.Enums.OrientationAxis.CORONAL,
            },
          });
        }

        renderingEngine.setViewports(viewportInput);

        volume.load();

        if (layout === 'all' || layout === 'volumes') {
          await cornerstone.setVolumesForViewports(
            renderingEngine,
            [{ volumeId: volumeId }],
            ['vol_axial', 'vol_sagittal', 'vol_coronal']
          );
        }

        if (layout === 'all' || layout === 'mips') {
          await cornerstone.setVolumesForViewports(
            renderingEngine,
            [
              {
                volumeId: volumeId,
                blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
              },
            ],
            ['mip_axial', 'mip_sagittal', 'mip_coronal']
          );
        }

        if (layout === 'all' || layout === '3d') {
          await cornerstone.setVolumesForViewports(renderingEngine, [{ volumeId: volumeId }], ['t3d_coronal']).then(() => {
            const viewport = renderingEngine.getViewport('t3d_coronal');
            viewport.setProperties({ preset: 'MR-Default' });

            const actorEntry = viewport.getActors()[0];
            if (actorEntry && actorEntry.actor) {
              const volumeActor = actorEntry.actor;
              const property = volumeActor.getProperty();
              const opacityFunction = property.getScalarOpacity(0);

              opacityFunction.removeAllPoints();
              opacityFunction.addPoint(0, 0); // Fully transparent at intensity 0
              opacityFunction.addPoint(500, opacity); // Slightly transparent at intensity 500
              opacityFunction.addPoint(1000, opacity); // Semi-transparent at intensity 1000
              opacityFunction.addPoint(1500, opacity); // Almost opaque at intensity 1500
              opacityFunction.addPoint(2000, opacity); // Fully opaque at intensity 2000

              property.setScalarOpacity(0, opacityFunction);
              viewport.render();
            }
          });
        }

        renderingEngine.render();

        if (layout === 'all' || layout === 'volumes') {
          setupVolViewportTools();
        }

        if (layout === 'all' || layout === 'mips') {
          setupMipViewportTools();
        }

        if (layout === 'all' || layout === '3d') {
          setup3dViewportTools();
        }
      }
    }

    run();

    return () => {
      resizeObserver.disconnect();
    };
  }, [layout]);

  useEffect(() => {
    const renderingEngine = renderingEngineRef.current;
    if (renderingEngine) {
      const volAxialViewport = renderingEngine.getViewport('vol_axial');
      if (volAxialViewport) {
        const camera = volAxialViewport.getCamera();
        camera.parallelScale = zoom;
        volAxialViewport.setCamera(camera);
        volAxialViewport.render();
      }
    }
  }, [zoom]);

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
          opacityFunction.addPoint(500, opacity);
          opacityFunction.addPoint(1000, opacity);
          opacityFunction.addPoint(1500, opacity);
          opacityFunction.addPoint(2000, opacity);

          property.setScalarOpacity(0, opacityFunction);
          viewport.render();
        }
      }
    }
  }, [opacity]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
};

export default CornerstoneViewer;





// V4 - Layouts
// import React, { useEffect, useRef } from 'react';
// import * as cornerstone from '@cornerstonejs/core';
// import * as cornerstoneTools from '@cornerstonejs/tools';
// import { segmentation } from '@cornerstonejs/tools';
// import {
//   cornerstoneStreamingImageVolumeLoader,
//   cornerstoneStreamingDynamicImageVolumeLoader,
// } from '@cornerstonejs/streaming-image-volume-loader';
// import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
// import dicomParser from 'dicom-parser';

// const CornerstoneViewer = ({ zoom, opacity, layout }) => {
//   const containerRef = useRef(null);
//   const renderingEngineRef = useRef(null);

//   useEffect(() => {
//     const seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
//     const timepointID = '6750';

//     let volumeId = null;
//     let volume = null;

//     const { volumeLoader } = cornerstone;

//     function initVolumeLoader() {
//       volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
//       volumeLoader.registerVolumeLoader('cornerstoneStreamingImageVolume', cornerstoneStreamingImageVolumeLoader);
//       volumeLoader.registerVolumeLoader('cornerstoneStreamingDynamicImageVolume', cornerstoneStreamingDynamicImageVolumeLoader);
//     }

//     function initCornerstoneDICOMImageLoader() {
//       const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
//       cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
//       cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
//       cornerstoneDICOMImageLoader.configure({
//         useWebWorkers: true,
//         decodeConfig: {
//           convertFloatPixelDataToInt: false,
//           use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
//         },
//       });

//       let maxWebWorkers = 1;

//       if (navigator.hardwareConcurrency) {
//         maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
//       }

//       const config = {
//         maxWebWorkers,
//         startWebWorkersOnDemand: false,
//         taskConfiguration: {
//           decodeTask: {
//             initializeCodecsOnStartup: false,
//             strict: false,
//           },
//         },
//       };

//       cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
//     }

//     async function getFileData() {
//       const response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);
//       const files = await response.json();
//       let fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
//       volumeId = 'cornerstoneStreamingImageVolume: newVolume';
//       volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
//     }

//     const resizeObserver = new ResizeObserver(() => {
//       const renderingEngine = renderingEngineRef.current;
//       if (renderingEngine) {
//         renderingEngine.resize(true, false);
//       }
//     });

//     function setupPanel(panelId) {
//       const panel = document.createElement('div');
//       panel.id = panelId;
//       panel.style.width = '100%';
//       panel.style.height = '100%';
//       panel.style.borderRadius = '8px';
//       panel.style.overflow = 'hidden';
//       panel.oncontextmenu = e => e.preventDefault();
//       resizeObserver.observe(panel);
//       return panel;
//     }

//     function setup3dViewportTools() {
//       // Tool Group Setup
//       const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('t3d_tool_group');
//       t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

//       // Trackball Rotate
//       cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);
//       t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
//       t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
//         bindings: [
//           {
//             mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//           },
//         ],
//       });

//       // Pan
//       cornerstoneTools.addTool(cornerstoneTools.PanTool);
//       t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
//       t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
//         bindings: [
//           {
//             mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
//           },
//         ],
//       });

//       // Zoom
//       cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
//       t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
//       t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
//         bindings: [
//           {
//             mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
//           },
//         ],
//       });

//       // Segmentation Display
//       cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
//       t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
//       t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
//     }

//     function setupVolViewportTools() {
//       // Tool Group setup
//       const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('vol_tool_group');
//       volToolGroup.addViewport('vol_axial', 'viewer_render_engine');
//       volToolGroup.addViewport('vol_sagittal', 'viewer_render_engine');
//       volToolGroup.addViewport('vol_coronal', 'viewer_render_engine');

//       // Stack Scroll Tool
//       cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
//       volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//       volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//     }

//     function setupMipViewportTools() {
//       // Tool Group setup
//       const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('mip_tool_group');
//       mipToolGroup.addViewport('mip_axial', 'viewer_render_engine');
//       mipToolGroup.addViewport('mip_sagittal', 'viewer_render_engine');
//       mipToolGroup.addViewport('mip_coronal', 'viewer_render_engine');

//       // Window Level
//       cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
//       mipToolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
//       mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
//         bindings: [
//           {
//             mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//           },
//         ],
//       });
//     }

//     async function run() {
//       await cornerstone.init();
//       await cornerstoneTools.init();
//       await initVolumeLoader();
//       await initCornerstoneDICOMImageLoader();
//       await getFileData();

//       const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');
//       renderingEngineRef.current = renderingEngine;

//       const container = containerRef.current;

//       if (layout === '3d') {
//         container.style.display = 'grid';
//         container.style.gridTemplateColumns = '1fr';
//         container.style.gridTemplateRows = '1fr';
//         container.style.gridGap = '2px';
//         container.style.width = '100%';
//         container.style.height = '100%';

//         const t3dCoronalContent = setupPanel('t3d_coronal');
//         container.appendChild(t3dCoronalContent);

//         const viewportInput = [
//           {
//             viewportId: 't3d_coronal',
//             type: cornerstone.Enums.ViewportType.VOLUME_3D,
//             element: t3dCoronalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//             },
//           },
//         ];

//         renderingEngine.setViewports(viewportInput);

//         volume.load();

//         await cornerstone.setVolumesForViewports(renderingEngine, [{ volumeId: volumeId }], ['t3d_coronal']).then(() => {
//           const viewport = renderingEngine.getViewport('t3d_coronal');
//           viewport.setProperties({ preset: 'MR-Default' });

//           // Adjust the opacity transfer function
//           const actorEntry = viewport.getActors()[0];
//           if (actorEntry && actorEntry.actor) {
//             const volumeActor = actorEntry.actor;
//             const property = volumeActor.getProperty();
//             const opacityFunction = property.getScalarOpacity(0);

//             opacityFunction.removeAllPoints();
//             opacityFunction.addPoint(0, 0);     // Fully transparent at intensity 0
//             opacityFunction.addPoint(500, opacity);   // Slightly transparent at intensity 500
//             opacityFunction.addPoint(1000, opacity);  // Semi-transparent at intensity 1000
//             opacityFunction.addPoint(1500, opacity);  // Almost opaque at intensity 1500
//             opacityFunction.addPoint(2000, opacity);  // Fully opaque at intensity 2000

//             property.setScalarOpacity(0, opacityFunction);
//             viewport.render();
//           }
//         });

//         renderingEngine.render();

//         // Setup 3D Viewport Tools
//         setup3dViewportTools();
//       } else {
//         // Existing setup for 7 views
//         container.style.display = 'grid';
//         container.style.gridTemplateColumns = 'repeat(3, 1fr)';
//         container.style.gridTemplateRows = 'repeat(3, 1fr)';
//         container.style.gridGap = '2px';
//         container.style.width = '100%';
//         container.style.height = '100%';

//         const volAxialContent = setupPanel('vol_axial');
//         const volSagittalContent = setupPanel('vol_sagittal');
//         const volCoronalContent = setupPanel('vol_coronal');
//         const mipAxialContent = setupPanel('mip_axial');
//         const mipSagittalContent = setupPanel('mip_sagittal');
//         const mipCoronalContent = setupPanel('mip_coronal');
//         const t3dCoronalContent = setupPanel('t3d_coronal');

//         container.appendChild(volAxialContent);
//         container.appendChild(volSagittalContent);
//         container.appendChild(volCoronalContent);
//         container.appendChild(mipAxialContent);
//         container.appendChild(mipSagittalContent);
//         container.appendChild(mipCoronalContent);
//         container.appendChild(t3dCoronalContent);

//         const viewportInput = [
//           {
//             viewportId: 'vol_axial',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: volAxialContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//             },
//           },
//           {
//             viewportId: 'vol_sagittal',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: volSagittalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//             },
//           },
//           {
//             viewportId: 'vol_coronal',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: volCoronalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//             },
//           },
//           {
//             viewportId: 'mip_axial',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: mipAxialContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//             },
//           },
//           {
//             viewportId: 'mip_sagittal',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: mipSagittalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//             },
//           },
//           {
//             viewportId: 'mip_coronal',
//             type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//             element: mipCoronalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//             },
//           },
//           {
//             viewportId: 't3d_coronal',
//             type: cornerstone.Enums.ViewportType.VOLUME_3D,
//             element: t3dCoronalContent,
//             defaultOptions: {
//               orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//             },
//           },
//         ];

//         renderingEngine.setViewports(viewportInput);

//         volume.load();

//         await cornerstone.setVolumesForViewports(
//           renderingEngine,
//           [{ volumeId: volumeId }],
//           ['vol_axial', 'vol_sagittal', 'vol_coronal']
//         );

//         await cornerstone.setVolumesForViewports(
//           renderingEngine,
//           [
//             {
//               volumeId: volumeId,
//               blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
//             },
//           ],
//           ['mip_axial', 'mip_sagittal', 'mip_coronal']
//         );

//         const viewport = renderingEngine.getViewport('t3d_coronal');

//         await cornerstone.setVolumesForViewports(
//           renderingEngine,
//           [{ volumeId: volumeId }],
//           ['t3d_coronal']
//         ).then(() => {
//           viewport.setProperties({ preset: 'MR-Default' });

//           const actorEntry = viewport.getActors()[0];
//           if (actorEntry && actorEntry.actor) {
//             const volumeActor = actorEntry.actor;
//             const property = volumeActor.getProperty();
//             const opacityFunction = property.getScalarOpacity(0);

//             opacityFunction.removeAllPoints();
//             opacityFunction.addPoint(0, 0);
//             opacityFunction.addPoint(500, opacity);
//             opacityFunction.addPoint(1000, opacity);
//             opacityFunction.addPoint(1500, opacity);
//             opacityFunction.addPoint(2000, opacity);

//             property.setScalarOpacity(0, opacityFunction);
//             viewport.render();
//           }
//         });

//         renderingEngine.render();

//         setup3dViewportTools();
//         setupVolViewportTools();
//         setupMipViewportTools();
//       }
//     }

//     run();

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [layout]);

//   useEffect(() => {
//     const renderingEngine = renderingEngineRef.current;
//     if (renderingEngine) {
//       const volAxialViewport = renderingEngine.getViewport('vol_axial');
//       if (volAxialViewport) {
//         const camera = volAxialViewport.getCamera();
//         camera.parallelScale = zoom;
//         volAxialViewport.setCamera(camera);
//         volAxialViewport.render();
//       }
//     }
//   }, [zoom]);

//   useEffect(() => {
//     const renderingEngine = renderingEngineRef.current;
//     if (renderingEngine) {
//       const viewport = renderingEngine.getViewport('t3d_coronal');
//       if (viewport) {
//         const actorEntry = viewport.getActors()[0];
//         if (actorEntry && actorEntry.actor) {
//           const volumeActor = actorEntry.actor;
//           const property = volumeActor.getProperty();
//           const opacityFunction = property.getScalarOpacity(0);

//           opacityFunction.removeAllPoints();
//           opacityFunction.addPoint(0, 0.0);
//           opacityFunction.addPoint(500, opacity);
//           opacityFunction.addPoint(1000, opacity);
//           opacityFunction.addPoint(1500, opacity);
//           opacityFunction.addPoint(2000, opacity);

//           property.setScalarOpacity(0, opacityFunction);
//           viewport.render();
//         }
//       }
//     }
//   }, [opacity]);

//   return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
// };

// export default CornerstoneViewer;





// // V3 - 3d Segmantation Tool

// import React, { useEffect, useRef } from 'react';
// import * as cornerstone from '@cornerstonejs/core';
// import * as cornerstoneTools from '@cornerstonejs/tools';
// import { segmentation } from '@cornerstonejs/tools';
// import {
//     cornerstoneStreamingImageVolumeLoader,
//     cornerstoneStreamingDynamicImageVolumeLoader,
// } from '@cornerstonejs/streaming-image-volume-loader';
// import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
// import dicomParser from 'dicom-parser';

// const CornerstoneViewer = ({ zoom, opacity, layout }) => {
//     const containerRef = useRef(null);
//     const renderingEngineRef = useRef(null);

//     useEffect(() => {

//         const seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
//         const timepointID = '6750';

//         let volumeId = null;
//         let volume = null;
        
//         const { volumeLoader } = cornerstone;

//         function initVolumeLoader() {
//             volumeLoader.registerUnknownVolumeLoader(
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingImageVolume',
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingDynamicImageVolume',
//                 cornerstoneStreamingDynamicImageVolumeLoader
//             );
//         }

//         function initCornerstoneDICOMImageLoader() {
//             const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
//             cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
//             cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
//             cornerstoneDICOMImageLoader.configure({
//                 useWebWorkers: true,
//                 decodeConfig: {
//                     convertFloatPixelDataToInt: false,
//                     use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
//                 },
//             });

//             let maxWebWorkers = 1;

//             if (navigator.hardwareConcurrency) {
//                 maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
//             }

//             const config = {
//                 maxWebWorkers,
//                 startWebWorkersOnDemand: false,
//                 taskConfiguration: {
//                     decodeTask: {
//                         initializeCodecsOnStartup: false,
//                         strict: false,
//                     },
//                 },
//             };

//             cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
//         }

//         async function getFileData() {
//             const response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);
//             const files = await response.json();
//             let fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
//             volumeId = 'cornerstoneStreamingImageVolume: newVolume';
//             volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
//         }

//         const resizeObserver = new ResizeObserver(() => {
//             const renderingEngine = renderingEngineRef.current;
//             if (renderingEngine) {
//                 renderingEngine.resize(true, false);
//             }
//         });

//         function setupPanel(panelId) {
//             const panel = document.createElement('div');
//             panel.id = panelId;
//             panel.style.width = '100%';
//             panel.style.height = '100%';
//             panel.style.borderRadius = '8px';
//             panel.style.overflow = "hidden";
//             panel.oncontextmenu = (e) => e.preventDefault();
//             resizeObserver.observe(panel);
//             return panel;
//         }

//         function setup3dViewportTools() {
            
//             // Tool Group Setup
//             const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('t3d_tool_group');
//             t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

//             // Trackball Rotate
//             cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);

//             t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });

//             // Pan
//             cornerstoneTools.addTool(cornerstoneTools.PanTool);

//             t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
//                     },
//                 ],
//             });
            
//             // Zoom
//             cornerstoneTools.addTool(cornerstoneTools.ZoomTool);

//             t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
//                     },
//                 ],
//             });

//             // Segmentation Display
//             cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);

//             t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
//             t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
//         }

//         function setupVolViewportTools() {
            
//             // Tool Group setup
//             const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('vol_tool_group');
//             volToolGroup.addViewport('vol_axial', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_sagittal', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_coronal', 'viewer_render_engine');

//             // Stack Scroll Tool
//             cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

//             volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//             volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//         }

//         function setupMipViewportTools() {

//             // Tool Group setup
//             const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('mip_tool_group');
//             mipToolGroup.addViewport('mip_axial', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_sagittal', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_coronal', 'viewer_render_engine');

//             // Window Level
//             cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);

//             mipToolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
//             mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });
//         }

//         async function run() {
//             await cornerstone.init();
//             await cornerstoneTools.init();
//             await initVolumeLoader();
//             await initCornerstoneDICOMImageLoader();
//             await getFileData();

//             const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');
//             renderingEngineRef.current = renderingEngine;

//             const container = containerRef.current;
            
//             container.style.display = 'grid';
//             container.style.gridTemplateColumns = 'repeat(3, 1fr)';
//             container.style.gridTemplateRows = 'repeat(3, 1fr)';
//             container.style.gridGap = '2px';
//             container.style.width = '100%';
//             container.style.height = '100%';

//             const volAxialContent = setupPanel('vol_axial');
//             const volSagittalContent = setupPanel('vol_sagittal');
//             const volCoronalContent = setupPanel('vol_coronal');
//             const mipAxialContent = setupPanel('mip_axial');
//             const mipSagittalContent = setupPanel('mip_sagittal');
//             const mipCoronalContent = setupPanel('mip_coronal');
//             const t3dCoronalContent = setupPanel('t3d_coronal');

//             container.appendChild(volAxialContent);
//             container.appendChild(volSagittalContent);
//             container.appendChild(volCoronalContent);
//             container.appendChild(mipAxialContent);
//             container.appendChild(mipSagittalContent);
//             container.appendChild(mipCoronalContent);
//             container.appendChild(t3dCoronalContent);

//             const viewportInput = [
//                 {
//                     viewportId: 'vol_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 't3d_coronal',
//                     type: cornerstone.Enums.ViewportType.VOLUME_3D,
//                     element: t3dCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//             ];

//             renderingEngine.setViewports(viewportInput);

//             volume.load();

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['vol_axial', 'vol_sagittal', 'vol_coronal']
//             );

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [
//                     {
//                         volumeId: volumeId,
//                         blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
//                     },
//                 ],
//                 ['mip_axial', 'mip_sagittal', 'mip_coronal']
//             );

//             const viewport = renderingEngine.getViewport('t3d_coronal');

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['t3d_coronal']
//             ).then(() => {
//                 viewport.setProperties({ preset: 'MR-Default' });

//                 // Adjust the opacity transfer function
//                 const actorEntry = viewport.getActors()[0];
//                 if (actorEntry && actorEntry.actor) {
//                     const volumeActor = actorEntry.actor;
//                     const property = volumeActor.getProperty();
//                     const opacityFunction = property.getScalarOpacity(0);

//                     // Example of setting a simple linear opacity transfer function
//                     opacityFunction.removeAllPoints();
//                     opacityFunction.addPoint(0, 0);     // Fully transparent at intensity 0
//                     opacityFunction.addPoint(500, opacity);   // Slightly transparent at intensity 500
//                     opacityFunction.addPoint(1000, opacity);  // Semi-transparent at intensity 1000
//                     opacityFunction.addPoint(1500, opacity);  // Almost opaque at intensity 1500
//                     opacityFunction.addPoint(2000, opacity);  // Fully opaque at intensity 2000

//                     property.setScalarOpacity(0, opacityFunction);
//                     viewport.render();
//                 }
//             });

//             renderingEngine.render();

//             // Setup Viewport Tools

//             // Setup 3D Viewport Tools
//             setup3dViewportTools();

//             // Setup Vol Viewport Tools
//             setupVolViewportTools();

//             // Setup Mip Viewport Tools
//             setupMipViewportTools();
//         }

//         run();

//         return () => {
//             resizeObserver.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         const renderingEngine = renderingEngineRef.current;
//         if (renderingEngine) {
//             const volAxialViewport = renderingEngine.getViewport('vol_axial');
//             if (volAxialViewport) {
//                 const camera = volAxialViewport.getCamera();
//                 camera.parallelScale = zoom; // Adjust the zoom level
//                 volAxialViewport.setCamera(camera);
//                 volAxialViewport.render();
//             }
//         }
//     }, [zoom]);

//     useEffect(() => {
//         const renderingEngine = renderingEngineRef.current;
//         if (renderingEngine) {
//             const viewport = renderingEngine.getViewport('t3d_coronal');
//             if (viewport) {
//                 const actorEntry = viewport.getActors()[0];
//                 if (actorEntry && actorEntry.actor) {
//                     const volumeActor = actorEntry.actor;
//                     const property = volumeActor.getProperty();
//                     const opacityFunction = property.getScalarOpacity(0);

//                     // Update the opacity transfer function at intensity 500
//                     opacityFunction.removeAllPoints();
//                     opacityFunction.addPoint(0, 0.0);
//                     opacityFunction.addPoint(500, opacity);
//                     opacityFunction.addPoint(1000, opacity);
//                     opacityFunction.addPoint(1500, opacity);
//                     opacityFunction.addPoint(2000, opacity);

//                     property.setScalarOpacity(0, opacityFunction);
//                     viewport.render();
//                 }
//             }
//         }
//     }, [opacity]);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
// };

// export default CornerstoneViewer;





// V2 - 3D Volume Alpha Blending with Opacity Transfer Function - Works 100%

// import React, { useEffect, useRef } from 'react';
// import * as cornerstone from '@cornerstonejs/core';
// import * as cornerstoneTools from '@cornerstonejs/tools';
// import {
//     cornerstoneStreamingImageVolumeLoader,
//     cornerstoneStreamingDynamicImageVolumeLoader,
// } from '@cornerstonejs/streaming-image-volume-loader';
// import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
// import dicomParser from 'dicom-parser';

// const CornerstoneViewer = ({ zoom, opacity }) => {
//     const containerRef = useRef(null);
//     const renderingEngineRef = useRef(null);

//     useEffect(() => {

//         const seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
//         const timepointID = '6750';

//         let volumeId = null;
//         let volume = null;
        
//         const { volumeLoader } = cornerstone;

//         function initVolumeLoader() {
//             volumeLoader.registerUnknownVolumeLoader(
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingImageVolume',
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingDynamicImageVolume',
//                 cornerstoneStreamingDynamicImageVolumeLoader
//             );
//         }

//         function initCornerstoneDICOMImageLoader() {
//             const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
//             cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
//             cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
//             cornerstoneDICOMImageLoader.configure({
//                 useWebWorkers: true,
//                 decodeConfig: {
//                     convertFloatPixelDataToInt: false,
//                     use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
//                 },
//             });

//             let maxWebWorkers = 1;

//             if (navigator.hardwareConcurrency) {
//                 maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
//             }

//             const config = {
//                 maxWebWorkers,
//                 startWebWorkersOnDemand: false,
//                 taskConfiguration: {
//                     decodeTask: {
//                         initializeCodecsOnStartup: false,
//                         strict: false,
//                     },
//                 },
//             };

//             cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
//         }

//         async function getFileData() {
//             const response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);
//             const files = await response.json();
//             let fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
//             volumeId = 'cornerstoneStreamingImageVolume: newVolume';
//             volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
//         }

//         const resizeObserver = new ResizeObserver(() => {
//             const renderingEngine = renderingEngineRef.current;
//             if (renderingEngine) {
//                 renderingEngine.resize(true, false);
//             }
//         });

//         function setupPanel(panelId) {
//             const panel = document.createElement('div');
//             panel.id = panelId;
//             panel.style.width = '100%';
//             panel.style.height = '100%';
//             panel.style.borderRadius = '8px';
//             panel.style.overflow = "hidden";
//             panel.oncontextmenu = (e) => e.preventDefault();
//             resizeObserver.observe(panel);
//             return panel;
//         }

//         function setup3dViewportTools() {
            
//             // Tool Group Setup
//             const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('t3d_tool_group');
//             t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

//             // Trackball Rotate
//             cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);

//             t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });

//             // Pan
//             cornerstoneTools.addTool(cornerstoneTools.PanTool);

//             t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
//                     },
//                 ],
//             });
            
//             // Zoom
//             cornerstoneTools.addTool(cornerstoneTools.ZoomTool);

//             t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
//                     },
//                 ],
//             });

//             // Segmentation Display
//             cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);

//             t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
//             t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
//         }

//         function setupVolViewportTools() {
            
//             // Tool Group setup
//             const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('vol_tool_group');
//             volToolGroup.addViewport('vol_axial', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_sagittal', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_coronal', 'viewer_render_engine');

//             // Stack Scroll Tool
//             cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

//             volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//             volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//         }

//         function setupMipViewportTools() {

//             // Tool Group setup
//             const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('mip_tool_group');
//             mipToolGroup.addViewport('mip_axial', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_sagittal', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_coronal', 'viewer_render_engine');

//             // Window Level
//             cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);

//             mipToolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
//             mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });
//         }

//         async function run() {
//             await cornerstone.init();
//             await cornerstoneTools.init();
//             await initVolumeLoader();
//             await initCornerstoneDICOMImageLoader();
//             await getFileData();

//             const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');
//             renderingEngineRef.current = renderingEngine;

//             const container = containerRef.current;
            
//             container.style.display = 'grid';
//             container.style.gridTemplateColumns = 'repeat(3, 1fr)';
//             container.style.gridTemplateRows = 'repeat(3, 1fr)';
//             container.style.gridGap = '2px';
//             container.style.width = '100%';
//             container.style.height = '100%';

//             const volAxialContent = setupPanel('vol_axial');
//             const volSagittalContent = setupPanel('vol_sagittal');
//             const volCoronalContent = setupPanel('vol_coronal');
//             const mipAxialContent = setupPanel('mip_axial');
//             const mipSagittalContent = setupPanel('mip_sagittal');
//             const mipCoronalContent = setupPanel('mip_coronal');
//             const t3dCoronalContent = setupPanel('t3d_coronal');

//             container.appendChild(volAxialContent);
//             container.appendChild(volSagittalContent);
//             container.appendChild(volCoronalContent);
//             container.appendChild(mipAxialContent);
//             container.appendChild(mipSagittalContent);
//             container.appendChild(mipCoronalContent);
//             container.appendChild(t3dCoronalContent);

//             const viewportInput = [
//                 {
//                     viewportId: 'vol_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 't3d_coronal',
//                     type: cornerstone.Enums.ViewportType.VOLUME_3D,
//                     element: t3dCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//             ];

//             renderingEngine.setViewports(viewportInput);

//             volume.load();

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['vol_axial', 'vol_sagittal', 'vol_coronal']
//             );

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [
//                     {
//                         volumeId: volumeId,
//                         blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
//                     },
//                 ],
//                 ['mip_axial', 'mip_sagittal', 'mip_coronal']
//             );

//             const viewport = renderingEngine.getViewport('t3d_coronal');

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['t3d_coronal']
//             ).then(() => {
//                 viewport.setProperties({ preset: 'MR-Default' });

//                 // Adjust the opacity transfer function
//                 const actorEntry = viewport.getActors()[0];
//                 if (actorEntry && actorEntry.actor) {
//                     const volumeActor = actorEntry.actor;
//                     const property = volumeActor.getProperty();
//                     const opacityFunction = property.getScalarOpacity(0);

//                     // Example of setting a simple linear opacity transfer function
//                     opacityFunction.removeAllPoints();
//                     opacityFunction.addPoint(0, 0);     // Fully transparent at intensity 0
//                     opacityFunction.addPoint(500, opacity);   // Slightly transparent at intensity 500
//                     opacityFunction.addPoint(1000, 0);  // Semi-transparent at intensity 1000
//                     opacityFunction.addPoint(1500, 0);  // Almost opaque at intensity 1500
//                     opacityFunction.addPoint(2000, 0);  // Fully opaque at intensity 2000

//                     property.setScalarOpacity(0, opacityFunction);
//                     viewport.render();
//                 }
//             });

//             renderingEngine.render();

//             // Setup Viewport Tools

//             // Setup 3D Viewport Tools
//             setup3dViewportTools();

//             // Setup Vol Viewport Tools
//             setupVolViewportTools();

//             // Setup Mip Viewport Tools
//             setupMipViewportTools();
//         }

//         run();

//         return () => {
//             resizeObserver.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         const renderingEngine = renderingEngineRef.current;
//         if (renderingEngine) {
//             const volAxialViewport = renderingEngine.getViewport('vol_axial');
//             if (volAxialViewport) {
//                 const camera = volAxialViewport.getCamera();
//                 camera.parallelScale = zoom; // Adjust the zoom level
//                 volAxialViewport.setCamera(camera);
//                 volAxialViewport.render();
//             }
//         }
//     }, [zoom]);

//     useEffect(() => {
//         const renderingEngine = renderingEngineRef.current;
//         if (renderingEngine) {
//             const viewport = renderingEngine.getViewport('t3d_coronal');
//             if (viewport) {
//                 const actorEntry = viewport.getActors()[0];
//                 if (actorEntry && actorEntry.actor) {
//                     const volumeActor = actorEntry.actor;
//                     const property = volumeActor.getProperty();
//                     const opacityFunction = property.getScalarOpacity(0);

//                     // Update the opacity transfer function at intensity 500
//                     opacityFunction.removeAllPoints();
//                     opacityFunction.addPoint(0, 0.0);
//                     opacityFunction.addPoint(500, opacity);
//                     opacityFunction.addPoint(1000, 0.0);
//                     opacityFunction.addPoint(1500, 0.0);
//                     opacityFunction.addPoint(2000, 0.0);

//                     property.setScalarOpacity(0, opacityFunction);
//                     viewport.render();
//                 }
//             }
//         }
//     }, [opacity]);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
// };

// export default CornerstoneViewer;


// V1: Initial version of CornerstoneViewer component

// import React, { useEffect, useRef } from 'react';
// import * as cornerstone from '@cornerstonejs/core';
// import * as cornerstoneTools from '@cornerstonejs/tools';
// import {
//     cornerstoneStreamingImageVolumeLoader,
//     cornerstoneStreamingDynamicImageVolumeLoader,
// } from '@cornerstonejs/streaming-image-volume-loader';
// import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
// import dicomParser from 'dicom-parser';

// const CornerstoneViewer = ({ zoom }) => {
//     const containerRef = useRef(null);
//     console.log(`Zoom level changed: ${zoom}`);

//     useEffect(() => {

//         const seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
//         const timepointID = '6750';

//         let volumeId = null;
//         let volume = null;
        
//         const { volumeLoader } = cornerstone;

//         function initVolumeLoader() {
//             volumeLoader.registerUnknownVolumeLoader(
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingImageVolume',
//                 cornerstoneStreamingImageVolumeLoader
//             );
//             volumeLoader.registerVolumeLoader(
//                 'cornerstoneStreamingDynamicImageVolume',
//                 cornerstoneStreamingDynamicImageVolumeLoader
//             );
//         }

//         function initCornerstoneDICOMImageLoader() {
//             const { preferSizeOverAccuracy, useNorm16Texture } = cornerstone.getConfiguration().rendering;
//             cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
//             cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
//             cornerstoneDICOMImageLoader.configure({
//                 useWebWorkers: true,
//                 decodeConfig: {
//                     convertFloatPixelDataToInt: false,
//                     use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
//                 },
//             });

//             let maxWebWorkers = 1;

//             if (navigator.hardwareConcurrency) {
//                 maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
//             }

//             const config = {
//                 maxWebWorkers,
//                 startWebWorkersOnDemand: false,
//                 taskConfiguration: {
//                     decodeTask: {
//                         initializeCodecsOnStartup: false,
//                         strict: false,
//                     },
//                 },
//             };

//             cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
//         }

//         async function getFileData() {
//             const response = await fetch(`/papi/v1/series/${seriesUID}:${timepointID}/files`);
//             const files = await response.json();
//             let fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
//             volumeId = 'cornerstoneStreamingImageVolume: newVolume';
//             volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
//         }

//         const resizeObserver = new ResizeObserver(() => {
//             const renderingEngine = cornerstone.getRenderingEngine('viewer_render_engine');
//             if (renderingEngine) {
//                 renderingEngine.resize(true, false);
//             }
//         });

//         function setupPanel(panelId) {
//             const panel = document.createElement('div');
//             panel.id = panelId;
//             panel.style.width = '100%';
//             panel.style.height = '100%';
//             panel.style.borderRadius = '8px';
//             panel.style.overflow = "hidden";
//             panel.oncontextmenu = (e) => e.preventDefault();
//             resizeObserver.observe(panel);
//             return panel;
//         }

//         function setup3dViewportTools() {
            
//             // Tool Group Setup
//             const t3dToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('t3d_tool_group');
//             t3dToolGroup.addViewport('t3d_coronal', 'viewer_render_engine');

//             // Trackball Rotate
//             cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);

//             t3dToolGroup.addTool(cornerstoneTools.TrackballRotateTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.TrackballRotateTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });

//             // Pan
//             cornerstoneTools.addTool(cornerstoneTools.PanTool);

//             t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
//                     },
//                 ],
//             });
            
//             // Zoom
//             cornerstoneTools.addTool(cornerstoneTools.ZoomTool);

//             t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
//             t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
//                     },
//                 ],
//             });

//             // Segmentation Display
//             cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);

//             t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
//             t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
//         }

//         function setupVolViewportTools() {
            
//             // Tool Group setup
//             const volToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('vol_tool_group');
//             volToolGroup.addViewport('vol_axial', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_sagittal', 'viewer_render_engine');
//             volToolGroup.addViewport('vol_coronal', 'viewer_render_engine');

//             // Stack Scroll Tool
//             cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

//             volToolGroup.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//             volToolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
//         }

//         function setupMipViewportTools() {

//             // Tool Group setup
//             const mipToolGroup = cornerstoneTools.ToolGroupManager.createToolGroup('mip_tool_group');
//             mipToolGroup.addViewport('mip_axial', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_sagittal', 'viewer_render_engine');
//             mipToolGroup.addViewport('mip_coronal', 'viewer_render_engine');

//             // Window Level
//             cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);

//             mipToolGroup.addTool(cornerstoneTools.WindowLevelTool.toolName);
//             mipToolGroup.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
//                 bindings: [
//                     {
//                         mouseButton: cornerstoneTools.Enums.MouseBindings.Primary, // Left Click
//                     },
//                 ],
//             });
//         }

//         async function run() {
//             await cornerstone.init();
//             await cornerstoneTools.init();
//             await initVolumeLoader();
//             await initCornerstoneDICOMImageLoader();
//             await getFileData();

//             const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');

//             const container = containerRef.current;
            
//             container.style.display = 'grid';
//             container.style.gridTemplateColumns = 'repeat(3, 1fr)';
//             container.style.gridTemplateRows = 'repeat(3, 1fr)';
//             container.style.gridGap = '2px';
//             container.style.width = '100%';
//             container.style.height = '100%';

//             const volAxialContent = setupPanel('vol_axial');
//             const volSagittalContent = setupPanel('vol_sagittal');
//             const volCoronalContent = setupPanel('vol_coronal');
//             const mipAxialContent = setupPanel('mip_axial');
//             const mipSagittalContent = setupPanel('mip_sagittal');
//             const mipCoronalContent = setupPanel('mip_coronal');
//             const t3dCoronalContent = setupPanel('t3d_coronal');

//             container.appendChild(volAxialContent);
//             container.appendChild(volSagittalContent);
//             container.appendChild(volCoronalContent);
//             container.appendChild(mipAxialContent);
//             container.appendChild(mipSagittalContent);
//             container.appendChild(mipCoronalContent);
//             container.appendChild(t3dCoronalContent);

//             const viewportInput = [
//                 {
//                     viewportId: 'vol_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'vol_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: volCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_axial',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipAxialContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.AXIAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_sagittal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipSagittalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
//                     },
//                 },
//                 {
//                     viewportId: 'mip_coronal',
//                     type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
//                     element: mipCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//                 {
//                     viewportId: 't3d_coronal',
//                     type: cornerstone.Enums.ViewportType.VOLUME_3D,
//                     element: t3dCoronalContent,
//                     defaultOptions: {
//                         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
//                     },
//                 },
//             ];

//             renderingEngine.setViewports(viewportInput);

//             volume.load();

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['vol_axial', 'vol_sagittal', 'vol_coronal']
//             );

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [
//                     {
//                         volumeId: volumeId,
//                         blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
//                     },
//                 ],
//                 ['mip_axial', 'mip_sagittal', 'mip_coronal']
//             );

//             const viewport = renderingEngine.getViewport('t3d_coronal');

//             await cornerstone.setVolumesForViewports(
//                 renderingEngine,
//                 [{ volumeId: volumeId }],
//                 ['t3d_coronal']
//             ).then(() => {
//                 viewport.setProperties({ preset: 'MR-Default' });
//             });

//             renderingEngine.render();

//             // Setup Viewport Tools

//             // Setup 3D Viewport Tools
//             setup3dViewportTools();

//             // Setup Vol Viewport Tools
//             setupVolViewportTools();

//             // Setup Mip Viewport Tools
//             setupMipViewportTools();

            
//         }

//         run();

//         return () => {
//             resizeObserver.disconnect();
//         };
//     }, []);

//     return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
// };

// export default CornerstoneViewer;