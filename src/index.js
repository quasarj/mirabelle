/**
 * This is the true entrypoint of the program
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

import store from './store';
import { Provider } from 'react-redux';

import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';

import ErrorPage from './error-page';
import './index.css'

import Home from './routes/home';

import RouteMaskIEC, { loader as routeMaskIECLoader, } 
from './routes/mask/iec';

import RouteMaskReviewIEC, { loader as routeMaskReviewIECLoader, } 
from './routes/mask-review/iec';

import RouteMaskReviewVR, { loader as routeMaskerReviewVRLoader }
from './routes/mask-review/vr';

import RouteDicomReviewVR, { loader as routeDicomReviewVRLoader }
from './routes/dicom/vr';

import RouteDicomReviewIEC, { loader as routeDicomReviewIECLoader }
from './routes/dicom/iec';

import RouteMaskVR, { loader as routeMaskVRLoader }
from './routes/mask/vr';

import RouteNiftiReviewFile, { loader as routeNiftiReviewFileLoader }
from './routes/nifti/file';

import RouteNiftiReviewVR, { loader as routeNiftiReviewVRLoader }
from './routes/nifti/vr';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: "mask/iec/:iec",
		element: <RouteMaskIEC />,
		loader: routeMaskIECLoader,
	},
	{
		path: "mask/vr/:visual_review_instance_id",
		element: <RouteMaskVR />,
		loader: routeMaskVRLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "mask/review/iec/:iec",
		element: <RouteMaskReviewIEC />,
		loader: routeMaskReviewIECLoader,
	},
	{
		path: "mask/review/vr/:vr",
		element: <RouteMaskReviewVR />,
		loader: routeMaskerReviewVRLoader,
	},
	{
		path: "review/nifti/file/:fileId",
		element: <RouteNiftiReviewFile />,
		loader: routeNiftiReviewFileLoader,
	},
	{
		path: "review/nifti/vr/:vr",
		element: <RouteNiftiReviewVR />,
		loader: routeNiftiReviewVRLoader,
	},
	{
		path: "review/dicom/iec/:iec",
		element: <RouteDicomReviewIEC />,
		loader: routeDicomReviewIECLoader,
	},
	{
		path: "review/dicom/vr/:vr",
		element: <RouteDicomReviewVR />,
		loader: routeDicomReviewVRLoader,
	},
], {
	basename: "/mira",
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);
