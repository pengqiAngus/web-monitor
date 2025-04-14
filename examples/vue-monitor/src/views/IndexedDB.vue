<template>
	<div>
		<el-button type="primary" size="default" @click="create">新增</el-button>
		<el-button type="primary" size="default" @click="update">修改</el-button>
		<el-button type="primary" size="default" @click="deletes">删除</el-button>
		<el-button type="primary" size="default" @click="query">查询</el-button>
	</div>
</template>
<script setup>
	class DBUtils {
		constructor() {
			this._DB = null;
			this._init();
			this._tableConfig = {
				jsError: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'sourceURL',
					'line',
					'column',
					'selector',
					'stack',
					'pid',
				],
				promiseError: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'sourceURL',
					'line',
					'column',
					'selector',
					'stack',
					'pid',
				],
				resourcesError: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'selector',
					'sourceURL',
					'pid',
				],
				exposure: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'exposure',
					'pid',
				],
				automaticBurialPoint: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'data',
					'selector',
					'pid',
				],
				pageDwellTime: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'durationMs',
					'pid',
				],
				pv: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'pid',
				],
				xhr: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'url',
					'method',
					'event',
					'status',
					'success',
					'duration',
					'responseSize',
					'responseData',
					'requestData',
					'type',
					'message',
					'pid',
				],
				resourcesPerf: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'resourcesUrl',
					'resourcesType',
					'redirect',
					'appCache',
					'dns',
					'tcp',
					'ssl',
					'rst',
					'trans',
					'duration',
					'decodedBodySize',
					'encodedBodySize',
					'transferSize',
					'pid',
				],
				perf: [
					'browserName',
					'browserVersion',
					'osName',
					'osVersion',
					'deviceType',
					'deviceVendor',
					'deviceModel',
					'engineName',
					'engineVersion',
					'timestamp',
					'pageUrl',
					'title',
					'userId',
					'uuid',
					'trackerId',
					'type',
					'message',
					'unload',
					'redirect',
					'appCache',
					'dns',
					'tcp',
					'ssl',
					'rst',
					'trans',
					'ready',
					'dcl',
					'resources',
					'onLoad',
					'load',
					'TTFB',
					'FP',
					'FCP',
					'FMP',
					'LCP',
					'DCL',
					'L',
					'TTI',
					'FID',
					'pid',
				],
			};

			this.mappingTable = {
				JS_ERROR: 'jsError',
				PROMISE_ERROR: 'promiseError',
				RESOURCES_ERROR: 'resourcesError',
				EXPOSURE: 'exposure',
				AUTOMATIC_BURIAL_POINT: 'automaticBurialPoint',
				PAGE_DWELL_TIME: 'pageDwellTime',
				PV: 'pv',
				PERFORMANCE: 'perf',
				RES_PERFORMANCE: 'resourcesPerf',
				XHR: 'xhr',
			};
		}

		_createTable() {
			Object.keys(this._tableConfig).forEach(tableName => {
				if (!this._DB.objectStoreNames.contains(tableName)) {
					const tableStore = this._DB.createObjectStore(tableName, {
						keyPath: 'id',
						autoIncrement: true,
					});
					this._tableConfig[tableName].forEach(_ => {
						tableStore.createIndex(`${_}Index`, _, { unique: false });
					});
				}
			});
		}

		_init() {
			// eslint-disable-next-line no-undef
			const request = window.indexedDB.open('monitor', 1);
			request.onupgradeneeded = event => {
				this._DB = event.target.result;
				this._createTable();
			};

			request.onsuccess = event => {
				this._DB = event.target.result;
				console.log('数据库已打开');
			};

			request.onerror = event => {
				console.error('数据库打开失败', event.target.error);
			};
		}

		_getTableStore(tableName) {
			const transaction = this.DB.transaction([tableName], 'readwrite');
			const tableStore = transaction.objectStore(tableName);
			return tableStore;
		}

		create(reportParams) {
			const tableStore = this._getTableStore(
				this.mappingTable[reportParams.type]
			);

			const addRequest = tableStore.add(reportParams);

			addRequest.onsuccess = function () {
				console.log('新增操作成功');
			};
			addRequest.onerror = function (event) {
				console.error('新增操作出错', event.target.error);
			};
		}

		delete(tableName, id) {
			const tableStore = this._getTableStore(this.mappingTable[tableName]);
			const deleteRequest = tableStore.delete(id);

			deleteRequest.onsuccess = function () {
				console.log('删除成功');
			};

			deleteRequest.onerror = function (event) {
				console.error('删除出错', event.target.error);
			};
		}

		update(tableName, id, data) {
			const tableStore = this._getTableStore(tableName);
			const updateRequest = tableStore.get(id);
			updateRequest.onsuccess = function (event) {
				const _data = event.target.result;
				if (_data) {
					const updateRequest = tableStore.put({ ..._data, ...data });
					updateRequest.onsuccess = function () {
						console.log('更新成功');
					};
					updateRequest.onerror = function (event) {
						console.error('更新信息时出错', event.target.error);
					};
				} else {
					console.error('未找到要更新的数据');
				}
			};

			updateRequest.onerror = function (event) {
				console.error('获取信息时出错', event.target.error);
			};
		}

		queryAll(tableName) {
			const tableStore = this._getTableStore(tableName);
			const request = tableStore.getAll();
			request.onsuccess = () => {
				console.log('查询操作成功', request.result);
			};

			request.onerror = function (event) {
				console.error('查询出错', event.target.error);
			};
		}
	}
	const dBUtils = new DBUtils();
</script>
