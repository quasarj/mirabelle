// V5 Layout 2
import React, { forwardRef, useImperativeHandle, useState, useEffect, useLayoutEffect, useRef } from 'react';
import MaskerPanel from './MaskerPanel.jsx';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  cornerstoneStreamingImageVolumeLoader,
  cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

import {
	expandSegTo3D,
	calculateDistance,
} from '../utilities';

import { setParameters } from '../masking';

//TODO this should probably be moved somewhere else, masking.js maybe?
async function finalCalc(coords, volumeId, iec) {
  console.log("finalCalc running");
  console.log(coords);

  const volume = cornerstone.cache.getVolume(volumeId);
  const volumeDims = volume.dimensions;
  const volumeSpacing = volume.spacing;


  // Extracting the coordinates of the corners of the top face
  const topLeft = [coords.x.min, coords.y.min, coords.z.max];
  const topRight = [coords.x.max, coords.y.min, coords.z.max];
  const bottomLeft = [coords.x.min, coords.y.max, coords.z.max];
  const bottomRight = [coords.x.max, coords.y.max, coords.z.max];

  // Top face coordinates for black boxing
  const bbTopLeft = [coords.x.min, coords.y.min];
  const bbBottomRight = [coords.x.max, coords.y.max];

  const topFaceCorners = [topLeft, topRight, bottomLeft, bottomRight];

  console.log("Coordinates of the corners of the top face:", topFaceCorners);

  // Calculate the center point
  const centerX = (topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4;
  const centerY = (topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4;
  const centerZ = (topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4;

  const centerPoint = [centerX, centerY, centerZ];

  console.log("Center point of the top face:", centerPoint);

  const radius = calculateDistance(topFaceCorners[0], centerPoint);
  const height = coords.z.max - coords.z.min;

  // experimental adjustment of coordinates for masker
  function invert(val, maxval) {
    return maxval - val
  }
  /*
    * Convert a point in LPS to RAS.
    * This just inverts the first two points (which is why it needs
    * the dims). This is only useful if the input is actually in LPS!
    */
  function convertLPStoRAS(point, dims) {
    const [ dimX, dimY, dimZ ] = dims;
    let [x, y, z] = point;
    x = invert(x, dimX);
    y = invert(y, dimY);

    return [ x, y, z];
  }
  function scaleBySpacing(point, spacings) {
    const [ spaceX, spaceY, spaceZ ] = spacings;
    let [x, y, z] = point;

    return [ Math.floor(x * spaceX),
          Math.floor(y * spaceY),
          Math.floor(z * spaceZ) ];
  }

  const [ dimX, dimY, dimZ ] = volumeDims;
  const [ spaceX, spaceY, spaceZ ] = volumeSpacing;

  // let [x, y, z] = centerPoint;
  // let x2 = invert(x, dimX) * spaceX;
  // let y2 = invert(y, dimY) * spaceY;
  // let z2 = z * spaceZ;

  let centerPointRAS = convertLPStoRAS(centerPoint, volumeDims);
  let centerPointFix = scaleBySpacing(centerPointRAS, volumeSpacing);

  const diameter = Math.floor((radius * spaceX) * 2);
  const i = Math.floor((centerPointRAS[2] - height) * spaceZ);

  // LR PA S I diameter
  const output = {
    lr: centerPointFix[0],
    pa: centerPointFix[1],
    i: centerPointFix[2],
    s: i,
    d: diameter,
  };
  console.log(output);
  await setParameters(iec, output);
  //TODO need better way for this
  alert("Submitted for masking!");

}

const CornerstoneViewer = forwardRef(function CornerstoneViewer({ volumeName,
  files, zoom, opacity, layout, iec }, ref) {
  const [ loading, setLoading ] = useState(true);
  const containerRef = useRef(null);
  const renderingEngineRef = useRef(null);

  let coords;
  let segId;
  let volumeId;

  useLayoutEffect(() => {
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
      // cornerstoneTools.addTool(cornerstoneTools.PanTool);
      t3dToolGroup.addTool(cornerstoneTools.PanTool.toolName);
      t3dToolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary, // Middle Click
          },
        ],
      });

      // Zoom
      // cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      t3dToolGroup.addTool(cornerstoneTools.ZoomTool.toolName);
      t3dToolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
          {
            mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary, // Right Click
          },
        ],
      });

      // Segmentation Display
      // cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
      t3dToolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
      t3dToolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);
    }

    function setupVolViewportTools() {
      cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);
      cornerstoneTools.addTool(cornerstoneTools.SegmentationDisplayTool);
      cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);

      // Create group and add viewports
      // TODO: should the render engine be coming from a var instead?
      const group = cornerstoneTools.ToolGroupManager.createToolGroup(
        'vol_tool_group');
      group.addViewport('vol_sagittal', 'viewer_render_engine');
      group.addViewport('vol_coronal', 'viewer_render_engine');

      // Stack Scroll Tool
      group.addTool(cornerstoneTools.StackScrollMouseWheelTool.toolName);
      group.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);

      group.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
      // group.setToolActive(cornerstoneTools.SegmentationDisplayTool.toolName);
      // group.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

      group.addTool(cornerstoneTools.RectangleScissorsTool.toolName);
      group.setToolActive(cornerstoneTools.RectangleScissorsTool.toolName, {
        bindings: [
          { mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
        ]
      });

      group.addTool(cornerstoneTools.PanTool.toolName);
      group.setToolActive(cornerstoneTools.PanTool.toolName, {
        bindings: [
          // Middle mouse button
          { mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary },
        ],
      });

      group.addTool(cornerstoneTools.ZoomTool.toolName);
      group.setToolActive(cornerstoneTools.ZoomTool.toolName, {
        bindings: [
          { mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
        ],
      });

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

      }

      // if (layout === 'all' || layout === 'volumes' || layout === 'mips' || layout === '3d') {
      //   const viewportInput = [];

      //   if (layout === 'all' || layout === 'volumes') {
      //     container.style.display = 'grid';
      //     container.style.gridTemplateColumns = 'repeat(3, 1fr)';
      //     container.style.gridTemplateRows = '1fr';
      //     container.style.gridGap = '2px';
      //     container.style.width = '100%';
      //     container.style.height = '100%';

      //     const volAxialContent = setupPanel('vol_axial');
      //     const volSagittalContent = setupPanel('vol_sagittal');
      //     const volCoronalContent = setupPanel('vol_coronal');

      //     container.appendChild(volAxialContent);
      //     container.appendChild(volSagittalContent);
      //     container.appendChild(volCoronalContent);

      //     viewportInput.push(
      //       {
      //         viewportId: 'vol_axial',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: volAxialContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.AXIAL,
      //         },
      //       },
      //       {
      //         viewportId: 'vol_sagittal',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: volSagittalContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
      //         },
      //       },
      //       {
      //         viewportId: 'vol_coronal',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: volCoronalContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.CORONAL,
      //         },
      //       }
      //     );
      //   }

      //   if (layout === 'all' || layout === 'mips') {
      //     container.style.display = 'grid';
      //     container.style.gridTemplateColumns = 'repeat(3, 1fr)';
      //     container.style.gridTemplateRows = '1fr';
      //     container.style.gridGap = '2px';
      //     container.style.width = '100%';
      //     container.style.height = '100%';

      //     const mipAxialContent = setupPanel('mip_axial');
      //     const mipSagittalContent = setupPanel('mip_sagittal');
      //     const mipCoronalContent = setupPanel('mip_coronal');

      //     container.appendChild(mipAxialContent);
      //     container.appendChild(mipSagittalContent);
      //     container.appendChild(mipCoronalContent);

      //     viewportInput.push(
      //       {
      //         viewportId: 'mip_axial',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: mipAxialContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.AXIAL,
      //         },
      //       },
      //       {
      //         viewportId: 'mip_sagittal',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: mipSagittalContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
      //         },
      //       },
      //       {
      //         viewportId: 'mip_coronal',
      //         type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
      //         element: mipCoronalContent,
      //         defaultOptions: {
      //           orientation: cornerstone.Enums.OrientationAxis.CORONAL,
      //         },
      //       }
      //     );
      //   }

      //   if (layout === 'all' || layout === '3d') {
      //     if (layout === 'all') {
      //       container.style.gridTemplateRows = 'repeat(2, 1fr)';
      //     } else {
      //       container.style.gridTemplateColumns = '1fr';
      //       container.style.gridTemplateRows = '1fr';
      //     }
      //     container.style.gridGap = '2px';
      //     container.style.width = '100%';
      //     container.style.height = '100%';

      //     const t3dCoronalContent = setupPanel('t3d_coronal');
      //     container.appendChild(t3dCoronalContent);

      //     viewportInput.push({
      //       viewportId: 't3d_coronal',
      //       type: cornerstone.Enums.ViewportType.VOLUME_3D,
      //       element: t3dCoronalContent,
      //       defaultOptions: {
      //         orientation: cornerstone.Enums.OrientationAxis.CORONAL,
      //       },
      //     });
      //   }

      //   renderingEngine.setViewports(viewportInput);

      //   volume.load();

      //   if (layout === 'all' || layout === 'volumes') {
      //     await cornerstone.setVolumesForViewports(
      //       renderingEngine,
      //       [{ volumeId: volumeId }],
      //       ['vol_axial', 'vol_sagittal', 'vol_coronal']
      //     );
      //   }

      //   if (layout === 'all' || layout === 'mips') {
      //     await cornerstone.setVolumesForViewports(
      //       renderingEngine,
      //       [
      //         {
      //           volumeId: volumeId,
      //           blendMode: cornerstone.Enums.BlendModes.MAXIMUM_INTENSITY_BLEND,
      //         },
      //       ],
      //       ['mip_axial', 'mip_sagittal', 'mip_coronal']
      //     );
      //   }

      //   if (layout === 'all' || layout === '3d') {
      //     await cornerstone.setVolumesForViewports(renderingEngine, [{ volumeId: volumeId }], ['t3d_coronal']).then(() => {
      //       const viewport = renderingEngine.getViewport('t3d_coronal');
      //       viewport.setProperties({ preset: 'MR-Default' });

      //       const actorEntry = viewport.getActors()[0];
      //       if (actorEntry && actorEntry.actor) {
      //         const volumeActor = actorEntry.actor;
      //         const property = volumeActor.getProperty();
      //         const opacityFunction = property.getScalarOpacity(0);

      //         opacityFunction.removeAllPoints();
      //         opacityFunction.addPoint(0, 0); // Fully transparent at intensity 0
      //         opacityFunction.addPoint(500, opacity); // Slightly transparent at intensity 500
      //         opacityFunction.addPoint(1000, opacity); // Semi-transparent at intensity 1000
      //         opacityFunction.addPoint(1500, opacity); // Almost opaque at intensity 1500
      //         opacityFunction.addPoint(2000, opacity); // Fully opaque at intensity 2000

      //         property.setScalarOpacity(0, opacityFunction);
      //         viewport.render();
      //       }
      //     });
      //   }

      //   renderingEngine.render();

        if (layout === 'all' || layout === 'volumes' || layout === 'Masker') {
          setupVolViewportTools();
        }

      //   if (layout === 'all' || layout === 'mips') {
      //     setupMipViewportTools();
      //   }

        if (layout === 'all' || layout === '3d' | layout === 'Masker') {
          setup3dViewportTools();
        }
      // }
      setLoading(false); // signal that setup is complete
    }

    run();

    return () => {
      resizeObserver.disconnect();
    };
  }, [layout]);

  // Load the actual volume into the display here
  useEffect(() => {
    // do nothing if Cornerstone is still loading
    if (loading) {
      return;
    }

    let volume = null;
    const renderingEngine = renderingEngineRef.current;

    async function getFileData() {
      let fileList = files.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
      // TODO: could probably use a better way to generate unique volumeIds
      volumeId = 'cornerstoneStreamingImageVolume: newVolume' + volumeName;
      volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
    }

    async function doit() {
      window.cornerstone = cornerstone;
      window.cornerstoneTools = cornerstoneTools;
      await getFileData();
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
        // viewport.setProperties({ preset: 'MR-Default' });
        viewport.setProperties({ preset: 'CT-Soft-Tissue' });
      });        

      // create and bind a new segmentation
      segId = 'seg' + volumeName;
      await cornerstone.volumeLoader.createAndCacheDerivedSegmentationVolume(
        volumeId,
        { volumeId: segId }
      );

      cornerstoneTools.segmentation.addSegmentations([
        {
          segmentationId: segId,
          representation: {
            type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
            data: {
              volumeId: segId,
            },
          },
        },
      ]);

      await cornerstoneTools.segmentation.addSegmentationRepresentations(
        'vol_tool_group',
        [
          {
            segmentationId: segId,
            type: cornerstoneTools.Enums.SegmentationRepresentations.Labelmap,
          },
        ]
      );

    }

    doit();

  }, [files, loading]);

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

  async function expandSelection() {
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
  async function clearSelection() {
    const segVolume = cornerstone.cache.getVolume(segId);
    const scalarData = segVolume.scalarData;
    scalarData.fill(0);

    // redraw segmentation
    cornerstoneTools.segmentation
      .triggerSegmentationEvents
      .triggerSegmentationDataModified(segId);
  }
  async function acceptSelection() {
    await finalCalc(coords, volumeId, iec);
  }
  // expose these methods to parent components
  useImperativeHandle(ref, () => (
    { expandSelection, clearSelection, acceptSelection }
  ));

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container">
        
      </div>
      <MaskerPanel />
    </>
  );
});

export default CornerstoneViewer;
