import React, { useState, useEffect, useRef } from 'react';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { RenderingEngine, Enums } from "@cornerstonejs/core"

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

const toolGroupId = 'STACK_TOOL_GROUP_ID';

function TestPanel({ viewportId, renderingEngine, toolGroup }) {
  const elementRef = useRef(null)
  const running = useRef(false)

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return
      }
      running.current = true

	// cornerstoneTools.addTool(PanTool);
	// cornerstoneTools.addTool(WindowLevelTool);
	// cornerstoneTools.addTool(StackScrollTool);
	// cornerstoneTools.addTool(ZoomTool);
	// cornerstoneTools.addTool(PlanarRotateTool);

	// const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

	// Add tools to the tool group
	// toolGroup.addTool(WindowLevelTool.toolName);
	// toolGroup.addTool(PanTool.toolName);
	// toolGroup.addTool(ZoomTool.toolName);
	// toolGroup.addTool(StackScrollTool.toolName, { loop: false });
	// toolGroup.addTool(PlanarRotateTool.toolName);

// toolGroup.setToolActive(StackScrollTool.toolName, {
//     bindings: [
//       {
//         mouseButton: MouseBindings.Wheel, // Wheel Mouse
//       },
//     ],
//   });

      // Get Cornerstone imageIds and fetch metadata into RAM
      // const imageIds = await createImageIdsAndCacheMetaData({
      //   StudyInstanceUID:
      //     "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
      //   SeriesInstanceUID:
      //     "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
      //   wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      // })

	let imageIds;
	// let response = await fetch(`/papi/v1/series/1.3.6.1.4.1.14519.5.2.1.8700.9542.328245508502044878714997235200@1037/files`);
	// if (response.ok) {
	// 	const files = await response.json();
	// 	imageIds = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
	// }

	imageIds = [ 
		"wadouri:/papi/v1/files/60514621/data?frame=0",
		"wadouri:/papi/v1/files/60514621/data?frame=1",
		"wadouri:/papi/v1/files/60514621/data?frame=2",
		"wadouri:/papi/v1/files/60514621/data?frame=3",
		"wadouri:/papi/v1/files/60514621/data?frame=4",
		"wadouri:/papi/v1/files/60514621/data?frame=5",
		"wadouri:/papi/v1/files/60514621/data?frame=6",
		"wadouri:/papi/v1/files/60514621/data?frame=7",
		"wadouri:/papi/v1/files/60514621/data?frame=8",
		"wadouri:/papi/v1/files/60514621/data?frame=9",
		"wadouri:/papi/v1/files/60514621/data?frame=10",
		"wadouri:/papi/v1/files/60514621/data?frame=11",
		"wadouri:/papi/v1/files/60514621/data?frame=12",
		"wadouri:/papi/v1/files/60514621/data?frame=13",
		"wadouri:/papi/v1/files/60514621/data?frame=14",
		"wadouri:/papi/v1/files/60514621/data?frame=15",
		"wadouri:/papi/v1/files/60514621/data?frame=16",
		"wadouri:/papi/v1/files/60514621/data?frame=17",
		"wadouri:/papi/v1/files/60514621/data?frame=18",
		"wadouri:/papi/v1/files/60514621/data?frame=19",
		"wadouri:/papi/v1/files/60514621/data?frame=20",
		"wadouri:/papi/v1/files/60514621/data?frame=21",
		"wadouri:/papi/v1/files/60514621/data?frame=22",
		"wadouri:/papi/v1/files/60514621/data?frame=23",
		"wadouri:/papi/v1/files/60514621/data?frame=24",
		"wadouri:/papi/v1/files/60514621/data?frame=25",
		"wadouri:/papi/v1/files/60514621/data?frame=26",
		"wadouri:/papi/v1/files/60514621/data?frame=27",
		"wadouri:/papi/v1/files/60514621/data?frame=28",
		"wadouri:/papi/v1/files/60514621/data?frame=29",
		"wadouri:/papi/v1/files/60514621/data?frame=30",
		"wadouri:/papi/v1/files/60514621/data?frame=31",
		"wadouri:/papi/v1/files/60514621/data?frame=32",
		"wadouri:/papi/v1/files/60514621/data?frame=33",
		"wadouri:/papi/v1/files/60514621/data?frame=34",
		"wadouri:/papi/v1/files/60514621/data?frame=35",
		"wadouri:/papi/v1/files/60514621/data?frame=36",
		"wadouri:/papi/v1/files/60514621/data?frame=37",
		"wadouri:/papi/v1/files/60514621/data?frame=38",
		"wadouri:/papi/v1/files/60514621/data?frame=39",
		"wadouri:/papi/v1/files/60514621/data?frame=40",
	];

	// const imageIds = [
	// 	'wadouri:/papi/v1/files/144272370/data',
	// 	'wadouri:/papi/v1/files/144272060/data',
	// ]

      // Instantiate a rendering engine
      // const renderingEngineId = "myRenderingEngine"
      // const renderingEngine = new RenderingEngine(renderingEngineId)
      // const viewportId = "CT"


      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.STACK,
        element: elementRef.current,
        // defaultOptions: {
        //   orientation: Enums.OrientationAxis.SAGITTAL,
        // },
      }

      renderingEngine.enableElement(viewportInput)

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

		  // toolGroup.addViewport(viewportId, renderingEngineId);
		  toolGroup.addViewport(viewportId, renderingEngine.id);

      // Define a volume in memory
      // const volumeId = "streamingImageVolume"
      // const volume = await volumeLoader.createAndCacheVolume(volumeId, {
      //   imageIds,
      // })

      // Set the volume to load
      // @ts-ignore
      // volume.load()

      // Set the volume on the viewport and it's default properties
      // viewport.setVolumes([{ volumeId}])
		viewport.setStack(imageIds);

		cornerstoneTools.utilities.stackPrefetch.enable(viewport.element);

      // Render the image
      viewport.render()
    }

    setup()

    // Create a stack viewport
  }, [elementRef, running])

  return (
	  <>
	  <h1>Multi-frame US image</h1>
    <div
      ref={elementRef}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
	</>
  )
}

// function TestPanel() {
//   return (
//     <div id="filesPanel" className=" p-6 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900">
//       Some stuff here
//     </div>
//   );
// }

export default TestPanel;
