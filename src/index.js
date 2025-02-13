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

import MaskIEC, {
	loader as iecLoader,
} from './routes/mask/iec';

// import ReviewIEC, {
//   loader as iecReviewLoader,
// } from './routes/mask/review';

// import ReviewNIFTI, {
//   loader as niftiReviewLoader,
// } from './routes/nifti/review';

// import MaskVR, {
// 	loader as vrLoader,
// } from './routes/mask/vr';

// import ReviewDICOM, {
// 	loader as dicomReviewLoader,
// } from './routes/dicom/review';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: "mask/iec/:iec",
		element: <MaskIEC />,
		loader: iecLoader,
	},
	// {
	// 	path: "mask/vr/:visual_review_instance_id",
	// 	element: <MaskVR />,
	// 	loader: vrLoader,
	// },
	// {
	// 	path: "review/mask/iec/:iec",
	// 	element: <ReviewIEC />,
	// 	loader: iecReviewLoader,
	// },
	// {
	// 	path: "review/nifti/fileId/:fileId",
	// 	element: <ReviewNIFTI />,
	// 	loader: niftiReviewLoader,
	// },
	// {
	// 	path: "review/dicom/iec/:iec",
	// 	element: <ReviewDICOM />,
	// 	loader: dicomReviewLoader,
	// },
], {
	basename: "/mira",
});

const root = ReactDOM.createRoot(document.getElementById('root'));

// Not currently working in StrictMode for some reason, investigate?
// root.render(
// 	<React.StrictMode>
// 		<RouterProvider router={router} />
// 	</React.StrictMode>
// );
//
root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);
