/**
 * This is the true entrypoint of the program
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

import store from './store';
import { Provider } from 'react-redux';

import EnableCornerstone from '@/components/EnableCornerstone';

import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';

import AppLayout from '@/components/AppLayout';

import ErrorPage from './error-page';
import './index.css'

import LoadingSpinner from '@/components/LoadingSpinner';

import Home from './routes/home';

import RouteMaskIEC, { loader as routeMaskIECLoader, } 
from './routes/mask/RouteMaskIEC';

import RouteMaskReviewIEC, { loader as routeMaskReviewIECLoader, } 
from './routes/mask-review/iec';

import RouteMaskReviewVR, { loader as routeMaskerReviewVRLoader }
from './routes/mask-review/vr';

import RouteDicomReviewVR, { loader as routeDicomReviewVRLoader }
from './routes/dicom/vr';

import RouteDicomReviewIEC, { loader as routeDicomReviewIECLoader }
from './routes/dicom/iec';

import RouteMaskVR, { loader as routeMaskVRLoader }
from './routes/mask/RouteMaskVR';

import RouteNiftiReviewFile, { loader as routeNiftiReviewFileLoader }
from './routes/nifti/RouteNiftiReviewFile';

import RouteNiftiReviewVR, { loader as routeNiftiReviewVRLoader }
from './routes/nifti/RouteNiftiReviewVR';

const router = createBrowserRouter(
	[
		{
			element: <AppLayout />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/",
					// element: <Home />,
				Component: Home,
				HydrateFallback: LoadingSpinner,
					errorElement: <ErrorPage />,
				},
				{
					path: "mask/iec/:iec",
					element: <RouteMaskIEC />,
				HydrateFallback: LoadingSpinner,
					loader: routeMaskIECLoader,
				},
				{
					path: "mask/vr/:visual_review_instance_id",
					element: <RouteMaskVR />,
				HydrateFallback: LoadingSpinner,
					loader: routeMaskVRLoader,
					errorElement: <ErrorPage />,
				},
				{
					path: "mask/review/iec/:iec",
					element: <RouteMaskReviewIEC />,
				HydrateFallback: LoadingSpinner,
					loader: routeMaskReviewIECLoader,
				},
				{
					path: "mask/review/vr/:vr",
					element: <RouteMaskReviewVR />,
				HydrateFallback: LoadingSpinner,
					loader: routeMaskerReviewVRLoader,
				},
				{
					path: "review/nifti/file/:fileId",
					element: <RouteNiftiReviewFile />,
				HydrateFallback: LoadingSpinner,
					loader: routeNiftiReviewFileLoader,
				},
				{
					path: "review/nifti/vr/:vr",
					element: <RouteNiftiReviewVR />,
				HydrateFallback: LoadingSpinner,
					loader: routeNiftiReviewVRLoader,
				},
				{
					path: "review/dicom/iec/:iec",
					element: <RouteDicomReviewIEC />,
				HydrateFallback: LoadingSpinner,
					loader: routeDicomReviewIECLoader,
				},
				{
					path: "review/dicom/vr/:vr",
					element: <RouteDicomReviewVR />,
				HydrateFallback: LoadingSpinner,
					loader: routeDicomReviewVRLoader,
				},
			],
		},
	], 
	{
		basename: "/mira",
	},
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
			<EnableCornerstone>
				<RouterProvider router={router} />
			</EnableCornerstone>
	</Provider>
);
