import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import MonitorSdk from './../../../lib/index.esm';

import App from './App.vue';
const monitorSdk = MonitorSdk({
	pid: '1000',
	reportUrl: 'http://127.0.0.1:9001/report',
	// debug: false,
	// jsErrorLog: true,
	// promiseErrorLog: true,
	// resourcesErrorLog: true,
	exposureLog: true,
	// automaticBurialPointLog: true,
	// pageDwellTimeLog: true,
	// pvLog: true,
	// xhrLog: true,
	// resourcesPerfLog: true,
	// perfLog: true,
});
// monitorSdk.report({
// 	type: 'custom',
// 	userName: 'hulei',
// });
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: () => import('./views/Home.vue') },
		{ path: '/list', component: () => import('./views/List.vue') },
		{ path: '/perf', component: () => import('./views/Perf.vue') },
		{ path: '/indexedDB', component: () => import('./views/IndexedDB.vue') },
	],
	scrollBehavior() {
		return {
			top: 0,
			behavior: 'smooth',
		};
	},
});

createApp(App).use(router).mount('#app');
