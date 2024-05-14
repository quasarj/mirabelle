import React, { useEffect, useRef } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import {
    cornerstoneStreamingImageVolumeLoader,
    cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

const CornerstoneViewer = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const seriesUID = '1.3.6.1.4.1.14519.5.2.1.1078.3273.284434159400355227660618151357';
        const timepointID = '6750';
        let fileList = null;
        let volumeId = null;
        let volume = null;

        const { volumeLoader } = cornerstone;

        function initVolumeLoader() {
            volumeLoader.registerUnknownVolumeLoader(
                cornerstoneStreamingImageVolumeLoader
            );
            volumeLoader.registerVolumeLoader(
                'cornerstoneStreamingImageVolume',
                cornerstoneStreamingImageVolumeLoader
            );
            volumeLoader.registerVolumeLoader(
                'cornerstoneStreamingDynamicImageVolume',
                cornerstoneStreamingDynamicImageVolumeLoader
            );
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
            fileList = files.file_ids.map(file_id => `wadouri:/papi/v1/files/${file_id}/data`);
            volumeId = 'cornerstoneStreamingImageVolume: newVolume';
            volume = await cornerstone.volumeLoader.createAndCacheVolume(volumeId, { imageIds: fileList });
        }

        const resizeObserver = new ResizeObserver(() => {
            const renderingEngine = cornerstone.getRenderingEngine('viewer_render_engine');
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
            panel.style.overflow = "hidden";
            panel.oncontextmenu = (e) => e.preventDefault();
            resizeObserver.observe(panel);
            return panel;
        }

        async function run() {
            await cornerstone.init();
            await initVolumeLoader();
            await initCornerstoneDICOMImageLoader();
            await getFileData();

            const renderingEngine = new cornerstone.RenderingEngine('viewer_render_engine');

            const container = containerRef.current;
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
            container.style.gridTemplateRows = 'repeat(3, 1fr)';
            container.style.gridGap = '2px';
            container.style.width = '100%';
            container.style.height = '100%';

            const volAxialContent = setupPanel('vol_axial');
            const volSagittalContent = setupPanel('vol_sagittal');
            const volCoronalContent = setupPanel('vol_coronal');
            const mipAxialContent = setupPanel('mip_axial');
            const mipSagittalContent = setupPanel('mip_sagittal');
            const mipCoronalContent = setupPanel('mip_coronal');
            const t3dCoronalContent = setupPanel('t3d_coronal');

            container.appendChild(volAxialContent);
            container.appendChild(volSagittalContent);
            container.appendChild(volCoronalContent);
            container.appendChild(mipAxialContent);
            container.appendChild(mipSagittalContent);
            container.appendChild(mipCoronalContent);
            container.appendChild(t3dCoronalContent);

            const viewportInput = [
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
                },
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
                },
                {
                    viewportId: 't3d_coronal',
                    type: cornerstone.Enums.ViewportType.VOLUME_3D,
                    element: t3dCoronalContent,
                    defaultOptions: {
                        orientation: cornerstone.Enums.OrientationAxis.CORONAL,
                    },
                },
            ];

            renderingEngine.setViewports(viewportInput);

            volume.load();

            await cornerstone.setVolumesForViewports(
                renderingEngine,
                [{ volumeId: volumeId }],
                ['vol_axial', 'vol_sagittal', 'vol_coronal']
            );

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

            const viewport = renderingEngine.getViewport('t3d_coronal');
            await cornerstone.setVolumesForViewports(
                renderingEngine,
                [{ volumeId: volumeId }],
                ['t3d_coronal']
            ).then(() => {
                viewport.setProperties({ preset: 'MR-Default' });
            });

            renderingEngine.render();
        }

        run();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="container"></div>;
};

export default CornerstoneViewer;