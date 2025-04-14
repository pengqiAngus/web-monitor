import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import MonitorSdk from './../../../lib/index.esm';

const Home = lazy(() => import('./views/Home'));
const List = lazy(() => import('./views/List'));
const Perf = lazy(() => import('./views/Perf'));

const monitorSdk = MonitorSdk({
	pid: '1000',
	reportUrl: 'http://127.0.0.1:9001/report',
	debug: false,
	jsErrorLog: true,
	promiseErrorLog: true,
	resourcesErrorLog: true,
	exposureLog: true, // TODO:
	automaticBurialPointLog: true,
	pageDwellTimeLog: true,
	pvLog: true,
	xhrLog: true,
	resourcesPerfLog: true,
	perfLog: true,
});
monitorSdk.report({
	type: 'custom',
	userName: 'hulei',
});

const router = createHashRouter([
	{
		path: '/',
		element: <Navigate replace to='/home' />,
	},
	{
		path: '/home',
		element: <Home />,
	},
	{
		path: '/list',
		element: <List />,
	},
	{
		path: '/perf',
		element: <Perf />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Suspense fallback={'Loading'}>
			<RouterProvider router={router}></RouterProvider>
		</Suspense>
	</React.StrictMode>
);
