import { ReportParams } from './types';

type MonitorType = 'PERFORMANCE' | 'RES_PERFORMANCE';

interface ITableConfig {
	resourcesPerf: string[];
	perf: string[];
}

type TypeTableConfig = 'perf' | 'resourcesPerf';

interface IMappingTable {
	PERFORMANCE: string;
	RES_PERFORMANCE: string;
}

export default class DBUtils {
	_DB: null | IDBDatabase = null;
	_tableConfig: ITableConfig;
	_mappingTable: IMappingTable;
	constructor() {
		this._init();
		this._tableConfig = {
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

		this._mappingTable = {
			PERFORMANCE: 'perf',
			RES_PERFORMANCE: 'resourcesPerf',
		};
	}

	_createTable() {
		Object.keys(this._tableConfig).forEach(tableName => {
			if (!this._DB?.objectStoreNames.contains(tableName)) {
				const tableStore = this._DB?.createObjectStore(tableName, {
					keyPath: 'id',
					autoIncrement: true,
				});
				this._tableConfig[tableName as TypeTableConfig].forEach(_ => {
					tableStore?.createIndex(`${_}Index`, _, { unique: false });
				});
			}
		});
	}

	_init() {
		const request = window.indexedDB.open('monitor', 1);
		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			this._DB = (event.target as IDBOpenDBRequest).result as IDBDatabase;
			this._createTable();
		};

		request.onsuccess = event => {
			this._DB = (event.target as IDBOpenDBRequest).result as IDBDatabase;
			console.log('数据库已打开');
		};

		request.onerror = (event: Event) => {
			console.error('数据库打开失败', (event.target as IDBRequest).error);
		};
	}

	_getTableStore(tableName: string) {
		const transaction = this._DB?.transaction([tableName], 'readwrite');
		const tableStore = transaction?.objectStore(tableName);
		return tableStore;
	}

	_requestHandler(request: IDBRequest<any> | undefined) {
		if (request) {
			request.onsuccess = function () {
				console.log('操作成功');
			};
			request.onerror = function (event) {
				console.error('操作出错', (event.target as IDBRequest).error);
			};
		}
	}
	create(reportParams: ReportParams) {
		const tableName = this._mappingTable[reportParams.type as MonitorType];

		const tableStore = this._getTableStore(tableName);
		if (reportParams.type === 'PERFORMANCE') {
			const request = tableStore?.getAll();
			if (request) {
				request.onsuccess = event => {
					const data = (event.target as IDBRequest).result;
					if (Array.isArray(data)) {
						tableStore?.put({ ...data[0], ...reportParams });
					} else {
						const addRequest = tableStore?.add(reportParams);
						this._requestHandler(addRequest);
					}
				};
				request.onerror = () => {
					const addRequest = tableStore?.add(reportParams);
					this._requestHandler(addRequest);
				};
			}
		} else {
			const addRequest = tableStore?.add(reportParams);
			this._requestHandler(addRequest);
		}
	}

	delete(tableName: MonitorType, id: string) {
		const tableStore = this._getTableStore(this._mappingTable[tableName]);
		const deleteRequest = tableStore?.delete(id);
		this._requestHandler(deleteRequest);
	}

	update(tableName: string, id: string, data: ReportParams) {
		const tableStore = this._getTableStore(tableName);
		const updateRequest = tableStore?.get(id);
		if (updateRequest) {
			updateRequest.onsuccess = event => {
				const _data = (event.target as IDBRequest).result;
				if (_data) {
					const updateRequest = tableStore?.put({ ..._data, ...data });
					this._requestHandler(updateRequest);
				} else {
					console.error('未找到要更新的数据');
				}
			};
			this._requestHandler(updateRequest);
		}
	}

	queryAll() {
		return Promise.all(
			Object.keys(this._tableConfig).map(tableName => {
				return new Promise(resolve => {
					const tableStore = this._getTableStore(tableName);
					const request: IDBRequest<any[]> | undefined = tableStore?.getAll();
					if (request) {
						request.onsuccess = event => {
							const data = (event.target as IDBRequest).result;
							if (Array.isArray(data)) {
								resolve(data);
							}
						};
						request.onerror = function () {
							resolve([]);
						};
					} else {
						resolve([]);
					}
				});
			})
		);
	}
}
