type MonitorType =
	| 'JS_ERROR'
	| 'PROMISE_ERROR'
	| 'RESOURCES_ERROR'
	| 'EXPOSURE'
	| 'AUTOMATIC_BURIAL_POINT'
	| 'PAGE_DWELL_TIME'
	| 'PV'
	| 'PERFORMANCE'
	| 'RES_PERFORMANCE'
	| 'XHR'
	| 'BLANKSCREEN';

interface ReportParams {
	type: MonitorType;
	[key: string]: any;
}

interface MonitorSdkConfig {
	pid: string;
	reportUrl?: string;
	jsErrorLog?: boolean;
	promiseErrorLog?: boolean;
	resourcesErrorLog?: boolean;
	perfLog?: boolean;
	resourcesPerfLog?: boolean;
	xhrLog?: boolean;
	pvLog?: boolean;
	pageDwellTimeLog?: boolean;
	exposureLog?: boolean;
	automaticBurialPointLog?: boolean;
	blankScreenLog?: boolean;
	debug?: boolean;
	ignoreWhiteScreenElements?: Array<string>;
	reportParamsFormat?: (params: ReportParams) => ReportParams;
	reportUploadBefore?: (params: ReportParams) => ReportParams;
	reportUploadAfter?: (params: ReportParams) => ReportParams;
}

type TypeTracker = Pick<
	MonitorSdkConfig,
	| 'reportUrl'
	| 'debug'
	| 'reportParamsFormat'
	| 'reportUploadBefore'
	| 'reportUploadAfter'
>;

export { MonitorSdkConfig, TypeTracker, ReportParams, MonitorType };
